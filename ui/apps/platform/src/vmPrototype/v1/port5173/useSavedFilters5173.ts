import { useCallback, useEffect, useState } from 'react';

import { INITIAL_SAVED_FILTERS_5173 } from './mockSavedFilters';
import type { SavedFilter5173 } from './mockSavedFilters';

const LS_PREFIX = 'vm-prototype-5173-saved-filters::';

function storageKey(scope: string): string {
    return `${LS_PREFIX}${scope}`;
}

function loadFromLocalStorage(scope: string): SavedFilter5173[] | null {
    try {
        const raw = localStorage.getItem(storageKey(scope));
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? (parsed as SavedFilter5173[]) : null;
    } catch {
        return null;
    }
}

function persistToLocalStorage(scope: string, filters: SavedFilter5173[]): void {
    try {
        localStorage.setItem(storageKey(scope), JSON.stringify(filters));
    } catch {
        // private mode / quota
    }
}

function initialFiltersForScope(scope: string): SavedFilter5173[] {
    if (scope === 'workload-vuln-user-workloads') {
        return [...INITIAL_SAVED_FILTERS_5173];
    }
    return [];
}

function getFiltersForScope(scope: string): SavedFilter5173[] {
    return loadFromLocalStorage(scope) ?? initialFiltersForScope(scope);
}

/**
 * In-memory + localStorage saved filters, namespaced by `scope` (per nav: user-workloads,
 * platform, all-images, or violations:Applications view, etc.).
 */
export function useSavedFilters5173(scope: string): {
    filters: SavedFilter5173[];
    replaceAll: (
        next: SavedFilter5173[] | ((prev: SavedFilter5173[]) => SavedFilter5173[])
    ) => void;
    createFilter: (
        filter: Pick<SavedFilter5173, 'name' | 'description' | 'filters'>
    ) => SavedFilter5173;
    updateFilter: (id: string, updates: Partial<SavedFilter5173>) => SavedFilter5173;
    deleteFilter: (id: string) => void;
} {
    const [filters, setFilters] = useState(() => getFiltersForScope(scope));

    useEffect(() => {
        setFilters(getFiltersForScope(scope));
    }, [scope]);

    useEffect(() => {
        persistToLocalStorage(scope, filters);
    }, [scope, filters]);

    const replaceAll = useCallback(
        (next: SavedFilter5173[] | ((prev: SavedFilter5173[]) => SavedFilter5173[])) => {
            setFilters((prev) => (typeof next === 'function' ? next(prev) : next));
        },
        []
    );

    const createFilter = useCallback(
        (filter: Pick<SavedFilter5173, 'name' | 'description' | 'filters'>) => {
            const newFilter: SavedFilter5173 = {
                id: `filter-${Date.now()}`,
                ...filter,
                createdAt: new Date().toISOString(),
            };
            setFilters((prev) => [...prev, newFilter]);
            return newFilter;
        },
        []
    );

    const updateFilter = useCallback((id: string, updates: Partial<SavedFilter5173>) => {
        let updated: SavedFilter5173 | undefined;
        setFilters((prev) =>
            prev.map((f) => {
                if (f.id !== id) {
                    return f;
                }
                updated = { ...f, ...updates };
                return updated;
            })
        );
        if (!updated) {
            throw new Error(`Filter ${id} not found`);
        }
        return updated;
    }, []);

    const deleteFilter = useCallback((id: string) => {
        setFilters((prev) => prev.filter((f) => f.id !== id));
    }, []);

    return { filters, replaceAll, createFilter, updateFilter, deleteFilter };
}
