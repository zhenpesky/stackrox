import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactElement, Ref } from 'react';
import {
    Button,
    Content,
    Divider,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    MenuToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Select,
    SelectList,
    SelectOption,
    TextInput,
    ToolbarItem,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

import ManageSavedFiltersModalV1 from 'vmPrototype/v1/port5173/ManageSavedFiltersModalV1';
import type { ManageSavedFilterRow } from 'vmPrototype/v1/port5173/ManageSavedFiltersModalV1';
import { useSavedFilters5173 } from 'vmPrototype/v1/port5173/useSavedFilters5173';
import type { SearchFilter } from 'types/search';
import { getHasSearchApplied } from 'utils/searchUtils';

import {
    savedFilter5173ToSearchFilter,
    searchFilterToSaved5173Filters,
    searchFilterToViolation5173Bundle,
    violation5173BundleToSearchFilter,
    violationFilterSummaryLines,
} from './savedFilter5173Mapping';

const MANAGE_VALUE = '__manage_saved_filters__';

export type V1WorkloadSavedFilterScheduleMeta = {
    selectedSavedName: string | null;
    baselineSearchFilter: SearchFilter | null;
};

export type V1PrototypeSavedFilterKind = 'workload' | 'violation';

export type UseV1WorkloadSavedFiltersControlArgs = {
    enabled: boolean;
    searchFilter: SearchFilter;
    setSearchFilter: (next: SearchFilter) => void;
    paginationSetPage: (page: number) => void;
    /**
     * Unique key for localStorage; e.g. `workload-vuln-user-workloads`,
     * `violations:Platform view` (per filtered workflow parent / available filters).
     */
    storageScope: string;
    /** Workload Results uses 5173 CVE/scope mapping; violations store raw search filter JSON. */
    filterKind: V1PrototypeSavedFilterKind;
    onScheduleMetaChange?: (meta: V1WorkloadSavedFilterScheduleMeta) => void;
};

export type V1WorkloadSavedFiltersControl = {
    prefixToolbarItem: ReactElement | null;
    /** Render after “Clear filters” in the applied-filter row (localhost:5173 v1 layout). */
    appliedFilterSuffix: ReactElement | null;
    modalsFragment: ReactElement | null;
};

export function useV1WorkloadSavedFiltersControl({
    enabled,
    searchFilter,
    setSearchFilter,
    paginationSetPage,
    storageScope,
    filterKind,
    onScheduleMetaChange,
}: UseV1WorkloadSavedFiltersControlArgs): V1WorkloadSavedFiltersControl {
    const { filters, replaceAll, createFilter, updateFilter } = useSavedFilters5173(storageScope);

    const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [newFilterName, setNewFilterName] = useState('');
    const [newFilterDescription, setNewFilterDescription] = useState('');

    const [selectedSavedName, setSelectedSavedName] = useState<string | null>(null);
    const [baselineSearchFilter, setBaselineSearchFilter] = useState<SearchFilter | null>(null);

    useEffect(() => {
        if (!enabled) {
            onScheduleMetaChange?.({
                selectedSavedName: null,
                baselineSearchFilter: null,
            });
            return;
        }
        onScheduleMetaChange?.({
            selectedSavedName,
            baselineSearchFilter,
        });
    }, [baselineSearchFilter, enabled, onScheduleMetaChange, selectedSavedName]);

    // Clear saved-filter selection when there are no applied filters (e.g. “Clear filters”, empty
    // table clear, vuln-state reset). Drop local selection when leaving the v1 toolbar context.
    useEffect(() => {
        if (!enabled) {
            setSelectedSavedName(null);
            setBaselineSearchFilter(null);
            return;
        }
        if (!getHasSearchApplied(searchFilter)) {
            setSelectedSavedName(null);
            setBaselineSearchFilter(null);
        }
    }, [enabled, searchFilter]);

    const manageRows: ManageSavedFilterRow[] = useMemo(
        () => filters.map((f) => ({ id: f.id, name: f.name, hidden: f.hidden })),
        [filters]
    );

    const visibleSavedFilters = useMemo(() => filters.filter((f) => !f.hidden), [filters]);

    const applySavedFilter = useCallback(
        (filter: (typeof filters)[number]) => {
            setSavedFiltersOpen(false);
            setSelectedSavedName(filter.name);
            const next =
                filterKind === 'workload'
                    ? savedFilter5173ToSearchFilter(filter.filters)
                    : violation5173BundleToSearchFilter(filter.filters);
            setSearchFilter(next);
            setBaselineSearchFilter(next);
            paginationSetPage(1);
        },
        [filterKind, paginationSetPage, setSearchFilter]
    );

    const handleSelectValue = useCallback(
        (value: string | number | undefined) => {
            const v = typeof value === 'string' ? value : String(value ?? '');
            if (v === MANAGE_VALUE) {
                setSavedFiltersOpen(false);
                setManageOpen(true);
                return;
            }
            const match = filters.find((f) => f.id === v);
            if (match) {
                applySavedFilter(match);
            }
        },
        [applySavedFilter, filters]
    );

    const handleManageSave = useCallback(
        (rows: ManageSavedFilterRow[]) => {
            const prevById = new Map(filters.map((f) => [f.id, f]));
            const nextFilters = rows
                .map((r) => {
                    const orig = prevById.get(r.id);
                    return orig ? { ...orig, name: r.name, hidden: Boolean(r.hidden) } : null;
                })
                .filter((x): x is NonNullable<typeof x> => x !== null);
            replaceAll(nextFilters);
        },
        [filters, replaceAll]
    );

    const handleSaveNew = useCallback(() => {
        if (!newFilterName.trim()) {
            return;
        }
        const bundle =
            filterKind === 'workload'
                ? searchFilterToSaved5173Filters(searchFilter)
                : searchFilterToViolation5173Bundle(searchFilter);
        const created = createFilter({
            name: newFilterName.trim(),
            description: newFilterDescription.trim(),
            filters: bundle,
        });
        setSaveModalOpen(false);
        setSelectedSavedName(created.name);
        setBaselineSearchFilter({ ...searchFilter });
        setNewFilterName('');
        setNewFilterDescription('');
    }, [createFilter, filterKind, newFilterDescription, newFilterName, searchFilter]);

    const handleUpdateSaved = useCallback(() => {
        const match = filters.find((f) => f.name === selectedSavedName);
        if (match) {
            const bundle =
                filterKind === 'workload'
                    ? searchFilterToSaved5173Filters(searchFilter)
                    : searchFilterToViolation5173Bundle(searchFilter);
            updateFilter(match.id, {
                filters: bundle,
            });
            setBaselineSearchFilter({ ...searchFilter });
        }
        setUpdateModalOpen(false);
    }, [filterKind, filters, searchFilter, selectedSavedName, updateFilter]);

    const selectedIdForSelect = useMemo(() => {
        if (!selectedSavedName) {
            return undefined;
        }
        return filters.find((f) => f.name === selectedSavedName)?.id;
    }, [filters, selectedSavedName]);

    const toggleLabel = selectedSavedName ?? 'Saved filters';

    const selectToggle = (toggleRef: Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            onClick={() => setSavedFiltersOpen(!savedFiltersOpen)}
            isExpanded={savedFiltersOpen}
            icon={selectedSavedName ? <FilterIcon /> : undefined}
        >
            {toggleLabel}
        </MenuToggle>
    );

    const filterSummaryLines = useMemo(() => {
        if (filterKind === 'violation') {
            return violationFilterSummaryLines(searchFilter);
        }
        const snap = searchFilterToSaved5173Filters(searchFilter) as Record<string, string[]>;
        return Object.entries(snap)
            .filter(([, values]) => values.length > 0)
            .map(([key, values]) => `${key}: ${values.join(', ')}`);
    }, [filterKind, searchFilter]);

    if (!enabled) {
        return {
            prefixToolbarItem: null,
            appliedFilterSuffix: null,
            modalsFragment: null,
        };
    }

    const prefixToolbarItem = (
        <ToolbarItem data-testid="vm-prototype-v1-saved-filters">
            <Select
                isOpen={savedFiltersOpen}
                onOpenChange={setSavedFiltersOpen}
                selected={selectedIdForSelect}
                onSelect={(_event, value) => handleSelectValue(value)}
                toggle={selectToggle}
            >
                <SelectList>
                    <SelectOption value={MANAGE_VALUE}>Manage saved filters</SelectOption>
                </SelectList>
                <Divider />
                <SelectList>
                    {visibleSavedFilters.map((sf) => (
                        <SelectOption key={sf.id} value={sf.id}>
                            <Flex direction={{ default: 'column' }}>
                                <FlexItem>
                                    <span className="pf-v6-u-font-weight-normal">{sf.name}</span>
                                </FlexItem>
                                {sf.description ? (
                                    <FlexItem>
                                        <Content component="small" className="pf-v6-u-color-200">
                                            {sf.description}
                                        </Content>
                                    </FlexItem>
                                ) : null}
                            </Flex>
                        </SelectOption>
                    ))}
                </SelectList>
            </Select>
        </ToolbarItem>
    );

    const appliedFilterSuffix = getHasSearchApplied(searchFilter) ? (
        <>
            {selectedSavedName ? (
                <FlexItem>
                    <Button variant="link" isInline onClick={() => setUpdateModalOpen(true)}>
                        Update saved filter
                    </Button>
                </FlexItem>
            ) : null}
            <FlexItem>
                <Button variant="link" isInline onClick={() => setSaveModalOpen(true)}>
                    Save as new saved filter
                </Button>
            </FlexItem>
        </>
    ) : null;

    const modalsFragment = (
        <>
            <ManageSavedFiltersModalV1
                isOpen={manageOpen}
                onClose={() => setManageOpen(false)}
                items={manageRows}
                onSave={handleManageSave}
            />
            <Modal variant="small" isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)}>
                <ModalHeader title="Save current filters" />
                <ModalBody>
                    <Form>
                        <FormGroup label="Filter name" isRequired fieldId="vm-v1-filter-name">
                            <TextInput
                                id="vm-v1-filter-name"
                                value={newFilterName}
                                onChange={(_e, val) => setNewFilterName(val)}
                                placeholder="Enter a name for this filter"
                            />
                        </FormGroup>
                        <FormGroup label="Description" fieldId="vm-v1-filter-desc">
                            <TextInput
                                id="vm-v1-filter-desc"
                                value={newFilterDescription}
                                onChange={(_e, val) => setNewFilterDescription(val)}
                                placeholder="Optional description"
                            />
                        </FormGroup>
                        <FormGroup label="Current filters" fieldId="vm-v1-filter-snapshot">
                            <Content component="small" className="pf-v6-u-color-200">
                                {filterSummaryLines.length ? (
                                    filterSummaryLines.map((line) => <div key={line}>{line}</div>)
                                ) : (
                                    <span>
                                        {filterKind === 'workload'
                                            ? 'No workload filters in URL.'
                                            : 'No violation list filters in URL.'}
                                    </span>
                                )}
                            </Content>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="primary"
                        onClick={handleSaveNew}
                        isDisabled={!newFilterName.trim()}
                    >
                        Save filter
                    </Button>
                    <Button variant="link" onClick={() => setSaveModalOpen(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal
                variant="medium"
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
            >
                <ModalHeader title={`Update saved filter — “${selectedSavedName ?? ''}”?`} />
                <ModalBody>
                    <Content component="p">
                        The current filter configuration will replace the saved filter settings.
                    </Content>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleUpdateSaved}>
                        Update saved filter
                    </Button>
                    <Button variant="link" onClick={() => setUpdateModalOpen(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );

    return {
        prefixToolbarItem,
        appliedFilterSuffix,
        modalsFragment,
    };
}
