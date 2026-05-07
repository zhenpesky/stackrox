import { describe, expect, it } from 'vitest';

import type { VmPrototypeVersion } from './vmPrototypeVersion';

import V1VulnReportingShell from './v1/V1VulnReportingShell';
import V1WorkloadCvesShell from './v1/V1WorkloadCvesShell';
import { getVulnReportingPageOverride, getWorkloadCvesPageOverride } from './vmPrototypeRegistry';

const VERSIONS: VmPrototypeVersion[] = ['v1', 'v2', 'v3', 'v4'];

describe('vmPrototypeRegistry (v1 shells)', () => {
    it('getWorkloadCvesPageOverride(v1) is the v1 workload shell', () => {
        expect(getWorkloadCvesPageOverride('v1')).toBe(V1WorkloadCvesShell);
    });

    it('getVulnReportingPageOverride(v1) is the v1 reporting shell', () => {
        expect(getVulnReportingPageOverride('v1')).toBe(V1VulnReportingShell);
    });

    it.each(['v2', 'v3', 'v4'] as const)(
        'getWorkloadCvesPageOverride(%s) is null (stock page)',
        (version) => {
            expect(getWorkloadCvesPageOverride(version)).toBeNull();
        }
    );

    it.each(['v2', 'v3', 'v4'] as const)(
        'getVulnReportingPageOverride(%s) is null (stock page)',
        (version) => {
            expect(getVulnReportingPageOverride(version)).toBeNull();
        }
    );
});

describe('vmPrototypeRegistry (scalability contract)', () => {
    it('resolves many lookups without growing work per call (registry stays switch-based)', () => {
        const iterations = 5000;
        const t0 = performance.now();
        for (let i = 0; i < iterations; i += 1) {
            const v = VERSIONS[i % VERSIONS.length];
            getWorkloadCvesPageOverride(v);
            getVulnReportingPageOverride(v);
        }
        const ms = performance.now() - t0;
        // Loose guard: pure switches should be far below this on CI hardware.
        expect(ms).toBeLessThan(500);
    });
});
