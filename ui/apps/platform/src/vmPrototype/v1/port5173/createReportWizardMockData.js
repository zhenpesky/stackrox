// Centralized mock data — single source of truth for the entire prototype.
// All pages import from here to ensure consistent cluster names, deployment
// names, counts, and severity numbers across the UI.
//
// IMPORTANT: These shapes match the real StackRox API response format exactly.
// When liveSync is active, these arrays are replaced in-place with real data.

// ---------------------------------------------------------------------------
// Clusters — matches GET /v1/clusters response shape
// ---------------------------------------------------------------------------
export const CLUSTERS = [
  {
    id: "cluster-001",
    name: "staging-central-cluster",
    type: "OPENSHIFT4_CLUSTER",
    labels: { environment: "staging", region: "us-east-1" },
    status: {
      sensorVersion: "4.6.0",
      providerMetadata: {
        region: "us-east-1",
        cluster: { type: "OCP", name: "staging-central-sshg4" },
      },
      certExpiryStatus: { sensorCertExpiry: "2027-01-15T00:00:00Z" },
    },
    healthStatus: {
      overallHealthStatus: "HEALTHY",
      sensorHealthStatus: "HEALTHY",
      collectorHealthStatus: "HEALTHY",
      admissionControlHealthStatus: "HEALTHY",
      lastContact: "2026-03-30T08:00:00Z",
    },
    priority: "1",
  },
  {
    id: "cluster-002",
    name: "staging-secured-cluster",
    type: "OPENSHIFT4_CLUSTER",
    labels: { environment: "staging", region: "us-west-2" },
    status: {
      sensorVersion: "4.6.0",
      providerMetadata: {
        region: "us-west-2",
        cluster: { type: "OCP", name: "staging-secured-abc1" },
      },
      certExpiryStatus: { sensorCertExpiry: "2027-01-15T00:00:00Z" },
    },
    healthStatus: {
      overallHealthStatus: "HEALTHY",
      sensorHealthStatus: "HEALTHY",
      collectorHealthStatus: "HEALTHY",
      admissionControlHealthStatus: "HEALTHY",
      lastContact: "2026-03-30T08:00:00Z",
    },
    priority: "2",
  },
  {
    id: "cluster-003",
    name: "prod-cluster-east",
    type: "KUBERNETES_CLUSTER",
    labels: { environment: "production", region: "us-east4" },
    status: {
      sensorVersion: "4.6.0",
      providerMetadata: {
        region: "us-east4",
        cluster: { type: "GKE", name: "prod-cluster-east-gke" },
      },
      certExpiryStatus: { sensorCertExpiry: "2027-03-20T00:00:00Z" },
    },
    healthStatus: {
      overallHealthStatus: "HEALTHY",
      sensorHealthStatus: "HEALTHY",
      collectorHealthStatus: "HEALTHY",
      admissionControlHealthStatus: "HEALTHY",
      lastContact: "2026-03-30T07:45:00Z",
    },
    priority: "3",
  },
  {
    id: "cluster-004",
    name: "dev-cluster",
    type: "KUBERNETES_CLUSTER",
    labels: { environment: "development", region: "eastus" },
    status: {
      sensorVersion: "4.5.3",
      providerMetadata: {
        region: "eastus",
        cluster: { type: "AKS", name: "dev-cluster-aks" },
      },
      certExpiryStatus: { sensorCertExpiry: "2026-09-10T00:00:00Z" },
    },
    healthStatus: {
      overallHealthStatus: "DEGRADED",
      sensorHealthStatus: "DEGRADED",
      collectorHealthStatus: "DEGRADED",
      admissionControlHealthStatus: "HEALTHY",
      lastContact: "2026-03-30T06:30:00Z",
    },
    priority: "4",
  },
  {
    id: "cluster-005",
    name: "test-cluster",
    type: "KUBERNETES_CLUSTER",
    labels: { environment: "test", region: "eu-west-1" },
    status: {
      sensorVersion: "4.6.0",
      providerMetadata: {
        region: "eu-west-1",
        cluster: { type: "EKS", name: "test-cluster-eks" },
      },
      certExpiryStatus: { sensorCertExpiry: "2027-06-01T00:00:00Z" },
    },
    healthStatus: {
      overallHealthStatus: "HEALTHY",
      sensorHealthStatus: "HEALTHY",
      collectorHealthStatus: "HEALTHY",
      admissionControlHealthStatus: "HEALTHY",
      lastContact: "2026-03-30T08:15:00Z",
    },
    priority: "5",
  },
];

// ---------------------------------------------------------------------------
// Summary counts (used by Dashboard top bar)
// Matches GraphQL summary_counts response shape
// ---------------------------------------------------------------------------
export const SUMMARY_COUNTS = {
  clusterCount: CLUSTERS.length,
  nodeCount: 17,
  violationCount: 10933,
  deploymentCount: 520,
  imageCount: 310,
  secretCount: 1927,
};

// ---------------------------------------------------------------------------
// Namespaces — matches GET /v1/namespaces response shape
// ---------------------------------------------------------------------------
export const NAMESPACES = [
  { metadata: { id: "ns-001", name: "openshift-machine-config-operator", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "openshift-machine-config-operator" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 8, numSecrets: 12, numNetworkPolicies: 0 },
  { metadata: { id: "ns-002", name: "default", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "default" }, creationTime: "2025-01-01T00:00:00Z", annotations: {} }, numDeployments: 12, numSecrets: 18, numNetworkPolicies: 2 },
  { metadata: { id: "ns-003", name: "openshift-dns", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "openshift-dns" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 4, numSecrets: 6, numNetworkPolicies: 0 },
  { metadata: { id: "ns-004", name: "openshift-monitoring", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "openshift-monitoring" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 6, numSecrets: 8, numNetworkPolicies: 1 },
  { metadata: { id: "ns-005", name: "openshift-apiserver", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "openshift-apiserver" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 5, numSecrets: 7, numNetworkPolicies: 0 },
  { metadata: { id: "ns-006", name: "stackrox", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "stackrox" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 10, numSecrets: 14, numNetworkPolicies: 3 },
  { metadata: { id: "ns-007", name: "kube-system", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "kube-system" }, creationTime: "2025-01-01T00:00:00Z", annotations: {} }, numDeployments: 15, numSecrets: 20, numNetworkPolicies: 0 },
  { metadata: { id: "ns-008", name: "openshift-operators", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "openshift-operators" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 8, numSecrets: 10, numNetworkPolicies: 0 },
  { metadata: { id: "ns-009", name: "openshift-ingress", clusterId: "cluster-002", clusterName: "staging-secured-cluster", labels: { "kubernetes.io/metadata.name": "openshift-ingress" }, creationTime: "2025-02-07T16:57:21Z", annotations: {} }, numDeployments: 3, numSecrets: 4, numNetworkPolicies: 1 },
  { metadata: { id: "ns-010", name: "cache", clusterId: "cluster-002", clusterName: "staging-secured-cluster", labels: { "kubernetes.io/metadata.name": "cache" }, creationTime: "2025-03-10T10:00:00Z", annotations: {} }, numDeployments: 4, numSecrets: 6, numNetworkPolicies: 0 },
  { metadata: { id: "ns-011", name: "database", clusterId: "cluster-002", clusterName: "staging-secured-cluster", labels: { "kubernetes.io/metadata.name": "database" }, creationTime: "2025-03-10T10:00:00Z", annotations: {} }, numDeployments: 3, numSecrets: 5, numNetworkPolicies: 0 },
  { metadata: { id: "ns-012", name: "monitoring", clusterId: "cluster-002", clusterName: "staging-secured-cluster", labels: { "kubernetes.io/metadata.name": "monitoring" }, creationTime: "2025-03-10T10:00:00Z", annotations: {} }, numDeployments: 6, numSecrets: 9, numNetworkPolicies: 2 },
  { metadata: { id: "ns-013", name: "jobs", clusterId: "cluster-002", clusterName: "staging-secured-cluster", labels: { "kubernetes.io/metadata.name": "jobs" }, creationTime: "2025-03-10T10:00:00Z", annotations: {} }, numDeployments: 5, numSecrets: 7, numNetworkPolicies: 0 },
  { metadata: { id: "ns-014", name: "my-webapp-ns", clusterId: "cluster-001", clusterName: "staging-central-cluster", labels: { "kubernetes.io/metadata.name": "my-webapp-ns" }, creationTime: "2025-06-15T12:00:00Z", annotations: {} }, numDeployments: 3, numSecrets: 4, numNetworkPolicies: 0 },
];

// ---------------------------------------------------------------------------
// Deployments — matches GraphQL getDeploymentList response shape
// ---------------------------------------------------------------------------
export const DEPLOYMENTS = [
  { id: "deploy-001", name: "machine-config-daemon", type: "DaemonSet", imageCVECountBySeverity: { critical: { total: 4 }, important: { total: 6 }, moderate: { total: 8 }, low: { total: 12 } }, clusterName: "staging-central-cluster", namespace: "openshift-machine-config-operator", imageCount: 1, created: "2023-01-15T10:30:00Z" },
  { id: "deploy-002", name: "my-webapp", type: "Deployment", imageCVECountBySeverity: { critical: { total: 2 }, important: { total: 3 }, moderate: { total: 5 }, low: { total: 1 } }, clusterName: "staging-central-cluster", namespace: "default", imageCount: 1, created: "2024-06-10T09:00:00Z" },
  { id: "deploy-003", name: "nginx-deployment", type: "Deployment", imageCVECountBySeverity: { critical: { total: 1 }, important: { total: 2 }, moderate: { total: 3 }, low: { total: 2 } }, clusterName: "staging-central-cluster", namespace: "default", imageCount: 1, created: "2024-03-20T14:45:00Z" },
  { id: "deploy-004", name: "api-gateway", type: "Deployment", imageCVECountBySeverity: { critical: { total: 0 }, important: { total: 1 }, moderate: { total: 2 }, low: { total: 1 } }, clusterName: "staging-secured-cluster", namespace: "default", imageCount: 2, created: "2023-04-18T13:45:00Z" },
  { id: "deploy-005", name: "redis-server", type: "Deployment", imageCVECountBySeverity: { critical: { total: 1 }, important: { total: 1 }, moderate: { total: 0 }, low: { total: 0 } }, clusterName: "staging-secured-cluster", namespace: "cache", imageCount: 1, created: "2023-06-12T11:30:00Z" },
  { id: "deploy-006", name: "postgres-db", type: "StatefulSet", imageCVECountBySeverity: { critical: { total: 3 }, important: { total: 2 }, moderate: { total: 1 }, low: { total: 4 } }, clusterName: "staging-secured-cluster", namespace: "database", imageCount: 1, created: "2021-08-22T08:15:00Z" },
  { id: "deploy-007", name: "frontend-app", type: "Deployment", imageCVECountBySeverity: { critical: { total: 0 }, important: { total: 2 }, moderate: { total: 4 }, low: { total: 3 } }, clusterName: "staging-secured-cluster", namespace: "default", imageCount: 1, created: "2024-09-01T10:00:00Z" },
  { id: "deploy-008", name: "monitoring-agent", type: "Deployment", imageCVECountBySeverity: { critical: { total: 1 }, important: { total: 3 }, moderate: { total: 0 }, low: { total: 0 } }, clusterName: "staging-secured-cluster", namespace: "monitoring", imageCount: 1, created: "2023-05-30T10:00:00Z" },
  { id: "deploy-009", name: "worker-process", type: "Deployment", imageCVECountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 2 }, low: { total: 5 } }, clusterName: "staging-secured-cluster", namespace: "jobs", imageCount: 1, created: "2024-01-10T16:20:00Z" },
  { id: "deploy-010", name: "batch-processor", type: "Deployment", imageCVECountBySeverity: { critical: { total: 0 }, important: { total: 1 }, moderate: { total: 1 }, low: { total: 2 } }, clusterName: "staging-central-cluster", namespace: "jobs", imageCount: 1, created: "2024-05-20T08:00:00Z" },
  { id: "deploy-011", name: "test-runner", type: "Deployment", imageCVECountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 1 }, low: { total: 1 } }, clusterName: "test-cluster", namespace: "default", imageCount: 1, created: "2025-01-05T12:00:00Z" },
  { id: "deploy-012", name: "machine-config-daemon", type: "DaemonSet", imageCVECountBySeverity: { critical: { total: 3 }, important: { total: 5 }, moderate: { total: 6 }, low: { total: 10 } }, clusterName: "staging-secured-cluster", namespace: "openshift-machine-config-operator", imageCount: 1, created: "2023-01-15T10:30:00Z" },
];

// ---------------------------------------------------------------------------
// Violation severity breakdown (used by Dashboard & ConfigManagement)
// ---------------------------------------------------------------------------
export const VIOLATION_SEVERITY = {
  critical: 308,
  high: 3708,
  medium: 3499,
  low: 3418,
  total: 10933,
};

// ---------------------------------------------------------------------------
// Violations (representative subset — used by ViolationsPage)
// These are NOT synced from the API; kept in prototype-specific format.
// ---------------------------------------------------------------------------
export const VIOLATIONS = [
  { id: "v-001", policy: "Docker CIS 4.1: Ensure That a User for the Container Has Been Created", entity: "my-webapp", entityType: "Deployment", enforced: false, severity: "Low", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-30T08:15:00Z", state: "Active" },
  { id: "v-002", policy: "Fixable CVSS >= 7", entity: "nginx-deployment", entityType: "Deployment", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-30T07:30:00Z", state: "Active" },
  { id: "v-003", policy: "A really old image", entity: "my-webapp", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-30T06:45:00Z", state: "Active" },
  { id: "v-004", policy: "Privileged Container", entity: "redis-server", entityType: "Deployment", enforced: true, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-29T22:10:00Z", state: "Active" },
  { id: "v-005", policy: "No resource requests or limits specified", entity: "api-gateway", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-29T20:05:00Z", state: "Active" },
  { id: "v-006", policy: "Curl in Image", entity: "worker-process", entityType: "Deployment", enforced: false, severity: "Low", categories: ["Security Best Practices"], lifecycle: "Build", time: "2026-03-29T18:30:00Z", state: "Active" },
  { id: "v-007", policy: "90-Day Image Age", entity: "postgres-db", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-29T15:20:00Z", state: "Active" },
  { id: "v-008", policy: "Fixable CVSS >= 7", entity: "frontend-app", entityType: "Deployment", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-29T12:00:00Z", state: "Active" },
  { id: "v-009", policy: "Latest tag", entity: "monitoring-agent", entityType: "Deployment", enforced: false, severity: "Low", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-29T10:45:00Z", state: "Active" },
  { id: "v-010", policy: "Container using read-write root filesystem", entity: "batch-processor", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-29T09:00:00Z", state: "Active" },

  { id: "v-011", policy: "Docker CIS 5.9: Ensure That the Host's Network Namespace Is Not Shared", entity: "network-monitor", entityType: "Deployment", enforced: false, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-28T16:30:00Z", state: "Resolved" },
  { id: "v-012", policy: "Fixable CVSS >= 7", entity: "legacy-api", entityType: "Deployment", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-27T14:20:00Z", state: "Resolved" },
  { id: "v-013", policy: "90-Day Image Age", entity: "cron-scheduler", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-26T09:15:00Z", state: "Resolved" },
  { id: "v-014", policy: "Privileged Container", entity: "debug-pod", entityType: "Deployment", enforced: true, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-25T11:00:00Z", state: "Resolved" },
  { id: "v-015", policy: "No resource requests or limits specified", entity: "temp-worker", entityType: "Deployment", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-24T08:45:00Z", state: "Resolved" },

  { id: "v-016", policy: "Curl in Image", entity: "init-container", entityType: "Deployment", enforced: false, severity: "Low", categories: ["Security Best Practices"], lifecycle: "Build", time: "2026-03-28T12:00:00Z", state: "Attempted" },
  { id: "v-017", policy: "Fixable CVSS >= 7", entity: "staging-api", entityType: "Deployment", enforced: true, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-27T10:30:00Z", state: "Attempted" },
  { id: "v-018", policy: "Latest tag", entity: "test-runner", entityType: "Deployment", enforced: false, severity: "Low", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-26T15:45:00Z", state: "Attempted" },

  { id: "v-019", policy: "Kubernetes Dashboard Deployed", entity: "kube-system", entityType: "Platform", enforced: false, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-30T05:00:00Z", state: "Active" },
  { id: "v-020", policy: "Fixable CVSS >= 7", entity: "openshift-apiserver", entityType: "Platform", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-29T14:30:00Z", state: "Active" },
  { id: "v-021", policy: "No resource requests or limits specified", entity: "kube-controller-manager", entityType: "Platform", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-29T11:20:00Z", state: "Active" },
  { id: "v-022", policy: "90-Day Image Age", entity: "etcd-operator", entityType: "Platform", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-28T18:45:00Z", state: "Active" },
  { id: "v-023", policy: "Privileged Container", entity: "kube-proxy", entityType: "Platform", enforced: true, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-28T10:00:00Z", state: "Resolved" },
  { id: "v-024", policy: "Docker CIS 4.1: Ensure That a User for the Container Has Been Created", entity: "coredns", entityType: "Platform", enforced: false, severity: "Low", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-27T09:30:00Z", state: "Resolved" },
  { id: "v-025", policy: "Fixable CVSS >= 7", entity: "openshift-ingress", entityType: "Platform", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Build", time: "2026-03-26T16:00:00Z", state: "Attempted" },

  { id: "v-026", policy: "Kernel CVE Detected", entity: "worker-node-1", entityType: "Node", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Deploy", time: "2026-03-30T04:15:00Z", state: "Active" },
  { id: "v-027", policy: "CIS Benchmark - Kubelet Configuration", entity: "worker-node-2", entityType: "Node", enforced: false, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-29T19:30:00Z", state: "Active" },
  { id: "v-028", policy: "Node Using Outdated Container Runtime", entity: "master-node-1", entityType: "Node", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-29T08:00:00Z", state: "Active" },
  { id: "v-029", policy: "Kernel CVE Detected", entity: "worker-node-3", entityType: "Node", enforced: false, severity: "Critical", categories: ["Vulnerability Management"], lifecycle: "Deploy", time: "2026-03-27T12:00:00Z", state: "Resolved" },
  { id: "v-030", policy: "CIS Benchmark - Kubelet Configuration", entity: "master-node-2", entityType: "Node", enforced: false, severity: "High", categories: ["Security Best Practices"], lifecycle: "Deploy", time: "2026-03-26T07:00:00Z", state: "Resolved" },
  { id: "v-031", policy: "Node Using Outdated Container Runtime", entity: "worker-node-4", entityType: "Node", enforced: false, severity: "Medium", categories: ["DevOps Best Practices"], lifecycle: "Deploy", time: "2026-03-25T14:30:00Z", state: "Attempted" },
];

// ---------------------------------------------------------------------------
// Policies — matches GET /v1/policies response shape
// ---------------------------------------------------------------------------
export const POLICIES = [
  { id: "pol-001", name: "Docker CIS 4.1: Ensure a user for the container", severity: "LOW_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Ensure that a non-root user is specified for the container" },
  { id: "pol-002", name: "Fixable CVSS >= 7", severity: "CRITICAL_SEVERITY", disabled: false, lifecycleStages: ["BUILD"], notifiers: ["notif-001"], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on deployments with fixable vulnerabilities with a CVSS of at least 7" },
  { id: "pol-003", name: "A really old image", severity: "MEDIUM_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on deployments with images that haven't been updated" },
  { id: "pol-004", name: "Privileged Container", severity: "HIGH_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: ["notif-001", "notif-002"], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on deployments with containers running in privileged mode" },
  { id: "pol-005", name: "No resource requests or limits specified", severity: "MEDIUM_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert when no resource requests or limits are specified" },
  { id: "pol-006", name: "Curl in Image", severity: "LOW_SEVERITY", disabled: true, lifecycleStages: ["BUILD"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on images that contain curl" },
  { id: "pol-007", name: "90-Day Image Age", severity: "MEDIUM_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on deployments with images that are older than 90 days" },
  { id: "pol-008", name: "Latest tag", severity: "LOW_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on images that use the latest tag" },
  { id: "pol-009", name: "Container using read-write root filesystem", severity: "MEDIUM_SEVERITY", disabled: false, lifecycleStages: ["DEPLOY"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on containers using a read-write root filesystem" },
  { id: "pol-010", name: "Red Hat Package Manager in Image", severity: "LOW_SEVERITY", disabled: false, lifecycleStages: ["BUILD"], notifiers: [], lastUpdated: "2025-06-19T12:30:09Z", isDefault: true, source: "IMPERATIVE", description: "Alert on images that contain Red Hat package managers" },
];

// ---------------------------------------------------------------------------
// CVEs — matches GraphQL getImageCVEList response shape
// ---------------------------------------------------------------------------
export const CVES = [
  { cve: "CVE-2023-44487", affectedImageCountBySeverity: { critical: { total: 5 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 5, firstDiscoveredInSystem: "2023-10-10T00:00:00Z", publishedOn: "2023-10-10T00:00:00Z", distroTuples: [{ summary: "HTTP/2 Rapid Reset Attack", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-5363", affectedImageCountBySeverity: { critical: { total: 8 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 9.8, affectedImageCount: 8, firstDiscoveredInSystem: "2023-10-24T00:00:00Z", publishedOn: "2023-10-24T00:00:00Z", distroTuples: [{ summary: "OpenSSL: Incorrect cipher key and IV length processing", operatingSystem: "rhel:9", cvss: 9.8, scoreVersion: "V3" }] },
  { cve: "CVE-2023-39325", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 10 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 10, firstDiscoveredInSystem: "2023-10-11T00:00:00Z", publishedOn: "2023-10-11T00:00:00Z", distroTuples: [{ summary: "golang: net/http, x/net/http2: rapid stream resets can cause excessive work", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-45853", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 4 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 9.8, affectedImageCount: 4, firstDiscoveredInSystem: "2023-10-14T00:00:00Z", publishedOn: "2023-10-14T00:00:00Z", distroTuples: [{ summary: "zlib: integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64", operatingSystem: "rhel:9", cvss: 9.8, scoreVersion: "V3" }] },
  { cve: "CVE-2023-4911", affectedImageCountBySeverity: { critical: { total: 15 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.8, affectedImageCount: 15, firstDiscoveredInSystem: "2023-10-03T00:00:00Z", publishedOn: "2023-10-03T00:00:00Z", distroTuples: [{ summary: "glibc: buffer overflow in ld.so leading to privilege escalation", operatingSystem: "rhel:9", cvss: 7.8, scoreVersion: "V3" }] },
  { cve: "CVE-2023-38545", affectedImageCountBySeverity: { critical: { total: 12 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 9.8, affectedImageCount: 12, firstDiscoveredInSystem: "2023-10-11T00:00:00Z", publishedOn: "2023-10-11T00:00:00Z", distroTuples: [{ summary: "curl: heap based buffer overflow in the SOCKS5 proxy handshake", operatingSystem: "rhel:9", cvss: 9.8, scoreVersion: "V3" }] },
  { cve: "CVE-2024-21626", affectedImageCountBySeverity: { critical: { total: 14 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 8.6, affectedImageCount: 14, firstDiscoveredInSystem: "2024-01-31T00:00:00Z", publishedOn: "2024-01-31T00:00:00Z", distroTuples: [{ summary: "runc: file descriptor leak allows container breakout", operatingSystem: "rhel:9", cvss: 8.6, scoreVersion: "V3" }] },
  { cve: "CVE-2024-3094", affectedImageCountBySeverity: { critical: { total: 3 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 10.0, affectedImageCount: 3, firstDiscoveredInSystem: "2024-03-29T00:00:00Z", publishedOn: "2024-03-29T00:00:00Z", distroTuples: [{ summary: "xz-utils: backdoor in upstream xz/liblzma", operatingSystem: "rhel:9", cvss: 10.0, scoreVersion: "V3" }] },
  { cve: "CVE-2024-0567", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 6 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 6, firstDiscoveredInSystem: "2024-01-16T00:00:00Z", publishedOn: "2024-01-16T00:00:00Z", distroTuples: [{ summary: "GnuTLS: incomplete verification of chain with PKCS#11 certs", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-6246", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 11 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.8, affectedImageCount: 11, firstDiscoveredInSystem: "2024-01-30T00:00:00Z", publishedOn: "2024-01-30T00:00:00Z", distroTuples: [{ summary: "glibc: heap-based buffer overflow in __vsyslog_internal", operatingSystem: "rhel:9", cvss: 7.8, scoreVersion: "V3" }] },
  { cve: "CVE-2023-50387", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 2 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 2, firstDiscoveredInSystem: "2024-02-13T00:00:00Z", publishedOn: "2024-02-13T00:00:00Z", distroTuples: [{ summary: "bind9: KeyTrap - Extreme CPU consumption in DNSSEC validator", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2024-24786", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 9 }, low: { total: 0 } }, topCVSS: 5.9, affectedImageCount: 9, firstDiscoveredInSystem: "2024-03-05T00:00:00Z", publishedOn: "2024-03-05T00:00:00Z", distroTuples: [{ summary: "golang-protobuf: infinite loop when unmarshaling certain forms of invalid protobuf", operatingSystem: "rhel:9", cvss: 5.9, scoreVersion: "V3" }] },
  { cve: "CVE-2023-48795", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 7 }, low: { total: 0 } }, topCVSS: 5.9, affectedImageCount: 7, firstDiscoveredInSystem: "2023-12-18T00:00:00Z", publishedOn: "2023-12-18T00:00:00Z", distroTuples: [{ summary: "ssh: Terrapin attack — prefix truncation attack on Binary Packet Protocol", operatingSystem: "rhel:9", cvss: 5.9, scoreVersion: "V3" }] },
  { cve: "CVE-2023-6129", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 5 }, low: { total: 0 } }, topCVSS: 6.5, affectedImageCount: 5, firstDiscoveredInSystem: "2024-01-09T00:00:00Z", publishedOn: "2024-01-09T00:00:00Z", distroTuples: [{ summary: "openssl: POLY1305 MAC implementation corrupts vector registers on PowerPC", operatingSystem: "rhel:9", cvss: 6.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-5678", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 6 }, low: { total: 0 } }, topCVSS: 5.3, affectedImageCount: 6, firstDiscoveredInSystem: "2023-11-06T00:00:00Z", publishedOn: "2023-11-06T00:00:00Z", distroTuples: [{ summary: "openssl: Generating excessively long X9.42 DH keys", operatingSystem: "rhel:9", cvss: 5.3, scoreVersion: "V3" }] },
  { cve: "CVE-2023-46218", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 10 }, low: { total: 0 } }, topCVSS: 6.5, affectedImageCount: 10, firstDiscoveredInSystem: "2023-12-06T00:00:00Z", publishedOn: "2023-12-06T00:00:00Z", distroTuples: [{ summary: "curl: cookie mixed case PSL bypass", operatingSystem: "rhel:9", cvss: 6.5, scoreVersion: "V3" }] },
  { cve: "CVE-2024-0727", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 5 }, low: { total: 0 } }, topCVSS: 5.5, affectedImageCount: 5, firstDiscoveredInSystem: "2024-01-26T00:00:00Z", publishedOn: "2024-01-26T00:00:00Z", distroTuples: [{ summary: "openssl: denial of service via null dereference", operatingSystem: "rhel:9", cvss: 5.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-52425", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 4 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 4, firstDiscoveredInSystem: "2024-02-04T00:00:00Z", publishedOn: "2024-02-04T00:00:00Z", distroTuples: [{ summary: "expat: parsing large tokens can trigger a denial of service", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2023-7104", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 3 } }, topCVSS: 3.3, affectedImageCount: 3, firstDiscoveredInSystem: "2023-12-29T00:00:00Z", publishedOn: "2023-12-29T00:00:00Z", distroTuples: [{ summary: "sqlite: heap-buffer-overflow in sessionReadRecord", operatingSystem: "rhel:9", cvss: 3.3, scoreVersion: "V3" }] },
  { cve: "CVE-2023-6237", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 6 } }, topCVSS: 3.7, affectedImageCount: 6, firstDiscoveredInSystem: "2024-01-15T00:00:00Z", publishedOn: "2024-01-15T00:00:00Z", distroTuples: [{ summary: "openssl: Excessive time spent checking invalid RSA public keys", operatingSystem: "rhel:9", cvss: 3.7, scoreVersion: "V3" }] },
  { cve: "CVE-2023-5156", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 11 } }, topCVSS: 3.7, affectedImageCount: 11, firstDiscoveredInSystem: "2023-09-25T00:00:00Z", publishedOn: "2023-09-25T00:00:00Z", distroTuples: [{ summary: "glibc: DoS due to memory leak in getaddrinfo", operatingSystem: "rhel:9", cvss: 3.7, scoreVersion: "V3" }] },
  { cve: "CVE-2024-22365", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 2 } }, topCVSS: 3.3, affectedImageCount: 2, firstDiscoveredInSystem: "2024-01-18T00:00:00Z", publishedOn: "2024-01-18T00:00:00Z", distroTuples: [{ summary: "pam: allowing unprivileged user to block another user namespace", operatingSystem: "rhel:9", cvss: 3.3, scoreVersion: "V3" }] },
  { cve: "CVE-2023-4016", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 4 } }, topCVSS: 3.3, affectedImageCount: 4, firstDiscoveredInSystem: "2023-08-02T00:00:00Z", publishedOn: "2023-08-02T00:00:00Z", distroTuples: [{ summary: "procps-ng: ps buffer overflow", operatingSystem: "rhel:9", cvss: 3.3, scoreVersion: "V3" }] },
  { cve: "CVE-2023-6779", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 11 }, moderate: { total: 0 }, low: { total: 0 } }, topCVSS: 7.5, affectedImageCount: 11, firstDiscoveredInSystem: "2024-01-30T00:00:00Z", publishedOn: "2024-01-30T00:00:00Z", distroTuples: [{ summary: "glibc: off-by-one heap-based buffer overflow in __vsyslog_internal", operatingSystem: "rhel:9", cvss: 7.5, scoreVersion: "V3" }] },
  { cve: "CVE-2024-28834", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 6 }, low: { total: 0 } }, topCVSS: 5.3, affectedImageCount: 6, firstDiscoveredInSystem: "2024-03-21T00:00:00Z", publishedOn: "2024-03-21T00:00:00Z", distroTuples: [{ summary: "GnuTLS: side-channel in deterministic ECDSA", operatingSystem: "rhel:9", cvss: 5.3, scoreVersion: "V3" }] },
  { cve: "CVE-2023-51385", affectedImageCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 7 }, low: { total: 0 } }, topCVSS: 6.5, affectedImageCount: 7, firstDiscoveredInSystem: "2023-12-18T00:00:00Z", publishedOn: "2023-12-18T00:00:00Z", distroTuples: [{ summary: "openssh: OS command injection via ProxyCommand expansion", operatingSystem: "rhel:9", cvss: 6.5, scoreVersion: "V3" }] },
];

export const PLATFORM_CVES = [
  { id: "CVE-2026-1234", cve: "CVE-2026-1234", severity: "Critical", cvss: 9.1, type: "Kubernetes", affectedComponents: "kube-apiserver", fixedIn: "1.28.5", firstDiscovered: "2026-03-15T00:00:00Z" },
  { id: "CVE-2026-1235", cve: "CVE-2026-1235", severity: "Critical", cvss: 8.8, type: "Kubernetes", affectedComponents: "etcd", fixedIn: "3.5.12", firstDiscovered: "2026-03-10T00:00:00Z" },
  { id: "CVE-2025-4567", cve: "CVE-2025-4567", severity: "Important", cvss: 7.5, type: "Istio", affectedComponents: "istiod", fixedIn: "1.20.3", firstDiscovered: "2025-12-20T00:00:00Z" },
  { id: "CVE-2025-7890", cve: "CVE-2025-7890", severity: "Important", cvss: 7.2, type: "OpenShift", affectedComponents: "openshift-controller-manager", fixedIn: "4.14.12", firstDiscovered: "2025-11-05T00:00:00Z" },
  { id: "CVE-2025-3456", cve: "CVE-2025-3456", severity: "Moderate", cvss: 5.3, type: "Kubernetes", affectedComponents: "kube-scheduler", fixedIn: "—", firstDiscovered: "2025-10-18T00:00:00Z" },
];

export const NODE_CVES = [
  { id: "NCVE-001", cve: "CVE-2026-2001", severity: "Critical", cvss: 9.8, affectedNodes: 12, fixable: "Yes", os: "RHCOS 4.14", firstDiscovered: "2026-03-20T00:00:00Z" },
  { id: "NCVE-002", cve: "CVE-2026-2002", severity: "Important", cvss: 7.5, affectedNodes: 8, fixable: "Yes", os: "RHCOS 4.14", firstDiscovered: "2026-03-15T00:00:00Z" },
  { id: "NCVE-003", cve: "CVE-2025-5001", severity: "Important", cvss: 7.1, affectedNodes: 17, fixable: "No", os: "RHCOS 4.13", firstDiscovered: "2025-12-01T00:00:00Z" },
  { id: "NCVE-004", cve: "CVE-2025-5002", severity: "Moderate", cvss: 5.5, affectedNodes: 4, fixable: "Yes", os: "RHCOS 4.14", firstDiscovered: "2025-11-10T00:00:00Z" },
  { id: "NCVE-005", cve: "CVE-2025-5003", severity: "Low", cvss: 3.1, affectedNodes: 17, fixable: "No", os: "RHCOS 4.13", firstDiscovered: "2025-10-05T00:00:00Z" },
];

// ---------------------------------------------------------------------------
// Saved filters (used by UserWorkloadVulnerabilities)
// ---------------------------------------------------------------------------
export const SAVED_FILTERS = [
  { id: "filter-001", name: "Staging cluster only", description: "Filter for staging cluster deployments", filters: { clusterName: ["staging-secured-cluster"], namespaceName: [], deploymentName: [], severity: [], cveStatus: [] }, createdBy: "admin@example.com", createdAt: "2023-06-15T10:00:00Z" },
  { id: "filter-002", name: "Critical fixable", description: "Critical fixable vulnerabilities", filters: { clusterName: [], namespaceName: [], deploymentName: [], severity: ["Critical"], cveStatus: ["Fixable"] }, createdBy: "admin@example.com", createdAt: "2023-07-20T14:30:00Z" },
  { id: "filter-003", name: "Production critical", description: "Critical vulnerabilities in production clusters", filters: { clusterName: ["prod-cluster-east"], namespaceName: [], deploymentName: [], severity: ["Critical"], cveStatus: [] }, createdBy: "secops@example.com", createdAt: "2023-09-01T11:00:00Z" },
  { id: "filter-004", name: "Cache namespace", description: "Cache namespace deployments", filters: { clusterName: [], namespaceName: ["cache"], deploymentName: [], severity: [], cveStatus: [] }, createdBy: "admin@example.com", createdAt: "2023-09-15T16:45:00Z" },
  { id: "filter-005", name: "Database deployments", description: "Database tier deployments", filters: { clusterName: [], namespaceName: ["database"], deploymentName: ["postgres-db"], severity: [], cveStatus: [] }, createdBy: "secops@example.com", createdAt: "2023-08-10T09:15:00Z" },
];

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------
export const REPORTS = [
  { id: "report-001", name: "workload-vulnerabilities-2024-01-15", type: "VIEW_BASED", status: "COMPLETED", createdAt: "2024-01-15T10:30:00Z", completedAt: "2024-01-15T10:32:15Z", downloadUrl: "/reports/report-001.csv", filters: { severity: ["Critical", "Important"], cveStatus: ["Fixable"] }, rowCount: 245 },
  { id: "report-002", name: "production-security-audit-2024-01", type: "SCHEDULED", status: "COMPLETED", createdAt: "2024-01-01T00:00:00Z", completedAt: "2024-01-01T00:05:30Z", downloadUrl: "/reports/report-002.csv", filters: { clusterName: ["prod-cluster-east"] }, rowCount: 1024 },
  { id: "report-003", name: "weekly-vulnerability-summary", type: "SCHEDULED", status: "GENERATING", createdAt: "2024-01-22T00:00:00Z", filters: { severity: ["Critical"] }, rowCount: null },
];

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------
export const COLLECTIONS = [
  { id: "col-001", name: "Production Workloads", description: "All production environment deployments across clusters" },
  { id: "col-002", name: "Staging Environment", description: "Deployments in staging-central-cluster and staging-secured-cluster" },
  { id: "col-003", name: "External-Facing Services", description: "Services exposed via ingress or load balancer" },
  { id: "col-004", name: "Database Deployments", description: "All database-tier deployments including postgres-db and redis-server" },
  { id: "col-005", name: "CI/CD Pipeline", description: "Build and deployment pipeline components" },
  { id: "col-006", name: "Monitoring Stack", description: "Prometheus, monitoring-agent, and related monitoring workloads" },
];

// ---------------------------------------------------------------------------
// Compliance
// ---------------------------------------------------------------------------
export const COMPLIANCE_PROFILES = [
  { id: "prof-001", name: "ocp4-cis", totalChecks: 85, passing: 62, failing: 10, manual: 8, other: 5, compliance: 73 },
  { id: "prof-002", name: "ocp4-cis-node", totalChecks: 42, passing: 35, failing: 3, manual: 2, other: 2, compliance: 83 },
  { id: "prof-003", name: "rhcos4-moderate", totalChecks: 128, passing: 99, failing: 12, manual: 10, other: 7, compliance: 77 },
];

export const COMPLIANCE_CHECKS = [
  { id: "chk-001", control: "CIS 1.2.1", description: "Ensure that the API server pod spec file has appropriate permissions", status: "Pass", cluster: "staging-central-cluster" },
  { id: "chk-002", control: "CIS 1.2.2", description: "Ensure that the API server pod spec file ownership is set correctly", status: "Pass", cluster: "staging-central-cluster" },
  { id: "chk-003", control: "CIS 1.2.3", description: "Ensure that the controller manager pod spec file has appropriate permissions", status: "Fail", cluster: "staging-central-cluster" },
  { id: "chk-004", control: "CIS 1.2.4", description: "Ensure that the controller manager pod spec file ownership is set correctly", status: "Pass", cluster: "staging-secured-cluster" },
  { id: "chk-005", control: "CIS 1.2.5", description: "Ensure that the scheduler pod spec file has appropriate permissions", status: "Manual", cluster: "prod-cluster-east" },
  { id: "chk-006", control: "CIS 4.2.1", description: "Minimize the admission of privileged containers", status: "Fail", cluster: "dev-cluster" },
];

export const COMPLIANCE_SCHEDULES = [
  { id: "sched-001", name: "Daily CIS Scan", schedule: "Daily at 2:00 AM UTC", lastScanned: "2026-03-30T02:00:00Z", clusters: 2, profiles: "ocp4-cis, ocp4-cis-node" },
  { id: "sched-002", name: "Weekly Moderate Scan", schedule: "Sundays at 3:00 AM UTC", lastScanned: "2026-03-24T03:00:00Z", clusters: 2, profiles: "rhcos4-moderate" },
  { id: "sched-003", name: "Monthly PCI Scan", schedule: "1st of month at 4:00 AM UTC", lastScanned: "2026-03-01T04:00:00Z", clusters: CLUSTERS.length, profiles: "ocp4-pci-dss" },
];

// ---------------------------------------------------------------------------
// Listening endpoints
// ---------------------------------------------------------------------------
export const LISTENING_ENDPOINTS = [
  { id: "ep-001", deployment: "nginx-deployment", namespace: "default", cluster: "staging-central-cluster", port: 443, protocol: "TCP", exposure: "Route" },
  { id: "ep-002", deployment: "api-gateway", namespace: "default", cluster: "staging-secured-cluster", port: 8443, protocol: "TCP", exposure: "Route" },
  { id: "ep-003", deployment: "redis-server", namespace: "cache", cluster: "staging-secured-cluster", port: 6379, protocol: "TCP", exposure: "ClusterIP" },
  { id: "ep-004", deployment: "postgres-db", namespace: "database", cluster: "staging-secured-cluster", port: 5432, protocol: "TCP", exposure: "ClusterIP" },
  { id: "ep-005", deployment: "monitoring-agent", namespace: "monitoring", cluster: "staging-secured-cluster", port: 9090, protocol: "TCP", exposure: "ClusterIP" },
  { id: "ep-006", deployment: "frontend-app", namespace: "default", cluster: "staging-secured-cluster", port: 3000, protocol: "TCP", exposure: "Route" },
  { id: "ep-007", deployment: "worker-process", namespace: "jobs", cluster: "staging-secured-cluster", port: 8080, protocol: "TCP", exposure: "ClusterIP" },
];

// ---------------------------------------------------------------------------
// Network graph data
// ---------------------------------------------------------------------------
export const NETWORK_NAMESPACES = [
  ["openshift-dns", "openshift-monitoring", "openshift-apiserver", "stackrox", "default", "kube-system"],
  ["openshift-operators", "openshift-machine-config-operator", "openshift-ingress", "my-webapp-ns"],
];

// ---------------------------------------------------------------------------
// Integrations
// ---------------------------------------------------------------------------
export const INTEGRATIONS = {
  imageIntegrations: [
    { name: "Docker Registry", count: 1 },
    { name: "Quay.io", count: 1 },
    { name: "Red Hat Registry", count: 1 },
    { name: "Google Container Registry", count: 0 },
    { name: "Amazon ECR", count: 0 },
    { name: "Azure Container Registry", count: 0 },
    { name: "Artifactory", count: 0 },
    { name: "Nexus", count: 0 },
  ],
  notifiers: [
    { name: "Slack", count: 2 },
    { name: "Email", count: 1 },
    { name: "Splunk", count: 1 },
    { name: "PagerDuty", count: 0 },
    { name: "Jira", count: 0 },
    { name: "Google Cloud SCC", count: 0 },
    { name: "Sumo Logic", count: 0 },
    { name: "Microsoft Sentinel", count: 0 },
    { name: "Syslog", count: 0 },
    { name: "Generic Webhook", count: 0 },
  ],
  backupIntegrations: [
    { name: "Amazon S3", count: 1 },
    { name: "Google Cloud Storage", count: 0 },
  ],
};

// ---------------------------------------------------------------------------
// Access control
// ---------------------------------------------------------------------------
export const AUTH_PROVIDERS = [
  { id: "ap-001", name: "OpenID Connect", type: "oidc", minimumRole: "None", rules: 3 },
  { id: "ap-002", name: "API Token", type: "api_token", minimumRole: "None", rules: 0 },
];

export const ROLES = [
  { id: "role-001", name: "Admin", description: "Full system access", permissionSet: "Unrestricted", accessScope: "Unrestricted", origin: "System" },
  { id: "role-002", name: "Analyst", description: "Read-only access to most resources", permissionSet: "Analyst", accessScope: "Unrestricted", origin: "System" },
  { id: "role-003", name: "Continuous Integration", description: "For CI/CD automation", permissionSet: "Continuous Integration", accessScope: "Unrestricted", origin: "System" },
  { id: "role-004", name: "None", description: "No permissions", permissionSet: "Deny All", accessScope: "Unrestricted", origin: "System" },
  { id: "role-005", name: "Scope Manager", description: "Can manage access scopes", permissionSet: "Scope Manager", accessScope: "Unrestricted", origin: "System" },
  { id: "role-006", name: "Sensor Creator", description: "Can create sensors", permissionSet: "Sensor Creator", accessScope: "Unrestricted", origin: "System" },
  { id: "role-007", name: "Vulnerability Management Approver", description: "Can approve vulnerability exceptions", permissionSet: "Vuln Mgmt Approver", accessScope: "Unrestricted", origin: "System" },
  { id: "role-008", name: "Vulnerability Management Requester", description: "Can request vulnerability exceptions", permissionSet: "Vuln Mgmt Requester", accessScope: "Unrestricted", origin: "System" },
  { id: "role-009", name: "Vulnerability Reporter", description: "Can create vulnerability reports", permissionSet: "Vuln Reporter", accessScope: "Unrestricted", origin: "System" },
];

// ---------------------------------------------------------------------------
// Exception management
// ---------------------------------------------------------------------------
export const EXCEPTIONS = [
  { id: "exc-001", name: "Defer CVE-2025-4567 for api-gateway", requester: "admin@example.com", scope: "api-gateway (staging-secured-cluster)", severity: "Important", status: "Pending", expires: "2026-06-30T00:00:00Z", created: "2026-03-15T10:00:00Z" },
  { id: "exc-002", name: "FP: CVE-2025-7890 not exploitable", requester: "secops@example.com", scope: "All deployments", severity: "Important", status: "Approved (Deferral)", expires: "2026-12-31T00:00:00Z", created: "2026-02-20T14:00:00Z" },
  { id: "exc-003", name: "Defer CVE-2025-3456 for test-runner", requester: "dev@example.com", scope: "test-runner (test-cluster)", severity: "Moderate", status: "Approved (Deferral)", expires: "2026-09-30T00:00:00Z", created: "2026-01-10T09:00:00Z" },
  { id: "exc-004", name: "FP: CVE-2026-1234 false positive", requester: "admin@example.com", scope: "staging-central-cluster", severity: "Critical", status: "Denied", expires: "—", created: "2026-03-20T16:00:00Z" },
];

// ---------------------------------------------------------------------------
// Administration events
// ---------------------------------------------------------------------------
export const ADMIN_EVENTS = [
  { id: "evt-001", domain: "Image Scanning", type: "Info", resource: "quay.io/stackrox-io/main:4.6.0", level: "Info", lastOccurred: "2026-03-30T08:00:00Z", count: 1 },
  { id: "evt-002", domain: "Compliance", type: "Info", resource: "ocp4-cis", level: "Info", lastOccurred: "2026-03-30T02:05:00Z", count: 3 },
  { id: "evt-003", domain: "Authentication", type: "Success", resource: "admin@example.com", level: "Info", lastOccurred: "2026-03-30T07:45:00Z", count: 12 },
  { id: "evt-004", domain: "Notifier", type: "Error", resource: "Slack - #security-alerts", level: "Error", lastOccurred: "2026-03-29T23:10:00Z", count: 5 },
  { id: "evt-005", domain: "Cluster", type: "Info", resource: "staging-central-cluster", level: "Info", lastOccurred: "2026-03-30T06:00:00Z", count: 2 },
  { id: "evt-006", domain: "Policy", type: "Info", resource: "Fixable CVSS >= 7", level: "Info", lastOccurred: "2026-03-30T07:30:00Z", count: 45 },
  { id: "evt-007", domain: "API Token", type: "Warning", resource: "ci-pipeline-token", level: "Warning", lastOccurred: "2026-03-29T14:00:00Z", count: 1 },
  { id: "evt-008", domain: "Image Scanning", type: "Error", resource: "internal-registry/custom-app:dev", level: "Error", lastOccurred: "2026-03-29T11:30:00Z", count: 8 },
];

// ---------------------------------------------------------------------------
// System config
// ---------------------------------------------------------------------------
export const SYSTEM_CONFIG = {
  retention: {
    resolvedDeployRetention: "24 hours",
    allRuntimeViolationsRetention: "90 days",
    deletedRuntimeViolationsRetention: "7 days",
    imageRetention: "90 days",
    maxImageRetention: "7 days",
  },
  public: {
    header: { enabled: false, text: "", color: "#000000", backgroundColor: "#FFFFFF" },
    footer: { enabled: false, text: "", color: "#000000", backgroundColor: "#FFFFFF" },
    loginNotice: { enabled: false, text: "" },
  },
  telemetry: { enabled: true },
};

// ---------------------------------------------------------------------------
// System health
// ---------------------------------------------------------------------------
export const SYSTEM_HEALTH = {
  clusterHealth: CLUSTERS.map((c) => ({
    name: c.name,
    sensorStatus: c.healthStatus?.sensorHealthStatus || "UNINITIALIZED",
    collectorStatus: c.healthStatus?.collectorHealthStatus || "UNINITIALIZED",
    admissionControlStatus: c.healthStatus?.admissionControlHealthStatus || "UNINITIALIZED",
  })),
  centralDb: { type: "PostgreSQL", usedStorage: "85.2 GB", totalStorage: "100 GB" },
  vulnerabilityDefs: { lastUpdated: "2026-03-30T02:00:00Z" },
  integrationHealth: {
    imageIntegrations: INTEGRATIONS.imageIntegrations.filter((i) => i.count > 0).length,
    notifiers: INTEGRATIONS.notifiers.filter((i) => i.count > 0).length,
    backupIntegrations: INTEGRATIONS.backupIntegrations.filter((i) => i.count > 0).length,
  },
};

// ---------------------------------------------------------------------------
// Dashboard widget data
// ---------------------------------------------------------------------------
export const DASHBOARD_WIDGETS = {
  violationsByPolicy: [
    { policy: "A really old image", count: 3, severity: "medium" },
    { policy: "A really old image", count: 2, severity: "medium" },
    { policy: "A really old image", count: 1, severity: "medium" },
  ],
  imagesAtMostRisk: [
    { name: "openshift-servic... helm-operator", critical: 12, important: 8, moderate: 5, low: 2 },
    { name: "openshift4/ose-... helm-operator", critical: 8, important: 6, moderate: 4, low: 1 },
    { name: "stehesse/snow-mid-server", critical: 5, important: 3, moderate: 2, low: 0 },
    { name: "ubi9/python-312", critical: 3, important: 2, moderate: 1, low: 0 },
    { name: "openshift4/ose-... emetes-rhel9", critical: 2, important: 1, moderate: 3, low: 2 },
    { name: "ubi9/python-312", critical: 1, important: 4, moderate: 2, low: 1 },
  ],
  deploymentsAtMostRisk: [
    { name: "machine-config-daemon", cluster: "staging-central-cluster", namespace: "openshift-machine-config-operator", riskScore: 9.5 },
    { name: "machine-config-daemon", cluster: "staging-secured-cluster", namespace: "openshift-machine-config-operator", riskScore: 9.3 },
  ],
  agingImages: { inactive30: 120, inactive60: 0, inactive90: 39, inactive180: 0, inactive365: 97 },
};

// ---------------------------------------------------------------------------
// Config Management dashboard
// ---------------------------------------------------------------------------
export const CONFIG_MANAGEMENT = {
  policyViolations: [
    { severity: "Critical", count: VIOLATION_SEVERITY.critical },
    { severity: "High", count: VIOLATION_SEVERITY.high },
    { severity: "Medium", count: VIOLATION_SEVERITY.medium },
    { severity: "Low", count: VIOLATION_SEVERITY.low },
  ],
  topClusterAdmins: [
    { user: "system:admin", cluster: "staging-central-cluster", roles: 5 },
    { user: "admin@example.com", cluster: "staging-secured-cluster", roles: 3 },
    { user: "ci-pipeline", cluster: "prod-cluster-east", roles: 2 },
  ],
  topSecrets: [
    { deployment: "api-gateway", secrets: 12 },
    { deployment: "frontend-app", secrets: 8 },
    { deployment: "postgres-db", secrets: 6 },
    { deployment: "redis-server", secrets: 4 },
    { deployment: "monitoring-agent", secrets: 3 },
  ],
  complianceByControls: [
    { standard: "CIS Docker", percentage: 82 },
    { standard: "CIS Kubernetes", percentage: 71 },
    { standard: "NIST SP 800-190", percentage: 78 },
    { standard: "PCI DSS 3.2", percentage: 65 },
  ],
};

// ---------------------------------------------------------------------------
// Helper functions — use real API field names
// ---------------------------------------------------------------------------
export function getClusterNames() {
  return CLUSTERS.map((c) => c.name);
}

export function getNamespaceNames() {
  return [...new Set(NAMESPACES.map((n) => n.metadata?.name || n.name))];
}

export function getDeploymentNames() {
  return [...new Set(DEPLOYMENTS.map((d) => d.name))];
}

export function getVulnerabilityStats() {
  let totalCritical = 0, totalImportant = 0, totalModerate = 0, totalLow = 0;

  DEPLOYMENTS.forEach((d) => {
    const sev = d.imageCVECountBySeverity;
    if (!sev) return;
    totalCritical += sev.critical?.total || 0;
    totalImportant += sev.important?.total || 0;
    totalModerate += sev.moderate?.total || 0;
    totalLow += sev.low?.total || 0;
  });

  return {
    total: { critical: totalCritical, important: totalImportant, moderate: totalModerate, low: totalLow, all: totalCritical + totalImportant + totalModerate + totalLow },
    fixable: { critical: 0, important: 0, moderate: 0, low: 0, all: 0 },
  };
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  if (diffDays < 730) return "1 year ago";
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Derive CVE severity from affectedImageCountBySeverity (matches how real API data is used)
export function deriveCveSeverity(cve) {
  const sev = cve.affectedImageCountBySeverity;
  if (!sev) return "LOW";
  if ((sev.critical?.total || 0) > 0) return "CRITICAL";
  if ((sev.important?.total || 0) > 0) return "IMPORTANT";
  if ((sev.moderate?.total || 0) > 0) return "MODERATE";
  return "LOW";
}
