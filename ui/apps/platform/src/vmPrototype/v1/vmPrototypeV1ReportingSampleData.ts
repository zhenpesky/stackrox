import type {
    ConfiguredReportSnapshot,
    ReportConfiguration,
    ViewBasedReportSnapshot,
} from 'services/ReportsService.types';

const sampleVulnFiltersAll: ReportConfiguration['vulnReportFilters'] = {
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
};

const sampleNotifier = {
    notifierName: 'Security email',
    emailConfig: {
        notifierId: 'sample-notifier-1',
        mailingLists: ['security@example.com'],
        customSubject: '',
        customBody: '',
    },
};

const sampleScope = (collectionId: string, collectionName: string) => ({
    collectionScope: { collectionId, collectionName },
});

/** Static report configurations for UI when `/v2/reports/configurations` is unavailable. */
export const VM_PROTOTYPE_V1_SAMPLE_REPORT_CONFIGURATIONS: ReportConfiguration[] = [
    {
        id: 'vm-prototype-sample-report-1',
        name: 'Weekly production CVE digest',
        description: 'Critical and important CVEs across production collections, emailed weekly.',
        type: 'VULNERABILITY',
        vulnReportFilters: sampleVulnFiltersAll,
        notifiers: [sampleNotifier],
        schedule: null,
        resourceScope: sampleScope('col-sample-1', 'All production workloads'),
    },
    {
        id: 'vm-prototype-sample-report-2',
        name: 'Staging image compliance',
        description: 'Watched and deployed images in staging clusters; download on demand.',
        type: 'VULNERABILITY',
        vulnReportFilters: sampleVulnFiltersAll,
        notifiers: [],
        schedule: null,
        resourceScope: sampleScope('col-sample-2', 'Staging and dev workloads'),
    },
    {
        id: 'vm-prototype-sample-report-3',
        name: 'Executive vulnerability summary',
        description: 'High-level counts and top risks for leadership review.',
        type: 'VULNERABILITY',
        vulnReportFilters: sampleVulnFiltersAll,
        notifiers: [sampleNotifier],
        schedule: null,
        resourceScope: sampleScope('col-sample-3', 'Frontend services'),
    },
];

function sampleConfiguredSnapshot(
    reportId: string,
    name: string,
    runState: ConfiguredReportSnapshot['reportStatus']['runState']
): ConfiguredReportSnapshot {
    const cfg = VM_PROTOTYPE_V1_SAMPLE_REPORT_CONFIGURATIONS.find((r) => r.id === reportId)!;
    return {
        reportJobId: `${reportId}-last-job`,
        name,
        reportConfigId: reportId,
        reportStatus: {
            runState,
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            errorMsg: '',
            reportRequestType: 'SCHEDULED',
            reportNotificationMethod: 'EMAIL',
        },
        user: { id: 'sample-user', name: 'Sample user' },
        isDownloadAvailable: runState === 'GENERATED',
        vulnReportFilters: cfg.vulnReportFilters,
        collectionSnapshot: {
            id: cfg.resourceScope.collectionScope.collectionId,
            name: cfg.resourceScope.collectionScope.collectionName,
        },
        schedule: cfg.schedule,
        notifiers: cfg.notifiers,
    };
}

/** Last-job snapshots keyed by {@link ReportConfiguration.id} for the sample configurations. */
export const VM_PROTOTYPE_V1_SAMPLE_CONFIGURED_SNAPSHOTS: Record<
    string,
    ConfiguredReportSnapshot | null
> = {
    'vm-prototype-sample-report-1': sampleConfiguredSnapshot(
        'vm-prototype-sample-report-1',
        'Weekly production CVE digest',
        'GENERATED'
    ),
    'vm-prototype-sample-report-2': sampleConfiguredSnapshot(
        'vm-prototype-sample-report-2',
        'Staging image compliance',
        'WAITING'
    ),
    'vm-prototype-sample-report-3': sampleConfiguredSnapshot(
        'vm-prototype-sample-report-3',
        'Executive vulnerability summary',
        'PREPARING'
    ),
};

/** Static view-based report jobs when `/v2/reports/view-based/history` is unavailable. */
export const VM_PROTOTYPE_V1_SAMPLE_VIEW_BASED_SNAPSHOTS: ViewBasedReportSnapshot[] = [
    {
        reportJobId: 'vm-prototype-vbr-1',
        name: 'Workload CVE export — April snapshot',
        reportStatus: {
            runState: 'GENERATED',
            completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            errorMsg: '',
            reportRequestType: 'ON_DEMAND',
            reportNotificationMethod: 'DOWNLOAD',
        },
        user: { id: 'sample-user', name: 'Sample user' },
        isDownloadAvailable: true,
        viewBasedVulnReportFilters: { query: 'CVE Severity:CRITICAL_VULNERABILITY_SEVERITY' },
        areaOfConcern: 'User workloads',
    },
    {
        reportJobId: 'vm-prototype-vbr-2',
        name: 'Namespace app-frontend CSV',
        reportStatus: {
            runState: 'PREPARING',
            completedAt: new Date().toISOString(),
            errorMsg: '',
            reportRequestType: 'ON_DEMAND',
            reportNotificationMethod: 'DOWNLOAD',
        },
        user: { id: 'sample-user', name: 'Sample user' },
        isDownloadAvailable: false,
        viewBasedVulnReportFilters: { query: 'Namespace:app-frontend' },
        areaOfConcern: 'Platform',
    },
];
