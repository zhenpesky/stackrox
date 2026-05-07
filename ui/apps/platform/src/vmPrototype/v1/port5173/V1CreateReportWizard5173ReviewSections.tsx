import type { ReactElement, ReactNode } from 'react';
import { Flex, FlexItem, Grid, GridItem, Title } from '@patternfly/react-core';

import VulnerabilitySeverityIconText from 'Components/PatternFly/IconText/VulnerabilitySeverityIconText';
import type { ReportFormValues } from 'Containers/Vulnerabilities/VulnerablityReporting/forms/useReportFormValues';
import { getCVEsDiscoveredSinceText } from 'Containers/Vulnerabilities/VulnerablityReporting/utils';
import type { VulnerabilitySeverity } from 'types/cve.proto';

import {
    AREA_OPTIONS,
    IMAGE_TYPE_OPTIONS,
    CVE_STATUS_OPTIONS,
    VULN_STATE_OPTIONS,
} from './V1CreateReportWizard5173.reviewData';

const REPORT_TYPE_IMAGE_VULN = 'Image vulnerabilities';

/**
 * One review field: label | value in a fixed proportion grid.
 *
 * PatternFly horizontal `DescriptionList` defaults (narrow term in `ch`, `baseline` alignment,
 * `overflow-wrap: break-word` on both columns) fight a 3-column page grid and caused overlapping
 * labels/values and mid-word breaks. This layout keeps two explicit columns with `minmax(0, 1fr)`
 * on the value so it always reserves space and does not paint under the label.
 *
 * `md={6}` → two fields per row on medium+ (wider cells than `md={4}` / three columns).
 */
function ReviewFieldGridCell({
    term,
    children,
}: {
    term: string;
    children: ReactNode;
}): ReactElement {
    return (
        <GridItem span={12} md={6}>
            <div
                className="pf-v6-u-display-grid"
                style={{
                    gridTemplateColumns: 'minmax(9rem, 0.38fr) minmax(0, 1fr)',
                    columnGap: 'var(--pf-t-global--spacer--md)',
                    alignItems: 'start',
                }}
            >
                <div
                    className="pf-v6-u-font-weight-bold"
                    style={{
                        wordBreak: 'normal',
                        overflowWrap: 'normal',
                    }}
                >
                    {term}
                </div>
                <div style={{ minWidth: 0, overflowWrap: 'break-word' }}>{children}</div>
            </div>
        </GridItem>
    );
}

/** Same mapping as `map5173FormToReportFormValues` (fallback if Formik not synced yet). */
const SEVERITY_5173_TO_API: Record<string, VulnerabilitySeverity> = {
    critical: 'CRITICAL_VULNERABILITY_SEVERITY',
    important: 'IMPORTANT_VULNERABILITY_SEVERITY',
    moderate: 'MODERATE_VULNERABILITY_SEVERITY',
    low: 'LOW_VULNERABILITY_SEVERITY',
    unknown: 'UNKNOWN_VULNERABILITY_SEVERITY',
};

type WizardFormShape = {
    name: string;
    description: string;
    scopeMethod: string;
    selectedCollection: string | null;
    selectedSavedFilter: string | null;
    selectedImageTypes: string[];
    scopeChips: string[];
    areaOfConcern: string;
    vulnerabilityState: string;
    selectedSeverities: string[];
    selectedCveStatus: string[];
    cveDiscoveredSince: string;
    cveDiscoveredCustomDate?: string;
};

export function parseScopeChipsToBuckets(scopeChips: string[] | undefined): {
    clusters: string[];
    namespaces: string[];
    deployments: string[];
} {
    const clusters: string[] = [];
    const namespaces: string[] = [];
    const deployments: string[] = [];
    (scopeChips || []).forEach((chip) => {
        const m = chip.match(/^(Cluster name|Namespace name|Deployment name):\s*(.+)$/);
        if (m) {
            const v = m[2].trim();
            if (m[1] === 'Cluster name') {
                clusters.push(v);
            } else if (m[1] === 'Namespace name') {
                namespaces.push(v);
            } else if (m[1] === 'Deployment name') {
                deployments.push(v);
            }
        }
    });
    return { clusters, namespaces, deployments };
}

function formatListOrAll(values: string[], emptyAsAll = true): string {
    if (values.length === 0) {
        return emptyAsAll ? 'All' : '—';
    }
    return values.join(', ');
}

function getCveStatusLabels(selected: string[] | undefined): string {
    if (!selected?.length) {
        return '—';
    }
    return selected
        .map((v) => CVE_STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v)
        .join(', ');
}

export type V1CreateReportWizard5173ReviewSectionsProps = {
    formValues: WizardFormShape;
    reportFormValues: ReportFormValues;
};

/**
 * Step 5 layout for the vmPrototype v1 wizard: Report details, Scope (cluster/namespace/deployment), Report parameters (image type + CVE filters).
 * Uses PatternFly Grid: two columns per row from the md breakpoint (`md={6}`); stacks on small screens.
 */
function V1CreateReportWizard5173ReviewSections({
    formValues,
    reportFormValues,
}: V1CreateReportWizard5173ReviewSectionsProps): ReactElement {
    const { clusters, namespaces, deployments } = parseScopeChipsToBuckets(formValues.scopeChips);
    const rp = reportFormValues.reportParameters;
    const imageTypeLabels = (formValues.selectedImageTypes || [])
        .map((k) => IMAGE_TYPE_OPTIONS.find((o) => o.value === k)?.label)
        .filter(Boolean) as string[];

    const apiSeveritiesForDisplay: VulnerabilitySeverity[] = rp.cveSeverities?.length
        ? rp.cveSeverities
        : (formValues.selectedSeverities || [])
              .map((s) => SEVERITY_5173_TO_API[s])
              .filter((s): s is VulnerabilitySeverity => Boolean(s));

    const cveSeveritiesDisplay = apiSeveritiesForDisplay.length ? (
        <ul className="pf-v6-u-m-0">
            {apiSeveritiesForDisplay.map((severity) => (
                <li key={severity}>
                    <VulnerabilitySeverityIconText severity={severity} />
                </li>
            ))}
        </ul>
    ) : (
        <ul className="pf-v6-u-m-0">
            <li>—</li>
        </ul>
    );

    const cvesSinceText = getCVEsDiscoveredSinceText(rp);
    const areaLabel =
        AREA_OPTIONS.find((o) => o.value === formValues.areaOfConcern)?.label ?? '—';
    const vulnStateLabel =
        VULN_STATE_OPTIONS.find((o) => o.value === formValues.vulnerabilityState)?.label ?? '—';

    return (
        <Flex direction={{ default: 'column' }} gap={{ default: 'gapLg' }}>
            <FlexItem>
                <Title className="pf-v6-u-mb-md" headingLevel="h2">
                    Report details
                </Title>
                <Grid hasGutter>
                    <ReviewFieldGridCell term="Name">
                        {formValues.name?.trim() || '—'}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Description">
                        {formValues.description?.trim() || '—'}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Report type">{REPORT_TYPE_IMAGE_VULN}</ReviewFieldGridCell>
                </Grid>
            </FlexItem>

            <FlexItem>
                <Title className="pf-v6-u-mb-md" headingLevel="h2">
                    Scope details
                </Title>
                <Grid hasGutter>
                    <ReviewFieldGridCell term="Cluster name">
                        {formatListOrAll(clusters)}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Namespace name">
                        {formatListOrAll(namespaces)}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Deployment name">
                        {formatListOrAll(deployments)}
                    </ReviewFieldGridCell>
                </Grid>
            </FlexItem>

            <FlexItem>
                <Title className="pf-v6-u-mb-md" headingLevel="h2">
                    Report parameters
                </Title>
                <Grid hasGutter>
                    <ReviewFieldGridCell term="Image type">
                        {imageTypeLabels.length ? (
                            <ul className="pf-v6-u-m-0">
                                {imageTypeLabels.map((l) => (
                                    <li key={l}>{l}</li>
                                ))}
                            </ul>
                        ) : (
                            '—'
                        )}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Area of concern">{areaLabel}</ReviewFieldGridCell>
                    <ReviewFieldGridCell term="Vulnerability state">{vulnStateLabel}</ReviewFieldGridCell>
                    <ReviewFieldGridCell term="CVE severity">{cveSeveritiesDisplay}</ReviewFieldGridCell>
                    <ReviewFieldGridCell term="CVE status">
                        {getCveStatusLabels(formValues.selectedCveStatus)}
                    </ReviewFieldGridCell>
                    <ReviewFieldGridCell term="CVEs discovered since">{cvesSinceText}</ReviewFieldGridCell>
                </Grid>
            </FlexItem>
        </Flex>
    );
}

export default V1CreateReportWizard5173ReviewSections;
