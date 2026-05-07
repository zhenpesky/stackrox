import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom-v5-compat';
import {
    Button,
    Content,
    Divider,
    Flex,
    FlexItem,
    PageSection,
    Popover,
    Title,
    ToolbarItem,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { gql, useApolloClient } from '@apollo/client';
import cloneDeep from 'lodash/cloneDeep';
import difference from 'lodash/difference';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import useURLSearch from 'hooks/useURLSearch';
import useURLStringUnion from 'hooks/useURLStringUnion';
import { getSearchFilterConfigWithFeatureFlagDependency } from 'Components/CompoundSearchFilter/utils/utils';
import PageTitle from 'Components/PageTitle';
import useURLPagination from 'hooks/useURLPagination';
import useSelectToggle from 'hooks/patternfly/useSelectToggle';
import useFeatureFlags from 'hooks/useFeatureFlags';
import usePermissions from 'hooks/usePermissions';
import useAnalytics, {
    WATCH_IMAGE_MODAL_OPENED,
    WORKLOAD_CVE_ENTITY_CONTEXT_VIEWED,
} from 'hooks/useAnalytics';
import useLocalStorage from 'hooks/useLocalStorage';
import type { SearchFilter } from 'types/search';
import { useIsFirstRender } from 'hooks/useIsFirstRender';
import { hideColumnIf } from 'hooks/useManagedColumns';
import useURLSort from 'hooks/useURLSort';
import type { VulnerabilityState } from 'types/cve.proto';
import {
    vulnerabilityConfigurationReportsPath,
    vulnerabilitiesUserWorkloadsPath,
} from 'routePaths';
import { linkToWithVmPrototype } from 'vmPrototype/vmPrototypeSession';
import { augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab } from 'vmPrototype/v1/augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab';
import { useIsV1UserWorkloadPrototype } from 'vmPrototype/v1/V1UserWorkloadPrototypeContext';
import { useV1WorkloadSavedFiltersControl } from 'vmPrototype/v1/useV1WorkloadSavedFiltersControl';
import type { V1WorkloadSavedFilterScheduleMeta } from 'vmPrototype/v1/useV1WorkloadSavedFiltersControl';
import { savedFilterSubsetEquals } from 'vmPrototype/v1/savedFilter5173Mapping';
import { VM_PROTOTYPE_SCHEDULED_REPORT_PREFILL_KEY } from 'vmPrototype/v1/scheduledReportPrefill';
import type { VmPrototypeScheduledReportPrefill } from 'vmPrototype/v1/scheduledReportPrefill';

import {
    clusterSearchFilterConfig,
    deploymentSearchFilterConfig,
    imageCVESearchFilterConfig,
    imageComponentSearchFilterConfig,
    imageSearchFilterConfig,
    namespaceSearchFilterConfig,
} from '../../searchFilterConfig';
import { isVulnMgmtLocalStorage, workloadEntityTabValues } from '../../types';
import type { DefaultFilters, VulnMgmtLocalStorage, WorkloadEntityTab } from '../../types';
import {
    getNamespaceViewPagePath,
    getVulnStateScopedQueryString,
    getZeroCveScopedQueryString,
    parseQuerySearchFilter,
} from '../../utils/searchUtils';
import {
    getDefaultZeroCveSortOption,
    getWorkloadCveOverviewDefaultSortOption,
    getWorkloadCveOverviewSortFields,
    syncSeveritySortOption,
} from '../../utils/sortUtils';
import { DEFAULT_VM_PAGE_SIZE } from '../../constants';

import WatchedImagesModal from '../WatchedImages/WatchedImagesModal';
import UnwatchImageModal from '../WatchedImages/UnwatchImageModal';
import VulnerabilityStateTabs, {
    vulnStateTabContentId,
} from '../components/VulnerabilityStateTabs';
import useVulnerabilityState from '../hooks/useVulnerabilityState';
import useWorkloadCveViewContext from '../hooks/useWorkloadCveViewContext';
import DefaultFilterModal from '../components/DefaultFilterModal';
import CreateReportDropdown from '../components/CreateReportDropdown';
import CreateViewBasedReportModal from '../components/CreateViewBasedReportModal';
import { imageListQuery } from '../Tables/ImageOverviewTable';
import useHasRequestExceptionsAbility from '../../hooks/useHasRequestExceptionsAbility';
import VulnerabilitiesOverview from './VulnerabilitiesOverview';

/** True when pathname is the User workloads vulnerability findings overview index (not a CVE/image/deployment child route). */
function isUserWorkloadOverviewIndex(pathname: string): boolean {
    return Boolean(matchPath({ path: vulnerabilitiesUserWorkloadsPath, end: true }, pathname));
}

export const entityTypeCountsQuery = gql`
    query getEntityTypeCounts($query: String) {
        imageCount(query: $query)
        deploymentCount(query: $query)
        imageCVECount(query: $query)
    }
`;

// Merge the default filters with the local filters.
// - Default filters that were removed are removed from the local filters.
// - Default filters that were added are added to the local filters.
// - Existing local filters are preserved.
function mergeDefaultAndLocalFilters(
    oldDefaults: DefaultFilters,
    newDefaults: DefaultFilters,
    searchFilter: SearchFilter
): SearchFilter {
    const filter = cloneDeep(searchFilter);

    let SEVERITY = filter.SEVERITY ?? [];
    let FIXABLE = filter.FIXABLE ?? [];

    // Remove existing applied filters that are no longer in the default filters, then
    // add the new default filters.
    SEVERITY = difference(SEVERITY, oldDefaults.SEVERITY, newDefaults.SEVERITY);
    SEVERITY = SEVERITY.concat(newDefaults.SEVERITY);

    FIXABLE = difference(FIXABLE, oldDefaults.FIXABLE, newDefaults.FIXABLE);
    FIXABLE = FIXABLE.concat(newDefaults.FIXABLE);

    return { ...filter, SEVERITY, FIXABLE };
}

const descriptionForVulnerabilityStateMap: Record<VulnerabilityState, string> = {
    OBSERVED: 'Prioritize and triage detected workload vulnerabilities',
    DEFERRED:
        'View workload vulnerabilities that have been postponed for future assessment or action',
    FALSE_POSITIVE:
        'View workload vulnerabilities identified as false positives and excluded from active prioritization',
};

const defaultStorage: VulnMgmtLocalStorage = {
    preferences: {
        defaultFilters: {
            SEVERITY: ['Critical', 'Important'],
            FIXABLE: ['Fixable'],
        },
    },
} as const;

function WorkloadCvesOverviewPage() {
    const apolloClient = useApolloClient();
    const location = useLocation();
    const navigate = useNavigate();
    const isV1Prototype = useIsV1UserWorkloadPrototype();

    const { isFeatureFlagEnabled } = useFeatureFlags();

    const { hasReadAccess, hasReadWriteAccess } = usePermissions();
    const hasWriteAccessForWatchedImage = hasReadWriteAccess('WatchedImage');
    const hasReadAccessForNamespaces = hasReadAccess('Namespace');
    const hasWriteAccessForImage = hasReadWriteAccess('Image'); // SBOM Generation mutates image scan state.
    const hasWorkflowAdminAccess = hasReadAccess('WorkflowAdministration');

    const { analyticsTrack } = useAnalytics();

    const { urlBuilder, pageTitle, pageTitleDescription, baseSearchFilter, viewContext, workloadCveViewId } =
        useWorkloadCveViewContext();
    const currentVulnerabilityState = useVulnerabilityState();

    // TODO We can potentially abstract the detection of "zero cve view"
    // in a way that doesn't require reading the base applied filters
    const isViewingWithCves = !(
        'Image CVE Count' in baseSearchFilter && isEqual(baseSearchFilter['Image CVE Count'], ['0'])
    );

    const [activeEntityTabKey, setActiveEntityTabKey] = useURLStringUnion(
        'entityTab',
        workloadEntityTabValues,
        isViewingWithCves ? 'CVE' : 'Image'
    );

    const [localStorageValue, setStoredValue] = useLocalStorage(
        'vulnerabilityManagement',
        defaultStorage,
        isVulnMgmtLocalStorage
    );

    const { searchFilter: urlSearchFilter, setSearchFilter: setURLSearchFilter } = useURLSearch();
    const isFirstRender = useIsFirstRender();

    // If this is the first render of the page, and no other filters are applied, use the default filters
    // as the search filters to apply on the first run of the query. This will only happen once, and on a
    // subsequent render the default filters will be synced with the URL params and page state, if needed.
    const shouldSyncDefaultFilters = isFirstRender && isEmpty(urlSearchFilter) && isViewingWithCves;
    const searchFilter = shouldSyncDefaultFilters
        ? localStorageValue.preferences.defaultFilters
        : urlSearchFilter;

    const querySearchFilter = parseQuerySearchFilter(searchFilter);

    // If the user is viewing observed CVEs, we need to scope the query based on
    // the selected vulnerability state. If the user is viewing _without_ CVEs, we
    // need to scope the query to only show images/deployments with 0 CVEs.
    const workloadCvesScopedQueryString = isViewingWithCves
        ? getVulnStateScopedQueryString(
              {
                  ...baseSearchFilter,
                  ...querySearchFilter,
              },
              currentVulnerabilityState
          )
        : getZeroCveScopedQueryString({
              ...baseSearchFilter,
              ...querySearchFilter,
          });

    const getDefaultSortOption = isViewingWithCves
        ? getWorkloadCveOverviewDefaultSortOption
        : getDefaultZeroCveSortOption;

    const pagination = useURLPagination(DEFAULT_VM_PAGE_SIZE);

    const sort = useURLSort({
        sortFields: getWorkloadCveOverviewSortFields(activeEntityTabKey),
        defaultSortOption: getDefaultSortOption(activeEntityTabKey, searchFilter),
        onSort: () => pagination.setPage(1),
    });

    function setSearchFilter(searchFilter: SearchFilter) {
        setURLSearchFilter(searchFilter);
        syncSeveritySortOption(searchFilter, sort.sortOption, sort.setSortOption);
    }

    function updateDefaultFilters(values: DefaultFilters) {
        pagination.setPage(1);
        setStoredValue({ preferences: { defaultFilters: values } });
        setSearchFilter(
            mergeDefaultAndLocalFilters(
                localStorageValue.preferences.defaultFilters,
                values,
                searchFilter
            )
        );
    }

    function onEntityTabChange(entityTab: WorkloadEntityTab) {
        pagination.setPage(1);
        sort.setSortOption(getDefaultSortOption(entityTab, searchFilter));

        analyticsTrack({
            event: WORKLOAD_CVE_ENTITY_CONTEXT_VIEWED,
            properties: {
                type: entityTab,
                page: 'Overview',
            },
        });
    }

    function onVulnerabilityStateChange(vulnerabilityState: VulnerabilityState) {
        // Reset all filters, sorting, and pagination and apply to the current history entry
        setActiveEntityTabKey('CVE');
        pagination.setPage(1);

        // For OBSERVED, apply saved defaults directly. Avoid setSearchFilter({}) first — that runs
        // syncSeveritySortOption with no severities and briefly expands severity multi-sort to the
        // fallback (was all five tiers including Unknown in the URL).
        if (vulnerabilityState === 'OBSERVED') {
            applyDefaultFilters();
            return;
        }

        setSearchFilter({});
        sort.setSortOption(getWorkloadCveOverviewDefaultSortOption('CVE'));
    }

    const applyDefaultFilters = useCallback(() => {
        setSearchFilter(localStorageValue.preferences.defaultFilters);
    }, [localStorageValue.preferences.defaultFilters, setSearchFilter]);

    /** Tracks pathname across navigations so we can re-apply saved defaults when returning via left nav with no `s` param (tier links only preserve vmPrototype). */
    const prevPathForDefaultSyncRef = useRef<string | null>(null);

    // Track the current entity tab when the page is initially visited.
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        onEntityTabChange(activeEntityTabKey);
    }, []);
    // activeEntityTabKey
    // onEntityTabChange
    /* eslint-enable react-hooks/exhaustive-deps */

    // Persist saved default filters (Critical / Important / Fixable, etc.) into the URL when:
    // - first visit with empty `s`, or
    // - navigating back to this overview from another app route or from a child route (CVE/image/deployment)
    //   while `s` is empty—e.g. sidebar "Results" only merges vmPrototype, not filter chips.
    // We intentionally do not re-apply when the pathname stays this overview and the user cleared filters.
    useEffect(() => {
        const prevPath = prevPathForDefaultSyncRef.current;
        prevPathForDefaultSyncRef.current = location.pathname;

        if (!isViewingWithCves || !isEmpty(urlSearchFilter)) {
            return;
        }

        if (!isUserWorkloadOverviewIndex(location.pathname)) {
            return;
        }

        const navigatedFromOutsideOverview =
            prevPath !== null &&
            prevPath !== location.pathname &&
            !isUserWorkloadOverviewIndex(prevPath);

        const firstVisitOverview = prevPath === null;

        if (shouldSyncDefaultFilters || firstVisitOverview || navigatedFromOutsideOverview) {
            applyDefaultFilters();
        }
    }, [
        applyDefaultFilters,
        isViewingWithCves,
        location.pathname,
        shouldSyncDefaultFilters,
        urlSearchFilter,
    ]);

    const [defaultWatchedImageName, setDefaultWatchedImageName] = useState('');
    const watchedImagesModalToggle = useSelectToggle();

    const [unwatchImageName, setUnwatchImageName] = useState('');
    const unwatchImageModalToggle = useSelectToggle();

    function onWatchedImagesChange() {
        return apolloClient.refetchQueries({ include: [imageListQuery] });
    }

    const searchFilterConfigDependency = useMemo(
        () => [
            clusterSearchFilterConfig,
            imageCVESearchFilterConfig,
            deploymentSearchFilterConfig,
            imageSearchFilterConfig,
            imageComponentSearchFilterConfig,
            namespaceSearchFilterConfig,
        ],
        []
    );

    // Report-specific state management
    const [isCreateViewBasedReportModalOpen, setIsCreateViewBasedReportModalOpen] = useState(false);

    const isViewBasedReportsEnabled =
        hasWorkflowAdminAccess &&
        (viewContext === 'User workloads' ||
            viewContext === 'Platform' ||
            viewContext === 'All vulnerable images' ||
            viewContext === 'Inactive images');

    const v1SavedFilterWorkloadViews = [
        'User workloads',
        'Platform',
        'All vulnerable images',
    ] as const;
    const v1WorkloadToolbarActive =
        isV1Prototype &&
        (v1SavedFilterWorkloadViews as readonly string[]).includes(viewContext) &&
        isViewingWithCves;

    /** v1 compound: Severity / Fixability under CVE entity; hide legacy standalone selects on every entity tab (CVE / Image / Deployment). */
    const v1VmPrototypeCompoundToolbarBase =
        isV1Prototype &&
        isViewingWithCves &&
        (viewContext === 'User workloads' ||
            viewContext === 'Platform' ||
            viewContext === 'All vulnerable images');

    // Augment the compound filter config with Severity / Fixability on all tabs (not just CVE)
    // so that filter chips and the saved-filter selection remain visible when switching tabs.
    const v1CveTabCompoundSeverityStatus = v1VmPrototypeCompoundToolbarBase;

    const searchFilterConfig = useMemo(() => {
        const base = getSearchFilterConfigWithFeatureFlagDependency(
            isFeatureFlagEnabled,
            searchFilterConfigDependency
        );
        if (!v1CveTabCompoundSeverityStatus) {
            return base;
        }
        return augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab(base);
    }, [isFeatureFlagEnabled, searchFilterConfigDependency, v1CveTabCompoundSeverityStatus]);

    const [v1ScheduleMeta, setV1ScheduleMeta] = useState<V1WorkloadSavedFilterScheduleMeta>({
        selectedSavedName: null,
        baselineSearchFilter: null,
    });

    const v1SavedFilterUi = useV1WorkloadSavedFiltersControl({
        enabled: v1WorkloadToolbarActive,
        searchFilter,
        setSearchFilter,
        paginationSetPage: () => pagination.setPage(1),
        storageScope: `workload-vuln-${workloadCveViewId}`,
        filterKind: 'workload',
        onScheduleMetaChange: setV1ScheduleMeta,
    });

    const openScheduledReportFromWorkload = useCallback(() => {
        const filtersModified = Boolean(
            v1ScheduleMeta.selectedSavedName &&
            v1ScheduleMeta.baselineSearchFilter &&
            !savedFilterSubsetEquals(searchFilter, v1ScheduleMeta.baselineSearchFilter)
        );
        const prefill: VmPrototypeScheduledReportPrefill = {
            workloadScopedQueryString: workloadCvesScopedQueryString,
            searchFilterForForm: { ...searchFilter },
            savedFilterName:
                !filtersModified && v1ScheduleMeta.selectedSavedName
                    ? v1ScheduleMeta.selectedSavedName
                    : null,
            filtersModified,
        };
        navigate(
            linkToWithVmPrototype(
                `${vulnerabilityConfigurationReportsPath}?action=create`,
                location.search
            ),
            {
                state: { [VM_PROTOTYPE_SCHEDULED_REPORT_PREFILL_KEY]: prefill },
            }
        );
    }, [
        location.search,
        navigate,
        searchFilter,
        v1ScheduleMeta.baselineSearchFilter,
        v1ScheduleMeta.selectedSavedName,
        workloadCvesScopedQueryString,
    ]);

    const hasRequestExceptionsAbility = useHasRequestExceptionsAbility();
    const showDeferralUI = hasRequestExceptionsAbility && currentVulnerabilityState === 'OBSERVED';

    return (
        <>
            <PageTitle title={`${pageTitle} Overview`} />
            <PageSection
                hasBodyWrapper={false}
                className="pf-v6-u-display-flex pf-v6-u-flex-direction-row pf-v6-u-align-items-center"
            >
                <Flex
                    direction={{
                        default: 'row',
                    }}
                    alignItems={{
                        default: 'alignItemsCenter',
                    }}
                    spaceItems={{
                        default: 'spaceItemsNone',
                    }}
                    className="pf-v6-u-flex-grow-1"
                >
                    <Title headingLevel="h1">{pageTitle}</Title>
                    {pageTitleDescription && (
                        <Popover
                            aria-label="More information about the current page"
                            bodyContent={pageTitleDescription}
                        >
                            <Button
                                icon={<OutlinedQuestionCircleIcon />}
                                title="Page description"
                                variant="plain"
                            />
                        </Popover>
                    )}
                </Flex>
                <Flex>
                    {hasWriteAccessForWatchedImage && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setDefaultWatchedImageName('');
                                watchedImagesModalToggle.openSelect();
                                analyticsTrack(WATCH_IMAGE_MODAL_OPENED);
                            }}
                        >
                            Manage watched images
                        </Button>
                    )}
                </Flex>
            </PageSection>
            {isViewingWithCves && (
                <PageSection type="tabs">
                    <VulnerabilityStateTabs onChange={onVulnerabilityStateChange} />
                </PageSection>
            )}
            <PageSection>
                <Content component="p">
                    {isViewingWithCves
                        ? descriptionForVulnerabilityStateMap[currentVulnerabilityState]
                        : 'View images and deployments that do not have detected vulnerabilities'}
                </Content>
            </PageSection>
            <Divider component="div" />
            <PageSection id={vulnStateTabContentId}>
                <VulnerabilitiesOverview
                    defaultFilters={localStorageValue.preferences.defaultFilters}
                    searchFilter={searchFilter}
                    setSearchFilter={setSearchFilter}
                    querySearchFilter={querySearchFilter}
                    workloadCvesScopedQueryString={workloadCvesScopedQueryString}
                    searchFilterConfig={searchFilterConfig}
                    pagination={pagination}
                    sort={sort}
                    currentVulnerabilityState={currentVulnerabilityState}
                    isViewingWithCves={isViewingWithCves}
                    onWatchImage={(imageName) => {
                        setDefaultWatchedImageName(imageName);
                        watchedImagesModalToggle.openSelect();
                        analyticsTrack(WATCH_IMAGE_MODAL_OPENED);
                    }}
                    onUnwatchImage={(imageName) => {
                        setUnwatchImageName(imageName);
                        unwatchImageModalToggle.openSelect();
                    }}
                    onEntityTabChange={onEntityTabChange}
                    activeEntityTabKey={activeEntityTabKey}
                    prefixToolbarItems={v1SavedFilterUi.prefixToolbarItem ?? undefined}
                    appliedFilterToolbarSuffix={v1SavedFilterUi.appliedFilterSuffix ?? undefined}
                    includeCveSeverityFilters={isViewingWithCves && !v1VmPrototypeCompoundToolbarBase}
                    includeCveStatusFilters={isViewingWithCves && !v1VmPrototypeCompoundToolbarBase}
                    additionalToolbarItems={
                        isViewBasedReportsEnabled && (
                            <ToolbarItem>
                                <CreateReportDropdown
                                    onSelect={() => {
                                        setIsCreateViewBasedReportModalOpen(true);
                                    }}
                                    showScheduleReport={v1WorkloadToolbarActive}
                                    onScheduleReport={
                                        v1WorkloadToolbarActive
                                            ? openScheduledReportFromWorkload
                                            : undefined
                                    }
                                />
                            </ToolbarItem>
                        )
                    }
                    additionalHeaderItems={
                        <>
                            <FlexItem>
                                <Title headingLevel="h2">
                                    {isViewingWithCves
                                        ? 'Vulnerability findings'
                                        : 'Workloads without detected vulnerabilities'}
                                </Title>
                            </FlexItem>
                            {isViewingWithCves &&
                                (currentVulnerabilityState === 'OBSERVED' ||
                                    currentVulnerabilityState === undefined) && (
                                    <FlexItem>
                                        <Flex
                                            direction={{ default: 'row' }}
                                            alignItems={{ default: 'alignItemsCenter' }}
                                            spaceItems={{ default: 'spaceItemsMd' }}
                                        >
                                            {hasReadAccessForNamespaces && (
                                                <Link
                                                    to={urlBuilder.vulnMgmtBase(
                                                        getNamespaceViewPagePath()
                                                    )}
                                                >
                                                    Namespace view
                                                </Link>
                                            )}
                                            <DefaultFilterModal
                                                defaultFilters={
                                                    localStorageValue.preferences.defaultFilters
                                                }
                                                setLocalStorage={updateDefaultFilters}
                                            />
                                        </Flex>
                                    </FlexItem>
                                )}
                        </>
                    }
                    showDeferralUI={showDeferralUI}
                    cveTableColumnOverrides={{
                        cveSelection: hideColumnIf(!showDeferralUI),
                        topNvdCvss: hideColumnIf(!isFeatureFlagEnabled('ROX_SCANNER_V4')),
                        epssProbability: hideColumnIf(!isFeatureFlagEnabled('ROX_SCANNER_V4')),
                        requestDetails: hideColumnIf(currentVulnerabilityState === 'OBSERVED'),
                        rowActions: hideColumnIf(!showDeferralUI),
                    }}
                    imageTableColumnOverrides={{
                        cvesBySeverity: hideColumnIf(!isViewingWithCves),
                        rowActions: hideColumnIf(
                            !hasWriteAccessForWatchedImage && !hasWriteAccessForImage
                        ),
                    }}
                    deploymentTableColumnOverrides={{
                        cvesBySeverity: hideColumnIf(!isViewingWithCves),
                    }}
                />
                {v1SavedFilterUi.modalsFragment}
                <WatchedImagesModal
                    defaultWatchedImageName={defaultWatchedImageName}
                    isOpen={watchedImagesModalToggle.isOpen}
                    onClose={() => {
                        setDefaultWatchedImageName('');
                        watchedImagesModalToggle.closeSelect();
                    }}
                    onWatchedImagesChange={onWatchedImagesChange}
                />
                <UnwatchImageModal
                    unwatchImageName={unwatchImageName}
                    isOpen={unwatchImageModalToggle.isOpen}
                    onClose={() => {
                        setUnwatchImageName('');
                        unwatchImageModalToggle.closeSelect();
                    }}
                    onWatchedImagesChange={onWatchedImagesChange}
                />
                {isViewBasedReportsEnabled && (
                    <CreateViewBasedReportModal
                        isOpen={isCreateViewBasedReportModalOpen}
                        setIsOpen={setIsCreateViewBasedReportModalOpen}
                        query={workloadCvesScopedQueryString}
                        areaOfConcern={viewContext}
                    />
                )}
            </PageSection>
        </>
    );
}

export default WorkloadCvesOverviewPage;
