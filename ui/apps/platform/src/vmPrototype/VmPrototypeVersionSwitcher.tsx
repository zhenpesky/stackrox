import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom-v5-compat';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import FlaskIcon from '@patternfly/react-icons/dist/esm/icons/flask-icon';

import {
    vulnerabilitiesUserWorkloadsPath,
    vulnerabilityReportsPath,
} from 'routePaths';
import { clearPersistedVmPrototype } from './vmPrototypeSession';

const RELEVANT_PATHS = [vulnerabilitiesUserWorkloadsPath, vulnerabilityReportsPath];

/**
 * Shown next to the masthead logo only on the Results and Vulnerability Reporting pages.
 * Uses a fully custom dropdown (no PF Dropdown) so click handling is reliable inside the PF6 masthead.
 */
function VmPrototypeVersionSwitcher(): ReactElement | null {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
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
    if (!isRelevantPage) {
        return null;
    }

    const searchParams = new URLSearchParams(location.search);
    const isV1 = searchParams.get('prototype') === 'v1';
    const toggleLabel = isV1 ? 'Prototype v1 — Saved filters' : 'Baseline UI';

    const handleSelect = (toV1: boolean) => {
        setIsOpen(false);
        const params = new URLSearchParams(location.search);
        if (toV1) {
            params.set('prototype', 'v1');
        } else {
            params.delete('prototype');
            clearPersistedVmPrototype();
        }
        const qs = params.toString();
        navigate(`${location.pathname}${qs ? `?${qs}` : ''}`, { replace: true });
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
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
                <FlaskIcon style={{ fontSize: '14px', color: '#6a6e73' }} />
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
                        minWidth: '260px',
                        padding: '4px 0',
                    }}
                >
                    {[
                        {
                            toV1: false,
                            label: 'Baseline UI',
                            description: 'Production baseline — no prototype changes',
                            active: !isV1,
                        },
                        {
                            toV1: true,
                            label: 'Prototype v1 — Saved filters',
                            description: 'Saved filters prototype',
                            active: isV1,
                        },
                    ].map(({ toV1, label, description, active }) => (
                        <button
                            key={label}
                            type="button"
                            role="option"
                            aria-selected={active}
                            disabled={active}
                            onClick={() => handleSelect(toV1)}
                            style={{
                                display: 'block',
                                width: '100%',
                                textAlign: 'left',
                                background: active ? '#f0f0f0' : 'transparent',
                                border: 'none',
                                padding: '8px 16px',
                                cursor: active ? 'default' : 'pointer',
                                opacity: active ? 0.7 : 1,
                                fontFamily: 'inherit',
                            }}
                        >
                            <div style={{ fontSize: '14px', color: '#151515' }}>
                                {label}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6a6e73', marginTop: '2px' }}>
                                {description}
                            </div>
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
                    </a>
                </div>
            )}
        </div>
    );
}

export default VmPrototypeVersionSwitcher;
