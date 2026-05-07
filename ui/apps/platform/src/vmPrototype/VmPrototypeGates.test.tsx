import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';

import VmPrototypeWorkloadCvesGate from './VmPrototypeWorkloadCvesGate';
import VmPrototypeVulnReportingGate from './VmPrototypeVulnReportingGate';

vi.mock('Containers/Vulnerabilities/WorkloadCves/WorkloadCvesPage', () => ({
    default: function MockWorkloadCvesPage({ view }: { view: string }) {
        return <div data-testid="mock-workload-cves">{view}</div>;
    },
}));

vi.mock('Containers/Vulnerabilities/VulnerablityReporting/VulnReportingPage', () => ({
    default: function MockVulnReportingPage() {
        return <div data-testid="mock-vuln-reporting">reporting</div>;
    },
}));

describe('VmPrototypeWorkloadCvesGate', () => {
    it('renders stock workload CVEs page (mock) for default tier', async () => {
        render(
            <MemoryRouter initialEntries={['/vm?vmPrototype=v4']}>
                <Routes>
                    <Route path="/vm" element={<VmPrototypeWorkloadCvesGate view="all-images" />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('mock-workload-cves')).toHaveTextContent('all-images');
        });
    });

    it('renders v1 shell + mocked inner workload page when vmPrototype is v1', async () => {
        render(
            <MemoryRouter initialEntries={['/vm?vmPrototype=v1']}>
                <Routes>
                    <Route path="/vm" element={<VmPrototypeWorkloadCvesGate view="platform" />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('vm-prototype-v1-saved-filters-toolbar')).toBeInTheDocument();
            expect(screen.getByTestId('mock-workload-cves')).toHaveTextContent('platform');
        });
    });
});

describe('VmPrototypeVulnReportingGate', () => {
    it('renders stock reporting page (mock) when not v1', async () => {
        render(
            <MemoryRouter initialEntries={['/reports?vmPrototype=v2']}>
                <Routes>
                    <Route path="/reports" element={<VmPrototypeVulnReportingGate />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('mock-vuln-reporting')).toBeInTheDocument();
        });
    });

    it('renders v1 shell + mocked inner reporting page when vmPrototype is v1', async () => {
        render(
            <MemoryRouter initialEntries={['/reports?vmPrototype=v1']}>
                <Routes>
                    <Route path="/reports" element={<VmPrototypeVulnReportingGate />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('mock-vuln-reporting')).toBeInTheDocument();
        });
    });
});
