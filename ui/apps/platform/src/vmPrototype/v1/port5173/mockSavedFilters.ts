/**
 * Saved filters seed data — copied from `local-ui-prototype-vite/src/mockData.js` (SAVED_FILTERS)
 * used by localhost:5173 `/v1/main/vulnerabilities/user-workloads` (UserWorkloadVulnerabilities.jsx).
 */
export type SavedFilter5173 = {
    id: string;
    name: string;
    description: string;
    filters: Record<string, unknown>;
    createdBy?: string;
    createdAt?: string;
    /** When true, hide from the Saved filters dropdown (manage modal), matching 5173 behavior. */
    hidden?: boolean;
};

export const INITIAL_SAVED_FILTERS_5173: SavedFilter5173[] = [
    {
        id: 'filter-001',
        name: 'Staging cluster only',
        description: 'Filter for staging cluster deployments',
        filters: {
            clusterName: ['staging-secured-cluster'],
            namespaceName: [],
            deploymentName: [],
            severity: [],
            cveStatus: [],
        },
        createdBy: 'admin@example.com',
        createdAt: '2023-06-15T10:00:00Z',
    },
    {
        id: 'filter-002',
        name: 'Critical fixable',
        description: 'Critical fixable vulnerabilities',
        filters: {
            clusterName: [],
            namespaceName: [],
            deploymentName: [],
            severity: ['Critical'],
            cveStatus: ['Fixable'],
        },
        createdBy: 'admin@example.com',
        createdAt: '2023-07-20T14:30:00Z',
    },
    {
        id: 'filter-003',
        name: 'Production critical',
        description: 'Critical vulnerabilities in production clusters',
        filters: {
            clusterName: ['prod-cluster-east'],
            namespaceName: [],
            deploymentName: [],
            severity: ['Critical'],
            cveStatus: [],
        },
        createdBy: 'secops@example.com',
        createdAt: '2023-09-01T11:00:00Z',
    },
    {
        id: 'filter-004',
        name: 'Cache namespace',
        description: 'Cache namespace deployments',
        filters: {
            clusterName: [],
            namespaceName: ['cache'],
            deploymentName: [],
            severity: [],
            cveStatus: [],
        },
        createdBy: 'admin@example.com',
        createdAt: '2023-09-15T16:45:00Z',
    },
    {
        id: 'filter-005',
        name: 'Database deployments',
        description: 'Database tier deployments',
        filters: {
            clusterName: [],
            namespaceName: ['database'],
            deploymentName: ['postgres-db'],
            severity: [],
            cveStatus: [],
        },
        createdBy: 'secops@example.com',
        createdAt: '2023-08-10T09:15:00Z',
    },
];
