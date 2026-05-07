import type { ReactElement } from 'react';

import VulnReportingPage from 'Containers/Vulnerabilities/VulnerablityReporting/VulnReportingPage';

/**
 * v1: same {@link VulnReportingPage} as stock. Create-report intro copy is under the H1 in
 * `ModifyVulnReport/CreateVulnReportPage.tsx` (vmPrototype v1 branch).
 */
export default function V1VulnReportingShell(): ReactElement {
    return <VulnReportingPage />;
}
