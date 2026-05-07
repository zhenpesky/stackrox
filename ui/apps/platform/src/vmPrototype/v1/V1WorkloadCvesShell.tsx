import type { ReactElement } from 'react';

import WorkloadCvesPage from 'Containers/Vulnerabilities/WorkloadCves/WorkloadCvesPage';
import type { WorkloadCvesPageProps } from 'Containers/Vulnerabilities/WorkloadCves/WorkloadCvesPage';

import { V1UserWorkloadPrototypeProvider } from './V1UserWorkloadPrototypeContext';

/**
 * v1: enables localhost:5173-style saved filters (mock) in the real workload CVEs overview toolbar.
 * Tables and Central APIs remain product {@link WorkloadCvesPage}.
 */
export default function V1WorkloadCvesShell(props: WorkloadCvesPageProps): ReactElement {
    const { view } = props;
    return (
        <V1UserWorkloadPrototypeProvider>
            <WorkloadCvesPage view={view} />
        </V1UserWorkloadPrototypeProvider>
    );
}
