import { useMemo } from 'react';

function isTruthyFetchFailure(fetchError: unknown): boolean {
    if (fetchError == null || fetchError === false) {
        return false;
    }
    if (typeof fetchError === 'string') {
        return fetchError.trim().length > 0;
    }
    return true;
}

/**
 * When Central’s vulnerability reporting list APIs fail (e.g. 5xx), show static sample rows in
 * {@link ConfigReportsTab} and {@link ViewBasedReportsTab} so the layout matches a healthy Central
 * until **Retry** succeeds—without requiring `?vmPrototype=v1` or a dev build.
 */
export function useVmPrototypeReportingSampleFallback(fetchError: unknown): boolean {
    return useMemo(() => isTruthyFetchFailure(fetchError), [fetchError]);
}
