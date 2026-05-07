import type {
    CompoundSearchFilterConfig,
    CompoundSearchFilterEntity,
    SelectSearchFilterAttribute,
} from 'Components/CompoundSearchFilter/types';
import {
    attributeForFixableInFrontendAndLocalStorage,
    attributeForSeverityInFrontendAndLocalStorage,
    imageCVESearchFilterConfig,
} from 'Containers/Vulnerabilities/searchFilterConfig';

const workloadCveSeverityChildAttribute: SelectSearchFilterAttribute = {
    ...attributeForSeverityInFrontendAndLocalStorage,
    displayName: 'Severity',
    filterChipLabel: 'Severity',
};

const workloadCveFixabilityChildAttribute: SelectSearchFilterAttribute = {
    ...attributeForFixableInFrontendAndLocalStorage,
    displayName: 'Fixability status',
    filterChipLabel: 'Fixability status',
};

function augmentImageCveEntity(entity: CompoundSearchFilterEntity): CompoundSearchFilterEntity {
    if (entity.searchCategory !== imageCVESearchFilterConfig.searchCategory) {
        return entity;
    }
    const alreadyHasSeverity = entity.attributes.some(
        (a) => a.searchTerm === workloadCveSeverityChildAttribute.searchTerm
    );
    if (alreadyHasSeverity) {
        return entity;
    }
    const attrs = [...entity.attributes];
    const nameIdx = attrs.findIndex((a) => a.searchTerm === 'CVE' && a.displayName === 'Name');
    const insertAt = nameIdx === -1 ? attrs.length : nameIdx;
    attrs.splice(
        insertAt,
        0,
        workloadCveSeverityChildAttribute,
        workloadCveFixabilityChildAttribute
    );
    return { ...entity, attributes: attrs };
}

/**
 * vmPrototype v1 CVE tab: expose **Severity** and **Fixability status** as attributes under the
 * **CVE** entity (child / middle dropdown), matching the workload results compound filter. Search
 * terms stay `SEVERITY` / `FIXABLE` for API and URL compatibility.
 */
export function augmentWorkloadSearchFilterConfigForVmPrototypeV1CveTab(
    config: CompoundSearchFilterConfig
): CompoundSearchFilterConfig {
    return config.map(augmentImageCveEntity);
}
