import { describe, expect, it } from 'vitest';

import { withPreservedVmPrototypeQuery } from './preserveVmPrototypeQuery';

describe('withPreservedVmPrototypeQuery', () => {
    it('returns path unchanged when no vmPrototype in search', () => {
        expect(withPreservedVmPrototypeQuery('/main/vulnerabilities/user-workloads', '')).toBe(
            '/main/vulnerabilities/user-workloads'
        );
        expect(
            withPreservedVmPrototypeQuery('/main/vulnerabilities/user-workloads', '?foo=1')
        ).toBe('/main/vulnerabilities/user-workloads');
    });

    it('appends vmPrototype from current search', () => {
        expect(
            withPreservedVmPrototypeQuery('/main/vulnerabilities/user-workloads', '?vmPrototype=v1')
        ).toBe('/main/vulnerabilities/user-workloads?vmPrototype=v1');
    });

    it('merges when path already has query', () => {
        const merged = withPreservedVmPrototypeQuery(
            '/main/vulnerabilities/reports?action=create',
            '?vmPrototype=v2'
        );
        expect(merged).toContain('vmPrototype=v2');
        expect(merged).toContain('action=create');
    });
});
