import { useMemo, useState } from 'react';
import { Link, generatePath, useLocation, useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import isEmpty from 'lodash/isEmpty';
import {
    Alert,
    AlertActionCloseButton,
    AlertActionLink,
    AlertGroup,
    Breadcrumb,
    BreadcrumbItem,
    Bullseye,
    Button,
    Card,
    CardHeader,
    Content,
    ContentVariants,
    Divider,
    DropdownItem,
    EmptyState,
    EmptyStateBody,
    Flex,
    FlexItem,
    Gallery,
    GalleryItem,
    Label,
    LabelGroup,
    MenuToggle,
    PageSection,
    Pagination,
    SearchInput,
    Select,
    SelectGroup,
    SelectList,
    SelectOption,
    Spinner,
    Tab,
    Tabs,
    TabTitleText,
    Title,
    ToggleGroup,
    ToggleGroupItem,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
} from '@patternfly/react-core';
import type { Ref } from 'react';
import type { MenuToggleElement } from '@patternfly/react-core';
import { ActionsColumn, Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { ExclamationCircleIcon, FileIcon, SearchIcon } from '@patternfly/react-icons';

import {
    vulnerabilityConfigurationReportsPath,
    complianceEnhancedSchedulesPath,
    vulnerabilityReportsUserWorkloadsPath,
    vulnerabilityReportsPlatformPath,
    vulnerabilityReportsAllImagesPath,
    vulnerabilityReportsNodeCvesPath,
    vulnerabilityReportsVirtualMachinesPath,
} from 'routePaths';
import useIsRouteEnabled from 'hooks/useIsRouteEnabled';
import usePermissions from 'hooks/usePermissions';
import useURLPagination from 'hooks/useURLPagination';
import useURLSearch from 'hooks/useURLSearch';
import useURLSort from 'hooks/useURLSort';
import CheckboxSelect from 'Components/PatternFly/CheckboxSelect';

import DeleteModal from 'Components/PatternFly/DeleteModal';
import PageTitle from 'Components/PageTitle';
import EmptyStateTemplate from 'Components/EmptyStateTemplate/EmptyStateTemplate';
import CollectionsFormModal from 'Containers/Collections/CollectionsFormModal';
import useToasts from 'hooks/patternfly/useToasts';
import type { Toast } from 'hooks/patternfly/useToasts';
import MenuDropdown from 'Components/PatternFly/MenuDropdown';
import useTableSelection from 'hooks/useTableSelection';
import pluralize from 'pluralize';
import HelpIconTh from 'Components/HelpIconTh';
import JobStatusPopoverContent from 'Components/ReportJob/JobStatusPopoverContent';
import MyLastJobStatus from 'Components/ReportJob/MyLastJobStatus';
import useAuthStatus from 'hooks/useAuthStatus';
import { reportDownloadURL } from 'services/ReportsService';

import useFetchReports from '../api/useFetchReports';
import useRunReport from '../api/useRunReport';
import { useWatchLastSnapshotForReports } from '../api/useWatchLastSnapshotForReports';
import useDeleteModal, {
    isErrorDeleteResult,
    isSuccessDeleteResult,
} from '../hooks/useDeleteModal';
import { vulnerabilityConfigurationReportDetailsPath } from '../pathsForVulnerabilityReporting';
import {
    mergeSessionReportsWithSample,
    readSessionCreatedReportConfigurations,
} from 'vmPrototype/vmPrototypeSessionCreatedReports';
import { linkToWithVmPrototype } from 'vmPrototype/vmPrototypeSession';
import { useVmPrototypeReportingSampleFallback } from 'vmPrototype/v1/useVmPrototypeReportingSampleFallback';
import {
    VM_PROTOTYPE_V1_SAMPLE_CONFIGURED_SNAPSHOTS,
    VM_PROTOTYPE_V1_SAMPLE_REPORT_CONFIGURATIONS,
} from 'vmPrototype/v1/vmPrototypeV1ReportingSampleData';
import { isUniversalReportsPrototypeActive } from 'vmPrototype/universalReports/isUniversalReportsPrototypeActive';
import { toggleItemInArray } from 'utils/arrayUtils';
import {
    mergeUniversalReportsSampleConfigurations,
    mergeUniversalReportsSampleSnapshots,
    resolveUniversalReportSourceType,
    resolveVulnWorkflowView,
} from 'vmPrototype/universalReports/universalReportsSampleData';
import {
    VULN_WORKFLOW_VIEWS,
    VULN_WORKFLOW_VIEW_META,
} from 'vmPrototype/universalReports/universalReportTypes';
import type { VulnWorkflowView } from 'vmPrototype/universalReports/universalReportTypes';

/** Returns the "Configure scheduled reports for …" description for the current area context. */
function areaDescription(group: string, area: string, v7Group: string, v6Filter: string[]): string {
    const imageAreas = new Set(['user-workloads', 'platform', 'all-images', 'inactive-images']);
    if (v7Group) {
        if (v7Group === 'node-cves') return 'Configure scheduled reports for node vulnerabilities.';
        if (v7Group === 'virtual-machines') return 'Configure scheduled reports for virtual machine vulnerabilities.';
        return 'Configure scheduled reports for image vulnerabilities.';
    }
    if (v6Filter.length > 0) {
        const hasImage = v6Filter.some((a) => imageAreas.has(a));
        const hasNode = v6Filter.includes('node-cves');
        const hasVM = v6Filter.includes('virtual-machines');
        if (hasNode && !hasImage && !hasVM) return 'Configure scheduled reports for node vulnerabilities.';
        if (hasVM && !hasImage && !hasNode) return 'Configure scheduled reports for virtual machine vulnerabilities.';
        return 'Configure scheduled reports for image vulnerabilities.';
    }
    if (group === 'image') return 'Configure scheduled reports for image vulnerabilities.';
    if (area === 'node-cves') return 'Configure scheduled reports for node vulnerabilities.';
    if (area === 'virtual-machines') return 'Configure scheduled reports for virtual machine vulnerabilities.';
    return 'Configure scheduled reports for image vulnerabilities.';
}

const CreateReportsButton = () => {
    const { search } = useLocation();
    return (
        <Link
            to={linkToWithVmPrototype(
                `${vulnerabilityConfigurationReportsPath}?action=create`,
                search
            )}
        >
            <Button variant="primary">Create report</Button>
        </Link>
    );
};

const reportNameSearchKey = 'Report Name';

const sortOptions = {
    sortFields: [reportNameSearchKey],
    defaultSortOption: { field: reportNameSearchKey, direction: 'asc' } as const,
};

const emptyReportArray = [];

/**
 * V4 sub-tabs: 3 grouped tabs, each with a description.
 * "Image vulnerability reports" aggregates all 4 image areas into one combined table.
 */
const V4_AREA_TABS = [
    {
        key: 'image',
        label: 'Image vulnerability reports',
        description:
            'CVE reports scoped to workload images, platform components, all deployed images, and inactive images across your clusters.',
        path: `${vulnerabilityConfigurationReportsPath}?vulnReportGroup=image&prototype=v4`,
        areas: ['user-workloads', 'platform', 'all-images', 'inactive-images'] as const,
    },
    {
        key: 'node-cves',
        label: 'Nodes',
        description: VULN_WORKFLOW_VIEW_META['node-cves'].description,
        path: vulnerabilityReportsNodeCvesPath,
        areas: ['node-cves'] as const,
    },
    {
        key: 'virtual-machines',
        label: 'Virtual machines',
        description: VULN_WORKFLOW_VIEW_META['virtual-machines'].description,
        path: vulnerabilityReportsVirtualMachinesPath,
        areas: ['virtual-machines'] as const,
    },
] as const;

type V4TabKey = (typeof V4_AREA_TABS)[number]['key'];

/**
 * V5 top-level group cards. "image" expands to sub-area cards; "node-cves"
 * and "virtual-machines" navigate directly to the report table.
 */
const V5_GROUP_ITEMS = [
    {
        key: 'image',
        label: V4_AREA_TABS[0].label,
        description: V4_AREA_TABS[0].description,
        linkTo: `${vulnerabilityConfigurationReportsPath}?vulnReportGroup=image&prototype=v5`,
    },
    {
        key: 'node-cves',
        label: V4_AREA_TABS[1].label,
        description: V4_AREA_TABS[1].description,
        linkTo: `${vulnerabilityConfigurationReportsPath}?vulnReportArea=node-cves&prototype=v5`,
    },
    {
        key: 'virtual-machines',
        label: V4_AREA_TABS[2].label,
        description: V4_AREA_TABS[2].description,
        linkTo: `${vulnerabilityConfigurationReportsPath}?vulnReportArea=virtual-machines&prototype=v5`,
    },
] as const;

/** Sub-area cards shown after selecting the "image" group in V5. */
const V5_IMAGE_SUB_AREAS = (
    ['user-workloads', 'platform', 'all-images', 'inactive-images'] as const
).map((view) => ({
    key: view,
    label: VULN_WORKFLOW_VIEW_META[view].label,
    description: VULN_WORKFLOW_VIEW_META[view].description,
    linkTo: `${vulnerabilityConfigurationReportsPath}?vulnReportArea=${view}&prototype=v5`,
}));

/** Contextual description for the v6/v7 report-config header row. */
function getV6V7Description(
    v6Filter: VulnWorkflowView[],
    v7Group: 'image' | 'node-cves' | 'virtual-machines'
): string {
    if (v7Group === 'node-cves') {
        return VULN_WORKFLOW_VIEW_META['node-cves'].description;
    }
    if (v7Group === 'virtual-machines') {
        return VULN_WORKFLOW_VIEW_META['virtual-machines'].description;
    }
    if (v6Filter.length === 1) {
        return VULN_WORKFLOW_VIEW_META[v6Filter[0]].description;
    }
    if (v6Filter.length > 1) {
        return 'Scheduled vulnerability reports for the selected areas of concern.';
    }
    return V4_AREA_TABS[0].description;
}

function V5Card({ item }: { item: { key: string; label: string; description: string; linkTo: string } }) {
    const navigate = useNavigate();
    return (
        <GalleryItem style={{ height: '100%' }}>
            <Card isCompact isClickable style={{ height: '100%' }}>
                <CardHeader
                    selectableActions={{
                        onClickAction: () => navigate(item.linkTo),
                        selectableActionAriaLabel: `Go to ${item.label}`,
                    }}
                >
                    <Flex
                        direction={{ default: 'column' }}
                        spaceItems={{ default: 'spaceItemsSm' }}
                    >
                        <Content component={ContentVariants.p} style={{ fontWeight: 600 }}>
                            {item.label}
                        </Content>
                        <Content
                            component={ContentVariants.p}
                            style={{
                                color: 'var(--pf-t--global--text--color--subtle)',
                                fontSize: '13px',
                            }}
                        >
                            {item.description}
                        </Content>
                    </Flex>
                </CardHeader>
            </Card>
        </GalleryItem>
    );
}

function ConfigReportsTab() {
    const navigate = useNavigate();
    const { search, pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const isAreaReports = isUniversalReportsPrototypeActive(searchParams);

    const protoParam = searchParams.get('prototype') ?? '';
    // v4: 3-tab grouped subnav (image / nodes / VMs) rendered in VulnReportingLayout.
    const isV4Mode = isAreaReports && (protoParam === 'v4' || protoParam === '4');
    // v5: area filter is a card gallery landing; once an area is chosen the table renders.
    const isV5Mode = isAreaReports && (protoParam === 'v5' || protoParam === '5');
    // v6: advanced checkbox filter — no ToggleGroup, no subnav.
    const isV6Mode = isAreaReports && (protoParam === 'v6' || protoParam === '6');
    // v7: 3-item ToggleGroup (Image / Node / VMs) — no advanced filter bar.
    const isV7Mode = isAreaReports && (protoParam === 'v7' || protoParam === '7');
    // v5 image group filter: pre-selected to user-workloads, can be cleared to show all image areas.
    const [v5ImageAreaFilter, setV5ImageAreaFilter] = useState<VulnWorkflowView[]>(['user-workloads']);
    const [toggleGroupView, setToggleGroupView] = useState<VulnWorkflowView>('user-workloads');

    // v7: 3-group ToggleGroup — 'image' | 'node-cves' | 'virtual-machines'
    type V7GroupKey = 'image' | 'node-cves' | 'virtual-machines';
    const [v7ToggleGroup, setV7ToggleGroup] = useState<V7GroupKey>('image');

    // v6 advanced filter state (local, not URL-driven)
    const [v6NameFilter, setV6NameFilter] = useState('');
    const [v6AreaFilter, setV6AreaFilter] = useState<VulnWorkflowView[]>([]);
    const [v6AreaFilterOpen, setV6AreaFilterOpen] = useState(false);
    const v6CrossAreaActive = isV6Mode && v6AreaFilter.length > 1;

    // v6 cross-source-type guard: image areas and node/VM areas cannot be mixed
    // because the backend report engine scopes to a single source type per run.
    const V6_IMAGE_AREAS = new Set<string>(['user-workloads', 'platform', 'all-images', 'inactive-images']);
    const V6_NODE_VM_AREAS = new Set<string>(['node-cves', 'virtual-machines']);
    const v6HasImageSel = v6AreaFilter.some((a) => V6_IMAGE_AREAS.has(a));
    const v6HasNodeVmSel = v6AreaFilter.some((a) => V6_NODE_VM_AREAS.has(a));
    // 'image' → node/VM locked; 'node-vm' → image locked; null → nothing locked
    const v6LockedGroup: 'image' | 'node-vm' | null = v6HasImageSel
        ? 'image'
        : v6HasNodeVmSel
          ? 'node-vm'
          : null;

    // v4/v5: area filter is driven by inline Subtabs and ?vulnReportArea= / ?vulnReportGroup= query params.
    const vulnReportAreaParam = searchParams.get('vulnReportArea') ?? '';
    const vulnReportGroupParam = searchParams.get('vulnReportGroup') ?? '';

    // V4 active tab key — 'image' (default), 'node-cves', or 'virtual-machines'
    const v4ActiveTab: V4TabKey = vulnReportGroupParam === 'image'
        ? 'image'
        : vulnReportAreaParam === 'node-cves'
          ? 'node-cves'
          : vulnReportAreaParam === 'virtual-machines'
            ? 'virtual-machines'
            : 'image';

    const subnav: VulnWorkflowView = (VULN_WORKFLOW_VIEWS as readonly string[]).includes(
        vulnReportAreaParam
    )
        ? (vulnReportAreaParam as VulnWorkflowView)
        : 'user-workloads';
    const activeSubnav: VulnWorkflowView = isV6Mode ? toggleGroupView : subnav;
    // v5: top-level card landing (no group or area selected).
    const showV5Landing = isV5Mode && !vulnReportGroupParam && !vulnReportAreaParam;
    // v5: inside a group or area — show table directly (no intermediate card selection).
    const isV5TableView = isV5Mode && (Boolean(vulnReportGroupParam) || Boolean(vulnReportAreaParam));
    // For backwards compat — always false now that we removed sub-area cards.
    const showV5GroupLanding = false;
    const { currentUser } = useAuthStatus();

    const { hasReadWriteAccess, hasReadAccess } = usePermissions();
    const hasWriteAccessForReport =
        hasReadWriteAccess('WorkflowAdministration') &&
        hasReadAccess('Image') && // for vulnerabilities
        hasReadAccess('Integration'); // for notifiers

    /**
     * Show primary "Create report" affordances on the local Vite dev server and in mock/prototype
     * mode even when the token lacks WorkflowAdministration write + Integration read (common
     * against a dev Central). Row edit/delete/send still require {@link hasWriteAccessForReport}.
     */
    const showCreateReportInDevUi =
        import.meta.env.DEV || import.meta.env.VITE_MOCK_MODE === 'true';
    const showCreateReportButton = hasWriteAccessForReport || showCreateReportInDevUi;

    const isRouteEnabled = useIsRouteEnabled();
    const isCollectionsRouteEnabled = isRouteEnabled('collections');

    const { toasts, addToast, removeToast } = useToasts();

    const { page, perPage, setPage, setPerPage } = useURLPagination(10);
    const { sortOption, getSortParams } = useURLSort(sortOptions);
    const { searchFilter, setSearchFilter } = useURLSearch();
    const [searchValue, setSearchValue] = useState(() => {
        return (searchFilter?.[reportNameSearchKey] as string) || '';
    });
    const [collectionModalId, setCollectionModalId] = useState<string | null>(null);

    const {
        reportConfigurations,
        totalReports,
        isLoading,
        error: fetchError,
        fetchReports,
    } = useFetchReports({
        searchFilter,
        page,
        perPage,
        sortOption,
    });

    const useSampleFallback = useVmPrototypeReportingSampleFallback(fetchError);
    // In v4 (area-of-concern) mode always use the curated seed data so the
    // per-area filtering runs, even when the mock API responds successfully.
    const useDemoReportList = useSampleFallback || isAreaReports;

    const filteredSampleReports = useMemo(() => {
        if (!useDemoReportList) {
            return null;
        }
        const sampleConfigurations = isAreaReports
            ? mergeUniversalReportsSampleConfigurations()
            : VM_PROTOTYPE_V1_SAMPLE_REPORT_CONFIGURATIONS;
        const merged = mergeSessionReportsWithSample(sampleConfigurations);

        // V6 uses local state filters; v4/v5/v7 use URL-driven search.
        const textQ = isV6Mode
            ? v6NameFilter.trim().toLowerCase()
            : String(searchFilter?.[reportNameSearchKey] ?? '').trim().toLowerCase();

        let result = textQ ? merged.filter((r) => r.name.toLowerCase().includes(textQ)) : merged;

        if (isAreaReports) {
            if (isV7Mode) {
                const V7_GROUP_AREAS: Record<V7GroupKey, VulnWorkflowView[]> = {
                    image: ['user-workloads', 'platform', 'all-images', 'inactive-images'],
                    'node-cves': ['node-cves'],
                    'virtual-machines': ['virtual-machines'],
                };
                const activeAreas = V7_GROUP_AREAS[v7ToggleGroup];
                result = result.filter((r) => {
                    const sourceType = resolveUniversalReportSourceType(r);
                    if (sourceType !== 'vulnerability') return false;
                    const view = resolveVulnWorkflowView(r.id);
                    return view !== undefined && activeAreas.includes(view);
                });
            } else if (isV6Mode) {
                const activeAreas: VulnWorkflowView[] =
                    v6AreaFilter.length > 0 ? v6AreaFilter : [toggleGroupView];
                result = result.filter((r) => {
                    const sourceType = resolveUniversalReportSourceType(r);
                    if (sourceType !== 'vulnerability') return false;
                    const view = resolveVulnWorkflowView(r.id);
                    return view !== undefined && activeAreas.includes(view);
                });
            } else if (isV5Mode && vulnReportGroupParam === 'image') {
                // v5 image group: combine all 4 image areas; v5ImageAreaFilter chips narrow results.
                const ALL_IMAGE_AREAS: VulnWorkflowView[] = ['user-workloads', 'platform', 'all-images', 'inactive-images'];
                const activeAreas = v5ImageAreaFilter.length > 0 ? v5ImageAreaFilter : ALL_IMAGE_AREAS;
                result = result.filter((r) => {
                    const sourceType = resolveUniversalReportSourceType(r);
                    if (sourceType !== 'vulnerability') return false;
                    const view = resolveVulnWorkflowView(r.id);
                    return view !== undefined && activeAreas.includes(view);
                });
            } else if (isV4Mode && v4ActiveTab === 'image') {
                // v4 image tab: all 4 image areas combined.
                const ALL_IMAGE_AREAS: VulnWorkflowView[] = ['user-workloads', 'platform', 'all-images', 'inactive-images'];
                result = result.filter((r) => {
                    const sourceType = resolveUniversalReportSourceType(r);
                    if (sourceType !== 'vulnerability') return false;
                    const view = resolveVulnWorkflowView(r.id);
                    return view !== undefined && ALL_IMAGE_AREAS.includes(view);
                });
            } else {
                result = result.filter((r) => {
                    const sourceType = resolveUniversalReportSourceType(r);
                    if (sourceType !== 'vulnerability') return false;
                    return resolveVulnWorkflowView(r.id) === activeSubnav;
                });
            }
        }
        return result;
    }, [useDemoReportList, searchFilter, pathname, isAreaReports, vulnReportAreaParam, vulnReportGroupParam, toggleGroupView, isV6Mode, isV5Mode, isV7Mode, v6NameFilter, v6AreaFilter, v5ImageAreaFilter, v7ToggleGroup, v4ActiveTab]);

    const apiReportConfigurations = useMemo(() => {
        if (!reportConfigurations) {
            return null;
        }
        if (!isAreaReports) {
            return reportConfigurations;
        }
        const session = readSessionCreatedReportConfigurations();
        const apiIds = new Set(reportConfigurations.map((report) => report.id));
        const sessionOnly = session.filter((report) => !apiIds.has(report.id));
        return [...sessionOnly, ...reportConfigurations];
    }, [reportConfigurations, isAreaReports]);

    const visibleReportConfigurations =
        useDemoReportList && filteredSampleReports
            ? filteredSampleReports.slice((page - 1) * perPage, (page - 1) * perPage + perPage)
            : apiReportConfigurations?.slice((page - 1) * perPage, (page - 1) * perPage + perPage) ??
              reportConfigurations;

    const totalReportsForPagination =
        useDemoReportList && filteredSampleReports
            ? filteredSampleReports.length
            : apiReportConfigurations?.length ?? totalReports;

    const snapshotReportSource =
        useDemoReportList && filteredSampleReports
            ? filteredSampleReports
            : apiReportConfigurations;

    const { reportSnapshots: fetchedReportSnapshots, isLoading: isLoadingReportSnapshots } =
        useWatchLastSnapshotForReports(useDemoReportList ? null : snapshotReportSource);

    const reportSnapshots = useDemoReportList
        ? isAreaReports
            ? mergeUniversalReportsSampleSnapshots()
            : VM_PROTOTYPE_V1_SAMPLE_CONFIGURED_SNAPSHOTS
        : fetchedReportSnapshots;
    const { isRunning, runError, runReport } = useRunReport({
        onCompleted: ({ reportNotificationMethod }) => {
            if (reportNotificationMethod === 'EMAIL') {
                addToast('The report has been sent to the configured email notifier', 'success');
            } else if (reportNotificationMethod === 'DOWNLOAD') {
                addToast(
                    'The report generation has started and will be available for download once complete',
                    'success'
                );
            }
            fetchReports();
        },
    });

    const {
        selected,
        numSelected,
        allRowsSelected,
        hasSelections,
        onSelect,
        onSelectAll,
        onClearAll: onClearAllSelected,
        getSelectedIds,
    } = useTableSelection(visibleReportConfigurations || emptyReportArray);

    const {
        openDeleteModal,
        isDeleteModalOpen,
        closeDeleteModal,
        isDeleting,
        onDelete,
        deleteResults,
        reportIdsToDelete,
    } = useDeleteModal({
        onCompleted: () => {
            onClearAllSelected();
            fetchReports();
        },
    });

    function onConfirmDeleteSelection() {
        const selectedIds = getSelectedIds();
        openDeleteModal(selectedIds);
    }

    const numSuccessfulDeletions = deleteResults?.filter(isSuccessDeleteResult).length || 0;
    const v6V7Description = isV7Mode
        ? getV6V7Description([], v7ToggleGroup)
        : isV6Mode
          ? getV6V7Description(v6AreaFilter, 'image')
          : '';

    return (
        <>
            <AlertGroup isToast isLiveRegion>
                {toasts.map(({ key, variant, title, children }: Toast) => (
                    <Alert
                        key={key}
                        variant={variant}
                        title={title}
                        component="p"
                        timeout
                        onTimeout={() => removeToast(key)}
                        actionClose={
                            <AlertActionCloseButton
                                title={title}
                                variantLabel={variant}
                                onClose={() => removeToast(key)}
                            />
                        }
                    >
                        {children}
                    </Alert>
                ))}
            </AlertGroup>
            <PageTitle title="Vulnerability reporting - Report configurations" />
            {/* Skip this section in V5 table view — breadcrumb row handles Create button */}
            {!isV5TableView && (
                <PageSection>
                    {runError && <Alert variant="danger" isInline title={runError} component="p" />}
                    {useSampleFallback && fetchError && (
                        <Alert
                            className="pf-v6-u-mb-md"
                            variant="info"
                            isInline
                            title="Showing sample report configurations"
                            component="p"
                            actionLinks={
                                <AlertActionLink
                                    component="button"
                                    isDisabled={isLoading}
                                    onClick={() => {
                                        fetchReports().catch(() => {});
                                    }}
                                >
                                    Retry loading reports
                                </AlertActionLink>
                            }
                        >
                            <Content component="p">
                                Central did not return scheduled reports ({fetchError}). The table
                                below shows static examples until the list loads successfully. Row
                                actions and create still call Central; sample row IDs may fail
                                until you retry or the API recovers.
                            </Content>
                        </Alert>
                    )}
                    {/* v6/v7: description + Create report on one row, divider below */}
                    {(isV6Mode || isV7Mode) && (
                        <>
                            <Flex
                                direction={{ default: 'row' }}
                                alignItems={{ default: 'alignItemsCenter' }}
                                justifyContent={{ default: 'justifyContentSpaceBetween' }}
                                flexWrap={{ default: 'nowrap' }}
                            >
                                <FlexItem flex={{ default: 'flex_1' }}>
                                    <Content
                                        component={ContentVariants.p}
                                        style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                                    >
                                        {v6V7Description}
                                    </Content>
                                </FlexItem>
                                {showCreateReportButton && (
                                    <FlexItem align={{ default: 'alignRight' }}>
                                        <CreateReportsButton />
                                    </FlexItem>
                                )}
                            </Flex>
                            <Divider className="pf-v6-u-mt-md pf-v6-u-mb-md" />
                        </>
                    )}
                    {/* V4: Create in VulnReportingLayout. V5 table view: breadcrumb row. */}
                    {!showV5Landing &&
                        !showV5GroupLanding &&
                        !isV4Mode &&
                        !isV5TableView &&
                        !isV6Mode &&
                        !isV7Mode && (
                        <Flex
                            direction={{ default: 'row' }}
                            alignItems={{ default: 'alignItemsCenter' }}
                            justifyContent={{ default: 'justifyContentSpaceBetween' }}
                            flexWrap={{ default: 'nowrap' }}
                        >
                            <FlexItem>
                                <Content component="p">
                                    {isAreaReports
                                        ? areaDescription(
                                              vulnReportGroupParam,
                                              vulnReportAreaParam,
                                              '',
                                              []
                                          )
                                        : 'Configure reports, define collections, and assign delivery destinations to report on vulnerabilities across the organization.'}
                                </Content>
                            </FlexItem>
                            {showCreateReportButton && (
                                <FlexItem align={{ default: 'alignRight' }}>
                                    <CreateReportsButton />
                                </FlexItem>
                            )}
                        </Flex>
                    )}
                </PageSection>
            )}
            {/* V4 sub-tabs now live in VulnReportingLayout directly under the main tab bar */}
            {showV5Landing && (
                <PageSection>
                    <Title headingLevel="h2" size="lg" style={{ marginBottom: '12px' }}>
                        Select a report type
                    </Title>
                    <Gallery hasGutter minWidths={{ default: '220px' }}>
                        {V5_GROUP_ITEMS.map((item) => (
                            <V5Card key={item.key} item={item} />
                        ))}
                    </Gallery>
                </PageSection>
            )}
            {isV5TableView && (
                <PageSection style={{ paddingBottom: 0 }}>
                    <Flex
                        direction={{ default: 'row' }}
                        alignItems={{ default: 'alignItemsCenter' }}
                        justifyContent={{ default: 'justifyContentSpaceBetween' }}
                        flexWrap={{ default: 'nowrap' }}
                    >
                        <FlexItem>
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    <Link to={`${vulnerabilityConfigurationReportsPath}?prototype=v5`}>
                                        Report configurations
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbItem isActive>
                                    {vulnReportGroupParam === 'image'
                                        ? 'Image vulnerability reports'
                                        : activeSubnav === 'node-cves'
                                          ? 'Nodes'
                                          : activeSubnav === 'virtual-machines'
                                            ? 'Virtual machines'
                                            : VULN_WORKFLOW_VIEW_META[activeSubnav].label}
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </FlexItem>
                        {showCreateReportButton && (
                            <FlexItem align={{ default: 'alignRight' }}>
                                <CreateReportsButton />
                            </FlexItem>
                        )}
                    </Flex>
                </PageSection>
            )}
            {isV6Mode && (
                <>
                    {/* Advanced search filters — sit above the toggle tabs */}
                    <PageSection>
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarGroup variant="filter-group">
                                    <ToolbarItem>
                                        {/* Area of concern grouped checkbox filter — left of search */}
                                        <Select
                                            isOpen={v6AreaFilterOpen}
                                            selected={v6AreaFilter}
                                            onSelect={(_e, val) => {
                                                if (typeof val === 'string') {
                                                    setV6AreaFilter((prev) =>
                                                        toggleItemInArray(
                                                            prev,
                                                            val as VulnWorkflowView
                                                        )
                                                    );
                                                    setPage(1);
                                                }
                                            }}
                                            onOpenChange={(open) => setV6AreaFilterOpen(open)}
                                            toggle={(ref: Ref<MenuToggleElement>) => (
                                                <MenuToggle
                                                    ref={ref}
                                                    onClick={() =>
                                                        setV6AreaFilterOpen((o) => !o)
                                                    }
                                                    isExpanded={v6AreaFilterOpen}
                                                >
                                                    <Flex
                                                        alignItems={{ default: 'alignItemsCenter' }}
                                                        spaceItems={{ default: 'spaceItemsSm' }}
                                                        flexWrap={{ default: 'nowrap' }}
                                                    >
                                                        <FlexItem>Area of concern</FlexItem>
                                                        {v6AreaFilter.length > 0 && (
                                                            <span
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    color: 'var(--pf-t--global--text--color--subtle)',
                                                                }}
                                                            >
                                                                {v6AreaFilter.length}
                                                            </span>
                                                        )}
                                                    </Flex>
                                                </MenuToggle>
                                            )}
                                        >
                                            <SelectList>
                                                <SelectGroup label="Image vulnerability reports">
                                                    {(['user-workloads', 'platform', 'all-images', 'inactive-images'] as const).map((view) => (
                                                        <SelectOption
                                                            key={view}
                                                            hasCheckbox
                                                            value={view}
                                                            isSelected={v6AreaFilter.includes(view)}
                                                            isDisabled={v6LockedGroup === 'node-vm'}
                                                        >
                                                            {VULN_WORKFLOW_VIEW_META[view].label}
                                                        </SelectOption>
                                                    ))}
                                                </SelectGroup>
                                                <Divider />
                                                <SelectOption
                                                    hasCheckbox
                                                    value="node-cves"
                                                    isSelected={v6AreaFilter.includes('node-cves')}
                                                    isDisabled={v6LockedGroup === 'image'}
                                                >
                                                    Nodes
                                                </SelectOption>
                                                <SelectOption
                                                    hasCheckbox
                                                    value="virtual-machines"
                                                    isSelected={v6AreaFilter.includes('virtual-machines')}
                                                    isDisabled={v6LockedGroup === 'image'}
                                                >
                                                    Virtual machines
                                                </SelectOption>
                                                {v6LockedGroup !== null && (
                                                    <SelectOption
                                                        isDisabled
                                                        value="__hint__"
                                                        style={{
                                                            fontSize: '12px',
                                                            color: 'var(--pf-t--global--text--color--subtle)',
                                                            fontStyle: 'italic',
                                                            cursor: 'default',
                                                            paddingTop: '6px',
                                                        }}
                                                    >
                                                        Image and node/VM reports use different data sources and cannot be combined.
                                                    </SelectOption>
                                                )}
                                            </SelectList>
                                        </Select>
                                    </ToolbarItem>
                                    <ToolbarItem>
                                        <SearchInput
                                            placeholder="Filter by report name"
                                            value={v6NameFilter}
                                            onChange={(_e, val) => {
                                                setV6NameFilter(val);
                                                setPage(1);
                                            }}
                                            onSearch={(_e, val) => {
                                                setV6NameFilter(val);
                                                setPage(1);
                                            }}
                                            onClear={() => {
                                                setV6NameFilter('');
                                                setPage(1);
                                            }}
                                        />
                                    </ToolbarItem>
                                </ToolbarGroup>
                            </ToolbarContent>
                            {(v6NameFilter || v6AreaFilter.length > 0) && (
                                <ToolbarContent>
                                    {v6AreaFilter.length > 0 && (
                                        <ToolbarItem>
                                            <LabelGroup categoryName="Area of concern" numLabels={5}>
                                                {v6AreaFilter.map((area) => (
                                                    <Label
                                                        key={area}
                                                        isCompact
                                                        onClose={() => {
                                                            setV6AreaFilter((prev) =>
                                                                prev.filter((a) => a !== area)
                                                            );
                                                            setPage(1);
                                                        }}
                                                    >
                                                        {VULN_WORKFLOW_VIEW_META[area].label}
                                                    </Label>
                                                ))}
                                            </LabelGroup>
                                        </ToolbarItem>
                                    )}
                                    <ToolbarItem>
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                setV6NameFilter('');
                                                setV6AreaFilter([]);
                                                setPage(1);
                                            }}
                                        >
                                            Clear all filters
                                        </Button>
                                    </ToolbarItem>
                                </ToolbarContent>
                            )}
                        </Toolbar>
                    </PageSection>
                </>
            )}
            {/* V7: 3-item grouped ToggleGroup — no advanced filter */}
            {isV7Mode && (
                <PageSection>
                    <ToggleGroup aria-label="Area of concern">
                        {(
                            [
                                { key: 'image', label: 'Image vulnerability reports' },
                                { key: 'node-cves', label: 'Node reports' },
                                { key: 'virtual-machines', label: 'Virtual machines reports' },
                            ] as { key: V7GroupKey; label: string }[]
                        ).map(({ key, label }) => (
                            <ToggleGroupItem
                                key={key}
                                text={label}
                                buttonId={`v7-area-${key}`}
                                isSelected={v7ToggleGroup === key}
                                onChange={() => {
                                    setV7ToggleGroup(key);
                                    setPage(1);
                                }}
                            />
                        ))}
                    </ToggleGroup>
                </PageSection>
            )}
            {!showV5Landing && (
                <PageSection>
                <Toolbar>
                    <ToolbarContent>
                        {/* V5 image group: area-of-concern pre-filter (before search) */}
                        {isV5Mode && vulnReportGroupParam === 'image' && (
                            <ToolbarItem>
                                <CheckboxSelect
                                    selections={v5ImageAreaFilter}
                                    onChange={(next) => {
                                        setV5ImageAreaFilter(next as VulnWorkflowView[]);
                                        setPage(1);
                                    }}
                                    placeholderText="Area of concern"
                                    ariaLabel="Filter by area of concern"
                                >
                                    {[
                                        { value: 'user-workloads', label: 'User workloads' },
                                        { value: 'platform', label: 'Platform' },
                                        { value: 'all-images', label: 'All vulnerability images' },
                                        { value: 'inactive-images', label: 'Inactive images' },
                                    ].map(({ value, label }) => (
                                        <SelectOption key={value} value={value}>
                                            {label}
                                        </SelectOption>
                                    ))}
                                </CheckboxSelect>
                            </ToolbarItem>
                        )}
                        {/* V6 replaces search with its own above-the-table filter bar */}
                        {!isV6Mode && (
                            <ToolbarItem className="pf-v6-u-flex-grow-1">
                                <SearchInput
                                    placeholder="Filter by report name"
                                    value={searchValue}
                                    onChange={(_event, value) => setSearchValue(value)}
                                    onSearch={(_event, value) => {
                                        setSearchValue(value);
                                        setSearchFilter({ [reportNameSearchKey]: value });
                                        setPage(1);
                                    }}
                                    onClear={() => {
                                        setSearchValue('');
                                        setSearchFilter({});
                                        setPage(1);
                                    }}
                                />
                            </ToolbarItem>
                        )}
                        <ToolbarItem>
                            <MenuDropdown toggleText="Bulk actions" isDisabled={!hasSelections}>
                                <DropdownItem key="delete" onClick={onConfirmDeleteSelection}>
                                    Delete ({numSelected})
                                </DropdownItem>
                            </MenuDropdown>
                        </ToolbarItem>
                        <ToolbarItem variant="pagination" align={{ default: 'alignEnd' }}>
                            <Pagination
                                itemCount={totalReportsForPagination}
                                page={page}
                                perPage={perPage}
                                onSetPage={(_, newPage) => setPage(newPage)}
                                onPerPageSelect={(_, newPerPage) => setPerPage(newPerPage)}
                                isCompact
                            />
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
                {isLoading && !visibleReportConfigurations && (
                    <div className="pf-v6-u-p-md">
                        <Bullseye>
                            <Spinner />
                        </Bullseye>
                    </div>
                )}
                {fetchError && !useSampleFallback && (
                    <EmptyState
                        headingLevel="h2"
                        icon={ExclamationCircleIcon}
                        titleText="Unable to get vulnerability reports"
                        variant="sm"
                    >
                        <EmptyStateBody>{fetchError}</EmptyStateBody>
                    </EmptyState>
                )}
                {visibleReportConfigurations && (
                    <Table>
                        <Thead noWrap>
                            <Tr>
                                <Th
                                    select={{
                                        onSelect: onSelectAll,
                                        isSelected: allRowsSelected,
                                    }}
                                />
                                <Th sort={getSortParams(reportNameSearchKey)}>Report</Th>
                                <HelpIconTh
                                    popoverContent={
                                        <div>
                                            {isAreaReports
                                                ? 'A set of user-configured rules to select deployed images either by Custom scope or by named collection'
                                                : 'A set of user-configured rules for selecting deployments as part of the collection'}
                                        </div>
                                    }
                                >
                                    {isAreaReports ? 'Resources' : 'Collection'}
                                </HelpIconTh>
                                <Th>Description</Th>
                                <HelpIconTh
                                    popoverContent={
                                        <JobStatusPopoverContent
                                            statuses={[
                                                'WAITING',
                                                'PREPARING',
                                                'DOWNLOAD_GENERATED',
                                                'EMAIL_DELIVERED',
                                                'ERROR',
                                            ]}
                                        />
                                    }
                                >
                                    My last job status
                                </HelpIconTh>
                                {hasWriteAccessForReport && <Th screenReaderText="Row actions" />}
                            </Tr>
                        </Thead>
                        {visibleReportConfigurations.length === 0 && isEmpty(searchFilter) && (
                            <Tbody>
                                <Tr>
                                    <Td colSpan={6}>
                                        <Bullseye>
                                            <EmptyStateTemplate
                                                title="No vulnerability reports yet"
                                                headingLevel="h2"
                                                icon={FileIcon}
                                            >
                                                {showCreateReportButton && (
                                                    <Flex
                                                        direction={{
                                                            default: 'column',
                                                        }}
                                                    >
                                                        <FlexItem>
                                                            <Content component="p">
                                                                To get started, create a report
                                                            </Content>
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <CreateReportsButton />
                                                        </FlexItem>
                                                    </Flex>
                                                )}
                                            </EmptyStateTemplate>
                                        </Bullseye>
                                    </Td>
                                </Tr>
                            </Tbody>
                        )}
                        {visibleReportConfigurations.length === 0 && !isEmpty(searchFilter) && (
                            <Tbody>
                                <Tr>
                                    <Td colSpan={6}>
                                        <Bullseye>
                                            <EmptyStateTemplate
                                                title="No results found"
                                                headingLevel="h2"
                                                icon={SearchIcon}
                                            >
                                                {hasWriteAccessForReport && (
                                                    <Flex
                                                        direction={{
                                                            default: 'column',
                                                        }}
                                                    >
                                                        <FlexItem>
                                                            <Content component="p">
                                                                No results match this filter
                                                                criteria. Clear the filter and try
                                                                again.
                                                            </Content>
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <Button
                                                                variant="link"
                                                                onClick={() => {
                                                                    setSearchValue('');
                                                                    setSearchFilter({});
                                                                }}
                                                            >
                                                                Clear filter
                                                            </Button>
                                                        </FlexItem>
                                                    </Flex>
                                                )}
                                            </EmptyStateTemplate>
                                        </Bullseye>
                                    </Td>
                                </Tr>
                            </Tbody>
                        )}
                        {visibleReportConfigurations.map((report, rowIndex) => {
                            const vulnReportURL = generatePath(
                                vulnerabilityConfigurationReportDetailsPath,
                                {
                                    reportId: report.id,
                                }
                            );
                            // V6/V7: append vulnReportGroup so the detail-page breadcrumb
                            // can show the correct area label. V4 already carries vulnReportArea
                            // in the URL from the subtab; V5 carries vulnReportGroup/Area too.
                            const areaGroupSuffix = (() => {
                                if (!isV6Mode && !isV7Mode) return '';
                                const view = resolveVulnWorkflowView(report.id);
                                if (!view) return '';
                                const imageViews = new Set<string>(['user-workloads', 'platform', 'all-images', 'inactive-images']);
                                const group = imageViews.has(view) ? 'image' : view;
                                return `&vulnReportGroup=${group}`;
                            })();
                            const snapshot = reportSnapshots[report.id];
                            const isReportStatusPending =
                                snapshot?.reportStatus.runState === 'PREPARING' ||
                                snapshot?.reportStatus.runState === 'WAITING';
                            const rowActions = [
                                {
                                    title: 'Edit report',
                                    onClick: (event) => {
                                        event.preventDefault();
                                        if (isAreaReports) {
                                            const sourceType = resolveUniversalReportSourceType(
                                                report.id
                                            );
                                            if (sourceType === 'compliance') {
                                                navigate(
                                                    linkToWithVmPrototype(
                                                        `${complianceEnhancedSchedulesPath}?action=create`,
                                                        search
                                                    )
                                                );
                                                return;
                                            }
                                        }
                                        navigate(
                                            linkToWithVmPrototype(
                                                `${vulnReportURL}?action=edit`,
                                                search
                                            ),
                                            {
                                                state: {
                                                    editReport: {
                                                        id: report.id,
                                                        name: report.name,
                                                        description: report.description,
                                                        reportScope: report.resourceScope
                                                            ?.collectionScope
                                                            ? {
                                                                  id: report.resourceScope
                                                                      .collectionScope.collectionId,
                                                                  name: report.resourceScope
                                                                      .collectionScope
                                                                      .collectionName,
                                                              }
                                                            : null,
                                                    },
                                                },
                                            }
                                        );
                                    },
                                    isDisabled: isReportStatusPending,
                                },
                                {
                                    isSeparator: true,
                                },
                                {
                                    title: 'Send report',
                                    description:
                                        report.notifiers.length === 0
                                            ? 'No delivery destinations set'
                                            : '',
                                    onClick: (event) => {
                                        event.preventDefault();
                                        runReport(report.id, 'EMAIL');
                                    },
                                    isDisabled:
                                        isReportStatusPending || report.notifiers.length === 0,
                                },
                                {
                                    title: 'Generate download',
                                    onClick: (event) => {
                                        event.preventDefault();
                                        runReport(report.id, 'DOWNLOAD');
                                    },
                                    isDisabled: isReportStatusPending,
                                },
                                {
                                    title: 'Clone report',
                                    onClick: (event) => {
                                        event.preventDefault();
                                        navigate(
                                            linkToWithVmPrototype(
                                                `${vulnReportURL}?action=clone`,
                                                search
                                            )
                                        );
                                    },
                                },
                                {
                                    isSeparator: true,
                                },
                                {
                                    title: (
                                        <span
                                            className={
                                                !isReportStatusPending
                                                    ? 'pf-v6-u-text-color-status-danger'
                                                    : ''
                                            }
                                        >
                                            Delete report
                                        </span>
                                    ),
                                    onClick: (event) => {
                                        event.preventDefault();
                                        openDeleteModal([report.id]);
                                    },
                                    isDisabled: isReportStatusPending,
                                },
                            ];
                            const { collectionName, collectionId } =
                                report.resourceScope.collectionScope;

                            return (
                                <Tbody key={report.id}>
                                    <Tr>
                                        <Td
                                            key={report.id}
                                            select={{
                                                rowIndex,
                                                onSelect,
                                                isSelected: selected[rowIndex],
                                            }}
                                        />
                                        <Td dataLabel="Report">
                                            <Link to={linkToWithVmPrototype(vulnReportURL, search + areaGroupSuffix)}>
                                                {report.name}
                                            </Link>
                                        </Td>
                                        <Td dataLabel={isAreaReports ? 'Resources' : 'Collection'}>
                                            {isAreaReports ? (
                                                collectionId ? (
                                                    isCollectionsRouteEnabled ? (
                                                        <Button
                                                            variant="link"
                                                            isInline
                                                            onClick={() =>
                                                                setCollectionModalId(collectionId)
                                                            }
                                                        >
                                                            {collectionName}
                                                        </Button>
                                                    ) : (
                                                        collectionName
                                                    )
                                                ) : (
                                                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                                                        Custom scope
                                                    </span>
                                                )
                                            ) : isCollectionsRouteEnabled ? (
                                                <Button
                                                    variant="link"
                                                    isInline
                                                    onClick={() =>
                                                        setCollectionModalId(collectionId)
                                                    }
                                                >
                                                    {collectionName}
                                                </Button>
                                            ) : (
                                                collectionName
                                            )}
                                        </Td>
                                        <Td dataLabel="Description">{report.description || '-'}</Td>
                                        <Td dataLabel="My last job status">
                                            <MyLastJobStatus
                                                snapshot={snapshot}
                                                isLoadingSnapshots={isLoadingReportSnapshots}
                                                currentUserId={currentUser.userId}
                                                baseDownloadURL={reportDownloadURL}
                                            />
                                        </Td>
                                        {hasWriteAccessForReport && (
                                            <Td isActionCell>
                                                <ActionsColumn
                                                    items={rowActions}
                                                    isDisabled={isRunning}
                                                    // menuAppendTo={() => document.body}
                                                />
                                            </Td>
                                        )}
                                    </Tr>
                                </Tbody>
                            );
                        })}
                    </Table>
                )}
                </PageSection>
            )}
            <DeleteModal
                title={`Permanently delete (${reportIdsToDelete.length}) ${pluralize(
                    'report',
                    reportIdsToDelete.length
                )}?`}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                isDeleting={isDeleting}
                onDelete={onDelete}
            >
                <AlertGroup>
                    {numSuccessfulDeletions > 0 && (
                        <Alert
                            isInline
                            variant="success"
                            title={`Successfully deleted ${numSuccessfulDeletions} ${pluralize(
                                'report',
                                numSuccessfulDeletions
                            )}`}
                            component="p"
                            className="pf-v6-u-mb-sm"
                        />
                    )}
                    {deleteResults?.filter(isErrorDeleteResult).map((deleteResult) => {
                        const report =
                            reportConfigurations?.find(
                                (reportConfig) => reportConfig.id === deleteResult.id
                            ) ??
                            readSessionCreatedReportConfigurations().find(
                                (reportConfig) => reportConfig.id === deleteResult.id
                            ) ??
                            VM_PROTOTYPE_V1_SAMPLE_REPORT_CONFIGURATIONS.find(
                                (reportConfig) => reportConfig.id === deleteResult.id
                            );
                        if (!report) {
                            return null;
                        }
                        return (
                            <Alert
                                isInline
                                variant="danger"
                                title={`Failed to delete "${report.name}"`}
                                component="p"
                                className="pf-v6-u-mb-sm"
                            >
                                {deleteResult.error}
                            </Alert>
                        );
                    })}
                </AlertGroup>
                <p>
                    The selected report(s) and any attached downloadable reports will be permanently
                    deleted. The action cannot be undone.
                </p>
            </DeleteModal>
            {collectionModalId && (
                <CollectionsFormModal
                    hasWriteAccessForCollections={false}
                    modalAction={{ type: 'view', collectionId: collectionModalId }}
                    onClose={() => setCollectionModalId(null)}
                />
            )}
        </>
    );
}

export default ConfigReportsTab;
