import { Button, Content, ContentVariants, Flex, FlexItem, PageSection, Tab, Tabs, Title } from '@patternfly/react-core';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import usePermissions from 'hooks/usePermissions';

import PageTitle from 'Components/PageTitle';
import { linkToWithVmPrototype } from 'vmPrototype/vmPrototypeSession';
import {
    vulnerabilityConfigurationReportsPath,
    vulnerabilityViewBasedReportsPath,
} from 'routePaths';

const tabs = [
    {
        id: 'report-configuration',
        title: 'Report configurations',
        path: vulnerabilityConfigurationReportsPath,
    },
    {
        id: 'view-based-reports',
        title: 'View-based reports',
        path: vulnerabilityViewBasedReportsPath,
    },
];

const V4_AREA_TABS = [
    {
        key: 'image',
        label: 'Image vulnerability reports',
        description: 'Configure scheduled reports for image vulnerabilities.',
        path: `${vulnerabilityConfigurationReportsPath}?vulnReportGroup=image&prototype=v4`,
    },
    {
        key: 'node-cves',
        label: 'Nodes',
        description: 'Configure scheduled reports for node vulnerabilities.',
        path: `${vulnerabilityConfigurationReportsPath}?vulnReportArea=node-cves&prototype=v4`,
    },
    {
        key: 'virtual-machines',
        label: 'Virtual machines',
        description: 'Configure scheduled reports for virtual machine vulnerabilities.',
        path: `${vulnerabilityConfigurationReportsPath}?vulnReportArea=virtual-machines&prototype=v4`,
    },
] as const;

type V4TabKey = (typeof V4_AREA_TABS)[number]['key'];

function VulnReportingLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { hasReadWriteAccess, hasReadAccess } = usePermissions();

    const activeTabIndex = tabs.findIndex((tab) => location.pathname.startsWith(tab.path));

    const onTabSelect = (_event, tabIndex) => {
        navigate(linkToWithVmPrototype(tabs[tabIndex].path, location.search));
    };

    const protoParam = searchParams.get('prototype') ?? '';
    const isV4Mode = protoParam === 'v4' || protoParam === '4';

    // V4 active sub-tab key
    const vulnReportGroupParam = searchParams.get('vulnReportGroup') ?? '';
    const vulnReportAreaParam = searchParams.get('vulnReportArea') ?? '';
    const v4ActiveTab: V4TabKey = vulnReportGroupParam === 'image'
        ? 'image'
        : vulnReportAreaParam === 'node-cves'
          ? 'node-cves'
          : vulnReportAreaParam === 'virtual-machines'
            ? 'virtual-machines'
            : 'image';

    const v4ActiveTabMeta = V4_AREA_TABS.find((t) => t.key === v4ActiveTab)!;

    // In V5 with a group or area selected, hide the page title and tabs so the
    // sub-landing / table feels like a standalone page (breadcrumb navigates back).
    const isV5AreaView =
        (protoParam === 'v5' || protoParam === '5') &&
        (Boolean(vulnReportAreaParam) || Boolean(vulnReportGroupParam));

    const showCreateButton =
        isV4Mode &&
        (hasReadWriteAccess('WorkflowAdministration') &&
            hasReadAccess('Image') &&
            hasReadAccess('Integration') ||
            import.meta.env.DEV ||
            import.meta.env.VITE_MOCK_MODE === 'true');

    const isOnReportConfig = location.pathname.startsWith(vulnerabilityConfigurationReportsPath);

    return (
        <>
            <PageTitle title="Vulnerability reporting" />
            {!isV5AreaView && (
                <PageSection>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem flex={{ default: 'flex_1' }}>
                            <Title headingLevel="h1">Vulnerability reporting</Title>
                        </FlexItem>
                        {showCreateButton && isOnReportConfig && (
                            <FlexItem>
                                <Link
                                    to={linkToWithVmPrototype(
                                        `${vulnerabilityConfigurationReportsPath}?action=create`,
                                        location.search
                                    )}
                                >
                                    <Button variant="primary">Create report</Button>
                                </Link>
                            </FlexItem>
                        )}
                    </Flex>
                </PageSection>
            )}
            {!isV5AreaView && (
                <PageSection type="tabs">
                    <Tabs
                        activeKey={activeTabIndex}
                        onSelect={onTabSelect}
                        usePageInsets
                        mountOnEnter
                        unmountOnExit
                    >
                        {tabs.map((tab, index) => (
                            <Tab
                                key={tab.id}
                                eventKey={index}
                                title={tab.title}
                                tabContentId={`${tab.id}-tab-content`}
                            />
                        ))}
                    </Tabs>
                </PageSection>
            )}
            {/* V4: sub-tabs sit directly below the main tab bar, inside the layout */}
            {isV4Mode && isOnReportConfig && !isV5AreaView && (
                <>
                    <PageSection type="tabs" style={{ paddingTop: 0 }}>
                        <Tabs
                            isSubtab
                            activeKey={v4ActiveTab}
                            onSelect={(_e, key) => {
                                const tab = V4_AREA_TABS.find((t) => t.key === key);
                                if (tab) navigate(tab.path);
                            }}
                            usePageInsets
                        >
                            {V4_AREA_TABS.map((tab) => (
                                <Tab
                                    key={tab.key}
                                    eventKey={tab.key}
                                    title={tab.label}
                                />
                            ))}
                        </Tabs>
                    </PageSection>
                    <PageSection style={{ paddingTop: 'var(--pf-t--global--spacer--md)', paddingBottom: 0 }}>
                        <Content component={ContentVariants.p}
                            style={{ color: 'var(--pf-t--global--text--color--subtle)' }}
                        >
                            {v4ActiveTabMeta.description}
                        </Content>
                    </PageSection>
                </>
            )}
            <Outlet />
        </>
    );
}

export default VulnReportingLayout;
