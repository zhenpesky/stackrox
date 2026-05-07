/** Shared with {@link V1CreateReportWizard5173} and step-5 review layout. */
export const SAVED_FILTER_OPTIONS = [
    {
        id: 'sf-1',
        name: 'Front End only',
        filters: {
            clusterName: ['staging-secured-cluster'],
            namespaceName: ['frontend'],
            deploymentName: ['api-gateway', 'redis-server', 'postgres-db'],
        },
    },
    {
        id: 'sf-2',
        name: 'Critical CVEs in production',
        filters: {
            clusterName: ['prod-cluster-east'],
            namespaceName: [],
            deploymentName: [],
        },
    },
    {
        id: 'sf-3',
        name: 'Fixable CVEs - all clusters',
        filters: {
            clusterName: ['staging-secured-cluster', 'prod-cluster-east'],
            namespaceName: [],
            deploymentName: [],
        },
    },
    { id: 'sf-4', name: 'Backend namespace vulnerabilities' },
];

export const IMAGE_TYPE_OPTIONS = [
    { value: 'deployed', label: 'Deployed images' },
    { value: 'watched', label: 'Watched images' },
];

export const AREA_OPTIONS = [
    { value: 'user-workloads', label: 'User workloads' },
    { value: 'platform', label: 'Platform' },
    { value: 'all-images', label: 'All vulnerable images' },
];

export const VULN_STATE_OPTIONS = [
    { value: 'observed', label: 'Observed' },
    { value: 'deferred', label: 'Deferred' },
    { value: 'false-positives', label: 'False positives' },
];

export const CVE_DISCOVERED_OPTIONS = [
    {
        value: 'last-scheduled',
        label: 'Last scheduled report that was successfully sent',
        description:
            'At least one delivery destination and schedule will be required in the next step.',
    },
    {
        value: 'custom',
        label: 'Custom start date',
        description:
            'Custom start date for the discovered CVE that were run on-demand or downloaded',
    },
    {
        value: 'all',
        label: 'All time',
        description: 'Show all detected CVEs from the beginning of cluster setup',
    },
];

export const SEVERITY_OPTIONS = [
    { value: 'critical', label: 'Critical', color: 'red' },
    { value: 'important', label: 'Important', color: 'orange' },
    { value: 'moderate', label: 'Moderate', color: 'gold' },
    { value: 'low', label: 'Low', color: 'blue' },
    { value: 'unknown', label: 'Unknown', color: 'grey' },
];

export const CVE_STATUS_OPTIONS = [
    { value: 'fixable', label: 'Fixable' },
    { value: 'not-fixable', label: 'Not fixable' },
];
