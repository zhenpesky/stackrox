import type { ManageSavedFilterRow } from './ManageSavedFiltersModalV1';

/**
 * Preset names in the Saved filters menu — from localhost:5173
 * `src/pages/v2/V2UserWorkloadVulnerabilities.jsx` (`SAVED_FILTER_DROPDOWN_OPTIONS`).
 */
export const V2_SAVED_FILTER_PRESET_MENU_NAMES = [
    'Front End minimum',
    'Static text',
    'Infra main',
    'etcd critical',
    'Cluster warnings',
    'Silenced alerts',
    'Disabled warnings',
] as const;

/** v2 shows "Front End only" in the toggle when the "Front End minimum" preset is active. */
export function getV2SelectedLabelForPresetMenuName(menuName: string): string {
    return menuName === 'Front End minimum' ? 'Front End only' : menuName;
}

export function getV2ManageModalSeedRows(): ManageSavedFilterRow[] {
    return V2_SAVED_FILTER_PRESET_MENU_NAMES.map((name, i) => ({
        id: `v2-sf-${i}`,
        name,
        hidden: false,
    }));
}

export function findMenuNameForSavedFilterUrlParam(param: string | null): string | null {
    if (!param) {
        return null;
    }
    const byDisplayLabel = V2_SAVED_FILTER_PRESET_MENU_NAMES.find(
        (menu) => getV2SelectedLabelForPresetMenuName(menu) === param
    );
    if (byDisplayLabel) {
        return byDisplayLabel;
    }
    if ((V2_SAVED_FILTER_PRESET_MENU_NAMES as readonly string[]).includes(param)) {
        return param;
    }
    return null;
}
