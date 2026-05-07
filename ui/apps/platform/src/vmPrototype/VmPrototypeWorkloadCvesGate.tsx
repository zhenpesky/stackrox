import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';

import asyncComponent from 'Containers/MainPage/asyncComponent';

import { getWorkloadCvesPageOverride } from './vmPrototypeRegistry';
import { getVmPrototypeParamForResolver } from './vmPrototypeSession';
import { resolveVmPrototypeVersion } from './vmPrototypeVersion';

const AsyncWorkloadCvesPage = asyncComponent(
    () => import('Containers/Vulnerabilities/WorkloadCves/WorkloadCvesPage')
);

export type VmPrototypeWorkloadCvesGateProps = {
    view: string;
};

/**
 * Single choke point for all workload-CVEs views. Reuses stock page unless registry supplies an override.
 */
export default function VmPrototypeWorkloadCvesGate({
    view,
}: VmPrototypeWorkloadCvesGateProps): ReactElement {
    const [searchParams] = useSearchParams();
    const version = resolveVmPrototypeVersion(
        getVmPrototypeParamForResolver(searchParams.get('prototype')),
        import.meta.env.VITE_VM_PROTOTYPE
    );
    const Override = getWorkloadCvesPageOverride(version);
    if (Override) {
        return <Override view={view} />;
    }
    return <AsyncWorkloadCvesPage view={view} />;
}
