import { gql } from '@apollo/client';

import { displayClusterType } from 'Containers/Vulnerabilities/PlatformCves/utils/stringUtils';
import { CLUSTER_SORT_FIELD } from 'Containers/Vulnerabilities/utils/sortFields';
import type { ClusterType } from 'types/cluster.proto';

/** Re-export for callers building pagination alongside this query. */
export { CLUSTER_SORT_FIELD as workloadScopeClusterSortField };

export const WORKLOAD_SCOPE_WIZARD_CENTRAL_QUERY = gql`
    query workloadScopeWizardCentral(
        $clusterQuery: String!
        $clusterPagination: Pagination!
        $namespaceQuery: String!
        $namespacePagination: Pagination!
        $deploymentQuery: String!
        $deploymentPagination: Pagination!
    ) {
        clusters(query: $clusterQuery, pagination: $clusterPagination) {
            id
            name
            type
            labels {
                key
                value
            }
        }
        namespaces(query: $namespaceQuery, pagination: $namespacePagination) {
            metadata {
                id
                name
                labels {
                    key
                    value
                }
                annotations {
                    key
                    value
                }
            }
        }
        deployments(query: $deploymentQuery, pagination: $deploymentPagination) {
            id
            name
            type
            labels {
                key
                value
            }
            annotations {
                key
                value
            }
        }
    }
`;

export type WorkloadScopeKeyValue = { key: string; value: string };

export type CentralWorkloadScopeCluster = {
    id: string;
    name: string;
    type: string;
    labels: WorkloadScopeKeyValue[];
};

export type CentralWorkloadScopeNamespace = {
    id: string;
    name: string;
    labels: WorkloadScopeKeyValue[];
    annotations: WorkloadScopeKeyValue[];
};

export type CentralWorkloadScopeDeployment = {
    id: string;
    name: string;
    type: string;
    labels: WorkloadScopeKeyValue[];
    annotations: WorkloadScopeKeyValue[];
};

export type CentralWorkloadScopePayload = {
    clusters: CentralWorkloadScopeCluster[];
    namespaces: CentralWorkloadScopeNamespace[];
    deployments: CentralWorkloadScopeDeployment[];
};

export type WorkloadScopeWizardCentralQueryData = {
    clusters: CentralWorkloadScopeCluster[];
    namespaces: {
        metadata: {
            id: string;
            name: string;
            labels: WorkloadScopeKeyValue[];
            annotations: WorkloadScopeKeyValue[];
        };
    }[];
    deployments: CentralWorkloadScopeDeployment[];
};

function pairsToKeyEqualsValue(pairs: WorkloadScopeKeyValue[] | null | undefined): string[] {
    if (!pairs?.length) {
        return [];
    }
    return pairs.map(({ key, value }) => `${key}=${value}`);
}

export function mapWorkloadScopeWizardCentralQuery(
    data: WorkloadScopeWizardCentralQueryData | undefined
): CentralWorkloadScopePayload | null {
    if (!data) {
        return null;
    }
    return {
        clusters: data.clusters ?? [],
        namespaces: (data.namespaces ?? []).map((n) => ({
            id: n.metadata.id,
            name: n.metadata.name,
            labels: n.metadata.labels ?? [],
            annotations: n.metadata.annotations ?? [],
        })),
        deployments: data.deployments ?? [],
    };
}

export function collectDeploymentLabelStrings(
    deployments: CentralWorkloadScopeDeployment[]
): string[] {
    const out: string[] = [];
    deployments.forEach((d) => {
        out.push(...pairsToKeyEqualsValue(d.labels));
    });
    return out;
}

export function collectDeploymentAnnotationStrings(
    deployments: CentralWorkloadScopeDeployment[]
): string[] {
    const out: string[] = [];
    deployments.forEach((d) => {
        out.push(...pairsToKeyEqualsValue(d.annotations));
    });
    return out;
}

export function collectNamespaceLabelStrings(
    namespaces: CentralWorkloadScopeNamespace[]
): string[] {
    const out: string[] = [];
    namespaces.forEach((n) => {
        out.push(...pairsToKeyEqualsValue(n.labels));
    });
    return out;
}

export function collectNamespaceAnnotationStrings(
    namespaces: CentralWorkloadScopeNamespace[]
): string[] {
    const out: string[] = [];
    namespaces.forEach((n) => {
        out.push(...pairsToKeyEqualsValue(n.annotations));
    });
    return out;
}

export function collectClusterLabelStrings(clusters: CentralWorkloadScopeCluster[]): string[] {
    const out: string[] = [];
    clusters.forEach((c) => {
        out.push(...pairsToKeyEqualsValue(c.labels));
    });
    return out;
}

function collectUniqueSorted(items: string[]): string[] {
    return [...new Set(items)].sort((a, b) => a.localeCompare(b));
}

function filterByQuery(items: string[], inputValue: string): string[] {
    const q = (inputValue || '').toLowerCase();
    return items.filter((i) => i.toLowerCase().includes(q));
}

/**
 * Autocomplete values for the v1 resource scope toolbar (Resources step) from Central GraphQL.
 * Returns null when there is no Central data so callers can fall back to mock data.
 */
export function getCentralScopeSuggestions(
    entityKey: string,
    attribute: string,
    inputValue: string,
    central: CentralWorkloadScopePayload | null | undefined
): string[] | null {
    if (!central) {
        return null;
    }
    const { clusters, namespaces, deployments } = central;
    const hasAny = clusters.length > 0 || namespaces.length > 0 || deployments.length > 0;
    if (!hasAny) {
        return null;
    }

    if (entityKey !== 'Cluster' && entityKey !== 'Namespace' && entityKey !== 'Deployment') {
        return null;
    }

    const filter = (items: string[]) => filterByQuery(items, inputValue);

    if (entityKey === 'Cluster') {
        if (attribute === 'Name') {
            return filter(clusters.map((c) => c.name));
        }
        if (attribute === 'ID') {
            return filter(clusters.map((c) => c.id));
        }
        if (attribute === 'Label') {
            return filter(collectUniqueSorted(collectClusterLabelStrings(clusters)));
        }
        if (attribute === 'Platform type') {
            const displayed = collectUniqueSorted(
                clusters.map((c) => {
                    try {
                        return displayClusterType(c.type as ClusterType);
                    } catch {
                        return String(c.type);
                    }
                })
            );
            return filter(displayed);
        }
        if (attribute === 'Type') {
            return filter(collectUniqueSorted(clusters.map((c) => String(c.type))));
        }
    }

    if (entityKey === 'Namespace') {
        if (attribute === 'Name') {
            return filter(collectUniqueSorted(namespaces.map((n) => n.name)));
        }
        if (attribute === 'ID') {
            return filter(namespaces.map((n) => n.id));
        }
        if (attribute === 'Label') {
            return filter(collectUniqueSorted(collectNamespaceLabelStrings(namespaces)));
        }
        if (attribute === 'Annotation') {
            return filter(collectUniqueSorted(collectNamespaceAnnotationStrings(namespaces)));
        }
    }

    if (entityKey === 'Deployment') {
        if (attribute === 'Name') {
            return filter(collectUniqueSorted(deployments.map((d) => d.name)));
        }
        if (attribute === 'ID') {
            return filter(deployments.map((d) => d.id));
        }
        if (attribute === 'Label') {
            return filter(collectUniqueSorted(collectDeploymentLabelStrings(deployments)));
        }
        if (attribute === 'Annotation') {
            return filter(collectUniqueSorted(collectDeploymentAnnotationStrings(deployments)));
        }
    }

    return [];
}
