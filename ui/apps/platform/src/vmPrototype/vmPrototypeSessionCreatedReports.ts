import type { ReportConfiguration } from 'services/ReportsService.types';

const STORAGE_KEY = 'stackrox-vmPrototype-created-report-configurations';

/**
 * When Central’s report configuration list API fails, {@link ConfigReportsTab} falls back to static
 * sample rows only—so a successful **create** still looks “missing.” Persist successful creates in
 * sessionStorage and merge them into that fallback list (deduped by id).
 */
export function appendSessionCreatedReportConfiguration(config: ReportConfiguration): void {
    try {
        const existing = readSessionCreatedReportConfigurations();
        const next = [config, ...existing.filter((r) => r.id !== config.id)].slice(0, 100);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // Quota, private mode, or serialization — ignore
    }
}

export function readSessionCreatedReportConfigurations(): ReportConfiguration[] {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw) as ReportConfiguration[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/** Prepend session-created configs, then static samples; first occurrence of each id wins. */
export function mergeSessionReportsWithSample(
    sampleReports: ReportConfiguration[]
): ReportConfiguration[] {
    const session = readSessionCreatedReportConfigurations();
    const seen = new Set<string>();
    const out: ReportConfiguration[] = [];
    for (const r of session) {
        if (r?.id && !seen.has(r.id)) {
            seen.add(r.id);
            out.push(r);
        }
    }
    for (const r of sampleReports) {
        if (r?.id && !seen.has(r.id)) {
            seen.add(r.id);
            out.push(r);
        }
    }
    return out;
}
