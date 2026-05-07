import { describe, expect, it } from 'vitest';

import { resolveVmPrototypeVersion } from './vmPrototypeVersion';

describe('resolveVmPrototypeVersion', () => {
    it('defaults to v4 when query and env are empty or unknown', () => {
        expect(resolveVmPrototypeVersion(undefined, undefined)).toBe('v4');
        expect(resolveVmPrototypeVersion('', undefined)).toBe('v4');
        expect(resolveVmPrototypeVersion('bogus', undefined)).toBe('v4');
        expect(resolveVmPrototypeVersion(undefined, 'nope')).toBe('v4');
    });

    it('prefers query over env', () => {
        expect(resolveVmPrototypeVersion('v1', 'v3')).toBe('v1');
        expect(resolveVmPrototypeVersion('2', 'v4')).toBe('v2');
    });

    it.each([
        ['v1', 'v1'],
        ['V1', 'v1'],
        ['1', 'v1'],
        ['v2', 'v2'],
        ['2', 'v2'],
        ['v3', 'v3'],
        ['3', 'v3'],
        ['v4', 'v4'],
        ['4', 'v4'],
        ['V4', 'v4'],
    ] as const)('parses query %s → %s', (input, expected) => {
        expect(resolveVmPrototypeVersion(input, undefined)).toBe(expected);
    });

    it('falls back to env when query missing', () => {
        expect(resolveVmPrototypeVersion(undefined, 'v2')).toBe('v2');
        expect(resolveVmPrototypeVersion(null, '3')).toBe('v3');
    });
});
