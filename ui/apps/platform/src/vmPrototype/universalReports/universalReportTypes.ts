export const UNIVERSAL_REPORT_SOURCE_TYPES = [
    'vulnerability',
    'violation',
    'compliance',
    'network',
    'risk',
    'configuration',
] as const;

export type UniversalReportSourceType = (typeof UNIVERSAL_REPORT_SOURCE_TYPES)[number];

export type UniversalReportSourceMeta = {
    label: string;
    description: string;
    scopeSummary: string;
    parametersSummary: string;
    labelColor: 'blue' | 'purple' | 'orange' | 'cyan' | 'green' | 'grey';
};

export const UNIVERSAL_REPORT_SOURCE_META: Record<
    UniversalReportSourceType,
    UniversalReportSourceMeta
> = {
    vulnerability: {
        label: 'Vulnerability report',
        description:
            'CVE reports scoped to workload images, platform components, deployed and inactive images, nodes, and virtual machines. Select an area of concern below.',
        scopeSummary: 'Resource scope determined by the selected area of concern.',
        parametersSummary: 'Severity, fixability, image type, CVE state',
        labelColor: 'blue',
    },
    violation: {
        label: 'Violation report',
        description: 'Policy violations across workloads, platform, and nodes. Select an area of concern below.',
        scopeSummary: 'Cluster, deployment, namespace, node, and resource compound filters',
        parametersSummary: 'Policy category, severity, lifecycle, and violation time filters',
        labelColor: 'purple',
    },
    compliance: {
        label: 'Compliance report',
        description: 'OpenShift and Kubernetes compliance controls by standard and cluster scope.',
        scopeSummary: 'Clusters and compliance profiles (scan schedule wizard)',
        parametersSummary: 'Schedule, scan name, and email delivery (scan schedule wizard)',
        labelColor: 'green',
    },
    network: {
        label: 'Network report',
        description:
            'Network connectivity, exposure, and policy violations across deployments. Select an area of concern below.',
        scopeSummary: 'Cluster, namespace, and deployment scope filters',
        parametersSummary: 'Exposure type, port, protocol, and policy violation filters',
        labelColor: 'cyan',
    },
    risk: {
        label: 'Risk report',
        description:
            'Deployment risk scores and risk factors across your environment.',
        scopeSummary: 'Cluster, namespace, and deployment scope filters',
        parametersSummary: 'Risk category and score threshold filters',
        labelColor: 'orange',
    },
    configuration: {
        label: 'Configuration report',
        description:
            'Resource configuration posture — secrets exposure, RBAC, service accounts, and image settings.',
        scopeSummary: 'Cluster and namespace scope filters',
        parametersSummary: 'Resource type, secret, role, and service account filters',
        labelColor: 'grey',
    },
};

export const UNIVERSAL_REPORT_TYPE_OPTIONS = UNIVERSAL_REPORT_SOURCE_TYPES.map((value) => ({
    value,
    label: UNIVERSAL_REPORT_SOURCE_META[value].label,
    description: UNIVERSAL_REPORT_SOURCE_META[value].description,
}));

export function isUniversalReportSourceType(value: string): value is UniversalReportSourceType {
    return (UNIVERSAL_REPORT_SOURCE_TYPES as readonly string[]).includes(value);
}

/** Secondary sub-type selection when the top-level report type is 'network'. */
export const NETWORK_WORKFLOW_VIEWS = ['network-graph', 'listening-endpoints'] as const;

export type NetworkWorkflowView = (typeof NETWORK_WORKFLOW_VIEWS)[number];

export const NETWORK_WORKFLOW_VIEW_META: Record<
    NetworkWorkflowView,
    { label: string; description: string }
> = {
    'network-graph': {
        label: 'Network graph',
        description:
            'Unexpected connections, policy violations, and external exposure across deployment network flows.',
    },
    'listening-endpoints': {
        label: 'Listening endpoints',
        description:
            'Exposed ports and services across deployments — including unexpected or unprotected listeners.',
    },
};

/** Secondary sub-type selection when the top-level report type is 'vulnerability'. */
export const VULN_WORKFLOW_VIEWS = [
    'user-workloads',
    'platform',
    'all-images',
    'inactive-images',
    'node-cves',
    'virtual-machines',
] as const;

export type VulnWorkflowView = (typeof VULN_WORKFLOW_VIEWS)[number];

export const VULN_WORKFLOW_VIEW_META: Record<
    VulnWorkflowView,
    { label: string; description: string }
> = {
    'user-workloads': {
        label: 'User workloads',
        description: 'CVEs in deployed and watched workload images (deployments, namespaces, clusters).',
    },
    platform: {
        label: 'Platform',
        description: 'CVEs in cluster infrastructure and platform components.',
    },
    'all-images': {
        label: 'All vulnerability images',
        description: 'CVEs across all deployed, watched, and inactive images regardless of workload context.',
    },
    'inactive-images': {
        label: 'Inactive images',
        description: 'CVEs in images no longer actively deployed but still present in the registry or image cache.',
    },
    'node-cves': {
        label: 'Nodes',
        description: 'OS and runtime CVEs across nodes in selected clusters.',
    },
    'virtual-machines': {
        label: 'Virtual machines',
        description: 'CVEs in KubeVirt virtual machine images by cluster and namespace.',
    },
};
