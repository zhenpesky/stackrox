import {
    violationsBasePath,
    vulnerabilitiesAllImagesPath,
    vulnerabilitiesBasePath,
    vulnerabilitiesImagesWithoutCvesPath,
    vulnerabilitiesInactiveImagesPath,
    vulnerabilitiesNodeCvesPath,
    vulnerabilitiesPlatformCvesPath,
    vulnerabilitiesPlatformPath,
    vulnerabilitiesUserWorkloadsPath,
    vulnerabilitiesVirtualMachineCvesPath,
    vulnerabilityReportsPath,
} from 'routePaths';
import { withPreservedVmPrototypeQuery } from 'utils/preserveVmPrototypeQuery';

const STORAGE_KEY = 'acs.vmPrototype.tier';

/**
 * Paths where `?prototype=` from the URL or session should be merged onto nav targets.
 * Matches sidebar **Results** (workload CVE views) and **Vulnerability Reporting** only — not
 * Exception Management, deprecated VM dashboard, or the rest of the app.
 */
const VM_PROTOTYPE_TIER_NAV_PATH_PREFIXES: readonly string[] = [
    violationsBasePath,
    vulnerabilitiesNodeCvesPath,
    vulnerabilitiesUserWorkloadsPath,
    vulnerabilitiesPlatformPath,
    vulnerabilitiesAllImagesPath,
    vulnerabilitiesInactiveImagesPath,
    vulnerabilitiesImagesWithoutCvesPath,
    vulnerabilitiesPlatformCvesPath,
    vulnerabilitiesVirtualMachineCvesPath,
    vulnerabilityReportsPath,
];

const VULNERABILITIES_SAVED_VIEWS_PATH_PREFIX = `${vulnerabilitiesBasePath}/results/`;

function pathnameOnly(pathOrUrl: string): string {
    const [pathname] = pathOrUrl.split('?');
    return pathname ?? pathOrUrl;
}

export function isVmPrototypeTierRelevantNavPath(pathOrUrl: string): boolean {
    const pathname = pathnameOnly(pathOrUrl);
    if (
        pathname === vulnerabilityReportsPath ||
        pathname.startsWith(`${vulnerabilityReportsPath}/`)
    ) {
        return true;
    }
    if (pathname.startsWith(VULNERABILITIES_SAVED_VIEWS_PATH_PREFIX)) {
        return true;
    }
    return VM_PROTOTYPE_TIER_NAV_PATH_PREFIXES.some(
        (root) => pathname === root || pathname.startsWith(`${root}/`)
    );
}

function safeGetItem(key: string): string | null {
    try {
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSetItem(key: string, value: string): void {
    try {
        sessionStorage.setItem(key, value);
    } catch {
        // ignore private mode / quota
    }
}

/** Call on route changes (e.g. MainPage) whenever the URL may contain `vmPrototype`. */
export function persistVmPrototypeFromSearch(locationSearch: string): void {
    const normalized = locationSearch.startsWith('?')
        ? locationSearch
        : locationSearch
          ? `?${locationSearch}`
          : '';
    const vm = new URLSearchParams(normalized).get('prototype')?.trim().toLowerCase();
    if (vm) {
        safeSetItem(STORAGE_KEY, vm);
    }
}

export function readPersistedVmPrototype(): string | null {
    const v = safeGetItem(STORAGE_KEY)?.trim().toLowerCase();
    return v || null;
}

/** Explicitly clear the persisted tier so gates fall back to the default (v4 / stock). */
export function clearPersistedVmPrototype(): void {
    try {
        sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore private mode / quota
    }
}

/**
 * Search string for **tier-relevant** links only ({@link isVmPrototypeTierRelevantNavPath}): prefer
 * the live URL, else last persisted tier so `?prototype=v1` survives hops inside Results /
 * Reporting. Other navigation should use plain paths without calling this.
 */
export function getSearchForNavPreservation(locationSearch: string): string {
    const normalized = locationSearch.startsWith('?')
        ? locationSearch
        : locationSearch
          ? `?${locationSearch}`
          : '';
    const params = new URLSearchParams(normalized);
    if (params.get('prototype')) {
        return normalized;
    }
    const persisted = readPersistedVmPrototype();
    if (persisted) {
        return `?prototype=${encodeURIComponent(persisted)}`;
    }
    return normalized;
}

/** Full `to` string with pathname + preserved prototype tier (any destination — use from VM flows). */
export function linkToWithVmPrototype(path: string, locationSearch: string): string {
    return withPreservedVmPrototypeQuery(path, getSearchForNavPreservation(locationSearch));
}

/**
 * Main / horizontal VM nav: preserve tier only for **Results** and **Vulnerability reporting**
 * targets; otherwise return the path alone (no session `vmPrototype` merge).
 */
export function linkForScopedVmPrototypeNav(path: string, locationSearch: string): string {
    if (isVmPrototypeTierRelevantNavPath(path)) {
        return linkToWithVmPrototype(path, locationSearch);
    }
    return pathnameOnly(path);
}

/** Resolver input: URL wins; otherwise last session tier (so gates stay on v1–v3 without query). */
export function getVmPrototypeParamForResolver(urlParam: string | null): string | null | undefined {
    if (urlParam != null && urlParam.trim() !== '') {
        return urlParam;
    }
    return readPersistedVmPrototype();
}
