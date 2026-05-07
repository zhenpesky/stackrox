/**
 * UX prototype tier for vulnerability-management experiments.
 * Same platform build; behavior switches via ?vmPrototype= or VITE_VM_PROTOTYPE.
 */

export type VmPrototypeVersion = 'v1' | 'v2' | 'v3' | 'v4';

const VALID: VmPrototypeVersion[] = ['v1', 'v2', 'v3', 'v4'];

function isVmPrototypeVersion(value: string): value is VmPrototypeVersion {
    return (VALID as readonly string[]).includes(value);
}

/**
 * Query param wins (good for demos from HPUX), then Vite env, then v4 baseline.
 */
export function resolveVmPrototypeVersion(
    queryValue: string | null | undefined,
    viteEnvValue: string | undefined
): VmPrototypeVersion {
    const fromQuery = (queryValue ?? '').trim().toLowerCase();
    if (fromQuery === '1') {
        return 'v1';
    }
    if (fromQuery === '2') {
        return 'v2';
    }
    if (fromQuery === '3') {
        return 'v3';
    }
    if (fromQuery === '4') {
        return 'v4';
    }
    if (isVmPrototypeVersion(fromQuery)) {
        return fromQuery;
    }

    const fromEnv = (viteEnvValue ?? '').trim().toLowerCase();
    if (fromEnv === '1') {
        return 'v1';
    }
    if (fromEnv === '2') {
        return 'v2';
    }
    if (fromEnv === '3') {
        return 'v3';
    }
    if (fromEnv === '4') {
        return 'v4';
    }
    if (isVmPrototypeVersion(fromEnv)) {
        return fromEnv;
    }

    return 'v4';
}
