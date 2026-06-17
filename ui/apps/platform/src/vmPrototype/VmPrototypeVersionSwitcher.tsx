import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import CheckIcon from '@patternfly/react-icons/dist/esm/icons/check-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import FlaskIcon from '@patternfly/react-icons/dist/esm/icons/flask-icon';
import LinkIcon from '@patternfly/react-icons/dist/esm/icons/link-icon';
import MapMarkerIcon from '@patternfly/react-icons/dist/esm/icons/map-marker-icon';

import {
    exceptionConfigurationPath,
    policyManagementBasePath,
    reportsBasePath,
    riskBasePath,
    systemConfigPath,
    violationsBasePath,
    vulnerabilitiesAllImagesPath,
    vulnerabilitiesImagesWithoutCvesPath,
    vulnerabilitiesInactiveImagesPath,
    vulnerabilitiesNodeCvesPath,
    vulnerabilitiesPlatformCvesPath,
    vulnerabilitiesPlatformPath,
    vulnerabilitiesSavedFiltersPath,
    vulnerabilitiesUserWorkloadsPath,
    vulnerabilitiesVirtualMachineCvesPath,
    vulnerabilityReportsPath,
} from 'routePaths';
import { clearPersistedVmPrototype, isShareMode, persistVmPrototypeFromSearch, readPrototypeQueryValue } from './vmPrototypeSession';
import { prototypeLastEditedLabel } from './vmPrototypeVersionEditDates';

const RELEVANT_PATHS = [
    riskBasePath,
    reportsBasePath,
    systemConfigPath,
    exceptionConfigurationPath,
    policyManagementBasePath,
    violationsBasePath,
    vulnerabilitiesUserWorkloadsPath,
    vulnerabilitiesPlatformPath,
    vulnerabilitiesNodeCvesPath,
    vulnerabilitiesVirtualMachineCvesPath,
    vulnerabilitiesAllImagesPath,
    vulnerabilitiesInactiveImagesPath,
    vulnerabilitiesImagesWithoutCvesPath,
    vulnerabilitiesPlatformCvesPath,
    vulnerabilitiesSavedFiltersPath,
    vulnerabilityReportsPath,
];

/**
 * Masthead version switcher for prototype routes (VM saved filters, System Config,
 * Exception Configuration, Vuln Reports, etc.). Rendered from Header.tsx.
 */
function VmPrototypeVersionSwitcher(): ReactElement | null {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [shareGuestOnly, setShareGuestOnly] = useState(true);
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside the dropdown container
    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const isRelevantPage = RELEVANT_PATHS.some((p) => location.pathname.startsWith(p));
    if (!isRelevantPage || isShareMode()) {
        return null;
    }

    const isOnSystemConfig = location.pathname.startsWith(systemConfigPath);
    const isOnExceptionConfig = location.pathname.startsWith(exceptionConfigurationPath);
    const isOnPolicyManagement = location.pathname.startsWith(policyManagementBasePath);

    const searchParams = new URLSearchParams(location.search);
    const activePrototype = readPrototypeQueryValue(searchParams);
    const isV1 = activePrototype === 'v1';
    const isV2 = activePrototype === 'v2';
    const isV3 = activePrototype === 'v3';
    const isV4 = activePrototype === 'v4' || activePrototype === '4';
    const isV5 = activePrototype === 'v5' || activePrototype === '5';
    const isV6 = activePrototype === 'v6' || activePrototype === '6';
    const isV7 = activePrototype === 'v7' || activePrototype === '7';

    const isOnVulnReports =
        location.pathname.startsWith(vulnerabilityReportsPath) && !isOnSystemConfig;
    const isOnGlobalReports =
        location.pathname.startsWith(reportsBasePath) && !isOnVulnReports;

    // Route-specific toggle label
    const toggleLabel = isOnPolicyManagement
        ? isV1
            ? 'V1 — CISA KEV policy criterion'
            : 'Baseline UI'
        : isOnExceptionConfig
        ? isV1
            ? 'V1 — Expiration periods'
            : 'Baseline UI'
        : isOnSystemConfig
        ? isV1
            ? 'V1 — Option A'
            : 'Baseline UI'
        : isOnGlobalReports
          ? 'Global Reports · Tabbed layout'
        : isOnVulnReports
          ? isV7
              ? 'V7 — Cross report types · Grouped toggle'
              : isV6
              ? 'V6 — Cross report types · Advanced filter'
              : isV5
                ? 'V5 — Cross report types · Card-first'
                : isV4
                  ? 'V4 — Cross report types'
                : isV3
                  ? 'Prototype v3 — Watched images scope'
                  : isV2
                    ? 'Prototype v2 — Saved Filter Iteration'
                    : isV1
                      ? 'Prototype v1 — Resource Scope'
                      : 'Baseline UI'
          : isV2
            ? 'Prototype v2 — Saved Filter Iteration'
            : isV1
              ? 'Prototype v1 — Saved filters (MVP)'
              : 'Baseline UI';

    const options = isOnPolicyManagement
        ? [
              {
                  protoValue: null,
                  label: 'Baseline UI',
                  description: 'Current production Policy Management',
                  active: !isV1,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
              {
                  protoValue: 'v1',
                  label: 'V1 — CISA KEV policy criterion',
                  description:
                      'Publicly exploitable CVE rule under Image scanning — yes/no KEV catalog match',
                  active: isV1,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
              },
          ]
        : isOnExceptionConfig
        ? [
              {
                  protoValue: null,
                  label: 'Baseline UI',
                  description: 'Current production Exception Configuration',
                  active: !isV1,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
              {
                  protoValue: 'v1',
                  label: 'V1 — Expiration periods',
                  description:
                      'Read-only view with disabled inputs + Edit button; edit state uses availability dropdowns',
                  active: isV1,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v1'),
              },
          ]
        : isOnSystemConfig
        ? [
              {
                  protoValue: null,
                  label: 'Baseline UI',
                  description: 'Current production System Configuration',
                  active: !isV1,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
              {
                  protoValue: 'v1',
                  label: 'V1 — Option A',
                  description: 'Min 1 day + Keep indefinitely; disabled input fields for retention read-only view',
                  active: isV1,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v1'),
              },
          ]
        : isOnVulnReports
        ? [
              {
                  protoValue: null,
                  label: 'Baseline UI',
                  description: 'Production baseline — no prototype changes',
                  active: !isV1 && !isV2 && !isV3 && !isV4 && !isV5 && !isV6 && !isV7,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
              {
                  protoValue: 'v1',
                  label: 'Prototype v1 — Resource Scope',
                  description: 'Report wizard — reusable resource scope with Available in (MVP)',
                  active: isV1,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v1'),
              },
              {
                  protoValue: 'v2',
                  label: 'Prototype v2 — Saved Filter Iteration',
                  description: 'WYSIWYG carry-over from live view; saved filter trust messaging',
                  active: isV2,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v2'),
              },
              {
                  protoValue: 'v3',
                  label: 'Prototype v3 — Watched images scope',
                  description: 'Resource scope always visible; disabled for watched-only images',
                  active: isV3,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v3'),
              },
              {
                  protoValue: 'v4',
                  label: 'V4 — Cross report types',
                  description:
                      'Type-first wizard — parameters and resource scope match the report source you pick. Create mode: custom scope only.',
                  active: isV4,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v4'),
              },
              {
                  protoValue: 'v5',
                  label: 'V5 — Cross report types · Card-first',
                  description:
                      'Card landing page groups report areas; combined image table with pre-filter. Collection scope available in create mode.',
                  active: isV5,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
              },
              {
                  protoValue: 'v6',
                  label: 'V6 — Cross report types · Advanced filter',
                  description:
                      'Area of concern grouped checkbox left of name search. No toggle group.',
                  active: isV6,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
              },
              {
                  protoValue: 'v7',
                  label: 'V7 — Cross report types · Grouped toggle',
                  description:
                      '3-item ToggleGroup: Image vulnerability reports / Node reports / Virtual machines — each aggregates its sub-areas.',
                  active: isV7,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
              },
          ]
        : isOnGlobalReports
        ? [
              {
                  protoValue: null,
                  label: 'Global Reports · Tabbed layout',
                  description: 'Standalone Reports entry — tabs per report feature with area-of-concern cards.',
                  active: true,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
          ]
        : [
              {
                  protoValue: null,
                  label: 'Baseline UI',
                  description: 'Production baseline — no prototype changes',
                  active: !isV1 && !isV2,
                  Icon: MapMarkerIcon,
                  iconColor: '#3e8635',
              },
              {
                  protoValue: 'v1',
                  label: 'Prototype v1 — Saved filters (MVP)',
                  description: 'Save, apply, and manage saved filters — first iteration',
                  active: isV1,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v1'),
              },
              {
                  protoValue: 'v2',
                  label: 'Prototype v2 — Saved Filter Iteration',
                  description:
                      'Team sharing, Platform/Nodes, WYSIWYG trust, central management',
                  active: isV2,
                  Icon: FlaskIcon,
                  iconColor: '#6753ac',
                  lastEdited: prototypeLastEditedLabel('v2'),
              },
          ];

    const ActiveIcon = isV1 || isV2 || isV3 || (isOnVulnReports && (isV4 || isV5 || isV6 || isV7)) ? FlaskIcon : MapMarkerIcon;
    const activeIconColor =
        isV1 || isV2 || isV3 || (isOnVulnReports && (isV4 || isV5 || isV6 || isV7)) ? '#6753ac' : '#3e8635';

    const isOnPrototype = isV1 || isV2 || isV3 || (isOnVulnReports && (isV4 || isV5 || isV6 || isV7)) || isOnGlobalReports;

    function buildShareUrl(guestOnly: boolean): string {
        const base = 'https://zhenpesky.github.io/rhacs-ux-prototypes/app';
        const params = new URLSearchParams();
        if (activePrototype) {
            params.set('prototype', activePrototype);
        }
        if (guestOnly) {
            params.set('share', '1');
        }
        const qs = params.toString();
        return `${base}${location.pathname.replace(/^\/app/, '')}${qs ? `?${qs}` : ''}`;
    }

    function handleCopy() {
        const url = buildShareUrl(shareGuestOnly);
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            // Fallback: select the text in the input so user can Ctrl+C
            const input = containerRef.current?.querySelector<HTMLInputElement>('input[readonly]');
            input?.select();
        });
    }

    const handleSelect = (protoValue: string | null) => {
        setIsOpen(false);
        setShowShareCard(false);
        const params = new URLSearchParams(location.search);
        if (protoValue) {
            params.set('prototype', protoValue);
        } else {
            params.delete('prototype');
            if (!isOnSystemConfig && !isOnExceptionConfig && !isOnPolicyManagement) {
                clearPersistedVmPrototype();
            }
        }
        const qs = params.toString();
        const nextSearch = qs ? `?${qs}` : '';
        if (protoValue) {
            persistVmPrototypeFromSearch(nextSearch);
        }
        navigate(`${location.pathname}${nextSearch}`, { replace: true });
    };

    return (
        <div ref={containerRef} data-testid="vm-prototype-version-switcher" style={{ position: 'relative', display: 'inline-block' }}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    border: '1px solid #d2d2d2',
                    borderRadius: '4px',
                    padding: '5px 12px',
                    fontSize: '14px',
                    color: '#151515',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                }}
            >
                <ActiveIcon style={{ fontSize: '14px', color: activeIconColor }} />
                <span
                    style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#151515',
                        marginRight: '2px',
                        fontFamily: '"RedHatDisplay", "Red Hat Display", Overpass, overpass, helvetica, arial, sans-serif',
                    }}
                >
                    Switch view:
                </span>
                <span>{toggleLabel}</span>
                <CaretDownIcon style={{ fontSize: '12px', color: '#6a6e73' }} />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        zIndex: 9999,
                        background: '#fff',
                        border: '1px solid #d2d2d2',
                        borderRadius: '4px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '280px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '4px 0',
                        overscrollBehavior: 'contain',
                    }}
                >
                    {options.map(({ protoValue, label, description, active, Icon, iconColor, lastEdited }) => (
                        <button
                            key={label}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => !active && handleSelect(protoValue)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                textAlign: 'left',
                                background: active ? '#f3faf2' : 'transparent',
                                border: 'none',
                                borderLeft: active ? '3px solid #3e8635' : '3px solid transparent',
                                padding: '8px 16px 8px 13px',
                                cursor: active ? 'default' : 'pointer',
                                fontFamily: 'inherit',
                            }}
                        >
                            <Icon style={{ fontSize: '16px', color: iconColor, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', color: '#151515', fontWeight: active ? 600 : 400 }}>
                                    {label}
                                </div>
                                <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '2px' }}>
                                    {description}
                                </div>
                                {lastEdited && (
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#969696',
                                            marginTop: '4px',
                                        }}
                                    >
                                        {lastEdited}
                                    </div>
                                )}
                            </div>
                            {active && (
                                <CheckIcon style={{ fontSize: '14px', color: '#3e8635', flexShrink: 0 }} />
                            )}
                        </button>
                    ))}
                    <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0' }} />
                    <a
                        href="https://zhenpesky.github.io/rhacs-ux-prototypes"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: '100%',
                            textAlign: 'left',
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            textDecoration: 'none',
                            color: '#0066cc',
                            fontSize: '13px',
                            fontWeight: 500,
                            boxSizing: 'border-box',
                        }}
                    >
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            style={{ width: '13px', height: '13px', fill: 'currentColor', flexShrink: 0 }}
                        >
                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                        View all in dashboard
                        <ExternalLinkAltIcon style={{ fontSize: '11px', marginLeft: '2px' }} />
                    </a>
                    {isOnPrototype && (
                        <>
                            <div style={{ borderTop: '1px solid #e8e8e8', margin: '4px 0' }} />
                            <button
                                type="button"
                                onClick={() => { setShowShareCard((v) => !v); setCopied(false); }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    color: '#0066cc',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                }}
                            >
                                <LinkIcon style={{ fontSize: '13px', flexShrink: 0 }} />
                                Share this prototype
                            </button>
                            {showShareCard && (
                                <div style={{ padding: '8px 16px 12px', borderTop: '1px solid #e8e8e8' }}>
                                    <div style={{ fontSize: '12px', color: '#6a6e73', marginBottom: '8px' }}>
                                        Choose link access level:
                                    </div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', marginBottom: '4px' }}>
                                        <input
                                            type="radio"
                                            name="share-access"
                                            checked={shareGuestOnly}
                                            onChange={() => { setShareGuestOnly(true); setCopied(false); }}
                                        />
                                        Guest only
                                        <span style={{ fontSize: '11px', color: '#3e8635', fontWeight: 500 }}>(recommended)</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', marginBottom: '10px' }}>
                                        <input
                                            type="radio"
                                            name="share-access"
                                            checked={!shareGuestOnly}
                                            onChange={() => { setShareGuestOnly(false); setCopied(false); }}
                                        />
                                        Internal stakeholder only
                                    </label>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <input
                                            readOnly
                                            value={buildShareUrl(shareGuestOnly)}
                                            style={{
                                                flex: 1,
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                                border: '1px solid #d2d2d2',
                                                borderRadius: '3px',
                                                background: '#f5f5f5',
                                                color: '#151515',
                                                fontFamily: 'monospace',
                                                minWidth: 0,
                                            }}
                                            onFocus={(e) => e.target.select()}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCopy}
                                            style={{
                                                padding: '4px 12px',
                                                fontSize: '12px',
                                                border: '1px solid #0066cc',
                                                borderRadius: '3px',
                                                background: copied ? '#3e8635' : '#0066cc',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontFamily: 'inherit',
                                                whiteSpace: 'nowrap',
                                                minWidth: '76px',
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            {copied ? 'Copied!' : 'Copy link'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default VmPrototypeVersionSwitcher;
