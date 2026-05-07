import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';

import asyncComponent from 'Containers/MainPage/asyncComponent';

import { getVulnReportingPageOverride } from './vmPrototypeRegistry';
import { getVmPrototypeParamForResolver } from './vmPrototypeSession';
import { resolveVmPrototypeVersion } from './vmPrototypeVersion';

const AsyncVulnReportingPage = asyncComponent(
    () => import('Containers/Vulnerabilities/VulnerablityReporting/VulnReportingPage')
);

/**
 * Choke point for vulnerability reporting routes. Reuses stock page unless registry supplies an override.
 */
export default function VmPrototypeVulnReportingGate(): ReactElement {
    const [searchParams] = useSearchParams();
    const version = resolveVmPrototypeVersion(
        getVmPrototypeParamForResolver(searchParams.get('prototype')),
        import.meta.env.VITE_VM_PROTOTYPE
    );
    const Override = getVulnReportingPageOverride(version);
    if (Override) {
        return <Override />;
    }
    return <AsyncVulnReportingPage />;
}
