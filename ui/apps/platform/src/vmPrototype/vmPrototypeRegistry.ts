import type { ComponentType } from 'react';

import type { WorkloadCvesPageProps } from 'Containers/Vulnerabilities/WorkloadCves/WorkloadCvesPage';

import V1VulnReportingShell from './v1/V1VulnReportingShell';
import V1WorkloadCvesShell from './v1/V1WorkloadCvesShell';
import type { VmPrototypeVersion } from './vmPrototypeVersion';

/**
 * Optional replacement for workload-CVEs "results" tree (all VM list views sharing WorkloadCvesPage).
 * Return null to use the stock WorkloadCvesPage (full v4 parity).
 */
export function getWorkloadCvesPageOverride(
    version: VmPrototypeVersion
): ComponentType<WorkloadCvesPageProps> | null {
    switch (version) {
        case 'v1':
            return V1WorkloadCvesShell;
        default:
            return null;
    }
}

/**
 * Optional replacement for /vulnerabilities/reports (wizard + tabs).
 * Return null to use the stock VulnReportingPage.
 */
export function getVulnReportingPageOverride(version: VmPrototypeVersion): ComponentType | null {
    switch (version) {
        case 'v1':
            return V1VulnReportingShell;
        default:
            return null;
    }
}
