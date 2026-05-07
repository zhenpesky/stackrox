import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
    getSearchForNavPreservation,
    getVmPrototypeParamForResolver,
    linkForScopedVmPrototypeNav,
    linkToWithVmPrototype,
    persistVmPrototypeFromSearch,
    readPersistedVmPrototype,
} from './vmPrototypeSession';

describe('vmPrototypeSession', () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    it('persists tier from URL search', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v2');
        expect(readPersistedVmPrototype()).toBe('v2');
    });

    it('getSearchForNavPreservation prefers URL over session', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v1');
        expect(getSearchForNavPreservation('?vmPrototype=v3')).toBe('?vmPrototype=v3');
    });

    it('getSearchForNavPreservation falls back to session when URL omits vmPrototype', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v1');
        expect(getSearchForNavPreservation('')).toBe('?vmPrototype=v1');
    });

    it('linkToWithVmPrototype appends tier from session when URL has none', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v1');
        expect(linkToWithVmPrototype('/main/vulnerabilities/user-workloads', '')).toBe(
            '/main/vulnerabilities/user-workloads?vmPrototype=v1'
        );
    });

    it('linkForScopedVmPrototypeNav preserves tier only for Results / reporting paths', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v1');
        expect(linkForScopedVmPrototypeNav('/main/dashboard', '')).toBe('/main/dashboard');
        expect(linkForScopedVmPrototypeNav('/main/vulnerabilities/exception-management', '')).toBe(
            '/main/vulnerabilities/exception-management'
        );
        expect(linkForScopedVmPrototypeNav('/main/vulnerabilities/user-workloads', '')).toBe(
            '/main/vulnerabilities/user-workloads?vmPrototype=v1'
        );
        expect(linkForScopedVmPrototypeNav('/main/vulnerabilities/reports', '')).toBe(
            '/main/vulnerabilities/reports?vmPrototype=v1'
        );
        expect(
            linkForScopedVmPrototypeNav('/main/vulnerabilities/reports/configuration', '')
        ).toBe('/main/vulnerabilities/reports/configuration?vmPrototype=v1');
    });

    it('getVmPrototypeParamForResolver falls back to session', () => {
        persistVmPrototypeFromSearch('?vmPrototype=v2');
        expect(getVmPrototypeParamForResolver(null)).toBe('v2');
        expect(getVmPrototypeParamForResolver('')).toBe('v2');
        expect(getVmPrototypeParamForResolver('v3')).toBe('v3');
    });
});
