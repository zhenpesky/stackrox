/**
 * MSW request handlers for the static prototype build.
 * Used when VITE_MOCK_MODE=true (GitHub Pages deployment).
 * All API calls are intercepted so the app runs without a Central backend.
 */
import { http, graphql, HttpResponse } from 'msw';

// ---------------------------------------------------------------------------
// Startup / auth fixtures
// ---------------------------------------------------------------------------

const MOCK_AUTH_STATUS = {
    userId: 'mock-user-1',
    expires: '2099-01-01T00:00:00Z',
    refreshUrl: '',
    authProvider: {
        id: 'mock-provider',
        name: 'Mock Auth',
        type: 'basic',
        uiEndpoint: '',
        enabled: true,
        config: {},
        loginUrl: '',
        validated: true,
        extraUiEndpoints: [],
        active: true,
        requiredAttributes: [],
        traits: null,
        lastUpdated: null,
    },
    userInfo: {
        username: 'prototype-demo',
        friendlyName: 'Prototype Demo',
        permissions: {
            resourceToAccess: {
                Alert: 'READ_ACCESS',
                CVE: 'READ_ACCESS',
                Cluster: 'READ_ACCESS',
                Deployment: 'READ_ACCESS',
                Detection: 'READ_ACCESS',
                Image: 'READ_ACCESS',
                Integration: 'READ_ACCESS',
                K8sRole: 'READ_ACCESS',
                K8sRoleBinding: 'READ_ACCESS',
                K8sSubject: 'READ_ACCESS',
                Namespace: 'READ_ACCESS',
                NetworkGraph: 'READ_ACCESS',
                NetworkPolicy: 'READ_ACCESS',
                Node: 'READ_ACCESS',
                Policy: 'READ_ACCESS',
                Role: 'READ_ACCESS',
                Secret: 'READ_ACCESS',
                ServiceAccount: 'READ_ACCESS',
                VulnerabilityManagementApprovals: 'READ_WRITE_ACCESS',
                VulnerabilityManagementRequests: 'READ_WRITE_ACCESS',
                VulnerabilityReports: 'READ_WRITE_ACCESS',
                WorkflowAdministration: 'READ_ACCESS',
                Administration: 'READ_ACCESS',
                Access: 'READ_ACCESS',
                Compliance: 'READ_ACCESS',
                DeploymentExtension: 'READ_ACCESS',
                InstallationInfo: 'READ_ACCESS',
            },
        },
        roles: [
            {
                name: 'Admin',
                globalAccess: 'READ_ACCESS',
                resourceToAccess: {},
            },
        ],
    },
    userAttributes: [],
};

// ---------------------------------------------------------------------------
// Mock CVE fixtures
// ---------------------------------------------------------------------------

function makeCVE(id: string, critical: number, important: number) {
    return {
        cve: id,
        affectedImageCountBySeverity: {
            critical: { total: critical },
            important: { total: important },
            moderate: { total: 1 },
            low: { total: 0 },
            unknown: { total: 0 },
        },
        topCVSS: 9.8,
        affectedImageCount: critical + important + 2,
        firstDiscoveredInSystem: '2024-01-15T00:00:00Z',
        publishedOn: '2024-01-10T00:00:00Z',
        topNvdCVSS: 9.8,
        distroTuples: [
            {
                summary: `Remote code execution via ${id}`,
                operatingSystem: 'ubuntu:22.04',
                cvss: 9.8,
                scoreVersion: 'V3',
                nvdCvss: 9.8,
                nvdScoreVersion: 'V3',
                cveBaseInfo: { epss: { epssProbability: 0.91 } },
            },
        ],
        pendingExceptionCount: 0,
    };
}

const MOCK_CVES = [
    makeCVE('CVE-2024-0001', 3, 5),
    makeCVE('CVE-2024-0002', 1, 8),
    makeCVE('CVE-2024-0003', 5, 2),
    makeCVE('CVE-2024-0004', 2, 4),
    makeCVE('CVE-2024-0005', 0, 6),
    makeCVE('CVE-2024-0006', 4, 3),
    makeCVE('CVE-2024-0007', 1, 7),
    makeCVE('CVE-2024-0008', 6, 1),
];

// ---------------------------------------------------------------------------
// Mock report fixtures — reuse shapes from vmPrototypeV1ReportingSampleData
// ---------------------------------------------------------------------------

const MOCK_REPORTS = [
    {
        id: 'vm-prototype-sample-report-1',
        name: 'Weekly production CVE digest',
        description: 'Critical and important CVEs across production collections, emailed weekly.',
        type: 'VULNERABILITY',
        vulnReportFilters: {
            allVuln: true,
            fixability: 'BOTH',
            severities: [
                'CRITICAL_VULNERABILITY_SEVERITY',
                'IMPORTANT_VULNERABILITY_SEVERITY',
                'MODERATE_VULNERABILITY_SEVERITY',
            ],
            imageTypes: ['DEPLOYED', 'WATCHED'],
            includeAdvisory: false,
            includeEpssProbability: false,
            includeNvdCvss: false,
        },
        notifiers: [
            {
                notifierName: 'Security email',
                emailConfig: {
                    notifierId: 'sample-notifier-1',
                    mailingLists: ['security@example.com'],
                    customSubject: '',
                    customBody: '',
                },
            },
        ],
        schedule: null,
        resourceScope: { collectionScope: { collectionId: 'col-1', collectionName: 'All production workloads' } },
    },
    {
        id: 'vm-prototype-sample-report-2',
        name: 'Staging image compliance',
        description: 'Watched and deployed images in staging clusters; download on demand.',
        type: 'VULNERABILITY',
        vulnReportFilters: {
            allVuln: true,
            fixability: 'BOTH',
            severities: ['CRITICAL_VULNERABILITY_SEVERITY'],
            imageTypes: ['DEPLOYED'],
            includeAdvisory: false,
            includeEpssProbability: false,
            includeNvdCvss: false,
        },
        notifiers: [],
        schedule: null,
        resourceScope: { collectionScope: { collectionId: 'col-2', collectionName: 'Staging and dev workloads' } },
    },
];

// ---------------------------------------------------------------------------
// GraphQL handler — intercept by operation name
// ---------------------------------------------------------------------------

const graphqlHandler = graphql.link('/api/graphql').operation(async ({ query, variables, operationName }) => {
    switch (operationName) {
        case 'getImageCVEList':
            return HttpResponse.json({ data: { imageCVEs: MOCK_CVES } });

        case 'getUnfilteredImageCount':
            return HttpResponse.json({ data: { imageCount: 42 } });

        case 'getWorkloadCveSummaryData':
        case 'getWorkloadCvesSummaryData':
            return HttpResponse.json({
                data: {
                    imageCVECount: 8,
                    imageCVEs: [],
                    imageCount: 42,
                },
            });

        case 'getImageList':
        case 'getDeploymentList':
        case 'getNodeList':
        case 'getClusterList':
        case 'getNamespaceList':
            return HttpResponse.json({ data: { result: [] } });

        default:
            // Return an empty data object for any unrecognized operation
            return HttpResponse.json({ data: {} });
    }
});

// ---------------------------------------------------------------------------
// REST handlers
// ---------------------------------------------------------------------------

export const handlers = [
    // Auth
    http.get('/v1/auth/status', () => HttpResponse.json(MOCK_AUTH_STATUS)),
    http.get('/v1/authProviders', () => HttpResponse.json({ authProviders: [] })),
    http.get('/v1/groups', () => HttpResponse.json({ groups: [] })),
    http.get('/v1/roles', () => HttpResponse.json({ roles: [] })),

    // Feature flags & metadata
    http.get('/v1/featureflags', () => HttpResponse.json({ featureFlags: [] })),
    http.get('/v1/metadata', () =>
        HttpResponse.json({
            version: '4.5.0-prototype',
            buildFlavor: 'release',
            releaseBuild: true,
            licenseStatus: 'VALID',
        })
    ),
    http.get('/v1/central-capabilities', () =>
        HttpResponse.json({
            centralCanDisplayDeclarativeConfigHealth: 'YES',
            centralCanUpdateCert: 'YES',
            centralCanUseCloudBackupIntegrations: 'YES',
            centralCanDisplayAdministrationEvents: 'YES',
        })
    ),

    // Public config
    http.get('/v1/config/public', () =>
        HttpResponse.json({
            publicConfig: {
                header: null,
                footer: null,
                loginNotice: null,
                telemetry: { enabled: false, userId: '' },
            },
        })
    ),

    // Telemetry
    http.get('/v1/telemetry/configure', () =>
        HttpResponse.json({ enabled: false, userId: 'mock-user-1', properties: {} })
    ),

    // Clusters
    http.get('/v1/clusters', () => HttpResponse.json({ clusters: [] })),
    http.get('/v1/cluster-defaults', () => HttpResponse.json({})),

    // Namespaces / deployments
    http.get('/v1/namespaces', () => HttpResponse.json({ namespaces: [] })),
    http.get('/v1/deployments', () => HttpResponse.json({ deployments: [] })),
    http.get('/v1/images', () => HttpResponse.json({ images: [] })),
    http.get('/v1/nodes', () => HttpResponse.json({ nodes: [] })),
    http.get('/v1/pods', () => HttpResponse.json({ pods: [] })),
    http.get('/v1/policies', () => HttpResponse.json({ policies: [] })),

    // Collections
    http.get('/v1/collections', () => HttpResponse.json({ collections: [] })),
    http.get('/v2/collections', () => HttpResponse.json({ collections: [] })),

    // Vulnerability reports (REST)
    http.get('/v2/reports/configuration-count', () => HttpResponse.json({ count: 2 })),
    http.get('/v2/reports/configurations', () =>
        HttpResponse.json({ reportConfigs: MOCK_REPORTS, totalCount: 2 })
    ),
    http.get('/v2/reports/configurations/:id', ({ params }) => {
        const report = MOCK_REPORTS.find((r) => r.id === params.id) ?? MOCK_REPORTS[0];
        return HttpResponse.json({ reportConfig: report });
    }),
    http.get('/v2/reports/jobs', () =>
        HttpResponse.json({ reportJobs: [], totalCount: 0 })
    ),
    http.get('/v2/reports/view-based/history', () =>
        HttpResponse.json({ reportJobs: [], totalCount: 0 })
    ),
    http.get('/v2/reports/view-based/my-history', () =>
        HttpResponse.json({ reportJobs: [], totalCount: 0 })
    ),

    // Notifiers / integrations
    http.get('/v1/notifiers', () => HttpResponse.json({ notifiers: [] })),
    http.get('/v1/integrations', () => HttpResponse.json({ integrations: {} })),

    // Exception / approval management
    http.get('/v1/cve/requests', () => HttpResponse.json({ approvalRequests: [] })),

    // Catch-all for /v1/* and /v2/* (prevents 404 noise)
    http.get('/v1/:rest*', () => HttpResponse.json({})),
    http.post('/v1/:rest*', () => HttpResponse.json({})),
    http.get('/v2/:rest*', () => HttpResponse.json({})),
    http.post('/v2/:rest*', () => HttpResponse.json({})),

    // GraphQL
    graphqlHandler,
];
