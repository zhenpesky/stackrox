import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type MouseEvent,
    type ReactElement,
    type Ref,
} from 'react';
import {
    Divider,
    MenuToggle,
    Select,
    SelectList,
    SelectOption,
    Toolbar,
    ToolbarContent,
    ToolbarItem,
} from '@patternfly/react-core';
import type { MenuToggleElement } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import { useSearchParams } from 'react-router-dom-v5-compat';

import ManageSavedFiltersModalV1 from './ManageSavedFiltersModalV1';
import type { ManageSavedFilterRow } from './ManageSavedFiltersModalV1';
import {
    V2_SAVED_FILTER_PRESET_MENU_NAMES,
    findMenuNameForSavedFilterUrlParam,
    getV2ManageModalSeedRows,
    getV2SelectedLabelForPresetMenuName,
} from './v2SavedFilterPresets';

const MANAGE_VALUE = '__manage_saved_filters__';

/**
 * Saved filters UX from localhost:5173 **`/v2/.../user-workloads`**
 * (`V2UserWorkloadVulnerabilities.jsx`): preset `Select`, manage modal, `savedFilter` URL param.
 * Does not drive the product compound-search bar (Central uses its own query model).
 */
export default function V1SavedFiltersToolbar(): ReactElement {
    const [searchParams, setSearchParams] = useSearchParams();
    const [savedFiltersOpen, setSavedFiltersOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [selectedMenuName, setSelectedMenuName] = useState<string | null>(() =>
        findMenuNameForSavedFilterUrlParam(searchParams.get('savedFilter'))
    );
    const [manageRows, setManageRows] = useState<ManageSavedFilterRow[]>(() =>
        getV2ManageModalSeedRows()
    );

    useEffect(() => {
        const fromUrl = findMenuNameForSavedFilterUrlParam(searchParams.get('savedFilter'));
        setSelectedMenuName(fromUrl);
    }, [searchParams]);

    const setSavedFilterParam = useCallback(
        (menuName: string | null) => {
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    if (menuName) {
                        next.set('savedFilter', getV2SelectedLabelForPresetMenuName(menuName));
                    } else {
                        next.delete('savedFilter');
                    }
                    return next;
                },
                { replace: true }
            );
        },
        [setSearchParams]
    );

    const applyPresetByMenuName = useCallback(
        (menuName: string) => {
            setSelectedMenuName(menuName);
            setSavedFilterParam(menuName);
            setSavedFiltersOpen(false);
        },
        [setSavedFilterParam]
    );

    const toggleLabel = selectedMenuName
        ? getV2SelectedLabelForPresetMenuName(selectedMenuName)
        : 'Saved filters';

    const visiblePresetOptions = useMemo(() => {
        return V2_SAVED_FILTER_PRESET_MENU_NAMES.map((canonicalName, i) => {
            const row = manageRows.find((r) => r.id === `v2-sf-${i}`);
            if (!row || row.hidden) {
                return null;
            }
            return { canonicalName, label: row.name };
        }).filter((x): x is { canonicalName: string; label: string } => x !== null);
    }, [manageRows]);

    const handleSelect = useCallback(
        (
            _event: MouseEvent<Element, MouseEvent> | undefined,
            value: string | number | undefined
        ) => {
            const v = typeof value === 'string' ? value : String(value ?? '');
            if (v === MANAGE_VALUE) {
                setSavedFiltersOpen(false);
                setManageOpen(true);
                return;
            }
            if (v) {
                applyPresetByMenuName(v);
            }
        },
        [applyPresetByMenuName]
    );

    const handleModalSave = useCallback((rows: ManageSavedFilterRow[]) => {
        setManageRows(rows);
    }, []);

    const selectToggle = (toggleRef: Ref<MenuToggleElement>) => (
        <MenuToggle
            ref={toggleRef}
            onClick={() => setSavedFiltersOpen(!savedFiltersOpen)}
            isExpanded={savedFiltersOpen}
            icon={selectedMenuName ? <FilterIcon /> : undefined}
        >
            {toggleLabel}
        </MenuToggle>
    );

    return (
        <>
            <Toolbar data-testid="vm-prototype-v1-saved-filters-toolbar">
                <ToolbarContent>
                    <ToolbarItem>
                        <Select
                            isOpen={savedFiltersOpen}
                            onOpenChange={setSavedFiltersOpen}
                            selected={selectedMenuName ?? undefined}
                            onSelect={handleSelect}
                            toggle={selectToggle}
                        >
                            <SelectList>
                                {visiblePresetOptions.map(({ canonicalName, label }) => (
                                    <SelectOption key={canonicalName} value={canonicalName}>
                                        {label}
                                    </SelectOption>
                                ))}
                            </SelectList>
                            <Divider />
                            <SelectList>
                                <SelectOption value={MANAGE_VALUE}>
                                    Manage saved filters
                                </SelectOption>
                            </SelectList>
                        </Select>
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            <ManageSavedFiltersModalV1
                isOpen={manageOpen}
                onClose={() => setManageOpen(false)}
                items={manageRows}
                onSave={handleModalSave}
            />
        </>
    );
}
