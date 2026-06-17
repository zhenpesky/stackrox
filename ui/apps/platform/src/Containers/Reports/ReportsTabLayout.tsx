import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
    Card,
    CardHeader,
    Content,
    ContentVariants,
    Flex,
    Gallery,
    GalleryItem,
    PageSection,
    Tab,
    Tabs,
    TabTitleText,
    Title,
} from '@patternfly/react-core';

import PageTitle from 'Components/PageTitle';
import {
    complianceEnhancedSchedulesPath,
    networkBasePath,
    reportsBasePath,
    riskBasePath,
    violationsFullViewPath,
    vulnerabilityConfigurationReportsPath,
} from 'routePaths';
import {
    UNIVERSAL_REPORT_SOURCE_TYPES,
    UNIVERSAL_REPORT_SOURCE_META,
    isUniversalReportSourceType,
    VULN_WORKFLOW_VIEWS,
    VULN_WORKFLOW_VIEW_META,
    NETWORK_WORKFLOW_VIEWS,
    NETWORK_WORKFLOW_VIEW_META,
} from 'vmPrototype/universalReports/universalReportTypes';
import type {
    UniversalReportSourceType,
    VulnWorkflowView,
    NetworkWorkflowView,
} from 'vmPrototype/universalReports/universalReportTypes';

const TAB_LABEL: Record<UniversalReportSourceType, string> = {
    vulnerability: 'Vulnerability management',
    violation: 'Violations',
    compliance: 'Compliance',
    network: 'Network',
    risk: 'Risk',
    configuration: 'Configuration',
};

const EXCLUDED_REPORT_TYPES = new Set(['network', 'configuration'] as const);

const REPORT_TABS = UNIVERSAL_REPORT_SOURCE_TYPES.filter(
    (type) => !EXCLUDED_REPORT_TYPES.has(type as 'network' | 'configuration')
).map((type) => ({
    type,
    label: TAB_LABEL[type],
    path: `${reportsBasePath}/${type}`,
}));

type AreaItem = { id: string; label: string; description: string; linkTo?: string };

/** Build a vuln-reports deep-link that forces the v4 prototype experience. */
function vulnReportLink(area: string): string {
    return `${vulnerabilityConfigurationReportsPath}?vulnReportArea=${area}&prototype=v4`;
}

function vulnImageReportsGroupLink(): string {
    return `${vulnerabilityConfigurationReportsPath}?vulnReportGroup=image&prototype=v4`;
}

const AREAS_BY_TYPE: Record<UniversalReportSourceType, AreaItem[]> = {
    vulnerability: [
        {
            id: 'image-vulnerability-reports',
            label: 'Image vulnerability reports',
            description:
                'CVE reports scoped to workload images, platform components, all deployed images, and inactive images across your clusters.',
            linkTo: vulnImageReportsGroupLink(),
        },
        {
            id: 'node-cves',
            label: VULN_WORKFLOW_VIEW_META['node-cves'].label,
            description: VULN_WORKFLOW_VIEW_META['node-cves'].description,
            linkTo: vulnReportLink('node-cves'),
        },
        {
            id: 'virtual-machines',
            label: VULN_WORKFLOW_VIEW_META['virtual-machines'].label,
            description: VULN_WORKFLOW_VIEW_META['virtual-machines'].description,
            linkTo: vulnReportLink('virtual-machines'),
        },
    ],
    violation: [
        {
            id: 'policy-violation-reports',
            label: 'Policy violation reports',
            description:
                'Policy violation reports scoped to deployed workload images and full-scope violations across workloads, platform components, and nodes.',
            linkTo: violationsFullViewPath,
        },
    ],
    compliance: [
        {
            id: 'compliance-reports',
            label: 'Compliance reports',
            description:
                'Compliance reports scoped to OpenShift CIS, Kubernetes CIS, and NIST 800-190 standards across your clusters.',
            linkTo: complianceEnhancedSchedulesPath,
        },
    ],
    network: [
        {
            id: 'network-graph',
            label: NETWORK_WORKFLOW_VIEW_META['network-graph'].label,
            description: NETWORK_WORKFLOW_VIEW_META['network-graph'].description,
            linkTo: networkBasePath,
        },
        {
            id: 'listening-endpoints',
            label: NETWORK_WORKFLOW_VIEW_META['listening-endpoints'].label,
            description: NETWORK_WORKFLOW_VIEW_META['listening-endpoints'].description,
        },
    ],
    risk: [
        {
            id: 'deployment-risk',
            label: 'Deployment risk reports',
            description:
                'Risk reports scoped to deployment risk scores and contributing factors across your environment.',
            linkTo: riskBasePath,
        },
    ],
    configuration: [
        {
            id: 'rbac-posture',
            label: 'RBAC posture',
            description:
                'Role bindings, service accounts, and cluster-role exposure across namespaces.',
        },
        {
            id: 'secrets-exposure',
            label: 'Secrets exposure',
            description: 'Mounted secrets and environment-variable secrets across workloads.',
        },
        {
            id: 'image-settings',
            label: 'Image settings',
            description:
                'Image pull policies, registries, and runtime configuration across deployments.',
        },
    ],
};

function AreaCard({
    area,
    sourceType: _sourceType,
}: {
    area: AreaItem;
    sourceType: UniversalReportSourceType;
}): ReactElement {
    const navigate = useNavigate();
    const isClickable = Boolean(area.linkTo);

    return (
        <GalleryItem style={{ height: '100%' }}>
            <Card isCompact isClickable={isClickable} style={{ height: '100%' }}>
                <CardHeader
                    selectableActions={
                        isClickable
                            ? {
                                  onClickAction: () => navigate(area.linkTo!),
                                  selectableActionAriaLabel: `Go to ${area.label}`,
                              }
                            : undefined
                    }
                >
                    <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                        <Content component={ContentVariants.p} style={{ fontWeight: 600 }}>
                            {area.label}
                        </Content>
                        <Content
                            component={ContentVariants.p}
                            style={{
                                color: 'var(--pf-t--global--text--color--subtle)',
                                fontSize: '13px',
                            }}
                        >
                            {area.description}
                        </Content>
                    </Flex>
                </CardHeader>
            </Card>
        </GalleryItem>
    );
}

function ReportsTabLayout(): ReactElement {
    const { reportType } = useParams<{ reportType: string }>();
    const navigate = useNavigate();

    const activeType: UniversalReportSourceType = isUniversalReportSourceType(reportType ?? '')
        ? (reportType as UniversalReportSourceType)
        : 'vulnerability';

    const areas = AREAS_BY_TYPE[activeType];

    return (
        <>
            <PageTitle title={`Reports — ${TAB_LABEL[activeType]}`} />
            <PageSection>
                <Title headingLevel="h1">Reports</Title>
            </PageSection>
            <PageSection type="tabs">
                <Tabs
                    activeKey={activeType}
                    onSelect={(_e, key) => navigate(`${reportsBasePath}/${key as string}`)}
                    usePageInsets
                    mountOnEnter
                    unmountOnExit
                >
                    {REPORT_TABS.map(({ type, label }) => (
                        <Tab
                            key={type}
                            eventKey={type}
                            title={<TabTitleText>{label}</TabTitleText>}
                        />
                    ))}
                </Tabs>
            </PageSection>
            <PageSection>
                <Content
                    component={ContentVariants.p}
                    style={{
                        color: 'var(--pf-t--global--text--color--subtle)',
                        marginBottom: '16px',
                    }}
                >
                    {UNIVERSAL_REPORT_SOURCE_META[activeType].description}
                </Content>
                <Gallery hasGutter minWidths={{ default: '240px' }}>
                    {areas.map((area) => (
                        <AreaCard key={area.id} area={area} sourceType={activeType} />
                    ))}
                </Gallery>
            </PageSection>
        </>
    );
}

export default ReportsTabLayout;
