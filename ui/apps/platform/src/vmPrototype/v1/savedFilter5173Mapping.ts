import type { SearchFilter } from 'types/search';
import { searchValueAsArray } from 'utils/searchUtils';

function asStringArray(v: unknown): string[] {
    if (Array.isArray(v)) {
        return v.filter((x): x is string => typeof x === 'string');
    }
    if (typeof v === 'string' && v) {
        return [v];
    }
    return [];
}

/**
 * Maps localhost:5173 v1 mock saved-filter fields to product workload URL {@link SearchFilter}.
 */
export function savedFilter5173ToSearchFilter(filters: Record<string, unknown>): SearchFilter {
    const out: SearchFilter = {};
    const cluster = asStringArray(filters.clusterName);
    const ns = asStringArray(filters.namespaceName);
    const dep = asStringArray(filters.deploymentName);
    const severity = asStringArray(filters.severity).length
        ? asStringArray(filters.severity)
        : asStringArray(filters.cveSeverity);
    const cveStatus = asStringArray(filters.cveStatus);
    if (cluster.length) {
        out.Cluster = cluster.length === 1 ? cluster[0] : cluster;
    }
    if (ns.length) {
        out.Namespace = ns.length === 1 ? ns[0] : ns;
    }
    if (dep.length) {
        out.Deployment = dep.length === 1 ? dep[0] : dep;
    }
    if (severity.length) {
        out.SEVERITY = severity.length === 1 ? severity[0] : severity;
    }
    if (cveStatus.length) {
        out.FIXABLE = cveStatus.length === 1 ? cveStatus[0] : cveStatus;
    }
    return out;
}

/** Inverse mapping for “save / update saved filter” from current URL filters. */
export function searchFilterToSaved5173Filters(sf: SearchFilter): Record<string, unknown> {
    return {
        clusterName: [...searchValueAsArray(sf.Cluster)],
        namespaceName: [...searchValueAsArray(sf.Namespace)],
        deploymentName: [...searchValueAsArray(sf.Deployment)],
        severity: [...searchValueAsArray(sf.SEVERITY)],
        cveStatus: [...searchValueAsArray(sf.FIXABLE)],
    };
}

const VIOLATION_SAVED_BUNDLE_KEY = '__violation';

/**
 * Violations: store the user-editable URL {@link SearchFilter} as JSON (alert compound filters differ
 * per “filtered workflow” parent view — scope saved lists per workflow in `useSavedFilters5173`.)
 */
export function searchFilterToViolation5173Bundle(sf: SearchFilter): Record<string, unknown> {
    return {
        [VIOLATION_SAVED_BUNDLE_KEY]: { ...sf },
    };
}

export function violation5173BundleToSearchFilter(filters: Record<string, unknown>): SearchFilter {
    const v = filters[VIOLATION_SAVED_BUNDLE_KEY];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
        return { ...(v as SearchFilter) };
    }
    return {};
}

export function violationFilterSummaryLines(sf: SearchFilter): string[] {
    return Object.entries(sf)
        .filter(([, val]) => {
            if (val === undefined || val === null || val === '') {
                return false;
            }
            if (Array.isArray(val) && val.length === 0) {
                return false;
            }
            return true;
        })
        .map(([k, val]) => {
            const s = Array.isArray(val) ? val.join(', ') : String(val);
            return `${k}: ${s}`;
        });
}

const SUBSET_KEYS = ['Cluster', 'Namespace', 'Deployment', 'SEVERITY', 'FIXABLE'] as const;

function pickComparableSubset(sf: SearchFilter): Record<string, string[]> {
    return SUBSET_KEYS.reduce<Record<string, string[]>>((acc, k) => {
        const v = searchValueAsArray(sf[k]);
        if (!v.length) {
            return acc;
        }
        return { ...acc, [k]: [...v].sort() };
    }, {});
}

export function savedFilterSubsetEquals(a: SearchFilter, b: SearchFilter): boolean {
    const pa = pickComparableSubset(a);
    const pb = pickComparableSubset(b);
    const keys = new Set([...Object.keys(pa), ...Object.keys(pb)]);
    return [...keys].every((k) => {
        const va = (pa[k] ?? []).join('\0');
        const vb = (pb[k] ?? []).join('\0');
        return va === vb;
    });
}
