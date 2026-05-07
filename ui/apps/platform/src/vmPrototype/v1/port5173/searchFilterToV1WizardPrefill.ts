import type {
    CompoundSearchFilterAttribute,
    CompoundSearchFilterConfig,
} from 'Components/CompoundSearchFilter/types';
import { isFixableStatus, isVulnerabilitySeverityLabel } from 'Containers/Vulnerabilities/types';
import type { SearchFilter } from 'types/search';
import { searchValueAsArray } from 'utils/searchUtils';

const SCOPE_ENTITY_LABELS = new Set(['Cluster', 'Namespace', 'Deployment']);

function severityLabelToWizard5173Value(label: string): string | null {
    if (!isVulnerabilitySeverityLabel(label)) {
        return null;
    }
    switch (label) {
        case 'Critical':
            return 'critical';
        case 'Important':
            return 'important';
        case 'Moderate':
            return 'moderate';
        case 'Low':
            return 'low';
        case 'Unknown':
            return 'unknown';
        default:
            return null;
    }
}

function fixableLabelToWizard5173Status(label: string): 'fixable' | 'not-fixable' | null {
    if (!isFixableStatus(label)) {
        return null;
    }
    return label === 'Fixable' ? 'fixable' : 'not-fixable';
}

function stripSurroundingQuotes(str: string): string {
    const t = str.trim();
    if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
        return t.slice(1, -1);
    }
    return str;
}

function chipTextForAttribute(
    entityLabel: string,
    attr: CompoundSearchFilterAttribute,
    value: string
): string {
    const v = stripSurroundingQuotes(String(value).trim());
    if (attr.inputType === 'condition-number' || attr.inputType === 'condition-text') {
        return `${entityLabel} ${attr.displayName} ${v}`;
    }
    return `${entityLabel} ${attr.displayName}: ${v}`;
}

export type V1WizardPrefillFromSearchFilter = {
    scopeChips: string[];
    generalFilterChips: string[];
    selectedSeverities: string[];
    selectedCveStatus: string[];
};

/**
 * Maps a workload results {@link SearchFilter} into v1 Create Report wizard fields
 * (resource scope chips, CVE severity/status as URL keys SEVERITY/FIXABLE, and general CVE filter chips).
 */
export function searchFilterToV1WizardPrefill(
    searchFilter: SearchFilter,
    compoundConfig: CompoundSearchFilterConfig
): V1WizardPrefillFromSearchFilter {
    const scopeChips: string[] = [];
    const generalChips: string[] = [];
    const selectedSeverities: string[] = [];
    const selectedCveStatus: string[] = [];

    compoundConfig.forEach((entity) => {
        const entityLabel = entity.displayName;

        entity.attributes.forEach((attr) => {
            const values = searchValueAsArray(searchFilter[attr.searchTerm]);
            if (!values.length) {
                return;
            }

            if (entityLabel === 'CVE' && attr.searchTerm === 'SEVERITY') {
                values.forEach((lab) => {
                    const v = severityLabelToWizard5173Value(lab);
                    if (v) {
                        selectedSeverities.push(v);
                    }
                });
                return;
            }
            if (entityLabel === 'CVE' && attr.searchTerm === 'FIXABLE') {
                values.forEach((lab) => {
                    const v = fixableLabelToWizard5173Status(lab);
                    if (v) {
                        selectedCveStatus.push(v);
                    }
                });
                return;
            }

            if (SCOPE_ENTITY_LABELS.has(entityLabel)) {
                values.forEach((val) => {
                    scopeChips.push(`${entityLabel} ${attr.displayName.toLowerCase()}: ${val}`);
                });
                return;
            }

            values.forEach((val) => {
                generalChips.push(chipTextForAttribute(entityLabel, attr, val));
            });
        });
    });

    return {
        scopeChips,
        generalFilterChips: generalChips,
        selectedSeverities: [...new Set(selectedSeverities)],
        selectedCveStatus: [...new Set(selectedCveStatus)],
    };
}
