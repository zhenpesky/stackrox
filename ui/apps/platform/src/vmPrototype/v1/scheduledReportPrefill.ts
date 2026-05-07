import type { FormikProps } from 'formik';

import { severityLabelToSeverity } from 'Containers/Vulnerabilities/utils/searchUtils';
import { isVulnerabilitySeverityLabel } from 'Containers/Vulnerabilities/types';
import type {
    CVEStatus,
    ReportFormValues,
} from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import type { SearchFilter } from 'types/search';
import type { VulnerabilitySeverity } from 'types/cve.proto';
import { searchValueAsArray } from 'utils/searchUtils';

export const VM_PROTOTYPE_SCHEDULED_REPORT_PREFILL_KEY = 'vmPrototypeScheduledReportPrefill';

export type VmPrototypeScheduledReportPrefill = {
    workloadScopedQueryString: string;
    searchFilterForForm: SearchFilter;
    savedFilterName: string | null;
    filtersModified: boolean;
};

export function mapSearchFilterToReportCveSeverities(sf: SearchFilter): VulnerabilitySeverity[] {
    const labels = searchValueAsArray(sf.SEVERITY).filter(isVulnerabilitySeverityLabel);
    return labels.map(severityLabelToSeverity);
}

export function mapSearchFilterToReportCveStatus(sf: SearchFilter): CVEStatus[] {
    const fix = searchValueAsArray(sf.FIXABLE);
    const out: CVEStatus[] = [];
    if (fix.some((x) => x === 'Fixable')) {
        out.push('FIXABLE');
    }
    if (fix.some((x) => x === 'Not fixable')) {
        out.push('NOT_FIXABLE');
    }
    return out;
}

/**
 * One-shot apply of workload URL filters into the create-report wizard (v1 prototype).
 */
export function applyVmPrototypeScheduledReportPrefill(
    formik: FormikProps<ReportFormValues>,
    prefill: VmPrototypeScheduledReportPrefill
): void {
    const severities = mapSearchFilterToReportCveSeverities(prefill.searchFilterForForm);
    const status = mapSearchFilterToReportCveStatus(prefill.searchFilterForForm);
    if (severities.length > 0) {
        formik.setFieldValue('reportParameters.cveSeverities', severities);
    }
    if (status.length > 0) {
        formik.setFieldValue('reportParameters.cveStatus', status);
    }
    const lines = [
        'Carried from User Workload CVEs (vmPrototype v1).',
        prefill.filtersModified
            ? 'Filters were changed after applying a saved filter; saved filter name was not carried as canonical scope.'
            : prefill.savedFilterName
              ? `Saved filter context: ${prefill.savedFilterName}.`
              : null,
        `Workload-scoped query: ${prefill.workloadScopedQueryString}`,
    ].filter(Boolean);
    const prev = formik.values.reportParameters.reportDescription?.trim();
    formik.setFieldValue(
        'reportParameters.reportDescription',
        prev ? `${prev}\n\n${lines.join('\n')}` : lines.join('\n')
    );
}
