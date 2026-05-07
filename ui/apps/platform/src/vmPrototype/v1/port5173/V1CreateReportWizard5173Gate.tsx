import { useCallback, useMemo } from 'react';
import type { ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router-dom-v5-compat';
import { Alert, Bullseye, Spinner } from '@patternfly/react-core';

import { getSearchFilterConfigWithFeatureFlagDependency } from 'Components/CompoundSearchFilter/utils/utils';
import type { ReportFormValues } from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import {
    clusterSearchFilterConfig,
    deploymentSearchFilterConfig,
    imageCVESearchFilterConfig,
    imageComponentSearchFilterConfig,
    imageSearchFilterConfig,
    namespaceSearchFilterConfig,
} from 'Containers/Vulnerabilities/searchFilterConfig';
import { CLUSTER_SORT_FIELD } from 'Containers/Vulnerabilities/utils/sortFields';
import { listCollections } from 'services/CollectionsService';
import type { Collection } from 'services/CollectionsService';
import { usePaginatedQuery } from 'hooks/usePaginatedQuery';
import useRestQuery from 'hooks/useRestQuery';
import { fetchNotifierIntegrations } from 'services/NotifierIntegrationsService';
import { getPaginationParams } from 'utils/searchUtils';
import useFeatureFlags from 'hooks/useFeatureFlags';

import { augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab } from '../augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab';
import type { CollectionSlim } from './map5173FormToReportFormValues';
import V1CreateReportWizard5173 from './V1CreateReportWizard5173';
import {
    WORKLOAD_SCOPE_WIZARD_CENTRAL_QUERY,
    mapWorkloadScopeWizardCentralQuery,
} from './workloadScopeWizardCentralQuery';

const WORKLOAD_SCOPE_PAGE_SIZE = 500;

const namespaceScopeSortOption = { field: 'Namespace Risk Priority', reversed: false };
const deploymentScopeSortOption = { field: 'Deployment', reversed: false };
const clusterScopeSortOption = { field: CLUSTER_SORT_FIELD, reversed: false };

const COLLECTION_PAGE = 50;

export type V1CreateReportWizard5173GateProps = {
    createReport: (values: ReportFormValues) => void;
    isPersisting: boolean;
    persistError: string | null;
};

/**
 * Loads Central collections + notifiers, then renders the localhost:5173 CreateReportWizard UI
 * (ported JSX) wired to {@link createReport}.
 */
const WORKLOAD_OVERVIEW_SEARCH_FILTER_ENTITIES = [
    clusterSearchFilterConfig,
    imageCVESearchFilterConfig,
    deploymentSearchFilterConfig,
    imageSearchFilterConfig,
    imageComponentSearchFilterConfig,
    namespaceSearchFilterConfig,
] as const;

export default function V1CreateReportWizard5173Gate({
    createReport,
    isPersisting,
    persistError,
}: V1CreateReportWizard5173GateProps): ReactElement {
    const { search } = useLocation();
    const { isFeatureFlagEnabled } = useFeatureFlags();

    const workloadCompoundConfigForPrefill = useMemo(
        () =>
            augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab(
                getSearchFilterConfigWithFeatureFlagDependency(
                    isFeatureFlagEnabled,
                    WORKLOAD_OVERVIEW_SEARCH_FILTER_ENTITIES
                )
            ),
        [isFeatureFlagEnabled]
    );

    const requestFn = useCallback(
        (page: number) =>
            listCollections(
                {},
                { field: 'Collection Name', reversed: false },
                page,
                COLLECTION_PAGE
            ).request,
        []
    );

    const {
        data: collectionPages,
        isFetchingNextPage,
        isRefreshingResults,
        lastFetchError,
    } = usePaginatedQuery<Collection, string>(requestFn, COLLECTION_PAGE, {
        dedupKeyFn: (c) => c.id,
    });

    const centralCollections: CollectionSlim[] = useMemo(
        () =>
            collectionPages
                .flat()
                .map((c) => ({ id: c.id, name: c.name, description: c.description })),
        [collectionPages]
    );

    const { data: notifierRows = [], isLoading: notifiersLoading } =
        useRestQuery(fetchNotifierIntegrations);

    const scopeVariables = useMemo(
        () => ({
            clusterQuery: '',
            clusterPagination: getPaginationParams({
                page: 1,
                perPage: WORKLOAD_SCOPE_PAGE_SIZE,
                sortOption: clusterScopeSortOption,
            }),
            namespaceQuery: '',
            namespacePagination: getPaginationParams({
                page: 1,
                perPage: WORKLOAD_SCOPE_PAGE_SIZE,
                sortOption: namespaceScopeSortOption,
            }),
            deploymentQuery: '',
            deploymentPagination: getPaginationParams({
                page: 1,
                perPage: WORKLOAD_SCOPE_PAGE_SIZE,
                sortOption: deploymentScopeSortOption,
            }),
        }),
        []
    );

    const {
        data: scopeQueryData,
        loading: scopeLoading,
        error: scopeQueryError,
    } = useQuery(WORKLOAD_SCOPE_WIZARD_CENTRAL_QUERY, {
        variables: scopeVariables,
        notifyOnNetworkStatusChange: true,
    });

    const centralWorkloadScope = useMemo(
        () => mapWorkloadScopeWizardCentralQuery(scopeQueryData),
        [scopeQueryData]
    );

    const emailNotifier = useMemo(() => {
        const email = notifierRows.find((n) => n.type?.toLowerCase().includes('email'));
        const pick = email ?? notifierRows[0];
        return pick ? { id: pick.id, name: pick.name } : null;
    }, [notifierRows]);

    const collectionsLoading = isRefreshingResults || isFetchingNextPage;

    if (collectionsLoading && centralCollections.length === 0) {
        return (
            <Bullseye className="pf-v6-u-p-xl">
                <Spinner aria-label="Loading collections" />
            </Bullseye>
        );
    }

    if (lastFetchError) {
        return (
            <Alert variant="danger" title="Could not load collections" component="p">
                {lastFetchError.message}
            </Alert>
        );
    }

    if (!collectionsLoading && centralCollections.length === 0) {
        return (
            <Alert variant="warning" title="No collections available" component="p">
                Create at least one collection in ACS, then reload this page to use the v1
                create-report wizard.
            </Alert>
        );
    }

    if (notifiersLoading) {
        return (
            <Bullseye className="pf-v6-u-p-xl">
                <Spinner aria-label="Loading notifiers" />
            </Bullseye>
        );
    }

    return (
        <V1CreateReportWizard5173
            centralCollections={centralCollections}
            centralWorkloadScope={centralWorkloadScope}
            centralWorkloadScopeLoading={scopeLoading}
            centralWorkloadScopeError={scopeQueryError}
            emailNotifier={emailNotifier}
            navigationSearch={search}
            workloadCompoundConfigForPrefill={workloadCompoundConfigForPrefill}
            onPersistReportFormValues={createReport}
            isPersisting={isPersisting}
            persistError={persistError}
        />
    );
}
