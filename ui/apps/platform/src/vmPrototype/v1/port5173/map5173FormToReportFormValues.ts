import type { DayOfWeek } from 'Components/PatternFly/DayPickerDropdown';
import type { NotifierConfiguration } from 'services/ReportsService.types';
import type { ReportFormValues } from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import type { VulnerabilitySeverity } from 'types/cve.proto';

export type CollectionSlim = { id: string; name: string; description?: string };

const severity5173ToApi: Record<string, VulnerabilitySeverity> = {
    critical: 'CRITICAL_VULNERABILITY_SEVERITY',
    important: 'IMPORTANT_VULNERABILITY_SEVERITY',
    moderate: 'MODERATE_VULNERABILITY_SEVERITY',
    low: 'LOW_VULNERABILITY_SEVERITY',
    unknown: 'UNKNOWN_VULNERABILITY_SEVERITY',
};

const dayNameToIndex: Record<string, DayOfWeek> = {
    sunday: '0',
    monday: '1',
    tuesday: '2',
    wednesday: '3',
    thursday: '4',
    friday: '5',
    saturday: '6',
};

export type Wizard5173FormValues = {
    name: string;
    description: string;
    scopeMethod: string;
    selectedCollection: string | null;
    selectedImageTypes: string[];
    selectedSeverities: string[];
    selectedCveStatus: string[];
    cveDiscoveredSince: string;
    /** ISO yyyy-mm-dd when {@link cveDiscoveredSince} is `custom`. */
    cveDiscoveredCustomDate?: string;
    scheduleType: string;
    scheduleDay: string;
    selectedNotifiers: string[];
};

export type Map5173Result = { ok: true; values: ReportFormValues } | { ok: false; error: string };

/**
 * Maps localhost:5173 CreateReportWizard state into platform {@link ReportFormValues} for Central APIs.
 * Custom resource scope chips are not persisted on the API yet; the first available collection is used as
 * {@link ReportFormValues.reportParameters.reportScope} so saves can succeed against Central.
 */
export function map5173FormToReportFormValues(
    fv: Wizard5173FormValues,
    collections: CollectionSlim[],
    notifier: { id: string; name: string } | null
): Map5173Result {
    let scope: CollectionSlim | undefined;
    if (fv.scopeMethod === 'collection' && fv.selectedCollection) {
        scope = collections.find((c) => c.id === fv.selectedCollection);
    } else if (collections.length > 0) {
        scope = collections[0];
    }
    if (!scope) {
        return {
            ok: false,
            error:
                collections.length === 0
                    ? 'No collections are available. Configure collections in Central before saving.'
                    : 'Unable to resolve report scope.',
        };
    }

    const cveSeverities = fv.selectedSeverities.map((s) => severity5173ToApi[s]).filter(Boolean);
    if (cveSeverities.length === 0) {
        return { ok: false, error: 'Select at least one severity.' };
    }

    const cveStatus: ('FIXABLE' | 'NOT_FIXABLE')[] = [];
    if (fv.selectedCveStatus.includes('fixable')) {
        cveStatus.push('FIXABLE');
    }
    if (fv.selectedCveStatus.includes('not-fixable')) {
        cveStatus.push('NOT_FIXABLE');
    }
    if (cveStatus.length === 0) {
        return { ok: false, error: 'Select at least one fixability status.' };
    }

    const imageType: ('DEPLOYED' | 'WATCHED')[] = [];
    if (fv.selectedImageTypes.includes('deployed')) {
        imageType.push('DEPLOYED');
    }
    if (fv.selectedImageTypes.includes('watched')) {
        imageType.push('WATCHED');
    }
    if (imageType.length === 0) {
        return { ok: false, error: 'Select at least one image type.' };
    }

    let cvesDiscoveredSince: ReportFormValues['reportParameters']['cvesDiscoveredSince'] =
        'ALL_VULN';
    let cvesDiscoveredStartDate: ReportFormValues['reportParameters']['cvesDiscoveredStartDate'];
    if (fv.cveDiscoveredSince === 'last-scheduled') {
        cvesDiscoveredSince = 'SINCE_LAST_REPORT';
    } else if (fv.cveDiscoveredSince === 'custom') {
        cvesDiscoveredSince = 'START_DATE';
        const raw = (fv.cveDiscoveredCustomDate || '').trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            return { ok: false, error: 'Enter a valid custom start date (YYYY-MM-DD).' };
        }
        cvesDiscoveredStartDate = raw;
    }

    const deliveryDestinations: NotifierConfiguration[] = [];
    if (notifier) {
        const includeNotifier =
            fv.selectedNotifiers.length === 0 || fv.selectedNotifiers.includes(notifier.id);
        if (includeNotifier) {
            deliveryDestinations.push({
                notifierName: notifier.name,
                emailConfig: {
                    notifierId: notifier.id,
                    mailingLists: ['team@example.com'],
                    customSubject: '',
                    customBody: '',
                },
            });
        }
    }

    let intervalType: ReportFormValues['schedule']['intervalType'] = null;
    let daysOfWeek: DayOfWeek[] = [];
    let daysOfMonth: ('1' | '15')[] = [];
    if (fv.scheduleType === 'weekly' || fv.scheduleType === 'daily') {
        // Central report API supports WEEKLY / MONTHLY only — treat “daily” as weekly on Monday for now.
        intervalType = 'WEEKLY';
        const d = dayNameToIndex[(fv.scheduleDay || 'monday').toLowerCase()];
        daysOfWeek = d ? [d] : ['1'];
    } else if (fv.scheduleType === 'monthly') {
        intervalType = 'MONTHLY';
        daysOfMonth = ['1'];
    }

    const values: ReportFormValues = {
        reportId: '',
        reportParameters: {
            reportName: fv.name.trim(),
            reportDescription: fv.description || '',
            cveSeverities,
            cveStatus,
            imageType,
            cvesDiscoveredSince,
            cvesDiscoveredStartDate,
            includeAdvisory: false,
            includeEpssProbability: false,
            includeNvdCvss: false,
            reportScope: { id: scope.id, name: scope.name },
        },
        deliveryDestinations,
        schedule: {
            intervalType,
            daysOfWeek,
            daysOfMonth,
        },
    };

    if (cvesDiscoveredSince === 'SINCE_LAST_REPORT' && deliveryDestinations.length === 0) {
        return {
            ok: false,
            error: 'When “CVE discovered since” is set to the last scheduled report, add at least one email notifier.',
        };
    }

    return { ok: true, values };
}
