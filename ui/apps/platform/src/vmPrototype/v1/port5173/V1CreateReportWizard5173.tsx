// @ts-nocheck — ported from local-ui-prototype-vite CreateReportWizard.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormik } from 'formik';
import isEmpty from 'lodash/isEmpty';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import {
    Alert,
    Button,
    Content,
    ContentVariants,
    DatePicker,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Divider,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Icon,
    InputGroup,
    InputGroupItem,
    Label,
    LabelGroup,
    MenuToggle,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalVariant,
    PageSection,
    Select,
    SelectList,
    SelectOption,
    TextArea,
    TextInput,
    TextInputGroup,
    TextInputGroupMain,
    TextInputGroupUtilities,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    ValidatedOptions,
    Wizard,
    WizardStep,
} from '@patternfly/react-core';
import { ArrowRightIcon, CaretDownIcon, TimesIcon } from '@patternfly/react-icons';
import { vulnerabilityConfigurationReportsPath } from 'routePaths';
import type { VmPrototypeScheduledReportPrefill } from 'vmPrototype/v1/scheduledReportPrefill';
import { VM_PROTOTYPE_SCHEDULED_REPORT_PREFILL_KEY } from 'vmPrototype/v1/scheduledReportPrefill';
import FormLabelGroup from 'Components/PatternFly/FormLabelGroup';
import DeliveryDestinationsForm from 'Containers/Vulnerabilities/VulnerablityReporting/forms/DeliveryDestinationsForm';
import {
    defaultReportFormValues,
    reportFormValidationSchema,
} from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import type { ReportFormValues } from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import { linkToWithVmPrototype } from 'vmPrototype/vmPrototypeSession';
import { map5173FormToReportFormValues } from './map5173FormToReportFormValues';
import { CLUSTERS, CVES, DEPLOYMENTS, NAMESPACES } from './createReportWizardMockData';
import { getCentralScopeSuggestions } from './workloadScopeWizardCentralQuery';
import { searchFilterToV1WizardPrefill } from './searchFilterToV1WizardPrefill';
import V1CreateReportWizard5173ReviewSections from './V1CreateReportWizard5173ReviewSections';
import {
    SAVED_FILTER_OPTIONS,
    IMAGE_TYPE_OPTIONS,
    AREA_OPTIONS,
    VULN_STATE_OPTIONS,
    CVE_DISCOVERED_OPTIONS,
    SEVERITY_OPTIONS,
    CVE_STATUS_OPTIONS,
} from './V1CreateReportWizard5173.reviewData';
import type { TemplatePreviewArgs } from 'Components/EmailTemplate/EmailTemplateModal';
import NotifierConfigurationView from 'Components/NotifierConfiguration/NotifierConfigurationView';
import EmailTemplatePreview from 'Containers/Vulnerabilities/VulnerablityReporting/components/EmailTemplatePreview';
import ScheduleDetails from 'Containers/Vulnerabilities/VulnerablityReporting/components/ScheduleDetails';
import { defaultEmailBody, getDefaultEmailSubject } from 'Containers/Vulnerabilities/VulnerablityReporting/forms/emailTemplateFormUtils';

const REVIEW_NOTIFIER_HEADING: 'h3' = 'h3';

const MOCK_COLLECTIONS_PROTOTYPE = [
    {
        id: 'col-1',
        name: 'All production workloads',
        description: 'All workloads deployed to production clusters',
        rules: [
            { entity: 'Cluster', field: 'Name', values: ['production-east', 'production-west'] },
        ],
    },
    {
        id: 'col-2',
        name: 'Staging and dev workloads',
        description: 'All workloads in non-production clusters',
        rules: [{ entity: 'Cluster', field: 'Name', values: ['staging-cluster', 'development'] }],
    },
    {
        id: 'col-3',
        name: 'Frontend services',
        description: 'Frontend deployments across all clusters',
        rules: [
            { entity: 'Namespace', field: 'Name', values: ['app-frontend'] },
            {
                entity: 'Deployment',
                field: 'Name',
                values: ['nginx-ingress', 'web-ui', 'api-gateway'],
            },
        ],
    },
    {
        id: 'col-4',
        name: 'Backend services',
        description: 'Backend and database deployments',
        rules: [{ entity: 'Namespace', field: 'Name', values: ['app-backend', 'database'] }],
    },
    {
        id: 'col-5',
        name: 'Critical infrastructure',
        description: 'Infrastructure-level services including monitoring and logging',
        rules: [
            {
                entity: 'Namespace',
                field: 'Name',
                values: ['kube-system', 'monitoring', 'logging'],
            },
        ],
    },
    {
        id: 'col-6',
        name: 'All namespaces in production-east',
        description: 'Every namespace in the production-east cluster',
        rules: [{ entity: 'Cluster', field: 'Name', values: ['production-east'] }],
    },
];

/** Multi-select filter toggle: plain label when empty; "Filter by …" + count when selections exist (VM toolbar pattern). */
function multiSelectFilterToggleLabel(filterFieldLabel, selectedCount) {
    if (!selectedCount) {
        return filterFieldLabel;
    }
    return `Filter by ${filterFieldLabel}`;
}

function getGeneralFilterChipValuesForAttribute(generalChips, entityLabel, attrLabel) {
    const prefix = `${entityLabel} ${attrLabel}: `;
    return generalChips
        .filter((c) => c.startsWith(prefix))
        .map((c) => stripSurroundingQuotes(c.slice(prefix.length).trim()));
}

function findGeneralChipIndexForAttrValue(generalChips, entityLabel, attrLabel, optionValue) {
    const norm = stripSurroundingQuotes(String(optionValue).trim());
    const prefix = `${entityLabel} ${attrLabel}: `;
    return generalChips.findIndex(
        (c) =>
            c.startsWith(prefix) &&
            stripSurroundingQuotes(c.slice(prefix.length).trim()) === norm
    );
}

/** Remove JSON-style wrapping quotes from URL / API filter values. */
function stripSurroundingQuotes(str) {
    if (typeof str !== 'string') {
        return str;
    }
    const t = str.trim();
    if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
        return t.slice(1, -1);
    }
    return str;
}

/**
 * Split "Image Name: docker.io/library/foo:latest" on the **first** colon only
 * (image refs contain colons; the old greedy `^.*?:` display logic truncated values).
 */
function parseGeneralFilterChip(chip) {
    const s = typeof chip === 'string' ? chip : String(chip?.text ?? chip ?? '');
    const idx = s.indexOf(':');
    if (idx === -1) {
        return { label: 'Filter', value: s };
    }
    return {
        label: s.slice(0, idx).trim(),
        value: s.slice(idx + 1).trim(),
    };
}

/** Sentence-case labels to match workload CVE filter / TextInputGroup styling. */
function filterChipCategoryLabel(label) {
    if (/^image name$/i.test(label)) {
        return 'Image name';
    }
    if (/^image label$/i.test(label)) {
        return 'Image label';
    }
    if (/^image operating system$/i.test(label)) {
        return 'Image operating system';
    }
    if (/^image registry$/i.test(label)) {
        return 'Image registry';
    }
    if (/^image tag$/i.test(label)) {
        return 'Image tag';
    }
    if (/^image component name$/i.test(label)) {
        return 'Image component name';
    }
    return label;
}

const REPORT_FILTER_ENTITIES = [
    {
        key: 'CVE',
        label: 'CVE',
        attributes: [
            { key: 'cvss', label: 'CVSS', inputType: 'condition-number' },
            { key: 'discoveredTime', label: 'Discovered time', inputType: 'date-picker' },
            { key: 'epss', label: 'EPSS probability', inputType: 'condition-text' },
            { key: 'name', label: 'Name', inputType: 'autocomplete' },
        ],
    },
    {
        key: 'Image',
        label: 'Image',
        attributes: [
            { key: 'label', label: 'Label', inputType: 'autocomplete' },
            { key: 'name', label: 'Name', inputType: 'autocomplete' },
            { key: 'os', label: 'Operating system', inputType: 'autocomplete' },
            { key: 'registry', label: 'Registry', inputType: 'autocomplete' },
            { key: 'tag', label: 'Tag', inputType: 'autocomplete' },
        ],
    },
    {
        key: 'ImageComponent',
        label: 'Image component',
        attributes: [
            {
                key: 'layerType',
                label: 'Layer type',
                inputType: 'select',
                options: ['Application', 'Base image'],
                multiSelect: true,
            },
            { key: 'name', label: 'Name', inputType: 'autocomplete' },
            {
                key: 'source',
                label: 'Source',
                inputType: 'select',
                options: [
                    'OS',
                    'Python',
                    'Java',
                    'Ruby',
                    'Node js',
                    'Go',
                    'Dotnet Core Runtime',
                    'Infrastructure',
                ],
                multiSelect: true,
            },
            { key: 'version', label: 'Version', inputType: 'autocomplete' },
        ],
    },
];

const EMAIL_NOTIFIERS = [
    { id: 'email-1', name: 'Security Team Email' },
    { id: 'email-2', name: 'DevOps Alerts' },
];

/** Aligns with {@link ReportFormWizard} step naming. */
const REPORT_WIZARD_DELIVERY_STEP_TITLE = 'Configure delivery destinations';
const REPORT_WIZARD_REVIEW_STEP_TITLE = 'Review';

const SCHEDULE_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const SCOPE_ENTITIES = [
    {
        key: 'Cluster',
        label: 'Cluster',
        attributes: ['ID', 'Label', 'Name', 'Platform type', 'Type'],
    },
    { key: 'Deployment', label: 'Deployment', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
    { key: 'Namespace', label: 'Namespace', attributes: ['Annotation', 'ID', 'Label', 'Name'] },
];

function savedFilterToChips(savedFilterId) {
    const opt = SAVED_FILTER_OPTIONS.find((o) => o.id === savedFilterId);
    if (!opt?.filters) {
        return [];
    }
    const { clusterName = [], namespaceName = [], deploymentName = [] } = opt.filters;
    const chips = [];
    clusterName.forEach((v) => chips.push({ id: `c-${v}`, text: `Cluster name: ${v}` }));
    namespaceName.forEach((v) => chips.push({ id: `n-${v}`, text: `Namespace name: ${v}` }));
    deploymentName.forEach((v) => chips.push({ id: `d-${v}`, text: `Deployment name: ${v}` }));
    return chips;
}

function groupChipsByCategory(chips) {
    const groups = {};
    chips.forEach((chip) => {
        const match = (typeof chip === 'string' ? chip : chip.text).match(/^(.+?):\s*(.+)$/);
        if (match) {
            const category = match[1].trim();
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(chip);
        } else {
            const cat = 'Other';
            if (!groups[cat]) {
                groups[cat] = [];
            }
            groups[cat].push(chip);
        }
    });
    return groups;
}

function collectUnique(arr) {
    return [...new Set(arr)].sort();
}

function getScopeSuggestions(entityKey, attribute, inputValue, centralScopePayload) {
    const fromCentral = getCentralScopeSuggestions(
        entityKey,
        attribute,
        inputValue,
        centralScopePayload
    );
    if (fromCentral !== null) {
        return fromCentral;
    }
    const q = (inputValue || '').toLowerCase();
    const filter = (items) => items.filter((i) => i.toLowerCase().includes(q));
    if (entityKey === 'Cluster') {
        if (attribute === 'Name') {
            return filter(CLUSTERS.map((c) => c.name));
        }
        if (attribute === 'ID') {
            return filter(CLUSTERS.map((c) => c.id));
        }
        if (attribute === 'Label') {
            return filter(
                collectUnique(
                    CLUSTERS.flatMap((c) =>
                        Object.entries(c.labels || {}).map(([k, v]) => `${k}=${v}`)
                    )
                )
            );
        }
        if (attribute === 'Platform type') {
            return filter(collectUnique(CLUSTERS.map((c) => c.provider || 'Kubernetes')));
        }
        if (attribute === 'Type') {
            return filter(collectUnique(CLUSTERS.map((c) => c.type || 'KUBERNETES_CLUSTER')));
        }
    }
    if (entityKey === 'Namespace') {
        if (attribute === 'Name') {
            return filter([...new Set(NAMESPACES.map((n) => n.metadata?.name || n.name))]);
        }
        if (attribute === 'ID') {
            return filter(NAMESPACES.map((n) => n.metadata?.id || n.id));
        }
        if (attribute === 'Annotation') {
            return filter([
                'kubernetes.io/metadata.name',
                'openshift.io/sa.scc.uid-range',
                'openshift.io/node-selector',
            ]);
        }
        if (attribute === 'Label') {
            return filter([
                'kubernetes.io/metadata.name',
                'pod-security.kubernetes.io/enforce=privileged',
                'security.openshift.io/scc.podSecurityLabelSync=true',
            ]);
        }
    }
    if (entityKey === 'Deployment') {
        if (attribute === 'Name') {
            return filter([...new Set(DEPLOYMENTS.map((d) => d.name))]);
        }
        if (attribute === 'ID') {
            return filter(DEPLOYMENTS.map((d) => d.id));
        }
        if (attribute === 'Annotation') {
            return filter(
                collectUnique(
                    DEPLOYMENTS.flatMap((d) =>
                        Object.entries(d.annotations || {}).map(([k, v]) => `${k}=${v}`)
                    )
                ).concat(['deployment.kubernetes.io/revision=1'])
            );
        }
        if (attribute === 'Label') {
            return filter(
                collectUnique(
                    DEPLOYMENTS.flatMap((d) =>
                        Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`)
                    )
                )
            );
        }
    }
    return [];
}

const REPORT_ATTR_TO_SCOPE_ATTR = {
    name: 'Name',
    id: 'ID',
    label: 'Label',
    annotation: 'Annotation',
    platformType: 'Platform type',
    type: 'Type',
};

function getReportFilterSuggestions(entityKey, attributeKey, inputValue, centralScopePayload) {
    const scopeAttr = REPORT_ATTR_TO_SCOPE_ATTR[attributeKey];
    if (
        scopeAttr &&
        (entityKey === 'Cluster' || entityKey === 'Namespace' || entityKey === 'Deployment')
    ) {
        const fromCentral = getCentralScopeSuggestions(
            entityKey,
            scopeAttr,
            inputValue,
            centralScopePayload
        );
        if (fromCentral !== null) {
            return fromCentral;
        }
    }
    const q = (inputValue || '').toLowerCase();
    const filter = (items) => items.filter((i) => i.toLowerCase().includes(q));
    if (entityKey === 'CVE') {
        if (attributeKey === 'name') {
            return filter(CVES.map((c) => c.cve).slice(0, 50));
        }
        if (attributeKey === 'severity') {
            return filter(['Critical', 'Important', 'Moderate', 'Low', 'Unknown']);
        }
        if (attributeKey === 'fixabilityStatus') {
            return filter(['Fixable', 'Not fixable']);
        }
    }
    if (entityKey === 'Image') {
        const imageFullNames = [
            'registry.redhat.io/rhacs-rhel8/main-rhel8:4.7.0',
            'registry.redhat.io/ubi9/python-312:latest',
            'registry.redhat.io/openshift4/ose-machine-config-operator:v4.16',
            'registry.redhat.io/openshift-service-mesh/proxyv2-rhel9:2.6.3',
            'docker.io/library/nginx:1.25-alpine',
            'docker.io/library/redis:7.2-bookworm',
            'docker.io/library/postgres:16.2-bullseye',
            'quay.io/stehesse/snow-mid-server:latest',
            'quay.io/openshift4/ose-kube-rbac-proxy:v0.14.0',
            'gcr.io/my-project/api-gateway:v2.3.1',
            'gcr.io/my-project/frontend-app:v1.8.0',
            'docker.io/library/node:20-slim',
            'registry.redhat.io/ubi9/ubi-minimal:9.4',
            'docker.io/prom/alertmanager:v0.27.0',
            'docker.io/grafana/grafana:10.4.1',
        ];
        if (attributeKey === 'name') {
            return filter(imageFullNames);
        }
        if (attributeKey === 'tag') {
            return filter([
                'latest',
                'v4.16',
                'v4.7.0',
                '2.6.3',
                '1.25-alpine',
                '7.2-bookworm',
                '16.2-bullseye',
                'v2.3.1',
                'v1.8.0',
                '20-slim',
                '9.4',
                'v0.27.0',
                '10.4.1',
                'v0.14.0',
                'v1.0.0',
            ]);
        }
        if (attributeKey === 'registry') {
            return filter(['registry.redhat.io', 'docker.io', 'quay.io', 'gcr.io', 'ghcr.io']);
        }
        if (attributeKey === 'os') {
            return filter(['linux', 'rhel', 'centos', 'ubuntu', 'alpine', 'debian']);
        }
        if (attributeKey === 'label') {
            return filter([
                'io.buildah.version=1.29.0',
                'architecture=x86_64',
                'vendor=Red Hat, Inc.',
                'com.redhat.component=ose-machine-config-operator-container',
                'maintainer=Red Hat',
            ]);
        }
    }
    if (entityKey === 'ImageComponent') {
        if (attributeKey === 'name') {
            return filter(
                collectUnique(
                    CVES.flatMap((c) => {
                        const s = c.distroTuples?.[0]?.summary?.trim();
                        return s ? [s.split(/\s+/)[0]] : [];
                    })
                )
            );
        }
        if (attributeKey === 'version') {
            return filter(['1.0', '2.0', '3.0', 'latest']);
        }
    }
    if (entityKey === 'Deployment') {
        if (attributeKey === 'name') {
            return filter(collectUnique(DEPLOYMENTS.map((d) => d.name)));
        }
        if (attributeKey === 'id') {
            return filter(DEPLOYMENTS.map((d) => d.id));
        }
        if (attributeKey === 'annotation') {
            return filter(
                collectUnique(
                    DEPLOYMENTS.flatMap((d) =>
                        Object.entries(d.annotations || {}).map(([k, v]) => `${k}=${v}`)
                    )
                ).concat(['deployment.kubernetes.io/revision=1'])
            );
        }
        if (attributeKey === 'label') {
            return filter(
                collectUnique(
                    DEPLOYMENTS.flatMap((d) =>
                        Object.entries(d.labels || {}).map(([k, v]) => `${k}=${v}`)
                    )
                )
            );
        }
    }
    if (entityKey === 'Namespace') {
        if (attributeKey === 'name') {
            return filter(collectUnique(NAMESPACES.map((n) => n.metadata?.name || n.name)));
        }
        if (attributeKey === 'id') {
            return filter(NAMESPACES.map((n) => n.metadata?.id || n.id));
        }
        if (attributeKey === 'annotation') {
            return filter(['kubernetes.io/metadata.name', 'openshift.io/sa.scc.uid-range']);
        }
        if (attributeKey === 'label') {
            return filter([
                'kubernetes.io/metadata.name',
                'pod-security.kubernetes.io/enforce=privileged',
            ]);
        }
    }
    if (entityKey === 'Cluster') {
        if (attributeKey === 'name') {
            return filter(CLUSTERS.map((c) => c.name));
        }
        if (attributeKey === 'id') {
            return filter(CLUSTERS.map((c) => c.id));
        }
        if (attributeKey === 'label') {
            return filter(
                collectUnique(
                    CLUSTERS.flatMap((c) =>
                        Object.entries(c.labels || {}).map(([k, v]) => `${k}=${v}`)
                    )
                )
            );
        }
        if (attributeKey === 'platformType') {
            return filter(collectUnique(CLUSTERS.map((c) => c.provider || 'Kubernetes')));
        }
        if (attributeKey === 'type') {
            return filter(collectUnique(CLUSTERS.map((c) => c.type || 'KUBERNETES_CLUSTER')));
        }
    }
    return [];
}

/** Resource scope row only (entity / attribute / value / apply) — matches results-page scope controls. */
function WorkloadScopeFiltersToolbar({ onAddChip, centralScopePayload }) {
    const [entityOpen, setEntityOpen] = useState(false);
    const [attrOpen, setAttrOpen] = useState(false);
    const [entityKey, setEntityKey] = useState('Deployment');
    const [attribute, setAttribute] = useState('Name');
    const [search, setSearch] = useState('');
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const inputWrapperRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});

    const entity = SCOPE_ENTITIES.find((e) => e.key === entityKey) || SCOPE_ENTITIES[0];

    const suggestions = useMemo(
        () => getScopeSuggestions(entityKey, attribute, search, centralScopePayload).slice(0, 15),
        [entityKey, attribute, search, centralScopePayload]
    );

    const updateDropdownPosition = useCallback(() => {
        if (inputWrapperRef.current) {
            const rect = inputWrapperRef.current.getBoundingClientRect();
            setDropdownStyle({
                position: 'fixed',
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
                background: 'var(--pf-t--global--background--color--primary--default, #fff)',
                border: '1px solid var(--pf-t--global--border--color--default)',
                borderRadius: 4,
                boxShadow: '0 4px 8px rgba(0,0,0,.12)',
                maxHeight: 250,
                overflowY: 'auto',
            });
        }
    }, []);

    useEffect(() => {
        if (suggestionsOpen) {
            updateDropdownPosition();
        }
    }, [suggestionsOpen, search, updateDropdownPosition]);

    const applyValue = (val) => {
        if (!val) {
            return;
        }
        onAddChip(`${entity.label} ${attribute.toLowerCase()}: ${val}`);
        setSearch('');
        setSuggestionsOpen(false);
    };

    const applySearch = () => {
        const q = search.trim();
        if (q) {
            applyValue(q);
        }
    };

    const toggleTight = { borderRadius: 0 };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, flexWrap: 'wrap' }}>
                <Select
                    isOpen={entityOpen}
                    onOpenChange={setEntityOpen}
                    selected={entity.key}
                    onSelect={(_e, val) => {
                        const next = SCOPE_ENTITIES.find((e) => e.key === val);
                        if (next) {
                            setEntityKey(next.key);
                            if (!next.attributes.includes(attribute)) {
                                setAttribute(next.attributes[0]);
                            }
                        }
                        setEntityOpen(false);
                        setSearch('');
                        setSuggestionsOpen(false);
                    }}
                    toggle={(ref) => (
                        <MenuToggle
                            ref={ref}
                            onClick={() => setEntityOpen(!entityOpen)}
                            isExpanded={entityOpen}
                            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                        >
                            {entity.label}
                        </MenuToggle>
                    )}
                >
                    <SelectList>
                        {SCOPE_ENTITIES.map((e) => (
                            <SelectOption key={e.key} value={e.key}>
                                {e.label}
                            </SelectOption>
                        ))}
                    </SelectList>
                </Select>
                <Select
                    isOpen={attrOpen}
                    onOpenChange={setAttrOpen}
                    selected={attribute}
                    onSelect={(_e, val) => {
                        setAttribute(val);
                        setAttrOpen(false);
                        setSearch('');
                        setSuggestionsOpen(false);
                    }}
                    toggle={(ref) => (
                        <MenuToggle
                            ref={ref}
                            onClick={() => setAttrOpen(!attrOpen)}
                            isExpanded={attrOpen}
                            style={toggleTight}
                        >
                            {attribute}
                        </MenuToggle>
                    )}
                >
                    <SelectList>
                        {entity.attributes.map((a) => (
                            <SelectOption key={a} value={a}>
                                {a}
                            </SelectOption>
                        ))}
                    </SelectList>
                </Select>
                <div
                    ref={inputWrapperRef}
                    style={{ flex: '1 1 180px', display: 'flex', minWidth: 0 }}
                >
                    <TextInputGroup style={{ borderRadius: 0, flex: 1 }}>
                        <TextInputGroupMain
                            value={search}
                            onChange={(_e, v) => {
                                setSearch(v);
                                setSuggestionsOpen(true);
                            }}
                            onFocus={() => setSuggestionsOpen(true)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applySearch();
                                }
                            }}
                            placeholder="Filter by value"
                            aria-label="Resource scope search"
                            autoComplete="off"
                        />
                        <TextInputGroupUtilities>
                            {search && (
                                <Button
                                    variant="plain"
                                    onClick={() => {
                                        setSearch('');
                                        setSuggestionsOpen(false);
                                    }}
                                    aria-label="Clear"
                                >
                                    <TimesIcon />
                                </Button>
                            )}
                            <Button
                                variant="plain"
                                onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                                aria-label="Toggle suggestions"
                            >
                                <CaretDownIcon
                                    style={{
                                        transform: suggestionsOpen
                                            ? 'rotate(180deg)'
                                            : 'rotate(0deg)',
                                        transition: 'transform 0.2s',
                                    }}
                                />
                            </Button>
                        </TextInputGroupUtilities>
                    </TextInputGroup>
                    <Button
                        type="button"
                        variant="control"
                        aria-label="Apply resource scope filter"
                        onClick={applySearch}
                        icon={
                            <Icon shouldMirrorRTL>
                                <ArrowRightIcon />
                            </Icon>
                        }
                    />
                </div>
            </div>
            {suggestionsOpen && suggestions.length > 0 && (
                <div style={dropdownStyle}>
                    {suggestions.map((s, i) => (
                        <div
                            key={i}
                            role="option"
                            tabIndex={0}
                            style={{ padding: '8px 12px', cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    'var(--pf-t--global--background--color--primary--hover, #f0f0f0)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                            onClick={() => applyValue(s)}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function cveStatusOptionsForSeverities(selectedSeverities) {
    if (!selectedSeverities?.length) {
        return CVE_STATUS_OPTIONS;
    }
    const onlyUnknown =
        selectedSeverities.length > 0 && selectedSeverities.every((s) => s === 'unknown');
    if (onlyUnknown) {
        return CVE_STATUS_OPTIONS.filter((o) => o.value === 'not-fixable');
    }
    return CVE_STATUS_OPTIONS;
}

function ResourcesStep({
    formValues,
    updateFormValue,
    centralScopePayload,
    centralWorkloadScopeLoading,
    centralWorkloadScopeError,
}) {
    const scopeChips = formValues.scopeChips || [];
    const totalCount = scopeChips.length;
    const addChip = (chip) => {
        updateFormValue('scopeChips', [...scopeChips, chip]);
    };
    const clearAll = () => {
        updateFormValue('scopeChips', []);
    };

    return (
        <>
            <div style={{ borderBottom: '1px solid var(--pf-t--global--border--color--default)' }}>
                <Flex direction={{ default: 'column' }} style={{ padding: '16px 24px' }}>
                    <FlexItem>
                        <Title headingLevel="h2">Configure resources</Title>
                    </FlexItem>
                    <FlexItem>
                        <Content
                            component={ContentVariants.p}
                            style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                        >
                            Select filters to define the scope of the report
                        </Content>
                    </FlexItem>
                </Flex>
            </div>
            <Divider />
            <Form style={{ padding: '24px' }}>
                <FormGroup fieldId="resource-scope-toolbar" label="Resource scope" isRequired>
                    {centralWorkloadScopeLoading && (
                        <FormHelperText className="pf-v6-u-mb-sm">
                            <HelperText>
                                <HelperTextItem>
                                    Loading resource scope values from Central…
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    )}
                    {centralWorkloadScopeError && !centralWorkloadScopeLoading && (
                        <Alert
                            className="pf-v6-u-mb-sm"
                            variant="warning"
                            isInline
                            title="Could not load live resource scope suggestions"
                        >
                            {centralWorkloadScopeError.message ||
                                'Using sample suggestions until Central data is available.'}
                        </Alert>
                    )}
                    <WorkloadScopeFiltersToolbar
                        onAddChip={addChip}
                        centralScopePayload={centralScopePayload}
                    />
                    {totalCount > 0 &&
                        (() => {
                            const allItems = scopeChips.map((chip, idx) => ({
                                key: `c-${idx}`,
                                text: chip,
                                source: 'custom',
                                idx,
                            }));
                            const grouped = groupChipsByCategory(allItems);
                            const removeItem = (item) => {
                                updateFormValue(
                                    'scopeChips',
                                    formValues.scopeChips.filter((_, i) => i !== item.idx)
                                );
                            };
                            const removeCategory = (category) => {
                                const items = grouped[category];
                                const removedIdxs = new Set(items.map((i) => i.idx));
                                updateFormValue(
                                    'scopeChips',
                                    (formValues.scopeChips || []).filter(
                                        (_, i) => !removedIdxs.has(i)
                                    )
                                );
                            };
                            return (
                                <Flex
                                    gap={{ default: 'gapSm' }}
                                    flexWrap={{ default: 'wrap' }}
                                    alignItems={{ default: 'alignItemsCenter' }}
                                    style={{ marginTop: 12 }}
                                >
                                    <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                                        {Object.entries(grouped).map(([category, items]) => (
                                            <LabelGroup
                                                key={category}
                                                categoryName={category}
                                                isClosable
                                                onClose={() => removeCategory(category)}
                                                numLabels={10}
                                            >
                                                {items.map((item) => (
                                                    <Label
                                                        key={item.key}
                                                        onClose={() => removeItem(item)}
                                                    >
                                                        {item.text.replace(/^.+?:\s*/, '')}
                                                    </Label>
                                                ))}
                                            </LabelGroup>
                                        ))}
                                    </Flex>
                                    <FlexItem>
                                        <Content component={ContentVariants.small}>
                                            {totalCount} filters applied
                                        </Content>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="link" isInline onClick={clearAll}>
                                            Clear filters
                                        </Button>
                                    </FlexItem>
                                </Flex>
                            );
                        })()}
                </FormGroup>

                <Divider style={{ marginTop: 8, marginBottom: 16 }} />
            </Form>
        </>
    );
}

function ReportCompoundFilter({
    generalChips,
    onAddGeneralChip,
    onRemoveGeneralChip,
    hasClearableCveFilters,
    /** Clears only compound CVE filter chips (`generalFilterChips`), not Severity/Fixability/Image type fields above. */
    onClearAllCveFilters,
    centralScopePayload,
}) {
    /** Lets the value column absorb width so InputGroup + apply control stay contiguous (toolbar defaults to baseline align). */
    const toolbarValueFlexClass = 'pf-v6-u-flex-grow-1 pf-v6-u-flex-basis-0 pf-v6-u-min-width-0';

    const [entityOpen, setEntityOpen] = useState(false);
    const [attrOpen, setAttrOpen] = useState(false);
    const [selectedEntityKey, setSelectedEntityKey] = useState(REPORT_FILTER_ENTITIES[0].key);
    const [selectedAttribute, setSelectedAttribute] = useState(
        REPORT_FILTER_ENTITIES[0].attributes[0]
    );
    const [inputValue, setInputValue] = useState('');
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [conditionOp, setConditionOp] = useState('>');
    const [conditionOpen, setConditionOpen] = useState(false);
    const [acOpen, setAcOpen] = useState(false);
    const acWrapperRef = useRef(null);
    const [acStyle, setAcStyle] = useState({});

    const selectedEntityRecord = useMemo(
        () => REPORT_FILTER_ENTITIES.find((e) => e.key === selectedEntityKey) ?? null,
        [selectedEntityKey]
    );

    const attr = selectedAttribute;

    const entityMenuToggleLabel = selectedEntityRecord?.label ?? 'CVE';

    const acSuggestions = useMemo(() => {
        if (!selectedEntityRecord) {
            return [];
        }
        if (attr.inputType !== 'autocomplete') {
            return [];
        }
        return getReportFilterSuggestions(
            selectedEntityRecord.key,
            attr.key,
            inputValue,
            centralScopePayload
        ).slice(0, 15);
    }, [selectedEntityRecord, attr.key, attr.inputType, inputValue, centralScopePayload]);

    /** Group chips by category (text before first `:`) so image refs with `:` display intact. */
    const generalChipsGrouped = useMemo(() => {
        const orderedKeys = [];
        const groupsMap = new Map();
        generalChips.forEach((chip, chipIdx) => {
            const s = typeof chip === 'string' ? chip : String(chip?.text ?? chip ?? '');
            const colonIdx = s.indexOf(':');
            if (colonIdx === -1) {
                const rowKey = `__nocolon_${chipIdx}`;
                orderedKeys.push(rowKey);
                groupsMap.set(rowKey, {
                    categoryLabel: null,
                    items: [{ chipIdx, displayValue: stripSurroundingQuotes(s.trim()) }],
                });
                return;
            }
            const categoryLabel = s.slice(0, colonIdx).trim();
            const displayValue = stripSurroundingQuotes(s.slice(colonIdx + 1).trim());
            if (!groupsMap.has(categoryLabel)) {
                orderedKeys.push(categoryLabel);
                groupsMap.set(categoryLabel, { categoryLabel, items: [] });
            }
            groupsMap.get(categoryLabel).items.push({ chipIdx, displayValue });
        });
        return orderedKeys.map((k) => ({ key: k, ...groupsMap.get(k) }));
    }, [generalChips]);

    const updateAcPosition = useCallback(() => {
        if (acWrapperRef.current) {
            const rect = acWrapperRef.current.getBoundingClientRect();
            setAcStyle({
                position: 'fixed',
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
                zIndex: 9999,
                background: 'var(--pf-t--global--background--color--primary--default, #fff)',
                border: '1px solid var(--pf-t--global--border--color--default)',
                borderRadius: 4,
                boxShadow: '0 4px 8px rgba(0,0,0,.12)',
                maxHeight: 250,
                overflowY: 'auto',
            });
        }
    }, []);

    useEffect(() => {
        if (acOpen) {
            updateAcPosition();
        }
    }, [acOpen, inputValue, updateAcPosition]);

    function handleApply(value) {
        if (!value || !selectedEntityRecord) {
            return;
        }
        const normalizedValue = stripSurroundingQuotes(String(value).trim());
        const chipText =
            attr.inputType === 'condition-number' || attr.inputType === 'condition-text'
                ? `${selectedEntityRecord.label} ${attr.label} ${normalizedValue}`
                : `${selectedEntityRecord.label} ${attr.label}: ${normalizedValue}`;
        onAddGeneralChip(chipText);
        setInputValue('');
        setSuggestionsOpen(false);
    }

    function renderValueInput() {
        if (!selectedEntityRecord) {
            return null;
        }
        if (attr.inputType === 'date-picker') {
            return (
                <ToolbarItem className={toolbarValueFlexClass}>
                    <InputGroup className="pf-v6-u-w-100">
                        <InputGroupItem isFill>
                            <TextInputGroup>
                                <TextInputGroupMain
                                    value={inputValue}
                                    onChange={(_e, v) => setInputValue(v)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && inputValue.trim()) {
                                            handleApply(inputValue.trim());
                                        }
                                    }}
                                    placeholder="MM/DD/YYYY"
                                    type="date"
                                    aria-label={`${attr.label} value`}
                                />
                                {inputValue && (
                                    <TextInputGroupUtilities>
                                        <Button
                                            variant="plain"
                                            onClick={() => setInputValue('')}
                                            aria-label="Clear"
                                        >
                                            <TimesIcon />
                                        </Button>
                                    </TextInputGroupUtilities>
                                )}
                            </TextInputGroup>
                        </InputGroupItem>
                        <InputGroupItem>
                            <Button
                                type="button"
                                variant="control"
                                aria-label="Apply"
                                onClick={() => {
                                    if (inputValue.trim()) {
                                        handleApply(inputValue.trim());
                                    }
                                }}
                                icon={
                                    <Icon shouldMirrorRTL>
                                        <ArrowRightIcon />
                                    </Icon>
                                }
                            />
                        </InputGroupItem>
                    </InputGroup>
                </ToolbarItem>
            );
        }
        if (attr.inputType === 'select' && attr.options) {
            const selectedForAttr = getGeneralFilterChipValuesForAttribute(
                generalChips,
                selectedEntityRecord.label,
                attr.label
            );
            const toggleCount = selectedForAttr.length;
            const togglePrimary = multiSelectFilterToggleLabel(attr.label, toggleCount);

            function toggleOptionChip(optionValue) {
                const norm = stripSurroundingQuotes(String(optionValue).trim());
                const chip = `${selectedEntityRecord.label} ${attr.label}: ${norm}`;
                const idx = findGeneralChipIndexForAttrValue(
                    generalChips,
                    selectedEntityRecord.label,
                    attr.label,
                    norm
                );
                if (idx >= 0) {
                    onRemoveGeneralChip(idx);
                } else {
                    onAddGeneralChip(chip);
                }
            }

            if (attr.multiSelect) {
                return (
                    <ToolbarItem className={toolbarValueFlexClass}>
                        <Select
                            isOpen={suggestionsOpen}
                            onOpenChange={setSuggestionsOpen}
                            toggle={(ref) => (
                                <MenuToggle
                                    ref={ref}
                                    onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                                    isExpanded={suggestionsOpen}
                                    className="pf-v6-u-w-100"
                                >
                                    <Flex
                                        alignItems={{ default: 'alignItemsCenter' }}
                                        flexWrap={{ default: 'nowrap' }}
                                        gap={{ default: 'gapSm' }}
                                    >
                                        <span>{togglePrimary}</span>
                                        {toggleCount > 0 && (
                                            <Label isCompact color="grey">
                                                {toggleCount}
                                            </Label>
                                        )}
                                    </Flex>
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                {attr.options.map((o) => (
                                    <SelectOption
                                        key={o}
                                        value={o}
                                        hasCheckbox
                                        isSelected={selectedForAttr.includes(o)}
                                        onClick={() => toggleOptionChip(o)}
                                    >
                                        {o}
                                    </SelectOption>
                                ))}
                            </SelectList>
                        </Select>
                    </ToolbarItem>
                );
            }

            return (
                <ToolbarItem className={toolbarValueFlexClass}>
                    <Select
                        isOpen={suggestionsOpen}
                        onOpenChange={setSuggestionsOpen}
                        onSelect={(_e, val) => {
                            const prefix = `${selectedEntityRecord.label} ${attr.label}: `;
                            const norm = stripSurroundingQuotes(String(val).trim());
                            const chip = `${selectedEntityRecord.label} ${attr.label}: ${norm}`;
                            const idxsToRemove = generalChips
                                .map((c, i) => (c.startsWith(prefix) ? i : -1))
                                .filter((i) => i >= 0)
                                .sort((a, b) => b - a);
                            idxsToRemove.forEach((i) => onRemoveGeneralChip(i));
                            onAddGeneralChip(chip);
                            setSuggestionsOpen(false);
                        }}
                        toggle={(ref) => (
                            <MenuToggle
                                ref={ref}
                                onClick={() => setSuggestionsOpen(!suggestionsOpen)}
                                isExpanded={suggestionsOpen}
                                className="pf-v6-u-w-100"
                            >
                                <Flex
                                    alignItems={{ default: 'alignItemsCenter' }}
                                    flexWrap={{ default: 'nowrap' }}
                                    gap={{ default: 'gapSm' }}
                                >
                                    <span>{togglePrimary}</span>
                                    {toggleCount > 0 && (
                                        <Label isCompact color="grey">
                                            {toggleCount}
                                        </Label>
                                    )}
                                </Flex>
                            </MenuToggle>
                        )}
                    >
                        <SelectList>
                            {attr.options.map((o) => (
                                <SelectOption key={o} value={o}>
                                    {o}
                                </SelectOption>
                            ))}
                        </SelectList>
                    </Select>
                </ToolbarItem>
            );
        }
        if (attr.inputType === 'condition-number' || attr.inputType === 'condition-text') {
            const ops = [
                { value: '>', label: 'Is greater than' },
                { value: '>=', label: 'Is greater than or equal to' },
                { value: '<=', label: 'Is less than or equal to' },
                { value: '<', label: 'Is less than' },
            ];
            return (
                <>
                    <ToolbarItem>
                        <Select
                            isOpen={conditionOpen}
                            onOpenChange={setConditionOpen}
                            selected={conditionOp}
                            onSelect={(_e, val) => {
                                setConditionOp(val);
                                setConditionOpen(false);
                            }}
                            toggle={(ref) => (
                                <MenuToggle
                                    ref={ref}
                                    onClick={() => setConditionOpen(!conditionOpen)}
                                    isExpanded={conditionOpen}
                                    className="pf-v6-u-flex-shrink-0"
                                >
                                    {ops.find((o) => o.value === conditionOp)?.label}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                {ops.map((o) => (
                                    <SelectOption key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectOption>
                                ))}
                            </SelectList>
                        </Select>
                    </ToolbarItem>
                    <ToolbarItem className={toolbarValueFlexClass}>
                        <InputGroup className="pf-v6-u-w-100">
                            <InputGroupItem isFill>
                                <TextInputGroup>
                                    <TextInputGroupMain
                                        value={inputValue}
                                        onChange={(_e, v) => setInputValue(v)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && inputValue.trim()) {
                                                handleApply(`${conditionOp}${inputValue.trim()}`);
                                            }
                                        }}
                                        placeholder={
                                            attr.inputType === 'condition-text' ? '0%' : '0'
                                        }
                                        type="text"
                                        aria-label={`${attr.label} value`}
                                    />
                                    {inputValue && (
                                        <TextInputGroupUtilities>
                                            <Button
                                                variant="plain"
                                                onClick={() => setInputValue('')}
                                                aria-label="Clear"
                                            >
                                                <TimesIcon />
                                            </Button>
                                        </TextInputGroupUtilities>
                                    )}
                                </TextInputGroup>
                            </InputGroupItem>
                            <InputGroupItem>
                                <Button
                                    type="button"
                                    variant="control"
                                    aria-label="Apply"
                                    onClick={() => {
                                        if (inputValue.trim()) {
                                            handleApply(`${conditionOp}${inputValue.trim()}`);
                                        }
                                    }}
                                    icon={
                                        <Icon shouldMirrorRTL>
                                            <ArrowRightIcon />
                                        </Icon>
                                    }
                                />
                            </InputGroupItem>
                        </InputGroup>
                    </ToolbarItem>
                </>
            );
        }
        return (
            <ToolbarItem className={toolbarValueFlexClass}>
                <InputGroup className="pf-v6-u-w-100">
                    <InputGroupItem isFill>
                        <div ref={acWrapperRef} style={{ position: 'relative', width: '100%' }}>
                            <TextInputGroup>
                                <TextInputGroupMain
                                    value={inputValue}
                                    onChange={(_e, v) => {
                                        setInputValue(v);
                                        setAcOpen(true);
                                    }}
                                    onFocus={() => setAcOpen(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && inputValue.trim()) {
                                            handleApply(inputValue.trim());
                                            setAcOpen(false);
                                        }
                                    }}
                                    placeholder={`Find results by ${attr.label.toLowerCase()}`}
                                    autoComplete="off"
                                    aria-label="Filter input"
                                />
                                <TextInputGroupUtilities>
                                    {inputValue && (
                                        <Button
                                            variant="plain"
                                            onClick={() => {
                                                setInputValue('');
                                                setAcOpen(false);
                                            }}
                                            aria-label="Clear"
                                        >
                                            <TimesIcon />
                                        </Button>
                                    )}
                                    <Button
                                        variant="plain"
                                        onClick={() => setAcOpen(!acOpen)}
                                        aria-label="Toggle suggestions"
                                    >
                                        <CaretDownIcon
                                            style={{
                                                transform: acOpen
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)',
                                                transition: 'transform 0.2s',
                                            }}
                                        />
                                    </Button>
                                </TextInputGroupUtilities>
                            </TextInputGroup>
                        </div>
                    </InputGroupItem>
                    <InputGroupItem>
                        <Button
                            type="button"
                            variant="control"
                            aria-label="Apply filter"
                            onClick={() => {
                                if (inputValue.trim()) {
                                    handleApply(inputValue.trim());
                                    setAcOpen(false);
                                }
                            }}
                            icon={
                                <Icon shouldMirrorRTL>
                                    <ArrowRightIcon />
                                </Icon>
                            }
                        />
                    </InputGroupItem>
                </InputGroup>
            </ToolbarItem>
        );
    }

    return (
        <div>
            <Toolbar style={{ padding: 0 }}>
                <ToolbarContent>
                    <ToolbarGroup
                        variant="filter-group"
                        alignItems="stretch"
                        className="pf-v6-u-flex-grow-1"
                    >
                        <ToolbarItem>
                            <Select
                                isOpen={entityOpen}
                                onOpenChange={setEntityOpen}
                                selected={selectedEntityKey}
                                onSelect={(_e, val) => {
                                    const v = String(val);
                                    const ent = REPORT_FILTER_ENTITIES.find((e) => e.key === v);
                                    if (ent) {
                                        setSelectedEntityKey(ent.key);
                                        setSelectedAttribute(ent.attributes[0]);
                                        setEntityOpen(false);
                                        setInputValue('');
                                        setAcOpen(false);
                                        setAttrOpen(false);
                                    }
                                }}
                                toggle={(ref) => (
                                    <MenuToggle
                                        ref={ref}
                                        onClick={() => setEntityOpen(!entityOpen)}
                                        isExpanded={entityOpen}
                                        className="pf-v6-u-flex-shrink-0"
                                    >
                                        {entityMenuToggleLabel}
                                    </MenuToggle>
                                )}
                            >
                                <SelectList>
                                    {REPORT_FILTER_ENTITIES.map((e) => (
                                        <SelectOption
                                            key={e.key}
                                            value={e.key}
                                            isSelected={e.key === selectedEntityKey}
                                        >
                                            {e.label}
                                        </SelectOption>
                                    ))}
                                </SelectList>
                            </Select>
                        </ToolbarItem>
                        {selectedEntityRecord && (
                            <ToolbarItem>
                                <Select
                                    isOpen={attrOpen}
                                    onOpenChange={setAttrOpen}
                                    selected={attr.key}
                                    onSelect={(_e, val) => {
                                        const next = selectedEntityRecord.attributes.find(
                                            (a) => a.key === val
                                        );
                                        setSelectedAttribute(
                                            next ?? selectedEntityRecord.attributes[0]
                                        );
                                        setAttrOpen(false);
                                        setInputValue('');
                                        setAcOpen(false);
                                    }}
                                    toggle={(ref) => (
                                        <MenuToggle
                                            ref={ref}
                                            onClick={() => setAttrOpen(!attrOpen)}
                                            isExpanded={attrOpen}
                                            className="pf-v6-u-flex-shrink-0"
                                        >
                                            {attr.label}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        {selectedEntityRecord.attributes.map((a) => (
                                            <SelectOption
                                                key={a.key}
                                                value={a.key}
                                                isSelected={a.key === attr.key}
                                            >
                                                {a.label}
                                            </SelectOption>
                                        ))}
                                    </SelectList>
                                </Select>
                            </ToolbarItem>
                        )}
                        {renderValueInput()}
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
            {acOpen && acSuggestions.length > 0 && (
                <div style={acStyle}>
                    {acSuggestions.map((s, i) => (
                        <div
                            key={i}
                            role="option"
                            tabIndex={0}
                            style={{ padding: '8px 12px', cursor: 'pointer' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    'var(--pf-t--global--background--color--primary--hover, #f0f0f0)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                            onClick={() => {
                                handleApply(s);
                                setAcOpen(false);
                            }}
                        >
                            {s}
                        </div>
                    ))}
                </div>
            )}
            {generalChips.length > 0 && (
                <Flex
                    direction={{ default: 'column' }}
                    gap={{ default: 'gapMd' }}
                    style={{ marginTop: 12 }}
                >
                    {generalChipsGrouped.map(({ key, categoryLabel, items }) => (
                        <Flex
                            key={key}
                            flexWrap={{ default: 'wrap' }}
                            gap={{ default: 'gapSm' }}
                            alignItems={{ default: 'alignItemsCenter' }}
                        >
                            {categoryLabel && (
                                <FlexItem>
                                    <span className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold">
                                        {filterChipCategoryLabel(categoryLabel)}
                                    </span>
                                </FlexItem>
                            )}
                            {items.map(({ chipIdx, displayValue }) => (
                                <FlexItem key={`g-chip-${chipIdx}`}>
                                    <Label
                                        variant="outline"
                                        color="grey"
                                        onClose={() => onRemoveGeneralChip(chipIdx)}
                                        closeBtnAriaLabel={`Remove ${displayValue}`}
                                    >
                                        {displayValue}
                                    </Label>
                                </FlexItem>
                            ))}
                        </Flex>
                    ))}
                </Flex>
            )}
            {onClearAllCveFilters && hasClearableCveFilters && (
                <Flex className="pf-v6-u-mt-sm" alignItems={{ default: 'alignItemsCenter' }}>
                    <FlexItem>
                        <Button variant="link" isInline onClick={() => onClearAllCveFilters()}>
                            Clear filters
                        </Button>
                    </FlexItem>
                </Flex>
            )}
        </div>
    );
}

export default function V1CreateReportWizard5173({
    centralCollections = [],
    centralWorkloadScope = null,
    centralWorkloadScopeLoading = false,
    centralWorkloadScopeError = null,
    emailNotifier = null,
    navigationSearch = '',
    /** Workload compound config (CVE-tab style) to map scheduled-report navigation prefill into the wizard. */
    workloadCompoundConfigForPrefill = null,
    onPersistReportFormValues,
    isPersisting,
    persistError,
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const collectionsCatalog =
        centralCollections.length > 0 ? centralCollections : MOCK_COLLECTIONS_PROTOTYPE;

    const notifierOptions = emailNotifier
        ? [{ id: emailNotifier.id, name: emailNotifier.name }]
        : EMAIL_NOTIFIERS;
    const vmScheduledPrefill = location.state?.[VM_PROTOTYPE_SCHEDULED_REPORT_PREFILL_KEY] as
        | VmPrototypeScheduledReportPrefill
        | undefined;
    const incomingFilters = location.state?.filters;
    const incomingSavedFilterName =
        vmScheduledPrefill?.savedFilterName ?? location.state?.savedFilterName;
    const incomingFiltersModified =
        vmScheduledPrefill?.filtersModified ?? location.state?.filtersModified;
    const editReport = location.state?.editReport;
    const isEditMode = Boolean(editReport);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [saveMapError, setSaveMapError] = useState('');

    const [formValues, setFormValues] = useState(() => {
        const defaults = {
            name: '',
            description: '',
            scopeMethod: 'custom-filters',
            selectedCollection: null,
            selectedSavedFilter: null,
            selectedImageTypes: ['deployed', 'watched'],
            areaOfConcern: 'user-workloads',
            vulnerabilityState: 'observed',
            selectedSeverities: ['critical', 'important'],
            selectedCveStatus: ['fixable'],
            cveDiscoveredSince: 'all',
            cveDiscoveredCustomDate: '',
            filterSearchValue: '',
            scopeChips: [],
            scopeExtraChips: [],
            removedBaseChipIds: [],
            generalFilterChips: [],
            selectedNotifiers: [],
            scheduleType: 'weekly',
            scheduleDay: 'monday',
            scheduleTime: '08:00',
        };

        if (editReport) {
            defaults.name = editReport.name || '';
            defaults.description = editReport.description || '';
            defaults.scopeMethod = 'custom-filters';
            defaults.selectedCollection = null;
            defaults.selectedSavedFilter = null;
            if (editReport.cveSeverities?.length) {
                defaults.selectedSeverities = editReport.cveSeverities.map((s) => s.toLowerCase());
            }
            if (editReport.cveStatus) {
                if (editReport.cveStatus.toLowerCase().includes('not fixable')) {
                    defaults.selectedCveStatus = ['fixable', 'not-fixable'];
                } else if (editReport.cveStatus.toLowerCase().includes('fixable')) {
                    defaults.selectedCveStatus = ['fixable'];
                }
            }
            if (editReport.imageType?.length) {
                defaults.selectedImageTypes = editReport.imageType.map((t) =>
                    t.toLowerCase().includes('watched') ? 'watched' : 'deployed'
                );
            }
            if (editReport.schedule) {
                const sched = editReport.schedule.toLowerCase();
                if (sched.includes('daily')) {
                    defaults.scheduleType = 'daily';
                } else if (sched.includes('monthly')) {
                    defaults.scheduleType = 'monthly';
                } else {
                    defaults.scheduleType = 'weekly';
                }
            }
            if (editReport.deliveryEmail) {
                defaults.selectedNotifiers = ['email-1'];
            }
            return defaults;
        }

        if (vmScheduledPrefill?.searchFilterForForm && workloadCompoundConfigForPrefill?.length) {
            const patch = searchFilterToV1WizardPrefill(
                vmScheduledPrefill.searchFilterForForm,
                workloadCompoundConfigForPrefill
            );
            const hasAnyPrefill =
                patch.scopeChips.length > 0 ||
                patch.generalFilterChips.length > 0 ||
                patch.selectedSeverities.length > 0 ||
                patch.selectedCveStatus.length > 0;

            if (hasAnyPrefill) {
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                });
                const timeStr = now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                });
                defaults.name = `Vulnerability Report - ${dateStr} ${timeStr}`;
                defaults.scopeMethod = 'custom-filters';
                defaults.selectedSavedFilter = null;
                defaults.selectedCollection = null;
                if (patch.scopeChips.length) {
                    defaults.scopeChips = patch.scopeChips;
                }
                if (patch.generalFilterChips.length) {
                    defaults.generalFilterChips = patch.generalFilterChips;
                }
                if (patch.selectedSeverities.length) {
                    defaults.selectedSeverities = patch.selectedSeverities;
                }
                if (patch.selectedCveStatus.length) {
                    defaults.selectedCveStatus = patch.selectedCveStatus;
                }
                return defaults;
            }
        }

        if (!incomingFilters) {
            return defaults;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        defaults.name = `Vulnerability Report - ${dateStr} ${timeStr}`;

        const inCluster = [...(incomingFilters.clusterName || [])].sort();
        const inNamespace = [...(incomingFilters.namespaceName || [])].sort();
        const inDeployment = [...(incomingFilters.deploymentName || [])].sort();
        const hasResourceFilters = inCluster.length || inNamespace.length || inDeployment.length;

        if (incomingFiltersModified) {
            defaults.scopeMethod = 'custom-filters';
            defaults.selectedCollection = null;
            defaults.selectedSavedFilter = null;
            const chips = [];
            (incomingFilters.clusterName || []).forEach((v) => chips.push(`Cluster name: ${v}`));
            (incomingFilters.namespaceName || []).forEach((v) =>
                chips.push(`Namespace name: ${v}`)
            );
            (incomingFilters.deploymentName || []).forEach((v) =>
                chips.push(`Deployment name: ${v}`)
            );
            defaults.scopeChips = chips;
        } else if (hasResourceFilters) {
            const arrEq = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
            let matchedSavedFilter = null;

            if (incomingSavedFilterName) {
                const byName = SAVED_FILTER_OPTIONS.find((f) => f.name === incomingSavedFilterName);
                if (byName?.filters) {
                    const sc = [...(byName.filters.clusterName || [])].sort();
                    const sn = [...(byName.filters.namespaceName || [])].sort();
                    const sd = [...(byName.filters.deploymentName || [])].sort();
                    if (arrEq(inCluster, sc) && arrEq(inNamespace, sn) && arrEq(inDeployment, sd)) {
                        matchedSavedFilter = byName;
                    }
                }
            }

            if (!matchedSavedFilter) {
                for (const sf of SAVED_FILTER_OPTIONS) {
                    if (!sf.filters) {
                        continue;
                    }
                    const sc = [...(sf.filters.clusterName || [])].sort();
                    const sn = [...(sf.filters.namespaceName || [])].sort();
                    const sd = [...(sf.filters.deploymentName || [])].sort();
                    if (arrEq(inCluster, sc) && arrEq(inNamespace, sn) && arrEq(inDeployment, sd)) {
                        matchedSavedFilter = sf;
                        break;
                    }
                }
            }

            if (matchedSavedFilter) {
                defaults.scopeMethod = 'custom-filters';
                defaults.selectedSavedFilter = null;
                defaults.selectedCollection = null;
                defaults.scopeChips = savedFilterToChips(matchedSavedFilter.id).map((c) => c.text);
            } else {
                defaults.scopeMethod = 'custom-filters';
                defaults.selectedCollection = null;
                defaults.selectedSavedFilter = null;
                const chips = [];
                (incomingFilters.clusterName || []).forEach((v) =>
                    chips.push(`Cluster name: ${v}`)
                );
                (incomingFilters.namespaceName || []).forEach((v) =>
                    chips.push(`Namespace name: ${v}`)
                );
                (incomingFilters.deploymentName || []).forEach((v) =>
                    chips.push(`Deployment name: ${v}`)
                );
                defaults.scopeChips = chips;
            }
        }

        if (incomingFilters.cveSeverity?.length) {
            defaults.selectedSeverities = incomingFilters.cveSeverity.map((s) => s.toLowerCase());
        }
        if (incomingFilters.cveStatus?.length) {
            defaults.selectedCveStatus = incomingFilters.cveStatus.map((s) =>
                s.toLowerCase().replace(/\s+/g, '-')
            );
        }

        const filterKeyToChipLabel = {
            imageName: 'Image Name',
            imageLabel: 'Image Label',
            imageOs: 'Image Operating system',
            imageRegistry: 'Image Registry',
            imageTag: 'Image Tag',
            imageComponentName: 'Image component Name',
            imageComponentLayerType: 'Image component Layer type',
            imageComponentSource: 'Image component Source',
            imageComponentVersion: 'Image component Version',
            cveName: 'CVE Name',
            cveCvss: 'CVE CVSS',
            cveEpss: 'CVE EPSS probability',
            cveDiscoveredTime: 'CVE Discovered time',
        };
        const chips = [];
        Object.entries(filterKeyToChipLabel).forEach(([key, label]) => {
            (incomingFilters[key] || []).forEach((val) => {
                const v = stripSurroundingQuotes(String(val).trim());
                chips.push(`${label}: ${v}`);
            });
        });
        if (chips.length > 0) {
            defaults.generalFilterChips = chips;
        }

        return defaults;
    });

    const [dropdownStates, setDropdownStates] = useState({
        area: false,
        vulnState: false,
        cveDiscovered: false,
        severity: false,
        cveStatus: false,
        imageTypeParam: false,
        notifiers: false,
        schedule: false,
    });

    const toggleDropdown = (key, nextOpen) => {
        setDropdownStates((prev) => ({
            ...prev,
            [key]: typeof nextOpen === 'boolean' ? nextOpen : !prev[key],
        }));
    };

    const [detailsTouched, setDetailsTouched] = useState({ reportName: false });

    useEffect(() => {
        setFormValues((prev) => {
            const allowed = cveStatusOptionsForSeverities(prev.selectedSeverities).map(
                (o) => o.value
            );
            const next = prev.selectedCveStatus.filter((s) => allowed.includes(s));
            if (next.length === prev.selectedCveStatus.length) {
                return prev;
            }
            return { ...prev, selectedCveStatus: next };
        });
    }, [formValues.selectedSeverities]);

    const updateFormValue = (keyOrUpdates, value) => {
        if (typeof keyOrUpdates === 'object' && value === undefined) {
            setFormValues((prev) => ({ ...prev, ...keyOrUpdates }));
        } else {
            setFormValues((prev) => ({ ...prev, [keyOrUpdates]: value }));
        }
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const handleConfirmCancel = () => {
        navigate(linkToWithVmPrototype(vulnerabilityConfigurationReportsPath, navigationSearch));
    };

    const handleSave = () => {
        setSaveMapError('');
        if (isEditMode) {
            setSaveMapError(
                'Editing reports in the v1 wizard is not supported yet. Use the standard reporting UI.'
            );
            return;
        }
        const mapped = map5173FormToReportFormValues(formValues, collectionsCatalog, emailNotifier);
        if (!mapped.ok) {
            setSaveMapError(mapped.error);
            return;
        }
        void reportFormik.validateForm().then((validationErrors) => {
            if (validationErrors && Object.keys(validationErrors).length > 0) {
                setSaveMapError('Fix validation errors in Delivery and Review before saving.');
                return;
            }
            const finalValues: ReportFormValues = {
                ...reportFormik.values,
                reportParameters: mapped.values.reportParameters,
            };
            onPersistReportFormValues(finalValues);
        });
    };

    const toggleSelection = (key, value) => {
        setFormValues((prev) => {
            const current = prev[key];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter((v) => v !== value) };
            }
            return { ...prev, [key]: [...current, value] };
        });
    };

    const reportFormik = useFormik<ReportFormValues>({
        initialValues: defaultReportFormValues,
        validationSchema: reportFormValidationSchema,
        validateOnMount: true,
        onSubmit: () => {},
    });

    useEffect(() => {
        const mapped = map5173FormToReportFormValues(formValues, collectionsCatalog, emailNotifier);
        if (!mapped.ok) {
            return;
        }
        void reportFormik.setFieldValue('reportParameters', mapped.values.reportParameters, true);
        // Intentionally depend on mapped inputs only; Formik instance is stable for this sync.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formValues, collectionsCatalog, emailNotifier]);

    const isStep1Valid = formValues.name.trim() !== '';
    const statusOptionsCveFilters = cveStatusOptionsForSeverities(formValues.selectedSeverities);
    const isStep2Valid = (formValues.scopeChips || []).length > 0;
    const isStep3CustomStartDateOk =
        formValues.cveDiscoveredSince !== 'custom' ||
        /^\d{4}-\d{2}-\d{2}$/.test((formValues.cveDiscoveredCustomDate || '').trim());
    const isStep3Valid =
        formValues.selectedImageTypes.length > 0 &&
        formValues.selectedSeverities.length > 0 &&
        formValues.selectedCveStatus.length > 0 &&
        formValues.selectedCveStatus.every((s) =>
            statusOptionsCveFilters.some((o) => o.value === s)
        ) &&
        isStep3CustomStartDateOk;

    const detailsErrors = useMemo(() => {
        const e = {};
        if (detailsTouched.reportName && !formValues.name.trim()) {
            e.reportName = 'Report name is required';
        }
        return e;
    }, [detailsTouched.reportName, formValues.name]);

    const parametersErrors = useMemo(() => {
        const e = {};
        const statusOptions = cveStatusOptionsForSeverities(formValues.selectedSeverities);
        if (formValues.selectedImageTypes.length === 0) {
            e.imageType = 'Select at least 1 image type';
        }
        if (formValues.selectedSeverities.length === 0) {
            e.cveSeverity = 'Select at least 1 severity';
        }
        if (
            formValues.selectedCveStatus.length === 0 ||
            !formValues.selectedCveStatus.every((s) => statusOptions.some((o) => o.value === s))
        ) {
            e.cveStatus = 'Select at least 1 fixability status';
        }
        if (
            formValues.cveDiscoveredSince === 'custom' &&
            !/^\d{4}-\d{2}-\d{2}$/.test((formValues.cveDiscoveredCustomDate || '').trim())
        ) {
            e.cveDiscoveredStartDate = 'A custom start date is required';
        }
        return e;
    }, [formValues]);

    const isReportFormBlockingWizardNext = useMemo(
        () =>
            !isEmpty(reportFormik.errors.reportParameters) ||
            !isEmpty(reportFormik.errors.deliveryDestinations) ||
            !isEmpty(reportFormik.errors.schedule),
        [reportFormik.errors]
    );

    return (
        <>
            {persistError ? (
                <PageSection>
                    <Alert variant="danger" title="Could not save report" isInline>
                        {persistError}
                    </Alert>
                </PageSection>
            ) : null}
            {saveMapError ? (
                <PageSection>
                    <Alert variant="warning" title="Fix the following before saving" isInline>
                        {saveMapError}
                    </Alert>
                </PageSection>
            ) : null}

            <PageSection padding={{ default: 'noPadding' }}>
                <Wizard onSave={handleSave} onClose={handleCancel}>
                    <WizardStep
                        name="Details"
                        id="step-details"
                        footer={{
                            isNextDisabled: !isStep1Valid,
                            onClose: handleCancel,
                        }}
                    >
                        <div style={{ padding: '24px', maxWidth: '650px' }}>
                            <Title headingLevel="h2" style={{ marginBottom: '24px' }}>
                                Details
                            </Title>
                            <Form>
                                <FormLabelGroup
                                    label="Report name"
                                    isRequired
                                    fieldId="reportName"
                                    errors={detailsErrors}
                                    touched={detailsTouched}
                                >
                                    <TextInput
                                        isRequired
                                        validated={
                                            detailsErrors.reportName
                                                ? ValidatedOptions.error
                                                : ValidatedOptions.default
                                        }
                                        id="report-name"
                                        value={formValues.name}
                                        onChange={(_, value) => updateFormValue('name', value)}
                                        onBlur={() =>
                                            setDetailsTouched((t) => ({ ...t, reportName: true }))
                                        }
                                        placeholder="Enter report name"
                                    />
                                </FormLabelGroup>
                                <FormGroup label="Report description" fieldId="report-description">
                                    <TextArea
                                        id="report-description"
                                        value={formValues.description}
                                        onChange={(_, value) =>
                                            updateFormValue('description', value)
                                        }
                                        placeholder="Enter a description for this report"
                                        rows={3}
                                    />
                                </FormGroup>
                            </Form>
                        </div>
                    </WizardStep>

                    <WizardStep
                        name="Resources"
                        id="step-resources"
                        isDisabled={!isStep1Valid}
                        footer={{
                            isNextDisabled: !isStep2Valid,
                            onClose: handleCancel,
                        }}
                    >
                        <ResourcesStep
                            formValues={formValues}
                            updateFormValue={updateFormValue}
                            centralScopePayload={centralWorkloadScope}
                            centralWorkloadScopeLoading={centralWorkloadScopeLoading}
                            centralWorkloadScopeError={centralWorkloadScopeError}
                        />
                    </WizardStep>

                    <WizardStep
                        name="Parameters"
                        id="step-parameters"
                        isDisabled={!isStep1Valid || !isStep2Valid}
                        footer={{
                            isNextDisabled: !isStep3Valid,
                            onClose: handleCancel,
                        }}
                    >
                        <div style={{ padding: '24px' }}>
                            <Title headingLevel="h2" style={{ marginBottom: '8px' }}>
                                Configure parameters
                            </Title>
                            <Content
                                component={ContentVariants.p}
                                style={{
                                    marginBottom: '24px',
                                    color: 'var(--pf-t--global--text--color--subtle)',
                                }}
                            >
                                Select data to include in this report
                            </Content>

                            <Form>
                                <FormLabelGroup
                                    label="Severity"
                                    isRequired
                                    fieldId="cveSeverity"
                                    errors={parametersErrors}
                                >
                                    <Select
                                        isOpen={dropdownStates.severity}
                                        onOpenChange={(open) =>
                                            setDropdownStates((s) => ({ ...s, severity: open }))
                                        }
                                        toggle={(ref) => (
                                            <MenuToggle
                                                ref={ref}
                                                onClick={() =>
                                                    setDropdownStates((s) => ({
                                                        ...s,
                                                        severity: !s.severity,
                                                    }))
                                                }
                                                isExpanded={dropdownStates.severity}
                                                isPlaceholder={
                                                    formValues.selectedSeverities.length === 0
                                                }
                                                status={
                                                    parametersErrors.cveSeverity
                                                        ? 'danger'
                                                        : undefined
                                                }
                                                style={{ minWidth: 200 }}
                                            >
                                                <Flex
                                                    alignItems={{ default: 'alignItemsCenter' }}
                                                    flexWrap={{ default: 'nowrap' }}
                                                    gap={{ default: 'gapSm' }}
                                                >
                                                    <span>
                                                        {multiSelectFilterToggleLabel(
                                                            'Severity',
                                                            formValues.selectedSeverities.length
                                                        )}
                                                    </span>
                                                    {formValues.selectedSeverities.length > 0 && (
                                                        <Label isCompact color="grey">
                                                            {formValues.selectedSeverities.length}
                                                        </Label>
                                                    )}
                                                </Flex>
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {SEVERITY_OPTIONS.map((o) => (
                                                <SelectOption
                                                    key={o.value}
                                                    hasCheckbox
                                                    isSelected={formValues.selectedSeverities.includes(
                                                        o.value
                                                    )}
                                                    onClick={() =>
                                                        toggleSelection(
                                                            'selectedSeverities',
                                                            o.value
                                                        )
                                                    }
                                                >
                                                    {o.label}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                </FormLabelGroup>

                                <FormLabelGroup
                                    label="Fixability status"
                                    isRequired
                                    fieldId="cveStatus"
                                    errors={parametersErrors}
                                >
                                    <Select
                                        isOpen={dropdownStates.cveStatus}
                                        onOpenChange={(open) =>
                                            setDropdownStates((s) => ({ ...s, cveStatus: open }))
                                        }
                                        toggle={(ref) => (
                                            <MenuToggle
                                                ref={ref}
                                                onClick={() =>
                                                    setDropdownStates((s) => ({
                                                        ...s,
                                                        cveStatus: !s.cveStatus,
                                                    }))
                                                }
                                                isExpanded={dropdownStates.cveStatus}
                                                isPlaceholder={
                                                    formValues.selectedCveStatus.length === 0
                                                }
                                                status={
                                                    parametersErrors.cveStatus
                                                        ? 'danger'
                                                        : undefined
                                                }
                                                style={{ minWidth: 200 }}
                                            >
                                                <Flex
                                                    alignItems={{ default: 'alignItemsCenter' }}
                                                    flexWrap={{ default: 'nowrap' }}
                                                    gap={{ default: 'gapSm' }}
                                                >
                                                    <span>
                                                        {multiSelectFilterToggleLabel(
                                                            'Fixability status',
                                                            formValues.selectedCveStatus.length
                                                        )}
                                                    </span>
                                                    {formValues.selectedCveStatus.length > 0 && (
                                                        <Label isCompact color="grey">
                                                            {formValues.selectedCveStatus.length}
                                                        </Label>
                                                    )}
                                                </Flex>
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {cveStatusOptionsForSeverities(
                                                formValues.selectedSeverities
                                            ).map((o) => (
                                                <SelectOption
                                                    key={o.value}
                                                    hasCheckbox
                                                    isSelected={formValues.selectedCveStatus.includes(
                                                        o.value
                                                    )}
                                                    onClick={() =>
                                                        toggleSelection(
                                                            'selectedCveStatus',
                                                            o.value
                                                        )
                                                    }
                                                >
                                                    {o.label}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                </FormLabelGroup>

                                <FormLabelGroup
                                    label="Image type"
                                    isRequired
                                    fieldId="imageType"
                                    errors={parametersErrors}
                                >
                                    <Select
                                        isOpen={dropdownStates.imageTypeParam}
                                        onOpenChange={(open) =>
                                            setDropdownStates((s) => ({
                                                ...s,
                                                imageTypeParam: open,
                                            }))
                                        }
                                        toggle={(ref) => (
                                            <MenuToggle
                                                ref={ref}
                                                onClick={() =>
                                                    setDropdownStates((s) => ({
                                                        ...s,
                                                        imageTypeParam: !s.imageTypeParam,
                                                    }))
                                                }
                                                isExpanded={dropdownStates.imageTypeParam}
                                                isPlaceholder={
                                                    formValues.selectedImageTypes.length === 0
                                                }
                                                status={
                                                    parametersErrors.imageType
                                                        ? 'danger'
                                                        : undefined
                                                }
                                                style={{ minWidth: 200 }}
                                            >
                                                <Flex
                                                    alignItems={{ default: 'alignItemsCenter' }}
                                                    flexWrap={{ default: 'nowrap' }}
                                                    gap={{ default: 'gapSm' }}
                                                >
                                                    <span>
                                                        {multiSelectFilterToggleLabel(
                                                            'Image type',
                                                            formValues.selectedImageTypes.length
                                                        )}
                                                    </span>
                                                    {formValues.selectedImageTypes.length > 0 && (
                                                        <Label isCompact color="grey">
                                                            {formValues.selectedImageTypes.length}
                                                        </Label>
                                                    )}
                                                </Flex>
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {IMAGE_TYPE_OPTIONS.map((o) => (
                                                <SelectOption
                                                    key={o.value}
                                                    hasCheckbox
                                                    isSelected={formValues.selectedImageTypes.includes(
                                                        o.value
                                                    )}
                                                    onClick={() =>
                                                        toggleSelection(
                                                            'selectedImageTypes',
                                                            o.value
                                                        )
                                                    }
                                                >
                                                    {o.label}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                </FormLabelGroup>

                                <FormGroup
                                    label="Area of concern"
                                    isRequired
                                    fieldId="area-of-concern"
                                >
                                    <Select
                                        id="area-of-concern"
                                        isOpen={dropdownStates.area}
                                        selected={formValues.areaOfConcern}
                                        onSelect={(_, value) => {
                                            updateFormValue('areaOfConcern', value);
                                            toggleDropdown('area');
                                        }}
                                        onOpenChange={() => toggleDropdown('area')}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => toggleDropdown('area')}
                                                isExpanded={dropdownStates.area}
                                                style={{ minWidth: '200px' }}
                                            >
                                                {
                                                    AREA_OPTIONS.find(
                                                        (o) => o.value === formValues.areaOfConcern
                                                    )?.label
                                                }
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {AREA_OPTIONS.map((opt) => (
                                                <SelectOption key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                </FormGroup>

                                <FormGroup
                                    label="Vulnerability state"
                                    isRequired
                                    fieldId="vuln-state"
                                >
                                    <Select
                                        id="vuln-state"
                                        isOpen={dropdownStates.vulnState}
                                        selected={formValues.vulnerabilityState}
                                        onSelect={(_, value) => {
                                            updateFormValue('vulnerabilityState', value);
                                            toggleDropdown('vulnState');
                                        }}
                                        onOpenChange={() => toggleDropdown('vulnState')}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => toggleDropdown('vulnState')}
                                                isExpanded={dropdownStates.vulnState}
                                                style={{ minWidth: '150px' }}
                                            >
                                                {
                                                    VULN_STATE_OPTIONS.find(
                                                        (o) =>
                                                            o.value ===
                                                            formValues.vulnerabilityState
                                                    )?.label
                                                }
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {VULN_STATE_OPTIONS.map((opt) => (
                                                <SelectOption key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                </FormGroup>

                                <FormGroup label="CVE filters" fieldId="cve-filters">
                                    <ReportCompoundFilter
                                        generalChips={formValues.generalFilterChips}
                                        onAddGeneralChip={(chip) =>
                                            updateFormValue('generalFilterChips', [
                                                ...formValues.generalFilterChips,
                                                chip,
                                            ])
                                        }
                                        onRemoveGeneralChip={(idx) =>
                                            updateFormValue(
                                                'generalFilterChips',
                                                formValues.generalFilterChips.filter(
                                                    (_, i) => i !== idx
                                                )
                                            )
                                        }
                                        hasClearableCveFilters={
                                            formValues.generalFilterChips.length > 0
                                        }
                                        onClearAllCveFilters={() =>
                                            updateFormValue('generalFilterChips', [])
                                        }
                                        centralScopePayload={centralWorkloadScope}
                                    />
                                </FormGroup>

                                <FormGroup
                                    label="CVEs discovered since"
                                    isRequired
                                    fieldId="cve-discovered"
                                >
                                    <Select
                                        id="cve-discovered"
                                        isOpen={dropdownStates.cveDiscovered}
                                        selected={formValues.cveDiscoveredSince}
                                        onSelect={(_, value) => {
                                            if (value === 'custom') {
                                                updateFormValue('cveDiscoveredSince', value);
                                            } else {
                                                updateFormValue({
                                                    cveDiscoveredSince: value,
                                                    cveDiscoveredCustomDate: '',
                                                });
                                            }
                                            toggleDropdown('cveDiscovered');
                                        }}
                                        onOpenChange={() => toggleDropdown('cveDiscovered')}
                                        toggle={(toggleRef) => (
                                            <MenuToggle
                                                ref={toggleRef}
                                                onClick={() => toggleDropdown('cveDiscovered')}
                                                isExpanded={dropdownStates.cveDiscovered}
                                                isFullWidth
                                                status={
                                                    parametersErrors.cveDiscoveredStartDate
                                                        ? 'danger'
                                                        : undefined
                                                }
                                            >
                                                {
                                                    CVE_DISCOVERED_OPTIONS.find(
                                                        (o) =>
                                                            o.value ===
                                                            formValues.cveDiscoveredSince
                                                    )?.label
                                                }
                                            </MenuToggle>
                                        )}
                                    >
                                        <SelectList>
                                            {CVE_DISCOVERED_OPTIONS.map((opt) => (
                                                <SelectOption key={opt.value} value={opt.value}>
                                                    <Flex direction={{ default: 'column' }}>
                                                        <FlexItem>
                                                            <span>{opt.label}</span>
                                                        </FlexItem>
                                                        <FlexItem>
                                                            <Content
                                                                component="small"
                                                                className="pf-v6-u-color-200"
                                                            >
                                                                {opt.description}
                                                            </Content>
                                                        </FlexItem>
                                                    </Flex>
                                                </SelectOption>
                                            ))}
                                        </SelectList>
                                    </Select>
                                    <FormHelperText>
                                        <HelperText>
                                            <HelperTextItem>
                                                {
                                                    CVE_DISCOVERED_OPTIONS.find(
                                                        (o) =>
                                                            o.value ===
                                                            formValues.cveDiscoveredSince
                                                    )?.description
                                                }
                                            </HelperTextItem>
                                        </HelperText>
                                    </FormHelperText>
                                </FormGroup>
                                {formValues.cveDiscoveredSince === 'custom' && (
                                    <FormLabelGroup
                                        className="pf-v6-u-mt-md"
                                        isRequired
                                        fieldId="cveDiscoveredStartDate"
                                        errors={parametersErrors}
                                    >
                                        <DatePicker
                                            value={formValues.cveDiscoveredCustomDate || ''}
                                            onChange={(_event, val) =>
                                                updateFormValue('cveDiscoveredCustomDate', val)
                                            }
                                            placeholder="YYYY-MM-DD"
                                            appendTo={() => document.body}
                                        />
                                    </FormLabelGroup>
                                )}
                            </Form>
                        </div>
                    </WizardStep>

                    <WizardStep
                        name="Delivery"
                        id="step-delivery"
                        isDisabled={!isStep1Valid || !isStep2Valid || !isStep3Valid}
                        footer={{
                            isNextDisabled: isReportFormBlockingWizardNext,
                            onClose: handleCancel,
                        }}
                    >
                        <DeliveryDestinationsForm
                            title={REPORT_WIZARD_DELIVERY_STEP_TITLE}
                            formik={reportFormik}
                        />
                    </WizardStep>

                    <WizardStep
                        name="Review"
                        id="step-review"
                        isDisabled={
                            !isStep1Valid ||
                            !isStep2Valid ||
                            !isStep3Valid ||
                            isReportFormBlockingWizardNext
                        }
                        footer={{
                            nextButtonText: 'Save',
                            nextButtonProps: { isLoading: Boolean(isPersisting) },
                            onClose: handleCancel,
                        }}
                    >
                        <>
                            <PageSection hasBodyWrapper={false} padding={{ default: 'noPadding' }}>
                                <Flex
                                    direction={{ default: 'column' }}
                                    className="pf-v6-u-py-lg pf-v6-u-px-lg"
                                >
                                    <FlexItem>
                                        <Title headingLevel="h2">{REPORT_WIZARD_REVIEW_STEP_TITLE}</Title>
                                    </FlexItem>
                                </Flex>
                            </PageSection>
                            <Divider component="div" />
                            <PageSection
                                hasBodyWrapper={false}
                                padding={{ default: 'noPadding' }}
                                className="pf-v6-u-py-lg pf-v6-u-px-lg"
                            >
                                <V1CreateReportWizard5173ReviewSections
                                    formValues={formValues}
                                    reportFormValues={reportFormik.values}
                                />
                                <Divider component="div" className="pf-v6-u-py-md" />
                                <NotifierConfigurationView
                                    headingLevel={REVIEW_NOTIFIER_HEADING}
                                    customBodyDefault={defaultEmailBody}
                                    customSubjectDefault={getDefaultEmailSubject(
                                        reportFormik.values.reportParameters.reportName,
                                        reportFormik.values.reportParameters.reportScope?.name
                                    )}
                                    notifierConfigurations={
                                        reportFormik.values.deliveryDestinations
                                    }
                                    renderTemplatePreview={({
                                        customBody,
                                        customSubject,
                                        customSubjectDefault,
                                    }: TemplatePreviewArgs) => (
                                        <EmailTemplatePreview
                                            emailSubject={customSubject}
                                            emailBody={customBody}
                                            defaultEmailSubject={customSubjectDefault}
                                            reportParameters={reportFormik.values.reportParameters}
                                        />
                                    )}
                                />
                                <Divider component="div" className="pf-v6-u-py-md" />
                                <ScheduleDetails formValues={reportFormik.values} />
                            </PageSection>
                        </>
                    </WizardStep>
                </Wizard>
            </PageSection>

            <Modal
                variant={ModalVariant.small}
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                aria-label="Confirm cancel"
            >
                <ModalHeader title="Confirm cancel" />
                <ModalBody>
                    Are you sure you want to cancel? Any unsaved changes will be lost. You will be
                    taken back to the list of reports.
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleConfirmCancel}>
                        Confirm
                    </Button>
                    <Button variant="link" onClick={() => setShowCancelModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}
