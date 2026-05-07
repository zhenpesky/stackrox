/**
 * Merges `vmPrototype` from a caller-provided search string onto `path`. Used by tier-preserving
 * links only (Results, Vulnerability reporting, and explicit `linkToWithVmPrototype` call sites).
 */
export function withPreservedVmPrototypeQuery(path: string, currentLocationSearch: string): string {
    const params = new URLSearchParams(
        currentLocationSearch.startsWith('?') || currentLocationSearch === ''
            ? currentLocationSearch
            : `?${currentLocationSearch}`
    );
    const vm = params.get('prototype');
    if (!vm) {
        return path;
    }
    const [pathname, pathQuery] = path.split('?');
    const merged = new URLSearchParams(pathQuery ?? '');
    merged.set('prototype', vm);
    const qs = merged.toString();
    return qs ? `${pathname}?${qs}` : pathname;
}
