/**
 * MSW request handlers for the static prototype build.
 * Used when VITE_MOCK_MODE=true (GitHub Pages deployment).
 * All API calls are intercepted so the app runs without a Central backend.
 *
 * Data sourced from staging.demo.stackrox.com — real clusters, CVEs, collections, notifiers, and reports.
 * Sensitive fields (webhooks, emails) have been replaced with safe placeholders.
 */
import { http, HttpResponse } from 'msw';

const MOCK_AUTH_STATUS = {
    userId: 'mock-user-1', expires: '2099-01-01T00:00:00Z', refreshUrl: '',
    authProvider: { id: 'mock-provider', name: 'Mock Auth', type: 'basic', uiEndpoint: '', enabled: true, config: {}, loginUrl: '', validated: true, extraUiEndpoints: [], active: true, requiredAttributes: [], traits: null, lastUpdated: null },
    userInfo: {
        username: 'prototype-demo', friendlyName: 'Prototype Demo',
        permissions: { resourceToAccess: { Alert: 'READ_WRITE_ACCESS', CVE: 'READ_WRITE_ACCESS', Cluster: 'READ_WRITE_ACCESS', Deployment: 'READ_WRITE_ACCESS', Detection: 'READ_WRITE_ACCESS', Image: 'READ_WRITE_ACCESS', Integration: 'READ_WRITE_ACCESS', K8sRole: 'READ_ACCESS', K8sRoleBinding: 'READ_ACCESS', K8sSubject: 'READ_ACCESS', Namespace: 'READ_WRITE_ACCESS', NetworkGraph: 'READ_ACCESS', NetworkPolicy: 'READ_ACCESS', Node: 'READ_ACCESS', Policy: 'READ_WRITE_ACCESS', Role: 'READ_ACCESS', Secret: 'READ_ACCESS', ServiceAccount: 'READ_ACCESS', VulnerabilityManagementApprovals: 'READ_WRITE_ACCESS', VulnerabilityManagementRequests: 'READ_WRITE_ACCESS', VulnerabilityReports: 'READ_WRITE_ACCESS', WorkflowAdministration: 'READ_WRITE_ACCESS', Administration: 'READ_WRITE_ACCESS', Access: 'READ_ACCESS', Compliance: 'READ_ACCESS', DeploymentExtension: 'READ_ACCESS', InstallationInfo: 'READ_ACCESS' } },
        roles: [{ name: 'Admin', globalAccess: 'READ_WRITE_ACCESS', resourceToAccess: {} }],
    },
    userAttributes: [],
};

const MOCK_CLUSTERS = [
    {
        "id": "82855fd3-0490-4d75-b0f0-1353ce7170ad",
        "name": "sc-test-1",
        "type": "KUBERNETES_CLUSTER",
        "mainImage": "",
        "admissionController": true,
        "status": {
            "sensorVersion": "",
            "lastContact": "2025-04-30T10:00:00Z",
            "providerMetadata": null,
            "orchestratorMetadata": {
                "version": "1.28.0"
            }
        },
        "healthStatus": {
            "overallHealthStatus": "HEALTHY",
            "sensorHealthStatus": "HEALTHY",
            "collectorHealthStatus": "HEALTHY",
            "admissionControlHealthStatus": "HEALTHY",
            "lastContact": "2025-04-30T10:00:00Z",
            "healthInfoComplete": true
        },
        "labels": {
            "test-key1": "test-val1"
        }
    },
    {
        "id": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
        "name": "staging-central-cluster",
        "type": "OPENSHIFT4_CLUSTER",
        "mainImage": "",
        "admissionController": true,
        "status": {
            "sensorVersion": "4.11.x-nightly-20260504",
            "lastContact": "2025-04-30T10:00:00Z",
            "providerMetadata": null,
            "orchestratorMetadata": {
                "version": "1.28.0"
            }
        },
        "healthStatus": {
            "overallHealthStatus": "HEALTHY",
            "sensorHealthStatus": "HEALTHY",
            "collectorHealthStatus": "HEALTHY",
            "admissionControlHealthStatus": "HEALTHY",
            "lastContact": "2025-04-30T10:00:00Z",
            "healthInfoComplete": true
        },
        "labels": {}
    },
    {
        "id": "f781e077-fb39-4529-a19d-7a3403e181b2",
        "name": "staging-secured-cluster",
        "type": "OPENSHIFT4_CLUSTER",
        "mainImage": "",
        "admissionController": true,
        "status": {
            "sensorVersion": "4.11.x-nightly-20260504",
            "lastContact": "2025-04-30T10:00:00Z",
            "providerMetadata": null,
            "orchestratorMetadata": {
                "version": "1.28.0"
            }
        },
        "healthStatus": {
            "overallHealthStatus": "HEALTHY",
            "sensorHealthStatus": "HEALTHY",
            "collectorHealthStatus": "HEALTHY",
            "admissionControlHealthStatus": "HEALTHY",
            "lastContact": "2025-04-30T10:00:00Z",
            "healthInfoComplete": true
        },
        "labels": {}
    },
    {
        "id": "fa769ee2-afeb-405f-910d-0f514e6b1d78",
        "name": "test-unhealthy",
        "type": "OPENSHIFT4_CLUSTER",
        "mainImage": "",
        "admissionController": false,
        "status": {
            "sensorVersion": "",
            "lastContact": "2025-04-30T10:00:00Z",
            "providerMetadata": null,
            "orchestratorMetadata": {
                "version": "1.28.0"
            }
        },
        "healthStatus": {
            "overallHealthStatus": "HEALTHY",
            "sensorHealthStatus": "HEALTHY",
            "collectorHealthStatus": "HEALTHY",
            "admissionControlHealthStatus": "HEALTHY",
            "lastContact": "2025-04-30T10:00:00Z",
            "healthInfoComplete": true
        },
        "labels": {}
    },
    {
        "id": "e491900d-b0bc-4c20-910d-f090f22effab",
        "name": "test_external_ips",
        "type": "KUBERNETES_CLUSTER",
        "mainImage": "",
        "admissionController": false,
        "status": {
            "sensorVersion": "4.8.x-934-gc81455f2dc",
            "lastContact": "2025-04-30T10:00:00Z",
            "providerMetadata": null,
            "orchestratorMetadata": {
                "version": "1.28.0"
            }
        },
        "healthStatus": {
            "overallHealthStatus": "HEALTHY",
            "sensorHealthStatus": "HEALTHY",
            "collectorHealthStatus": "HEALTHY",
            "admissionControlHealthStatus": "HEALTHY",
            "lastContact": "2025-04-30T10:00:00Z",
            "healthInfoComplete": true
        },
        "labels": {}
    }
];

const MOCK_NAMESPACES = [
    {
        "metadata": {
            "id": "e83ac6c8-8bbe-4297-883b-accf9a63d5d0",
            "name": "acc-clemson",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "acc-clemson",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "63"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "e18f322e-76bc-4d45-8e15-e4d7d1082055",
            "name": "acc-duke",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "acc-duke",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "63"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "cc2054dd-32be-44c5-b369-0227341fb046",
            "name": "acc-unc",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "acc-unc",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "63"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "665556ff-ac9b-4c83-a6e7-06b5b8255b03",
            "name": "backend",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "backend",
                "name": "backend",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "baseline",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "baseline",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "42"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 8
    },
    {
        "metadata": {
            "id": "40178fa0-986d-4d36-ba25-bd949c536593",
            "name": "cert-manager",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "cert-manager",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "41"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 13
    },
    {
        "metadata": {
            "id": "bc13ba5f-e08f-4054-a47b-ab5d85bb23cb",
            "name": "cert-manager",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "cert-manager",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "baseline",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "baseline",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "41"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 11
    },
    {
        "metadata": {
            "id": "370fe7f7-f977-465c-92a1-1a242b119baf",
            "name": "cert-manager-operator",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "cert-manager-operator",
                "olm.operatorgroup.uid/b07b2adc-324a-49bd-b01e-3f2781a0b1df": "",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "74"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 4
    },
    {
        "metadata": {
            "id": "fe549838-a31f-48f4-82c0-8c2248791222",
            "name": "cert-manager-operator",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "cert-manager-operator",
                "olm.operatorgroup.uid/11254917-dcc6-4e1a-b8af-48ce60caefe8": "",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "baseline",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "baseline",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "74"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 5
    },
    {
        "metadata": {
            "id": "e96963ff-155f-44a6-9157-9a7f4754f3b4",
            "name": "default",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "default",
                "pod-security.kubernetes.io/audit": "privileged",
                "pod-security.kubernetes.io/enforce": "privileged",
                "pod-security.kubernetes.io/warn": "privileged"
            },
            "annotations": [],
            "priority": "78"
        },
        "numDeployments": 3,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "43e3fa6b-ebb7-4bdc-b904-a113cf4af3e6",
            "name": "default",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "kubernetes.io/metadata.name": "default"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "7a08806d-7fd2-4ced-ae4f-94b288515107",
            "name": "default",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "default",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "privileged",
                "pod-security.kubernetes.io/enforce": "privileged",
                "pod-security.kubernetes.io/warn": "privileged"
            },
            "annotations": [],
            "priority": "73"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 5
    },
    {
        "metadata": {
            "id": "48a805b4-45f2-4167-88db-2c60b74cbd97",
            "name": "default-broker",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "default-broker",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 4
    },
    {
        "metadata": {
            "id": "ee054e74-bbb7-44f5-ae4b-e600645c0d92",
            "name": "frontend",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "frontend",
                "name": "frontend",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "baseline",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "baseline",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "38"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 6
    },
    {
        "metadata": {
            "id": "071f804d-985a-47d4-a39e-31064f325fee",
            "name": "gke-managed-cim",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "kubernetes.io/metadata.name": "gke-managed-cim"
            },
            "annotations": [],
            "priority": "83"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "7660d820-ba64-4bb8-9bdc-cc98126252f8",
            "name": "gke-managed-system",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "kubernetes.io/metadata.name": "gke-managed-system"
            },
            "annotations": [],
            "priority": "82"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "8d4d0f31-ad19-4768-9ca3-aac64d39b35e",
            "name": "gke-managed-volumepopulator",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "k8s-app": "gke-volume-populator",
                "kubernetes.io/metadata.name": "gke-managed-volumepopulator"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "af1cec43-1ee9-4caf-bd62-0773005bfca7",
            "name": "gmp-public",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "kubernetes.io/metadata.name": "gmp-public"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "374a9019-9519-4e37-98da-1b312a76fd08",
            "name": "gmp-system",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "addonmanager.kubernetes.io/mode": "Reconcile",
                "kubernetes.io/metadata.name": "gmp-system"
            },
            "annotations": [],
            "priority": "80"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 4
    },
    {
        "metadata": {
            "id": "a1565315-76b6-4f67-8a0f-6125d8f03ae8",
            "name": "hive",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "hive.openshift.io/target-namespace": "true",
                "kubernetes.io/metadata.name": "hive",
                "pod-security.kubernetes.io/audit": "restricted",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "restricted",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "27"
        },
        "numDeployments": 4,
        "numNetworkPolicies": 0,
        "numSecrets": 7
    },
    {
        "metadata": {
            "id": "82214c9d-6ae5-4d8c-b72b-2912fc2b0cb7",
            "name": "hypershift",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "hypershift.openshift.io/monitoring": "true",
                "kubernetes.io/metadata.name": "hypershift",
                "olm.operatorgroup.uid/3dcaa378-950c-4a2e-b3f2-74e2bedfdc9f": "",
                "openshift.io/cluster-monitoring": "true",
                "pod-security.kubernetes.io/audit": "privileged",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "privileged",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "62"
        },
        "numDeployments": 1,
        "numNetworkPolicies": 0,
        "numSecrets": 5
    },
    {
        "metadata": {
            "id": "f9544785-f6c0-4a34-9e24-d41056b83a96",
            "name": "ingress-nginx",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "app.kubernetes.io/instance": "ingress-nginx",
                "app.kubernetes.io/name": "ingress-nginx",
                "kubernetes.io/metadata.name": "ingress-nginx",
                "openshift-pipelines.tekton.dev/namespace-reconcile-version": "1.22.0",
                "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version": "1.22.0",
                "pod-security.kubernetes.io/audit": "baseline",
                "pod-security.kubernetes.io/audit-version": "latest",
                "pod-security.kubernetes.io/warn": "baseline",
                "pod-security.kubernetes.io/warn-version": "latest"
            },
            "annotations": [],
            "priority": "39"
        },
        "numDeployments": 3,
        "numNetworkPolicies": 0,
        "numSecrets": 6
    },
    {
        "metadata": {
            "id": "02bc4a7a-1b84-4344-95b7-38cc71d70802",
            "name": "kube-node-lease",
            "clusterId": "f781e077-fb39-4529-a19d-7a3403e181b2",
            "clusterName": "staging-secured-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "kube-node-lease"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "1dcfe07c-a486-44c3-b085-41e1770b26b7",
            "name": "kube-node-lease",
            "clusterId": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
            "clusterName": "staging-central-cluster",
            "labels": {
                "kubernetes.io/metadata.name": "kube-node-lease"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 3
    },
    {
        "metadata": {
            "id": "4b670a74-aba6-4361-878e-eafcafd560cc",
            "name": "kube-node-lease",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "kubernetes.io/metadata.name": "kube-node-lease"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    },
    {
        "metadata": {
            "id": "d32a6466-605d-4993-87f1-da850aed1be3",
            "name": "kube-public",
            "clusterId": "e491900d-b0bc-4c20-910d-f090f22effab",
            "clusterName": "test_external_ips",
            "labels": {
                "kubernetes.io/metadata.name": "kube-public"
            },
            "annotations": [],
            "priority": "84"
        },
        "numDeployments": 0,
        "numNetworkPolicies": 0,
        "numSecrets": 0
    }
];

const MOCK_DEPLOYMENTS = [
    {
        "id": "9eb91cc0-6ed8-4489-b4ac-016000ca858f",
        "name": "admission-control",
        "namespace": "stackrox",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 1,
        "created": "2025-05-13T21:02:56Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "Helm"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "stackrox"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "4.11.x-nightly-20260504"
            },
            {
                "key": "app.stackrox.io/managed-by",
                "value": "operator"
            },
            {
                "key": "auto-upgrade.stackrox.io/component",
                "value": "sensor"
            },
            {
                "key": "helm.sh/chart",
                "value": "stackrox-secured-cluster-services-400.11.0-nightly-20260504"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 6
            },
            "moderate": {
                "total": 28
            },
            "low": {
                "total": 19
            },
            "unknown": {
                "total": 5
            }
        }
    },
    {
        "id": "a3831e4e-325b-4cd9-9ab6-f68a3cc178fd",
        "name": "admission-control",
        "namespace": "stackrox",
        "clusterId": "",
        "clusterName": "test_external_ips",
        "imageCount": 0,
        "created": "2025-06-03T17:44:28Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "Helm"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "stackrox"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "4.7.2"
            },
            {
                "key": "auto-upgrade.stackrox.io/component",
                "value": "sensor"
            },
            {
                "key": "helm.sh/chart",
                "value": "stackrox-secured-cluster-services-400.7.2"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        }
    },
    {
        "id": "c9724c3d-34c3-4d17-b87a-862f745671a5",
        "name": "admission-control",
        "namespace": "stackrox",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 1,
        "created": "2025-05-13T11:55:12Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "Helm"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "stackrox"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "4.11.x-nightly-20260504"
            },
            {
                "key": "app.stackrox.io/managed-by",
                "value": "operator"
            },
            {
                "key": "auto-upgrade.stackrox.io/component",
                "value": "sensor"
            },
            {
                "key": "helm.sh/chart",
                "value": "stackrox-secured-cluster-services-400.11.0-nightly-20260504"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 6
            },
            "moderate": {
                "total": 28
            },
            "low": {
                "total": 19
            },
            "unknown": {
                "total": 5
            }
        }
    },
    {
        "id": "d7a0e553-438e-4c77-9d64-9eb77016344f",
        "name": "adservice",
        "namespace": "ms-demo",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 1,
        "created": "2026-03-10T15:21:01Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "app.openshift.io/runtime",
                "value": "java"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 15
            },
            "moderate": {
                "total": 13
            },
            "low": {
                "total": 3
            },
            "unknown": {
                "total": 32
            }
        }
    },
    {
        "id": "89a26b68-fb22-4693-b45c-1fdf54ce2f75",
        "name": "alertmanager",
        "namespace": "gmp-system",
        "clusterId": "",
        "clusterName": "test_external_ips",
        "imageCount": 0,
        "created": "2025-06-03T17:31:08Z",
        "type": "StatefulSet",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        }
    },
    {
        "id": "34d4a47f-440d-4b70-a81c-bc9f52ac6d0d",
        "name": "alertmanager-main",
        "namespace": "openshift-monitoring",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 4,
        "created": "2024-02-20T19:12:41Z",
        "type": "StatefulSet",
        "labels": [
            {
                "key": "alertmanager",
                "value": "main"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "alert-router"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "main"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "prometheus-operator"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "alertmanager"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "openshift-monitoring"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "0.29.0"
            },
            {
                "key": "managed-by",
                "value": "prometheus-operator"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 11
            },
            "moderate": {
                "total": 18
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 11
            }
        }
    },
    {
        "id": "ae1285c1-74ce-4fda-b7fa-f81536069c29",
        "name": "alertmanager-main",
        "namespace": "openshift-monitoring",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 4,
        "created": "2024-02-20T17:14:48Z",
        "type": "StatefulSet",
        "labels": [
            {
                "key": "alertmanager",
                "value": "main"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "alert-router"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "main"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "prometheus-operator"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "alertmanager"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "openshift-monitoring"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "0.29.0"
            },
            {
                "key": "managed-by",
                "value": "prometheus-operator"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 11
            },
            "moderate": {
                "total": 18
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 11
            }
        }
    },
    {
        "id": "f5715627-6586-449c-bfe7-a3a69662ddd0",
        "name": "api-server",
        "namespace": "backend",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 1,
        "created": "2024-02-21T21:07:03Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "api-server"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        }
    },
    {
        "id": "8224bc35-ecc4-4d0c-858b-f02fbbaa0cf2",
        "name": "apiserver",
        "namespace": "openshift-apiserver",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 2,
        "created": "2024-02-20T19:05:50Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-apiserver"
            },
            {
                "key": "revision",
                "value": "3"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 14
            },
            "moderate": {
                "total": 18
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 14
            }
        }
    },
    {
        "id": "93015600-b251-44e3-bb20-6f47a0eaa94c",
        "name": "apiserver",
        "namespace": "openshift-apiserver",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 2,
        "created": "2024-02-20T17:07:47Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-apiserver"
            },
            {
                "key": "revision",
                "value": "3"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 14
            },
            "moderate": {
                "total": 18
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 14
            }
        }
    },
    {
        "id": "9533a147-9c5d-4783-94c0-5ec0b25b808b",
        "name": "apiserver",
        "namespace": "openshift-oauth-apiserver",
        "clusterId": "",
        "clusterName": "staging-secured-cluster",
        "imageCount": 1,
        "created": "2024-02-20T19:05:47Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-oauth-apiserver"
            },
            {
                "key": "revision",
                "value": "4"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 9
            },
            "moderate": {
                "total": 17
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 13
            }
        }
    },
    {
        "id": "c60a8f9c-ccb8-466b-997b-99c55806e4ee",
        "name": "apiserver",
        "namespace": "openshift-oauth-apiserver",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 1,
        "created": "2024-02-20T17:07:29Z",
        "type": "Deployment",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-oauth-apiserver"
            },
            {
                "key": "revision",
                "value": "4"
            }
        ],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 9
            },
            "moderate": {
                "total": 17
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 13
            }
        }
    },
    {
        "id": "e8de94db-9ad3-444d-adec-11704d3fc954",
        "name": "apiserver-watcher-staging-central-sshg4-master-0.c.acs-team-automation.internal",
        "namespace": "openshift-kube-apiserver",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 1,
        "created": "2026-03-17T10:16:57Z",
        "type": "Pod",
        "labels": [],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 17
            },
            "moderate": {
                "total": 44
            },
            "low": {
                "total": 5
            },
            "unknown": {
                "total": 11
            }
        }
    },
    {
        "id": "18ecc3f8-4ddc-4b43-8816-049902527a8a",
        "name": "apiserver-watcher-staging-central-sshg4-master-1.c.acs-team-automation.internal",
        "namespace": "openshift-kube-apiserver",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 1,
        "created": "2026-03-17T10:24:37Z",
        "type": "Pod",
        "labels": [],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 17
            },
            "moderate": {
                "total": 44
            },
            "low": {
                "total": 5
            },
            "unknown": {
                "total": 11
            }
        }
    },
    {
        "id": "ce694e8d-c0df-42d0-8b4b-34df37e70659",
        "name": "apiserver-watcher-staging-central-sshg4-master-2.c.acs-team-automation.internal",
        "namespace": "openshift-kube-apiserver",
        "clusterId": "",
        "clusterName": "staging-central-cluster",
        "imageCount": 1,
        "created": "2026-03-17T10:32:39Z",
        "type": "Pod",
        "labels": [],
        "annotations": [],
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 17
            },
            "moderate": {
                "total": 44
            },
            "low": {
                "total": 5
            },
            "unknown": {
                "total": 11
            }
        }
    }
];

const MOCK_IMAGES = [
    {
        "id": "b9406647-ad83-5907-b81d-0122f5527ac5",
        "name": {
            "registry": "docker.io",
            "remote": "apache/kafka",
            "tag": "4.1.0",
            "fullName": "docker.io/apache/kafka:4.1.0"
        },
        "operatingSystem": "alpine:3.22",
        "deploymentCount": 0,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 1
            },
            "important": {
                "total": 18
            },
            "moderate": {
                "total": 11
            },
            "low": {
                "total": 3
            },
            "unknown": {
                "total": 46
            }
        },
        "watchStatus": "WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ADD",
                        "value": "alpine-minirootfs-3.22.1-x86_64.tar.gz / # buildkit"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"/bin/sh\"]"
                    },
                    {
                        "instruction": "ENV",
                        "value": "JAVA_HOME=/opt/java/openjdk"
                    },
                    {
                        "instruction": "ENV",
                        "value": "PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
                    },
                    {
                        "instruction": "ENV",
                        "value": "LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -eux;     apk add --no-cache         fontconfig ttf-dejavu         gnupg         ca-certificates p11-kit-trust         musl-locales musl-locales-lang         tzdata         coreutils         openssl     ;     rm -rf /var/cache/apk/* # buildkit"
                    },
                    {
                        "instruction": "ENV",
                        "value": "JAVA_VERSION=jdk-21.0.8+9"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -eux;     ARCH=\"$(apk --print-arch)\";     case \"${ARCH}\" in        aarch64)          ESUM='f495749fce8d8974323f30428c1183168f90592dc90bb94c96edab33ffccc94e';          BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.8%2B9/OpenJDK21U-jre_aarch64_alpine-linux_hotspot_21.0.8_9.tar.gz';          ;;        x86_64)          ESUM='f499e2d5c596fd531c8427b2fb207c9eeabed783adad32aeed64b03dd476a231';          BINARY_URL='https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.8%2B9/OpenJDK21U-jre_x64_alpine-linux_hotspot_21.0.8_9.tar.gz';          ;;        *)          echo \"Unsupported arch: ${ARCH}\";          exit 1;          ;;     esac;     wget -O /tmp/openjdk.tar.gz ${BINARY_URL};     wget -O /tmp/openjdk.tar.gz.sig ${BINARY_URL}.sig;     export GNUPGHOME=\"$(mktemp -d)\";     gpg --batch --keyserver keyserver.ubuntu.com --recv-keys 3B04D753C9050D9A5D343F39843C48A565F8F04B;     gpg --batch --verify /tmp/openjdk.tar.gz.sig /tmp/openjdk.tar.gz;     rm -rf \"${GNUPGHOME}\" /tmp/openjdk.tar.gz.sig;     echo \"${ESUM} */tmp/openjdk.tar.gz\" | sha256sum -c -;     mkdir -p \"$JAVA_HOME\";     tar --extract         --file /tmp/openjdk.tar.gz         --directory \"$JAVA_HOME\"         --strip-components 1         --no-same-owner     ;     rm -f /tmp/openjdk.tar.gz; # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -eux;     echo \"Verifying install ...\";     echo \"java --version\"; java --version;     echo \"Complete.\" # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "--chmod=755 entrypoint.sh /__cacert_entrypoint.sh # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/__cacert_entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[9092/tcp:{}]"
                    },
                    {
                        "instruction": "USER",
                        "value": "root"
                    },
                    {
                        "instruction": "ARG",
                        "value": "kafka_url=https://dist.apache.org/repos/dist/dev/kafka/4.1.0-rc3/kafka_2.13-4.1.0.tgz"
                    },
                    {
                        "instruction": "ARG",
                        "value": "build_date=2025-08-27"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "org.label-schema.name=kafka org.label-schema.description=Apache Kafka org.label-schema.build-date=2025-08-27 org.label-schema.vcs-url=https://github.com/apache/kafka maintainer=Apache Kafka"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 kafka_url=https://dist.apache.org/repos/dist/dev/kafka/4.1.0-rc3/kafka_2.13-4.1.0.tgz build_date=2025-08-27 /bin/sh -c set -eux ;     apk update ;     apk upgrade ;     apk add --no-cache wget gcompat gpg gpg-agent procps bash;     mkdir opt/kafka;     wget -nv -O kafka.tgz \"$kafka_url\";     wget -nv -O kafka.tgz.asc \"$kafka_url.asc\";     tar xfz kafka.tgz -C /opt/kafka --strip-components 1;     wget -nv -O KEYS https://downloads.apache.org/kafka/KEYS;     gpg --import KEYS;     gpg --batch --verify kafka.tgz.asc kafka.tgz;     mkdir -p /var/lib/kafka/data /etc/kafka/secrets;     mkdir -p /etc/kafka/docker /usr/logs /mnt/shared/config;     adduser -h /home/appuser -D --shell /bin/bash appuser;     chown appuser:appuser -R /usr/logs /opt/kafka /mnt/shared/config;     chown appuser:root -R /var/lib/kafka /etc/kafka/secrets /etc/kafka;     chmod -R ug+w /etc/kafka /var/lib/kafka /etc/kafka/secrets;     cp /opt/kafka/config/log4j2.yaml /etc/kafka/docker/log4j2.yaml;     cp /opt/kafka/config/tools-log4j2.yaml /etc/kafka/docker/tools-log4j2.yaml;     rm kafka.tgz kafka.tgz.asc KEYS;     apk del wget gpg gpg-agent;     apk cache clean; # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "server.properties /etc/kafka/docker/server.properties # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "kafka.jsa /opt/kafka/kafka.jsa # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "storage.jsa /opt/kafka/storage.jsa # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "--chown=appuser:appuser resources/common-scripts /etc/kafka/docker # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "--chown=appuser:appuser launch /etc/kafka/docker/launch # buildkit"
                    },
                    {
                        "instruction": "USER",
                        "value": "appuser"
                    },
                    {
                        "instruction": "VOLUME",
                        "value": "[/etc/kafka/secrets /var/lib/kafka/data /mnt/shared/config]"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"/etc/kafka/docker/run\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T17:30:05.441239405Z"
    },
    {
        "id": "9db6d12e-6c23-5aed-839a-7e0bbc200e17",
        "name": {
            "registry": "docker.io",
            "remote": "grafana/alloy",
            "tag": "v1.8.1",
            "fullName": "docker.io/grafana/alloy:v1.8.1"
        },
        "operatingSystem": "ubuntu:24.04",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 3
            },
            "important": {
                "total": 17
            },
            "moderate": {
                "total": 75
            },
            "low": {
                "total": 34
            },
            "unknown": {
                "total": 43
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ARG",
                        "value": "RELEASE"
                    },
                    {
                        "instruction": "ARG",
                        "value": "LAUNCHPAD_BUILD_ARCH"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "org.opencontainers.image.ref.name=ubuntu"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "org.opencontainers.image.version=24.04"
                    },
                    {
                        "instruction": "ADD",
                        "value": "file:1d7c45546e94b90e941c5bf5c7a5d415d7b868581ad96171d4beb76caa8ab683 in /"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"/bin/bash\"]"
                    },
                    {
                        "instruction": "ARG",
                        "value": "UID=473"
                    },
                    {
                        "instruction": "ARG",
                        "value": "USERNAME=alloy"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "org.opencontainers.image.source=https://github.com/grafana/alloy"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c apt-get update  &&  apt-get install -qy libsystemd-dev tzdata ca-certificates  &&  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "/src/alloy/build/alloy /bin/alloy # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "example-config.alloy /etc/alloy/config.alloy # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c groupadd --gid $UID $USERNAME # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c useradd -m -u $UID -g $UID $USERNAME # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c mkdir -p /var/lib/alloy/data # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c chown -R $USERNAME:$USERNAME /var/lib/alloy # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 UID=473 USERNAME=alloy /bin/sh -c chmod -R 770 /var/lib/alloy # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/bin/alloy\"]"
                    },
                    {
                        "instruction": "ENV",
                        "value": "ALLOY_DEPLOY_MODE=docker"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"run\" \"/etc/alloy/config.alloy\" \"--storage.path=/var/lib/alloy/data\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T17:31:24.338848254Z"
    },
    {
        "id": "53ecc203-1581-50f2-a163-0614d21642fa",
        "name": {
            "registry": "docker.io",
            "remote": "library/busybox",
            "tag": "1.28",
            "fullName": "docker.io/library/busybox:1.28"
        },
        "operatingSystem": "unknown",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ADD",
                        "value": "file:5f0439d8328ab58c087cd067c91ce92765da98916d91b083df6590477b7b9f19 in /"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"sh\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-04-26T23:03:04.797871595Z"
    },
    {
        "id": "6e9fc603-9319-53ec-a643-eaf4493ab01f",
        "name": {
            "registry": "docker.io",
            "remote": "library/busybox",
            "tag": "latest",
            "fullName": "docker.io/library/busybox:latest"
        },
        "operatingSystem": "unknown",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "RUN",
                        "value": "BusyBox 1.37.0 (glibc), Debian 13"
                    }
                ]
            }
        },
        "scanTime": "2026-05-01T05:19:23.094137765Z"
    },
    {
        "id": "28f0d777-5eb7-5bd2-a2db-996fc777ed97",
        "name": {
            "registry": "docker.io",
            "remote": "library/nginx",
            "tag": "1.27.2",
            "fullName": "docker.io/library/nginx:1.27.2"
        },
        "operatingSystem": "debian:12",
        "deploymentCount": 3,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 6
            },
            "important": {
                "total": 36
            },
            "moderate": {
                "total": 33
            },
            "low": {
                "total": 80
            },
            "unknown": {
                "total": 114
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ADD",
                        "value": "rootfs.tar.xz / # buildkit"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"bash\"]"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NGINX_VERSION=1.27.2"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_VERSION=0.8.6"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_RELEASE=1~bookworm"
                    },
                    {
                        "instruction": "ENV",
                        "value": "PKG_RELEASE=1~bookworm"
                    },
                    {
                        "instruction": "ENV",
                        "value": "DYNPKG_RELEASE=1~bookworm"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && groupadd --system --gid 101 nginx     && useradd --system --gid nginx --no-create-home --home /nonexistent --comment \"nginx user\" --shell /bin/false --uid 101 nginx     && apt-get update     && apt-get install --no-install-recommends --no-install-suggests -y gnupg1 ca-certificates     &&     NGINX_GPGKEYS=\"573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 8540A6F18833A80E9C1653A42FD21310B49F6B46 9E9BE90EACBCDE69FE9B204CBCDCD8A38D88A2B3\";     NGINX_GPGKEY_PATH=/etc/apt/keyrings/nginx-archive-keyring.gpg;     export GNUPGHOME=\"$(mktemp -d)\";     found='';     for NGINX_GPGKEY in $NGINX_GPGKEYS; do     for server in         hkp://keyserver.ubuntu.com:80         pgp.mit.edu     ; do         echo \"Fetching GPG key $NGINX_GPGKEY from $server\";         gpg1 --keyserver \"$server\" --keyserver-options timeout=10 --recv-keys \"$NGINX_GPGKEY\" && found=yes && break;     done;     test -z \"$found\" && echo >&2 \"error: failed to fetch GPG key $NGINX_GPGKEY\" && exit 1;     done;     gpg1 --export \"$NGINX_GPGKEYS\" > \"$NGINX_GPGKEY_PATH\" ;     rm -rf \"$GNUPGHOME\";     apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/*     && dpkgArch=\"$(dpkg --print-architecture)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-${PKG_RELEASE}         nginx-module-xslt=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-geoip=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-image-filter=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${NJS_RELEASE}     \"     && case \"$dpkgArch\" in         amd64|arm64)             echo \"deb [signed-by=$NGINX_GPGKEY_PATH] https://nginx.org/packages/mainline/debian/ bookworm nginx\" >> /etc/apt/sources.list.d/nginx.list             && apt-get update             ;;         *)             tempDir=\"$(mktemp -d)\"             && chmod 777 \"$tempDir\"                         && savedAptMark=\"$(apt-mark showmanual)\"                         && apt-get update             && apt-get install --no-install-recommends --no-install-suggests -y                 curl                 devscripts                 equivs                 git                 libxml2-utils                 lsb-release                 xsltproc             && (                 cd \"$tempDir\"                 && REVISION=\"${NGINX_VERSION}-${PKG_RELEASE}\"                 && REVISION=${REVISION%~*}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${REVISION}.tar.gz                 && PKGOSSCHECKSUM=\"6982e2df739645fc72db5bdf994032f799718230e7016e811d9d482e5cf41814c888660ca9a68814d5e99ab571e892ada3bd43166e720cbf04c7f85b6934772c *${REVISION}.tar.gz\"                 && if [ \"$(openssl sha512 -r ${REVISION}.tar.gz)\" = \"$PKGOSSCHECKSUM\" ]; then                     echo \"pkg-oss tarball checksum verification succeeded!\";                 else                     echo \"pkg-oss tarball checksum verification failed!\";                     exit 1;                 fi                 && tar xzvf ${REVISION}.tar.gz                 && cd pkg-oss-${REVISION}                 && cd debian                 && for target in base module-geoip module-image-filter module-njs module-xslt; do                     make rules-$target;                     mk-build-deps --install --tool=\"apt-get -o Debug::pkgProblemResolver=yes --no-install-recommends --yes\"                         debuild-$target/nginx-$NGINX_VERSION/debian/control;                 done                 && make base module-geoip module-image-filter module-njs module-xslt             )                         && apt-mark showmanual | xargs apt-mark auto > /dev/null             && { [ -z \"$savedAptMark\" ] || apt-mark manual $savedAptMark; }                         && ls -lAFh \"$tempDir\"             && ( cd \"$tempDir\" && dpkg-scanpackages . > Packages )             && grep '^Package: ' \"$tempDir/Packages\"             && echo \"deb [ trusted=yes ] file://$tempDir ./\" > /etc/apt/sources.list.d/temp.list             && apt-get -o Acquire::GzipIndexes=false update             ;;     esac         && apt-get install --no-install-recommends --no-install-suggests -y                         $nginxPackages                         gettext-base                         curl     && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list         && if [ -n \"$tempDir\" ]; then         apt-get purge -y --auto-remove         && rm -rf \"$tempDir\" /etc/apt/sources.list.d/temp.list;     fi     && ln -sf /dev/stdout /var/log/nginx/access.log     && ln -sf /dev/stderr /var/log/nginx/error.log     && mkdir /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "docker-entrypoint.sh / # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "10-listen-on-ipv6-by-default.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "15-local-resolvers.envsh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "20-envsubst-on-templates.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "30-tune-worker-processes.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/docker-entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[80/tcp:{}]"
                    },
                    {
                        "instruction": "STOPSIGNAL",
                        "value": "SIGQUIT"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"nginx\" \"-g\" \"daemon off;\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T13:30:51.313420894Z"
    },
    {
        "id": "1f749613-a936-5382-847b-7835d396726a",
        "name": {
            "registry": "docker.io",
            "remote": "library/nginx",
            "tag": "1.7.9",
            "fullName": "docker.io/library/nginx:1.7.9"
        },
        "operatingSystem": "",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "RUN",
                        "value": ""
                    },
                    {
                        "instruction": "RUN",
                        "value": ""
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/bash"
                    },
                    {
                        "instruction": "RUN",
                        "value": "nginx -g daemon off;"
                    },
                    {
                        "instruction": "RUN",
                        "value": "nginx -g daemon off;"
                    }
                ]
            }
        },
        "scanTime": null
    },
    {
        "id": "27b12e0b-2016-5205-ad53-771e45f5f479",
        "name": {
            "registry": "docker.io",
            "remote": "library/nginx",
            "tag": "latest",
            "fullName": "docker.io/library/nginx:latest"
        },
        "operatingSystem": "debian:13",
        "deploymentCount": 2,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 10
            },
            "moderate": {
                "total": 12
            },
            "low": {
                "total": 61
            },
            "unknown": {
                "total": 59
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "RUN",
                        "value": "# debian.sh --arch 'amd64' out/ 'trixie' '@1776729600'"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NGINX_VERSION=1.29.8"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_VERSION=0.9.6"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "ENV",
                        "value": "ACME_VERSION=0.3.1"
                    },
                    {
                        "instruction": "ENV",
                        "value": "PKG_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "ENV",
                        "value": "DYNPKG_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && groupadd --system --gid 101 nginx     && useradd --system --gid nginx --no-create-home --home /nonexistent --comment \"nginx user\" --shell /bin/false --uid 101 nginx     && apt-get update     && apt-get install --no-install-recommends --no-install-suggests -y gnupg1 ca-certificates     &&     NGINX_GPGKEYS=\"573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 8540A6F18833A80E9C1653A42FD21310B49F6B46 9E9BE90EACBCDE69FE9B204CBCDCD8A38D88A2B3\";     NGINX_GPGKEY_PATH=/etc/apt/keyrings/nginx-archive-keyring.gpg;     export GNUPGHOME=\"$(mktemp -d)\";     found='';     for NGINX_GPGKEY in $NGINX_GPGKEYS; do     for server in         hkp://keyserver.ubuntu.com:80         pgp.mit.edu     ; do         echo \"Fetching GPG key $NGINX_GPGKEY from $server\";         gpg1 --batch --keyserver \"$server\" --keyserver-options timeout=10 --recv-keys \"$NGINX_GPGKEY\" && found=yes && break;     done;     test -z \"$found\" && echo >&2 \"error: failed to fetch GPG key $NGINX_GPGKEY\" && exit 1;     done;     gpg1 --batch --export $NGINX_GPGKEYS > \"$NGINX_GPGKEY_PATH\" ;     rm -rf \"$GNUPGHOME\";     apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/*     && dpkgArch=\"$(dpkg --print-architecture)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-${PKG_RELEASE}         nginx-module-xslt=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-geoip=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-image-filter=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${NJS_RELEASE}         nginx-module-acme=${NGINX_VERSION}+${ACME_VERSION}-${PKG_RELEASE}     \"     && case \"$dpkgArch\" in         amd64|arm64)             echo \"deb [signed-by=$NGINX_GPGKEY_PATH] https://nginx.org/packages/mainline/debian/ trixie nginx\" >> /etc/apt/sources.list.d/nginx.list             && apt-get update             ;;         *)             tempDir=\"$(mktemp -d)\"             && chmod 777 \"$tempDir\"                         && savedAptMark=\"$(apt-mark showmanual)\"                         && apt-get update             && apt-get install --no-install-recommends --no-install-suggests -y                 cargo                 curl                 devscripts                 equivs                 git                 libxml2-utils                 lsb-release                 xsltproc             && (                 cd \"$tempDir\"                 && export CARGO_HOME=\"$tempDir/.cargo\"                 && REVISION=\"${NGINX_VERSION}-${PKG_RELEASE}\"                 && REVISION=${REVISION%~*}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${REVISION}.tar.gz                 && PKGOSSCHECKSUM=\"7074c3ba1ece708140afd0220b16df77651fbb56cc012e901bc1c4a80531872b7a58ad97a28357646575ce625e94a0540796c045f95d33e40e6d3874ce7b3d79 *${REVISION}.tar.gz\"                 && if [ \"$(openssl sha512 -r ${REVISION}.tar.gz)\" = \"$PKGOSSCHECKSUM\" ]; then                     echo \"pkg-oss tarball checksum verification succeeded!\";                 else                     echo \"pkg-oss tarball checksum verification failed!\";                     exit 1;                 fi                 && tar xzvf ${REVISION}.tar.gz                 && cd pkg-oss-${REVISION}                 && cd debian                 && for target in base module-geoip module-image-filter module-njs module-xslt module-acme; do                     make rules-$target;                     mk-build-deps --install --tool=\"apt-get -o Debug::pkgProblemResolver=yes --no-install-recommends --yes\"                         debuild-$target/nginx-$NGINX_VERSION/debian/control;                 done                 && make base module-geoip module-image-filter module-njs module-xslt module-acme             )                         && apt-mark showmanual | xargs apt-mark auto > /dev/null             && { [ -z \"$savedAptMark\" ] || apt-mark manual $savedAptMark; }                         && ls -lAFh \"$tempDir\"             && ( cd \"$tempDir\" && dpkg-scanpackages . > Packages )             && grep '^Package: ' \"$tempDir/Packages\"             && echo \"deb [ trusted=yes ] file://$tempDir ./\" > /etc/apt/sources.list.d/temp.list             && apt-get -o Acquire::GzipIndexes=false update             ;;     esac         && apt-get install --no-install-recommends --no-install-suggests -y                         $nginxPackages                         gettext-base                         curl     && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list         && if [ -n \"$tempDir\" ]; then         apt-get purge -y --auto-remove         && rm -rf \"$tempDir\" /etc/apt/sources.list.d/temp.list;     fi     && ln -sf /dev/stdout /var/log/nginx/access.log     && ln -sf /dev/stderr /var/log/nginx/error.log     && mkdir /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "docker-entrypoint.sh / # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "10-listen-on-ipv6-by-default.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "15-local-resolvers.envsh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "20-envsubst-on-templates.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "30-tune-worker-processes.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/docker-entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[80/tcp:{}]"
                    },
                    {
                        "instruction": "STOPSIGNAL",
                        "value": "SIGQUIT"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"nginx\" \"-g\" \"daemon off;\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T17:31:23.95934561Z"
    },
    {
        "id": "4690d5cd-6e77-53cd-a215-c7e72577777b",
        "name": {
            "registry": "docker.io",
            "remote": "library/nginx",
            "tag": "latest",
            "fullName": "docker.io/library/nginx:latest"
        },
        "operatingSystem": "debian:13",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "RUN",
                        "value": "# debian.sh --arch 'amd64' out/ 'trixie' '@1773619200'"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NGINX_VERSION=1.29.6"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_VERSION=0.9.6"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "ENV",
                        "value": "ACME_VERSION=0.3.1"
                    },
                    {
                        "instruction": "ENV",
                        "value": "PKG_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "ENV",
                        "value": "DYNPKG_RELEASE=1~trixie"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && groupadd --system --gid 101 nginx     && useradd --system --gid nginx --no-create-home --home /nonexistent --comment \"nginx user\" --shell /bin/false --uid 101 nginx     && apt-get update     && apt-get install --no-install-recommends --no-install-suggests -y gnupg1 ca-certificates     &&     NGINX_GPGKEYS=\"573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 8540A6F18833A80E9C1653A42FD21310B49F6B46 9E9BE90EACBCDE69FE9B204CBCDCD8A38D88A2B3\";     NGINX_GPGKEY_PATH=/etc/apt/keyrings/nginx-archive-keyring.gpg;     export GNUPGHOME=\"$(mktemp -d)\";     found='';     for NGINX_GPGKEY in $NGINX_GPGKEYS; do     for server in         hkp://keyserver.ubuntu.com:80         pgp.mit.edu     ; do         echo \"Fetching GPG key $NGINX_GPGKEY from $server\";         gpg1 --batch --keyserver \"$server\" --keyserver-options timeout=10 --recv-keys \"$NGINX_GPGKEY\" && found=yes && break;     done;     test -z \"$found\" && echo >&2 \"error: failed to fetch GPG key $NGINX_GPGKEY\" && exit 1;     done;     gpg1 --batch --export $NGINX_GPGKEYS > \"$NGINX_GPGKEY_PATH\" ;     rm -rf \"$GNUPGHOME\";     apt-get remove --purge --auto-remove -y gnupg1 && rm -rf /var/lib/apt/lists/*     && dpkgArch=\"$(dpkg --print-architecture)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-${PKG_RELEASE}         nginx-module-xslt=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-geoip=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-image-filter=${NGINX_VERSION}-${DYNPKG_RELEASE}         nginx-module-njs=${NGINX_VERSION}+${NJS_VERSION}-${NJS_RELEASE}         nginx-module-acme=${NGINX_VERSION}+${ACME_VERSION}-${PKG_RELEASE}     \"     && case \"$dpkgArch\" in         amd64|arm64)             echo \"deb [signed-by=$NGINX_GPGKEY_PATH] https://nginx.org/packages/mainline/debian/ trixie nginx\" >> /etc/apt/sources.list.d/nginx.list             && apt-get update             ;;         *)             tempDir=\"$(mktemp -d)\"             && chmod 777 \"$tempDir\"                         && savedAptMark=\"$(apt-mark showmanual)\"                         && apt-get update             && apt-get install --no-install-recommends --no-install-suggests -y                 cargo                 curl                 devscripts                 equivs                 git                 libxml2-utils                 lsb-release                 xsltproc             && (                 cd \"$tempDir\"                 && export CARGO_HOME=\"$tempDir/.cargo\"                 && REVISION=\"${NGINX_VERSION}-${PKG_RELEASE}\"                 && REVISION=${REVISION%~*}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${REVISION}.tar.gz                 && PKGOSSCHECKSUM=\"4cfaf8725bdead3e1944f91af7d97e8102892a205cccd1b0e4de6588f3f8a8171c0d856f27cc8bdd5ffd063adec3a57b85cf82fbb13cba0dd8bf902f40be5715 *${REVISION}.tar.gz\"                 && if [ \"$(openssl sha512 -r ${REVISION}.tar.gz)\" = \"$PKGOSSCHECKSUM\" ]; then                     echo \"pkg-oss tarball checksum verification succeeded!\";                 else                     echo \"pkg-oss tarball checksum verification failed!\";                     exit 1;                 fi                 && tar xzvf ${REVISION}.tar.gz                 && cd pkg-oss-${REVISION}                 && cd debian                 && for target in base module-geoip module-image-filter module-njs module-xslt module-acme; do                     make rules-$target;                     mk-build-deps --install --tool=\"apt-get -o Debug::pkgProblemResolver=yes --no-install-recommends --yes\"                         debuild-$target/nginx-$NGINX_VERSION/debian/control;                 done                 && make base module-geoip module-image-filter module-njs module-xslt module-acme             )                         && apt-mark showmanual | xargs apt-mark auto > /dev/null             && { [ -z \"$savedAptMark\" ] || apt-mark manual $savedAptMark; }                         && ls -lAFh \"$tempDir\"             && ( cd \"$tempDir\" && dpkg-scanpackages . > Packages )             && grep '^Package: ' \"$tempDir/Packages\"             && echo \"deb [ trusted=yes ] file://$tempDir ./\" > /etc/apt/sources.list.d/temp.list             && apt-get -o Acquire::GzipIndexes=false update             ;;     esac         && apt-get install --no-install-recommends --no-install-suggests -y                         $nginxPackages                         gettext-base                         curl     && apt-get remove --purge --auto-remove -y && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/nginx.list         && if [ -n \"$tempDir\" ]; then         apt-get purge -y --auto-remove         && rm -rf \"$tempDir\" /etc/apt/sources.list.d/temp.list;     fi     && ln -sf /dev/stdout /var/log/nginx/access.log     && ln -sf /dev/stderr /var/log/nginx/error.log     && mkdir /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "docker-entrypoint.sh / # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "10-listen-on-ipv6-by-default.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "15-local-resolvers.envsh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "20-envsubst-on-templates.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "30-tune-worker-processes.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/docker-entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[80/tcp:{}]"
                    },
                    {
                        "instruction": "STOPSIGNAL",
                        "value": "SIGQUIT"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"nginx\" \"-g\" \"daemon off;\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-02T05:18:54.497314694Z"
    },
    {
        "id": "b42bc682-e5b2-52b4-989a-d730bd5e6606",
        "name": {
            "registry": "docker.io",
            "remote": "library/nginx",
            "tag": "stable-alpine-perl",
            "fullName": "docker.io/library/nginx:stable-alpine-perl"
        },
        "operatingSystem": "alpine:3.23",
        "deploymentCount": 0,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 1
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 2
            }
        },
        "watchStatus": "WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ADD",
                        "value": "alpine-minirootfs-3.23.4-x86_64.tar.gz / # buildkit"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"/bin/sh\"]"
                    },
                    {
                        "instruction": "LABEL",
                        "value": "maintainer=NGINX Docker Maintainers <docker-maint@nginx.com>"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NGINX_VERSION=1.30.0"
                    },
                    {
                        "instruction": "ENV",
                        "value": "PKG_RELEASE=1"
                    },
                    {
                        "instruction": "ENV",
                        "value": "DYNPKG_RELEASE=1"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && addgroup -g 101 -S nginx     && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx     && apkArch=\"$(cat /etc/apk/arch)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-r${PKG_RELEASE}     \"     && apk add --no-cache --virtual .checksum-deps         openssl     && case \"$apkArch\" in         x86_64|aarch64)             set -x             && KEY_SHA512=\"e09fa32f0a0eab2b879ccbbc4d0e4fb9751486eedda75e35fac65802cc9faa266425edf83e261137a2f4d16281ce2c1a5f4502930fe75154723da014214f0655\"             && wget -O /tmp/nginx_signing.rsa.pub https://nginx.org/keys/nginx_signing.rsa.pub             && if echo \"$KEY_SHA512 */tmp/nginx_signing.rsa.pub\" | sha512sum -c -; then                 echo \"key verification succeeded!\";                 mv /tmp/nginx_signing.rsa.pub /etc/apk/keys/;             else                 echo \"key verification failed!\";                 exit 1;             fi             && DEPS=$(apk query --summarize depends --recursive --no-cache                        --repository \"@nginxorg https://nginx.org/packages/alpine/v$(egrep -o '^[0-9]+\\.[0-9]+' /etc/alpine-release)/main\"                        ${nginxPackages/=/@nginxorg=})             && apk add --no-cache $DEPS             && apk add --repositories-file /dev/null -X \"https://nginx.org/packages/alpine/v$(egrep -o '^[0-9]+\\.[0-9]+' /etc/alpine-release)/main\" --no-cache $nginxPackages             ;;         *)             set -x             && tempDir=\"$(mktemp -d)\"             && chown nobody:nobody $tempDir             && apk add --no-cache --virtual .build-deps                 gcc                 libc-dev                 make                 openssl-dev                 pcre2-dev                 zlib-dev                 linux-headers                 bash                 alpine-sdk                 findutils                 curl             && su nobody -s /bin/sh -c \"                 export HOME=${tempDir}                 && cd ${tempDir}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && PKGOSSCHECKSUM=\\\"a090f4aecd628ab4b4124376efa55f617a272f9bae4e306df9b659b1b850133b0806cac31fb2a72faf1cc36bde8f5a19f4f5da5fd73502d3bbe374697920344e *${NGINX_VERSION}-${PKG_RELEASE}.tar.gz\\\"                 && if [ \\\"\\$(openssl sha512 -r ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz)\\\" = \\\"\\$PKGOSSCHECKSUM\\\" ]; then                     echo \\\"pkg-oss tarball checksum verification succeeded!\\\";                 else                     echo \\\"pkg-oss tarball checksum verification failed!\\\";                     exit 1;                 fi                 && tar xzvf ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && cd pkg-oss-${NGINX_VERSION}-${PKG_RELEASE}                 && cd alpine                 && make base                 && apk index --allow-untrusted -o ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz ${tempDir}/packages/alpine/${apkArch}/*.apk                 && abuild-sign -k ${tempDir}/.abuild/abuild-key.rsa ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz                 \"             && cp ${tempDir}/.abuild/abuild-key.rsa.pub /etc/apk/keys/             && apk del --no-network .build-deps             && DEPS=$(apk query --summarize depends --recursive --no-cache                        --repository \"@nginxorg ${tempDir}/packages/alpine/\"                        ${nginxPackages/=/@nginxorg=})             && apk add --no-cache $DEPS             && apk add --repositories-file /dev/null -X ${tempDir}/packages/alpine/ --no-cache $nginxPackages             ;;     esac     && apk del --no-network .checksum-deps     && if [ -n \"$tempDir\" ]; then rm -rf \"$tempDir\"; fi     && if [ -f \"/etc/apk/keys/abuild-key.rsa.pub\" ]; then rm -f /etc/apk/keys/abuild-key.rsa.pub; fi     && apk add --no-cache gettext-envsubst     && apk add --no-cache tzdata     && ln -sf /dev/stdout /var/log/nginx/access.log     && ln -sf /dev/stderr /var/log/nginx/error.log     && mkdir /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "docker-entrypoint.sh / # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "10-listen-on-ipv6-by-default.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "15-local-resolvers.envsh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "20-envsubst-on-templates.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "COPY",
                        "value": "30-tune-worker-processes.sh /docker-entrypoint.d # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"/docker-entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[80/tcp:{}]"
                    },
                    {
                        "instruction": "STOPSIGNAL",
                        "value": "SIGQUIT"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"nginx\" \"-g\" \"daemon off;\"]"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_VERSION=0.9.6"
                    },
                    {
                        "instruction": "ENV",
                        "value": "NJS_RELEASE=1"
                    },
                    {
                        "instruction": "ENV",
                        "value": "ACME_VERSION=0.3.1"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && apkArch=\"$(cat /etc/apk/arch)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-r${PKG_RELEASE}         nginx-module-xslt=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-geoip=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-image-filter=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-njs=${NGINX_VERSION}.${NJS_VERSION}-r${NJS_RELEASE}         nginx-module-acme=${NGINX_VERSION}.${ACME_VERSION}-r${PKG_RELEASE}     \"     && apk add --no-cache --virtual .checksum-deps         openssl     && case \"$apkArch\" in         x86_64|aarch64)             apk add -X \"https://nginx.org/packages/alpine/v$(egrep -o '^[0-9]+\\.[0-9]+' /etc/alpine-release)/main\" --no-cache $nginxPackages             ;;         *)             set -x             && tempDir=\"$(mktemp -d)\"             && chown nobody:nobody $tempDir             && apk add --no-cache --virtual .build-deps                 gcc                 libc-dev                 make                 openssl-dev                 pcre2-dev                 zlib-dev                 linux-headers                 libxslt-dev                 gd-dev                 geoip-dev                 libedit-dev                 bash                 alpine-sdk                 findutils                 curl                 cargo                 clang-libclang             && su nobody -s /bin/sh -c \"                 export HOME=${tempDir}                 && cd ${tempDir}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && PKGOSSCHECKSUM=\\\"a090f4aecd628ab4b4124376efa55f617a272f9bae4e306df9b659b1b850133b0806cac31fb2a72faf1cc36bde8f5a19f4f5da5fd73502d3bbe374697920344e *${NGINX_VERSION}-${PKG_RELEASE}.tar.gz\\\"                 && if [ \\\"\\$(openssl sha512 -r ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz)\\\" = \\\"\\$PKGOSSCHECKSUM\\\" ]; then                     echo \\\"pkg-oss tarball checksum verification succeeded!\\\";                 else                     echo \\\"pkg-oss tarball checksum verification failed!\\\";                     exit 1;                 fi                 && tar xzvf ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && cd pkg-oss-${NGINX_VERSION}-${PKG_RELEASE}                 && cd alpine                 && export BUILDTARGET=\\\"module-geoip module-image-filter module-njs module-xslt module-acme\\\"                 && if [ \\\"\\$(apk --print-arch)\\\" = \\\"armhf\\\" ]; then BUILDTARGET=\\\"\\$( echo \\$BUILDTARGET | sed 's,module-acme,,' )\\\"; fi                 && make \\$BUILDTARGET                 && apk index --allow-untrusted -o ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz ${tempDir}/packages/alpine/${apkArch}/*.apk                 && abuild-sign -k ${tempDir}/.abuild/abuild-key.rsa ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz                 \"             && cp ${tempDir}/.abuild/abuild-key.rsa.pub /etc/apk/keys/             && apk del --no-network .build-deps             && if [ \"$apkArch\" = \"armhf\" ]; then nginxPackages=\"$( echo $nginxPackages | sed 's,nginx-module-acme=.*,,')\"; fi             && apk add -X ${tempDir}/packages/alpine/ --no-cache $nginxPackages             ;;     esac     && apk del --no-network .checksum-deps     && if [ -n \"$tempDir\" ]; then rm -rf \"$tempDir\"; fi     && if [ -f \"/etc/apk/keys/abuild-key.rsa.pub\" ]; then rm -f /etc/apk/keys/abuild-key.rsa.pub; fi     && apk add --no-cache curl ca-certificates # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -x     && apkArch=\"$(cat /etc/apk/arch)\"     && nginxPackages=\"         nginx=${NGINX_VERSION}-r${PKG_RELEASE}         nginx-module-xslt=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-geoip=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-image-filter=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-perl=${NGINX_VERSION}-r${DYNPKG_RELEASE}         nginx-module-njs=${NGINX_VERSION}.${NJS_VERSION}-r${NJS_RELEASE}         nginx-module-acme=${NGINX_VERSION}.${ACME_VERSION}-r${PKG_RELEASE}     \"     && apk add --no-cache --virtual .checksum-deps         openssl     && case \"$apkArch\" in         x86_64|aarch64)             apk add -X \"https://nginx.org/packages/alpine/v$(egrep -o '^[0-9]+\\.[0-9]+' /etc/alpine-release)/main\" --no-cache $nginxPackages             ;;         *)             set -x             && tempDir=\"$(mktemp -d)\"             && chown nobody:nobody $tempDir             && apk add --no-cache --virtual .build-deps                 gcc                 libc-dev                 make                 openssl-dev                 pcre2-dev                 zlib-dev                 linux-headers                 perl-dev                 bash                 alpine-sdk                 findutils                 curl             && su nobody -s /bin/sh -c \"                 export HOME=${tempDir}                 && cd ${tempDir}                 && curl -f -L -O https://github.com/nginx/pkg-oss/archive/${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && PKGOSSCHECKSUM=\\\"a090f4aecd628ab4b4124376efa55f617a272f9bae4e306df9b659b1b850133b0806cac31fb2a72faf1cc36bde8f5a19f4f5da5fd73502d3bbe374697920344e *${NGINX_VERSION}-${PKG_RELEASE}.tar.gz\\\"                 && if [ \\\"\\$(openssl sha512 -r ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz)\\\" = \\\"\\$PKGOSSCHECKSUM\\\" ]; then                     echo \\\"pkg-oss tarball checksum verification succeeded!\\\";                 else                     echo \\\"pkg-oss tarball checksum verification failed!\\\";                     exit 1;                 fi                 && tar xzvf ${NGINX_VERSION}-${PKG_RELEASE}.tar.gz                 && cd pkg-oss-${NGINX_VERSION}-${PKG_RELEASE}                 && cd alpine                 && make module-perl                 && apk index --allow-untrusted -o ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz ${tempDir}/packages/alpine/${apkArch}/*.apk                 && abuild-sign -k ${tempDir}/.abuild/abuild-key.rsa ${tempDir}/packages/alpine/${apkArch}/APKINDEX.tar.gz                 \"             && cp ${tempDir}/.abuild/abuild-key.rsa.pub /etc/apk/keys/             && apk del --no-network .build-deps             && if [ \"$apkArch\" = \"armhf\" ]; then nginxPackages=\"$( echo $nginxPackages | sed -E 's,nginx-module-acme=[^ ]+,,')\"; fi             && apk add -X ${tempDir}/packages/alpine/ --no-cache $nginxPackages             ;;     esac     && apk del --no-network .checksum-deps     && if [ -n \"$tempDir\" ]; then rm -rf \"$tempDir\"; fi     && if [ -f \"/etc/apk/keys/abuild-key.rsa.pub\" ]; then rm -f /etc/apk/keys/abuild-key.rsa.pub; fi # buildkit"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T17:30:05.007519513Z"
    },
    {
        "id": "0ef93917-d88f-560c-9a06-9ea8d15e925d",
        "name": {
            "registry": "docker.io",
            "remote": "library/redis",
            "tag": "alpine",
            "fullName": "docker.io/library/redis:alpine"
        },
        "operatingSystem": "alpine:3.23",
        "deploymentCount": 1,
        "imageCVECountBySeverity": {
            "critical": {
                "total": 0
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "watchStatus": "NOT_WATCHED",
        "metadata": {
            "v1": {
                "layers": [
                    {
                        "instruction": "ADD",
                        "value": "alpine-minirootfs-3.23.4-x86_64.tar.gz / # buildkit"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"/bin/sh\"]"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -eux; \taddgroup -S -g 1000 redis; \tadduser -S -G redis -u 999 redis # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "/bin/sh -c set -eux; \tapk add --no-cache \t\ttzdata \t\tsetpriv \t; # buildkit"
                    },
                    {
                        "instruction": "ARG",
                        "value": "REDIS_DOWNLOAD_URL=https://github.com/redis/redis/archive/refs/tags/8.6.2.tar.gz"
                    },
                    {
                        "instruction": "ARG",
                        "value": "REDIS_DOWNLOAD_SHA=cef021615ec4aef355a824cf933702be5def36e37ca1e9b99ab1cc5599f1748f"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 REDIS_DOWNLOAD_URL=https://github.com/redis/redis/archive/refs/tags/8.6.2.tar.gz REDIS_DOWNLOAD_SHA=cef021615ec4aef355a824cf933702be5def36e37ca1e9b99ab1cc5599f1748f /bin/sh -c set -eux; \t\tapk add --no-cache --virtual .build-deps \t\tcoreutils \t\tdpkg-dev dpkg \t\tgcc \t\tlinux-headers \t\tmake \t\tmusl-dev \t\topenssl-dev \t\tg++; \t\tarch=\"$(dpkg --print-architecture | awk -F- '{ print $NF }')\"; \tcase \"$arch\" in \t\t'amd64') export BUILD_WITH_MODULES=yes; export INSTALL_RUST_TOOLCHAIN=yes; export DISABLE_WERRORS=yes ;; \t\t'arm64') export BUILD_WITH_MODULES=yes; export INSTALL_RUST_TOOLCHAIN=yes; export DISABLE_WERRORS=yes ;; \t\t*) echo >&2 \"Modules are NOT supported! unsupported architecture: '$arch'\"; export BUILD_WITH_MODULES=no ;; \tesac; \tif [ \"$BUILD_WITH_MODULES\" = \"yes\" ]; then \tapk add --no-cache --virtual .module-build-deps \t\tautoconf \t\tautomake \t\tbash \t\tbsd-compat-headers \t\tbuild-base \t\tcargo \t\tclang21 \t\tclang21-static \t\tclang21-libclang \t\tcmake \t\tcurl \t\tg++ \t\tgit \t\tlibffi-dev \t\tlibgcc \t\tlibtool \t\tllvm21-dev \t\tncurses-dev \t\topenssh \t\topenssl  \t\tpy-virtualenv \t\tpy3-cryptography \t\tpy3-pip \t\tpy3-virtualenv \t\tpython3 \t\tpython3-dev \t\trsync \t\ttar \t\tunzip \t\twhich \t\txsimd \t\txz; \tfi; \t\tpip install -q --upgrade setuptools &&  pip install -q --upgrade pip && PIP_BREAK_SYSTEM_PACKAGES=1 pip install -q addict toml jinja2 ramp-packer ;\twget -O redis.tar.gz \"$REDIS_DOWNLOAD_URL\"; \techo \"$REDIS_DOWNLOAD_SHA *redis.tar.gz\" | sha256sum -c -; \tmkdir -p /usr/src/redis; \ttar -xzf redis.tar.gz -C /usr/src/redis --strip-components=1; \trm redis.tar.gz; \t\tgrep -E '^ *createBoolConfig[(]\"protected-mode\",.*, *1 *,.*[)],$' /usr/src/redis/src/config.c; \tsed -ri 's!^( *createBoolConfig[(]\"protected-mode\",.*, *)1( *,.*[)],)$!\\10\\2!' /usr/src/redis/src/config.c; \tgrep -E '^ *createBoolConfig[(]\"protected-mode\",.*, *0 *,.*[)],$' /usr/src/redis/src/config.c; \t\tgnuArch=\"$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)\"; \textraJemallocConfigureFlags=\"--build=$gnuArch\"; \tdpkgArch=\"$(dpkg --print-architecture)\"; \tcase \"${dpkgArch##*-}\" in \t\tamd64 | i386 | x32) extraJemallocConfigureFlags=\"$extraJemallocConfigureFlags --with-lg-page=12\" ;; \t\t*) extraJemallocConfigureFlags=\"$extraJemallocConfigureFlags --with-lg-page=16\" ;; \tesac; \textraJemallocConfigureFlags=\"$extraJemallocConfigureFlags --with-lg-hugepage=21\"; \tgrep -F 'cd jemalloc && ./configure ' /usr/src/redis/deps/Makefile; \tsed -ri 's!cd jemalloc && ./configure !&'\"$extraJemallocConfigureFlags\"' !' /usr/src/redis/deps/Makefile; \tgrep -F \"cd jemalloc && ./configure $extraJemallocConfigureFlags \" /usr/src/redis/deps/Makefile; \t\texport RUST_DYN_CRT=1; \texport PATH=\"/usr/lib/llvm21/bin:$PATH\"; \texport BUILD_TLS=yes; \tif [ \"$BUILD_WITH_MODULES\" = \"yes\" ]; then \t\tmake -C /usr/src/redis/modules/redisjson get_source; \t\tsed -i 's/^RUST_FLAGS=$/RUST_FLAGS += -C target-feature=-crt-static/' /usr/src/redis/modules/redisjson/src/Makefile ; \t\tgrep -E 'RUST_FLAGS' /usr/src/redis/modules/redisjson/src/Makefile; \tfi; \tmake -C /usr/src/redis -j \"$(nproc)\" all; \tmake -C /usr/src/redis install; \t\tserverMd5=\"$(md5sum /usr/local/bin/redis-server | cut -d' ' -f1)\"; export serverMd5; \tfind /usr/local/bin/redis* -maxdepth 0 \t\t-type f -not -name redis-server \t\t-exec sh -eux -c ' \t\t\tmd5=\"$(md5sum \"$1\" | cut -d\" \" -f1)\"; \t\t\ttest \"$md5\" = \"$serverMd5\"; \t\t' -- '{}' ';' \t\t-exec ln -svfT 'redis-server' '{}' ';' \t; \t\tmake -C /usr/src/redis distclean; \trm -r /usr/src/redis; \t\trunDeps=\"$( \t\tscanelf --needed --nobanner --format '%n#p' --recursive /usr/local \t\t\t| tr ',' '\\n' \t\t\t| sort -u \t\t\t| awk 'system(\"[ -e /usr/local/lib/\" $1 \" ]\") == 0 { next } { print \"so:\" $1 }' \t)\"; \tapk add --no-network --virtual .redis-rundeps $runDeps; \tif [ \"$BUILD_WITH_MODULES\" = \"yes\" ]; then \t\tapk del --no-network .module-build-deps; \tfi; \tapk del --no-network .build-deps; \trm -rf ~/.cache ~/.gitconfig; \t\tredis-cli --version; \tredis-server --version; # buildkit"
                    },
                    {
                        "instruction": "RUN",
                        "value": "|2 REDIS_DOWNLOAD_URL=https://github.com/redis/redis/archive/refs/tags/8.6.2.tar.gz REDIS_DOWNLOAD_SHA=cef021615ec4aef355a824cf933702be5def36e37ca1e9b99ab1cc5599f1748f /bin/sh -c mkdir /data && chown redis:redis /data # buildkit"
                    },
                    {
                        "instruction": "WORKDIR",
                        "value": "/data"
                    },
                    {
                        "instruction": "COPY",
                        "value": "docker-entrypoint.sh /usr/local/bin/ # buildkit"
                    },
                    {
                        "instruction": "ENTRYPOINT",
                        "value": "[\"docker-entrypoint.sh\"]"
                    },
                    {
                        "instruction": "EXPOSE",
                        "value": "map[6379/tcp:{}]"
                    },
                    {
                        "instruction": "CMD",
                        "value": "[\"redis-server\"]"
                    }
                ]
            }
        },
        "scanTime": "2026-05-04T17:31:17.318348724Z"
    }
];

const MOCK_CVES = [
    {
        "cve": "CVE-2026-33186",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 129
            },
            "important": {
                "total": 6
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 129
            }
        },
        "topCVSS": 9.100000381469727,
        "affectedImageCount": 130,
        "firstDiscoveredInSystem": "2026-03-19T00:26:34.669657Z",
        "publishedOn": "2026-03-18T20:10:29Z",
        "topNvdCVSS": 0,
        "distroTuples": [
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "alpine:3.13",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "debian:11",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "gRPC-Go has an authorization bypass via missing leading slash in :path",
                "operatingSystem": "debian:11",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "A flaw was found in gRPC-Go, the Go language implementation of gRPC. This vulnerability, an authorization bypass, is caused by improper input validation of the HTTP/2 `:path` pseudo-header. A remote attacker can exploit this by sending raw HTTP/2 frames with a malformed `:path` that omits the mandatory leading slash. This allows the attacker to bypass defined security policies, potentially leading to unauthorized access to services or information disclosure.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "alpine:3.13",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "debian:11",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            },
            {
                "summary": "Authorization bypass in gRPC-Go via missing leading slash in :path in google.golang.org/grpc",
                "operatingSystem": "debian:11",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00019999999494757503
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2025-68121",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 84
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 9
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 10,
        "affectedImageCount": 90,
        "firstDiscoveredInSystem": "2026-02-06T00:00:18.208389Z",
        "publishedOn": "2026-02-05T17:23:09Z",
        "topNvdCVSS": 10,
        "distroTuples": [
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "alpine:3.21",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "debian:12",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "debian:11",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "alpine:3.13",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "alpine:edge",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "unknown",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "debian:11",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:8",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "Unexpected session resumption in crypto/tls",
                "operatingSystem": "rhel:9",
                "cvss": 10,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "unknown",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "unknown",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "unknown",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:8",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            },
            {
                "summary": "A flaw was found in the crypto/tls component. This vulnerability occurs during Transport Layer Security (TLS) session resumption when certificate authority (CA) settings are modified between the initial and resumed handshakes. An attacker could exploit this to bypass certificate validation, allowing a client or server to establish a connection that should have been rejected. This could lead to an authentication bypass under specific conditions.",
                "operatingSystem": "rhel:9",
                "cvss": 7.400000095367432,
                "scoreVersion": "V3",
                "nvdCvss": 10,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00018000000272877514
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2024-45337",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 31
            },
            "important": {
                "total": 8
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 31
            }
        },
        "topCVSS": 9.100000381469727,
        "affectedImageCount": 34,
        "firstDiscoveredInSystem": "2026-01-27T08:49:14.008739Z",
        "publishedOn": "2024-12-11T18:40:19Z",
        "topNvdCVSS": 0,
        "distroTuples": [
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "alpine:3.13",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "debian:11",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of ServerConfig.PublicKeyCallback may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "unknown",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "A flaw was found in the x/crypto/ssh go library. Applications and libraries that misuse the ServerConfig.PublicKeyCallback callback may be susceptible to an authorization bypass. For example, an attacker may send public keys A and B and authenticate with A. PublicKeyCallback would be called only twice, first with A and then with B. A vulnerable application may then make authorization decisions based on key B, for which the attacker does not control the private key. The misuse of ServerConfig.PublicKeyCallback may cause an authorization bypass.",
                "operatingSystem": "rhel:8",
                "cvss": 8.199999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "alpine:3.13",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            },
            {
                "summary": "Misuse of connection.serverAuthenticate may cause authorization bypass in golang.org/x/crypto",
                "operatingSystem": "debian:11",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.30296000838279724
                    }
                }
            }
        ],
        "pendingExceptionCount": 1
    },
    {
        "cve": "CVE-2024-24790",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 27
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 3
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 29,
        "firstDiscoveredInSystem": "2026-01-27T08:50:07.280026Z",
        "publishedOn": "2024-06-04T00:00:00Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "unknown",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "alpine:edge",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "A flaw was found in the Go language standard library net/netip. The method Is*() (IsPrivate(), IsPublic(), etc) doesn't behave properly when working with IPv6 mapped to IPv4 addresses. The unexpected behavior can lead to integrity and confidentiality issues, specifically when these methods are used to control access to resources or data.",
                "operatingSystem": "rhel:9",
                "cvss": 6.699999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "A flaw was found in the Go language standard library net/netip. The method Is*() (IsPrivate(), IsPublic(), etc) doesn't behave properly when working with IPv6 mapped to IPv4 addresses. The unexpected behavior can lead to integrity and confidentiality issues, specifically when these methods are used to control access to resources or data.",
                "operatingSystem": "rhel:9",
                "cvss": 6.699999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "Unexpected behavior from Is methods for IPv4-mapped IPv6 addresses in net/netip",
                "operatingSystem": "alpine:3.13",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "A flaw was found in the Go language standard library net/netip. The method Is*() (IsPrivate(), IsPublic(), etc) doesn't behave properly when working with IPv6 mapped to IPv4 addresses. The unexpected behavior can lead to integrity and confidentiality issues, specifically when these methods are used to control access to resources or data.",
                "operatingSystem": "rhel:9",
                "cvss": 6.699999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            },
            {
                "summary": "A flaw was found in the Go language standard library net/netip. The method Is*() (IsPrivate(), IsPublic(), etc) doesn't behave properly when working with IPv6 mapped to IPv4 addresses. The unexpected behavior can lead to integrity and confidentiality issues, specifically when these methods are used to control access to resources or data.",
                "operatingSystem": "rhel:9",
                "cvss": 6.699999809265137,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00171999994199723
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2026-31789",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 12
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 146
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 158,
        "firstDiscoveredInSystem": "2026-04-08T01:05:43.779643Z",
        "publishedOn": "2026-04-07T00:00:00Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.21",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.22",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.22",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.21",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.22",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.20",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to\na hexadecimal string leads to a heap buffer overflow on 32 bit platforms.\n\nImpact summary: A heap buffer overflow may lead to a crash or possibly\nan attacker controlled code execution or other undefined behavior.\n\nIf an attacker can supply a crafted X.509 certificate with an excessively\nlarge OCTET STRING value in extensions such as the Subject Key Identifier\n(SKID) or Authority Key Identifier (AKID) which are being converted to hex,\nthe size of the buffer needed for the result is calculated as multiplication\nof the input length by 3. On 32 bit platforms, this multiplication may overflow\nresulting in the allocation of a smaller buffer and a heap buffer overflow.\n\nApplications and services that print or log contents of untrusted X.509\ncertificates are vulnerable to this issue. As the certificates would have\nto have sizes of over 1 Gigabyte, printing or logging such certificates\nis a fairly unlikely operation and only 32 bit platforms are affected,\nthis issue was assigned Low severity.\n\nThe FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this\nissue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "alpine:3.21",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:10",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value toa hexadecimal string leads to a heap buffer overflow on 32 bit platforms.Impact summary: A heap buffer overflow may lead to a crash or possiblyan attacker controlled code execution or other undefined behavior.If an attacker can supply a crafted X.509 certificate with an excessivelylarge OCTET STRING value in extensions such as the Subject Key Identifier(SKID) or Authority Key Identifier (AKID) which are being converted to hex,the size of the buffer needed for the result is calculated asmultiplicationof the input length by 3. On 32 bit platforms, this multiplication mayoverflowresulting in the allocation of a smaller buffer and a heap buffer overflow.Applications and services that print or log contents of untrusted X.509certificates are vulnerable to this issue. As the certificates would haveto have sizes of over 1 Gigabyte, printing or logging such certificatesis a fairly unlikely operation and only 32 bit platforms are affected,this issue was assigned Low severity.The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by thisissue, as the affected code is outside the OpenSSL FIPS module boundary.\n\n    Update Instructions:\n\n    Run `sudo pro fix CVE-2026-31789` to fix the vulnerability. The problem can be corrected\n    by updating your system to the following package versions:\n\nlibssl3 - 3.0.2-0ubuntu1.23\nopenssl - 3.0.2-0ubuntu1.23\nNo subscription required",
                "operatingSystem": "ubuntu:22.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:8",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value to a hexadecimal string leads to a heap buffer overflow on 32 bit platforms.  Impact summary: A heap buffer overflow may lead to a crash or possibly an attacker controlled code execution or other undefined behavior.  If an attacker can supply a crafted X.509 certificate with an excessively large OCTET STRING value in extensions such as the Subject Key Identifier (SKID) or Authority Key Identifier (AKID) which are being converted to hex, the size of the buffer needed for the result is calculated as multiplication of the input length by 3. On 32 bit platforms, this multiplication may overflow resulting in the allocation of a smaller buffer and a heap buffer overflow.  Applications and services that print or log contents of untrusted X.509 certificates are vulnerable to this issue. As the certificates would have to have sizes of over 1 Gigabyte, printing or logging such certificates is a fairly unlikely operation and only 32 bit platforms are affected, this issue was assigned Low severity.  The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by this issue, as the affected code is outside the OpenSSL FIPS module boundary.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value toa hexadecimal string leads to a heap buffer overflow on 32 bit platforms.Impact summary: A heap buffer overflow may lead to a crash or possiblyan attacker controlled code execution or other undefined behavior.If an attacker can supply a crafted X.509 certificate with an excessivelylarge OCTET STRING value in extensions such as the Subject Key Identifier(SKID) or Authority Key Identifier (AKID) which are being converted to hex,the size of the buffer needed for the result is calculated asmultiplicationof the input length by 3. On 32 bit platforms, this multiplication mayoverflowresulting in the allocation of a smaller buffer and a heap buffer overflow.Applications and services that print or log contents of untrusted X.509certificates are vulnerable to this issue. As the certificates would haveto have sizes of over 1 Gigabyte, printing or logging such certificatesis a fairly unlikely operation and only 32 bit platforms are affected,this issue was assigned Low severity.The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by thisissue, as the affected code is outside the OpenSSL FIPS module boundary.\n\n    Update Instructions:\n\n    Run `sudo pro fix CVE-2026-31789` to fix the vulnerability. The problem can be corrected\n    by updating your system to the following package versions:\n\nlibssl3t64 - 3.0.13-0ubuntu3.9\nopenssl - 3.0.13-0ubuntu3.9\nNo subscription required",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "Issue summary: Converting an excessively large OCTET STRING value toa hexadecimal string leads to a heap buffer overflow on 32 bit platforms.Impact summary: A heap buffer overflow may lead to a crash or possiblyan attacker controlled code execution or other undefined behavior.If an attacker can supply a crafted X.509 certificate with an excessivelylarge OCTET STRING value in extensions such as the Subject Key Identifier(SKID) or Authority Key Identifier (AKID) which are being converted to hex,the size of the buffer needed for the result is calculated asmultiplicationof the input length by 3. On 32 bit platforms, this multiplication mayoverflowresulting in the allocation of a smaller buffer and a heap buffer overflow.Applications and services that print or log contents of untrusted X.509certificates are vulnerable to this issue. As the certificates would haveto have sizes of over 1 Gigabyte, printing or logging such certificatesis a fairly unlikely operation and only 32 bit platforms are affected,this issue was assigned Low severity.The FIPS modules in 3.6, 3.5, 3.4, 3.3 and 3.0 are not affected by thisissue, as the affected code is outside the OpenSSL FIPS module boundary.\n\n    Update Instructions:\n\n    Run `sudo pro fix CVE-2026-31789` to fix the vulnerability. The problem can be corrected\n    by updating your system to the following package versions:\n\nlibssl3t64 - 3.0.13-0ubuntu3.9\nopenssl - 3.0.13-0ubuntu3.9\nNo subscription required",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:9",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:10",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:10",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            },
            {
                "summary": "A flaw was found in OpenSSL. This vulnerability, a heap buffer overflow, affects 32-bit systems when processing an unusually large X.509 certificate. If an application or service attempts to print or log such a specially crafted certificate, it could lead to a system crash or potentially allow an attacker to execute arbitrary code. This issue is considered low severity due to the specific conditions required for exploitation, including the need for an extremely large certificate and a 32-bit operating environment.",
                "operatingSystem": "rhel:10",
                "cvss": 5.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.00026000000070780516
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2024-41110",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 11
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 11
            }
        },
        "topCVSS": 0,
        "affectedImageCount": 11,
        "firstDiscoveredInSystem": "2026-01-27T08:49:14.008739Z",
        "publishedOn": "2024-07-29T18:08:44Z",
        "topNvdCVSS": 0,
        "distroTuples": [
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Authz zero length regression",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            },
            {
                "summary": "Moby authz zero length regression in github.com/moby/moby",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.041280001401901245
                    }
                }
            }
        ],
        "pendingExceptionCount": 2
    },
    {
        "cve": "CVE-2025-21613",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 9
            },
            "important": {
                "total": 5
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 9
            }
        },
        "topCVSS": 8.100000381469727,
        "affectedImageCount": 13,
        "firstDiscoveredInSystem": "2026-01-27T08:49:14.008739Z",
        "publishedOn": "2025-01-06T16:13:10.611Z",
        "topNvdCVSS": 0,
        "distroTuples": [
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "debian:11",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "debian:11",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "go-git has an Argument Injection via the URL field",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "An argument injection vulnerability was found in go-git. This flaw allows an attacker to set arbitrary values to git-upload-pack flags, leading to command or code execution, exposure of sensitive data, or other unintended behavior. This is only possible in configurations where the file transport protocol is being used.",
                "operatingSystem": "rhel:8",
                "cvss": 8.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "An argument injection vulnerability was found in go-git. This flaw allows an attacker to set arbitrary values to git-upload-pack flags, leading to command or code execution, exposure of sensitive data, or other unintended behavior. This is only possible in configurations where the file transport protocol is being used.",
                "operatingSystem": "rhel:8",
                "cvss": 8.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "An argument injection vulnerability was found in go-git. This flaw allows an attacker to set arbitrary values to git-upload-pack flags, leading to command or code execution, exposure of sensitive data, or other unintended behavior. This is only possible in configurations where the file transport protocol is being used.",
                "operatingSystem": "unknown",
                "cvss": 8.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "An argument injection vulnerability was found in go-git. This flaw allows an attacker to set arbitrary values to git-upload-pack flags, leading to command or code execution, exposure of sensitive data, or other unintended behavior. This is only possible in configurations where the file transport protocol is being used.",
                "operatingSystem": "rhel:8",
                "cvss": 8.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "An argument injection vulnerability was found in go-git. This flaw allows an attacker to set arbitrary values to git-upload-pack flags, leading to command or code execution, exposure of sensitive data, or other unintended behavior. This is only possible in configurations where the file transport protocol is being used.",
                "operatingSystem": "rhel:8",
                "cvss": 8.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            },
            {
                "summary": "Argument Injection via the URL field in github.com/go-git/go-git",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.028599999845027924
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2023-45853",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 9
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 2
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 11,
        "firstDiscoveredInSystem": "2026-01-27T08:50:52.444214Z",
        "publishedOn": "2023-10-14T02:15:09.323Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultantheap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename,comment, or extra field. NOTE: MiniZip is not a supported part of the zlibproduct. NOTE: pyminizip through 0.2.6 is also vulnerable because itbundles an affected zlib version, and exposes the applicable MiniZip codethrough its compress API.\n\n    Update Instructions:\n\n    Run `sudo pro fix CVE-2023-45853` to fix the vulnerability. The problem can be corrected\n    by updating your system to the following package versions:\n\nlib32z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nlib64z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nlibx32z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nzlib-bin - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nzlib1g - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nAvailable with Ubuntu Pro (Infra-only): https://ubuntu.com/pro",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultantheap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename,comment, or extra field. NOTE: MiniZip is not a supported part of the zlibproduct. NOTE: pyminizip through 0.2.6 is also vulnerable because itbundles an affected zlib version, and exposes the applicable MiniZip codethrough its compress API.\n\n    Update Instructions:\n\n    Run `sudo pro fix CVE-2023-45853` to fix the vulnerability. The problem can be corrected\n    by updating your system to the following package versions:\n\nlib32z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nlib64z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nlibx32z1 - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nzlib-bin - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nzlib1g - 1:1.2.8.dfsg-1ubuntu1.1+esm3\nAvailable with Ubuntu Pro (Infra-only): https://ubuntu.com/pro",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            },
            {
                "summary": "MiniZip in zlib through 1.3 has an integer overflow and resultant heap-based buffer overflow in zipOpenNewFileInZip4_64 via a long filename, comment, or extra field. NOTE: MiniZip is not a supported part of the zlib product. NOTE: pyminizip through 0.2.6 is also vulnerable because it bundles an affected zlib version, and exposes the applicable MiniZip code through its compress API.",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.01286999974399805
                    }
                }
            }
        ],
        "pendingExceptionCount": 3
    },
    {
        "cve": "CVE-2026-33816",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 8
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 8
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 8,
        "firstDiscoveredInSystem": "2026-04-08T00:55:53.352226Z",
        "publishedOn": "2026-04-07T14:58:41Z",
        "topNvdCVSS": 0,
        "distroTuples": [
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "unknown",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "unknown",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "Memory-safety vulnerability in github.com/jackc/pgx/v5.",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:8",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "unknown",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            },
            {
                "summary": "CVE-2026-33816 in github.com/jackc/pgx",
                "operatingSystem": "rhel:9",
                "cvss": 0,
                "scoreVersion": "V2",
                "nvdCvss": 0,
                "nvdScoreVersion": "UNKNOWN_VERSION",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0005600000149570405
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2026-1229",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 8
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 8
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 8,
        "firstDiscoveredInSystem": "2026-02-26T13:09:02.388422Z",
        "publishedOn": "2026-02-25T19:17:50Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "ubuntu:24.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            },
            {
                "summary": "CIRCL has an incorrect calculation in secp384r1 CombinedMult in github.com/cloudflare/circl",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002300000051036477
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2026-33211",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 7
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.600000381469727,
        "affectedImageCount": 7,
        "firstDiscoveredInSystem": "2026-03-19T01:15:21.972761Z",
        "publishedOn": "2026-03-18T20:20:10Z",
        "topNvdCVSS": 9.600000381469727,
        "distroTuples": [
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            },
            {
                "summary": "Path traversal in Tekton Pipelines git resolver allows reading arbitrary files from the resolver pod in github.com/tektoncd/pipeline",
                "operatingSystem": "rhel:9",
                "cvss": 9.600000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.600000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0002500000118743628
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2026-33747",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 6
            },
            "important": {
                "total": 6
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 6,
        "firstDiscoveredInSystem": "2026-03-30T21:16:19.797307Z",
        "publishedOn": "2026-03-26T18:26:09Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:9",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:9",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:9",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:9",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:8",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root",
                "operatingSystem": "rhel:8",
                "cvss": 8.399999618530273,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            },
            {
                "summary": "BuildKit's Malicious frontend can cause file escape outside of storage root in github.com/moby/buildkit",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0006000000284984708
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2022-23305",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2022-01-21T23:26:47Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "SQL Injection in Log4j 1.2.x",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.09457000344991684
                    }
                }
            },
            {
                "summary": "SQL Injection in Log4j 1.2.x",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.09457000344991684
                    }
                }
            },
            {
                "summary": "SQL Injection in Log4j 1.2.x",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.09457000344991684
                    }
                }
            },
            {
                "summary": "SQL Injection in Log4j 1.2.x",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.09457000344991684
                    }
                }
            },
            {
                "summary": "SQL Injection in Log4j 1.2.x",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.09457000344991684
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2022-1996",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 4
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.100000381469727,
        "affectedImageCount": 9,
        "firstDiscoveredInSystem": "2026-01-27T08:51:14.685094Z",
        "publishedOn": "2022-06-08T00:00:00Z",
        "topNvdCVSS": 9.100000381469727,
        "distroTuples": [
            {
                "summary": "Authorization Bypass Through User-Controlled Key in go-restful",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization Bypass Through User-Controlled Key in go-restful",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization Bypass Through User-Controlled Key in go-restful",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization Bypass Through User-Controlled Key in go-restful",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization Bypass Through User-Controlled Key in go-restful",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "A flaw was found in CORS Filter feature from the go-restful package. When a user inputs a domain which is in AllowedDomains, all domains starting with the same pattern are accepted. This issue could allow an attacker to break the CORS policy by allowing any page to make requests and retrieve data on behalf of users.",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "A flaw was found in CORS Filter feature from the go-restful package. When a user inputs a domain which is in AllowedDomains, all domains starting with the same pattern are accepted. This issue could allow an attacker to break the CORS policy by allowing any page to make requests and retrieve data on behalf of users.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization bypass in github.com/emicklei/go-restful, go-restful/v2 and go-restful/v3",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization bypass in github.com/emicklei/go-restful, go-restful/v2 and go-restful/v3",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization bypass in github.com/emicklei/go-restful, go-restful/v2 and go-restful/v3",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization bypass in github.com/emicklei/go-restful, go-restful/v2 and go-restful/v3",
                "operatingSystem": "rhel:8",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "Authorization bypass in github.com/emicklei/go-restful, go-restful/v2 and go-restful/v3",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "A flaw was found in CORS Filter feature from the go-restful package. When a user inputs a domain which is in AllowedDomains, all domains starting with the same pattern are accepted. This issue could allow an attacker to break the CORS policy by allowing any page to make requests and retrieve data on behalf of users.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            },
            {
                "summary": "A flaw was found in CORS Filter feature from the go-restful package. When a user inputs a domain which is in AllowedDomains, all domains starting with the same pattern are accepted. This issue could allow an attacker to break the CORS policy by allowing any page to make requests and retrieve data on behalf of users.",
                "operatingSystem": "rhel:9",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.009630000218749046
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2024-53677",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2024-12-11T18:30:42Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Apache Struts file upload logic is flawed",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9306600093841553
                    }
                }
            },
            {
                "summary": "Apache Struts file upload logic is flawed",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9306600093841553
                    }
                }
            },
            {
                "summary": "Apache Struts file upload logic is flawed",
                "operatingSystem": "alpine:3.7",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9306600093841553
                    }
                }
            },
            {
                "summary": "Apache Struts file upload logic is flawed",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9306600093841553
                    }
                }
            },
            {
                "summary": "Apache Struts file upload logic is flawed",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9306600093841553
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2021-31805",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2022-04-13T00:00:30Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Expression Language Injection in Apache Struts",
                "operatingSystem": "alpine:3.7",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9395599961280823
                    }
                }
            },
            {
                "summary": "Expression Language Injection in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9395599961280823
                    }
                }
            },
            {
                "summary": "Expression Language Injection in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9395599961280823
                    }
                }
            },
            {
                "summary": "Expression Language Injection in Apache Struts",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9395599961280823
                    }
                }
            },
            {
                "summary": "Expression Language Injection in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9395599961280823
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2020-17530",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2022-02-09T22:51:56Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Remote code execution in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9437599778175354
                    }
                }
            },
            {
                "summary": "Remote code execution in Apache Struts",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9437599778175354
                    }
                }
            },
            {
                "summary": "Remote code execution in Apache Struts",
                "operatingSystem": "alpine:3.7",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9437599778175354
                    }
                }
            },
            {
                "summary": "Remote code execution in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9437599778175354
                    }
                }
            },
            {
                "summary": "Remote code execution in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9437599778175354
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2025-7458",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 2
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.100000381469727,
        "affectedImageCount": 7,
        "firstDiscoveredInSystem": "2026-01-27T08:50:02.097988Z",
        "publishedOn": "2025-07-29T12:43:19.427Z",
        "topNvdCVSS": 9.100000381469727,
        "distroTuples": [
            {
                "summary": "An integer overflow flaw has been discovered in SQLite. This flaw allows an attacker who has the ability to execute raw SQL statements to induce a denial of service or leak process memory.",
                "operatingSystem": "rhel:10",
                "cvss": 6.099999904632568,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow flaw has been discovered in SQLite. This flaw allows an attacker who has the ability to execute raw SQL statements to induce a denial of service or leak process memory.",
                "operatingSystem": "rhel:10",
                "cvss": 6.099999904632568,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            },
            {
                "summary": "An integer overflow in the sqlite3KeyInfoFromExprList function in SQLite versions 3.39.2 through 3.41.1 allows an attacker with the ability to execute arbitrary SQL statements to cause a denial of service or disclose sensitive information from process memory via a crafted SELECT statement with a large number of expressions in the ORDER BY clause.",
                "operatingSystem": "debian:12",
                "cvss": 9.100000381469727,
                "scoreVersion": "V3",
                "nvdCvss": 9.100000381469727,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.0007099999929778278
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2016-1000031",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2018-12-21T17:51:51Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Improper Access Control in commons-fileupload",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.5643200278282166
                    }
                }
            },
            {
                "summary": "Improper Access Control in commons-fileupload",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.5643200278282166
                    }
                }
            },
            {
                "summary": "Improper Access Control in commons-fileupload",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.5643200278282166
                    }
                }
            },
            {
                "summary": "Improper Access Control in commons-fileupload",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.5643200278282166
                    }
                }
            },
            {
                "summary": "Improper Access Control in commons-fileupload",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.5643200278282166
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2019-17571",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2020-01-06T18:43:49Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Deserialization of Untrusted Data in Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.3696500062942505
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Log4j",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.3696500062942505
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.3696500062942505
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Log4j",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.3696500062942505
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.3696500062942505
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2019-0230",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2021-12-02T14:50:51Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Improperly Controlled Modification of Dynamically-Determined Object Attributes in Apache Struts",
                "operatingSystem": "alpine:3.7",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9384899735450745
                    }
                }
            },
            {
                "summary": "Improperly Controlled Modification of Dynamically-Determined Object Attributes in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9384899735450745
                    }
                }
            },
            {
                "summary": "Improperly Controlled Modification of Dynamically-Determined Object Attributes in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9384899735450745
                    }
                }
            },
            {
                "summary": "Improperly Controlled Modification of Dynamically-Determined Object Attributes in Apache Struts",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9384899735450745
                    }
                }
            },
            {
                "summary": "Improperly Controlled Modification of Dynamically-Determined Object Attributes in Apache Struts",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9384899735450745
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2023-49569",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:10.221281Z",
        "publishedOn": "2024-01-10T15:37:05Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Maliciously crafted Git server replies can lead to path traversal and RCE on go-git clients",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "rhel:9",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "debian:11",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            },
            {
                "summary": "Path traversal and RCE in github.com/go-git/go-git/v5 and gopkg.in/src-d/go-git.v4",
                "operatingSystem": "rhel:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.04027000069618225
                    }
                }
            }
        ],
        "pendingExceptionCount": 1
    },
    {
        "cve": "CVE-2022-23307",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2022-01-19T00:01:15Z",
        "topNvdCVSS": 8.800000190734863,
        "distroTuples": [
            {
                "summary": "Deserialization of Untrusted Data in Apache Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 8.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.026729999110102654
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Apache Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 8.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.026729999110102654
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Apache Log4j",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 8.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.026729999110102654
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Apache Log4j",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 8.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.026729999110102654
                    }
                }
            },
            {
                "summary": "Deserialization of Untrusted Data in Apache Log4j",
                "operatingSystem": "ubuntu:14.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 8.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.026729999110102654
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2023-50164",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 5
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 5,
        "firstDiscoveredInSystem": "2026-01-27T08:50:42.249793Z",
        "publishedOn": "2023-12-07T09:30:45Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Apache Struts vulnerable to path traversal",
                "operatingSystem": "ubuntu:20.04",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9286400079727173
                    }
                }
            },
            {
                "summary": "Apache Struts vulnerable to path traversal",
                "operatingSystem": "alpine:3.7",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9286400079727173
                    }
                }
            },
            {
                "summary": "Apache Struts vulnerable to path traversal",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9286400079727173
                    }
                }
            },
            {
                "summary": "Apache Struts vulnerable to path traversal",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9286400079727173
                    }
                }
            },
            {
                "summary": "Apache Struts vulnerable to path traversal",
                "operatingSystem": "debian:8",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.9286400079727173
                    }
                }
            }
        ],
        "pendingExceptionCount": 0
    },
    {
        "cve": "CVE-2023-6879",
        "affectedImageCountBySeverity": {
            "critical": {
                "total": 4
            },
            "important": {
                "total": 0
            },
            "moderate": {
                "total": 0
            },
            "low": {
                "total": 0
            },
            "unknown": {
                "total": 0
            }
        },
        "topCVSS": 9.800000190734863,
        "affectedImageCount": 4,
        "firstDiscoveredInSystem": "2026-01-27T08:50:52.444214Z",
        "publishedOn": "2023-12-27T23:15:07.53Z",
        "topNvdCVSS": 9.800000190734863,
        "distroTuples": [
            {
                "summary": "Increasing the resolution of video frames, while performing a multi-threaded encode, can result in a heap overflow in av1_loop_restoration_dealloc().",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.001550000044517219
                    }
                }
            },
            {
                "summary": "Increasing the resolution of video frames, while performing a multi-threaded encode, can result in a heap overflow in av1_loop_restoration_dealloc().",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.001550000044517219
                    }
                }
            },
            {
                "summary": "Increasing the resolution of video frames, while performing a multi-threaded encode, can result in a heap overflow in av1_loop_restoration_dealloc().",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.001550000044517219
                    }
                }
            },
            {
                "summary": "Increasing the resolution of video frames, while performing a multi-threaded encode, can result in a heap overflow in av1_loop_restoration_dealloc().",
                "operatingSystem": "debian:12",
                "cvss": 9.800000190734863,
                "scoreVersion": "V3",
                "nvdCvss": 9.800000190734863,
                "nvdScoreVersion": "V3",
                "cveBaseInfo": {
                    "epss": {
                        "epssProbability": 0.001550000044517219
                    }
                }
            }
        ],
        "pendingExceptionCount": 1
    }
];

const MOCK_COLLECTIONS = [
    {
        "id": "b703d50e-b003-4a6a-bf1b-7ab36c9af184",
        "name": "All",
        "description": "The whole shebang (use .*)",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Cluster",
                        "operator": "OR",
                        "values": [
                            {
                                "value": ".*",
                                "matchType": "REGEX"
                            }
                        ]
                    },
                    {
                        "fieldName": "Namespace",
                        "operator": "OR",
                        "values": [
                            {
                                "value": ".*",
                                "matchType": "REGEX"
                            }
                        ]
                    },
                    {
                        "fieldName": "Deployment",
                        "operator": "OR",
                        "values": [
                            {
                                "value": ".*",
                                "matchType": "REGEX"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-21T16:47:08.550364622Z",
        "lastUpdated": "2024-03-21T16:57:15.308488438Z",
        "action": "APPEND"
    },
    {
        "id": "d58ac599-95de-43e7-bcb5-505c4c4d8950",
        "name": "Approved Apps",
        "description": "An explicit list of apps that are approved for exceptions",
        "resourceSelectors": [
            {
                "rules": []
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-20T02:30:13.246058713Z",
        "lastUpdated": "2024-03-20T02:30:13.246058713Z",
        "action": "APPEND"
    },
    {
        "id": "5527bd66-91ef-4df9-9b68-22bd492dd417",
        "name": "asdf",
        "description": "",
        "resourceSelectors": [
            {
                "rules": []
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-06-20T19:58:16.964789419Z",
        "lastUpdated": "2024-06-20T19:58:16.964789419Z",
        "action": "APPEND"
    },
    {
        "id": "9da7e891-5867-482c-8a78-da828221f25a",
        "name": "Back and Front",
        "description": "Defined purely by using attachments",
        "resourceSelectors": [
            {
                "rules": []
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-20T00:37:27.835362124Z",
        "lastUpdated": "2024-03-20T00:37:27.835362124Z",
        "action": "APPEND"
    },
    {
        "id": "90e56de8-2371-43f0-8453-e44f8fb55a83",
        "name": "Backend NS",
        "description": "All apps in \"backend\" namespace",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Namespace",
                        "operator": "OR",
                        "values": [
                            {
                                "value": "backend",
                                "matchType": "EXACT"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-20T00:27:26.145977452Z",
        "lastUpdated": "2024-03-20T00:38:39.791865170Z",
        "action": "APPEND"
    },
    {
        "id": "97091f15-e725-4fcb-a9e5-2539e6c793df",
        "name": "cdu",
        "description": "test",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Deployment",
                        "operator": "OR",
                        "values": [
                            {
                                "value": "api-server",
                                "matchType": "EXACT"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2026-02-12T04:55:43.208309356Z",
        "lastUpdated": "2026-03-20T23:25:57.960297452Z",
        "action": "APPEND"
    },
    {
        "id": "2c65c370-46f0-4444-8d3d-2da26b659a7e",
        "name": "cdu-1",
        "description": "attached",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Deployment Label",
                        "operator": "OR",
                        "values": [
                            {
                                "value": "component=insights-metrics",
                                "matchType": "EXACT"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2026-03-20T17:59:42.162934744Z",
        "lastUpdated": "2026-03-20T23:15:25.776317840Z",
        "action": "APPEND"
    },
    {
        "id": "bfc5914b-aee3-4ee0-992e-bee967ef9488",
        "name": "Collection with incorrect regex",
        "description": "",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Deployment",
                        "operator": "OR",
                        "values": [
                            {
                                "value": "^",
                                "matchType": "REGEX"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-10-03T22:19:45.447760866Z",
        "lastUpdated": "2024-10-03T22:19:45.447760866Z",
        "action": "APPEND"
    },
    {
        "id": "4a4004a8-220c-4919-b49b-2aaada74c1ad",
        "name": "Demo - All",
        "description": "Demo deployments using combination of rules and deep nesting",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Namespace",
                        "operator": "OR",
                        "values": [
                            {
                                "value": "operations",
                                "matchType": "EXACT"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-20T00:36:20.928535862Z",
        "lastUpdated": "2024-03-20T00:38:49.035450641Z",
        "action": "APPEND"
    },
    {
        "id": "55fa809a-edc9-41a8-9da3-5182c661fe06",
        "name": "dv-attached",
        "description": "",
        "resourceSelectors": [
            {
                "rules": []
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2026-01-21T20:07:37.422158984Z",
        "lastUpdated": "2026-01-21T20:07:37.422158984Z",
        "action": "APPEND"
    },
    {
        "id": "35d30665-da38-4dad-9b67-950ab3423646",
        "name": "dv-double-dash-test",
        "description": "",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Cluster",
                        "operator": "OR",
                        "values": [
                            {
                                "value": ".*-.*-.*",
                                "matchType": "REGEX"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2024-03-29T19:23:03.703573293Z",
        "lastUpdated": "2024-03-29T19:24:10.059988858Z",
        "action": "APPEND"
    },
    {
        "id": "d1e93d5e-a235-4591-8b37-3aae97efffd2",
        "name": "dv-double-dash-test-CLONE-ROX-20187",
        "description": "",
        "resourceSelectors": [
            {
                "rules": [
                    {
                        "fieldName": "Cluster",
                        "operator": "OR",
                        "values": [
                            {
                                "value": ".*-.*-.*",
                                "matchType": "REGEX"
                            }
                        ]
                    }
                ]
            }
        ],
        "embeddedCollectionIds": [],
        "createdAt": "2025-10-03T18:33:29.726338948Z",
        "lastUpdated": "2025-10-03T18:33:29.726338948Z",
        "action": "APPEND"
    }
];

const MOCK_NOTIFIERS = [
    {
        "id": "a5465fb1-5bb4-4c41-a740-92b0206e8a59",
        "name": "#acs-staging-slack-notifications",
        "type": "slack",
        "labelDefault": "#security-channel",
        "labelKey": "",
        "slack": {
            "webhookURL": ""
        }
    },
    {
        "id": "a109a0d4-ed64-4bd3-bb85-69ba634b7126",
        "name": "Same slack channel using Slack APP",
        "type": "slack",
        "labelDefault": "#security-channel",
        "labelKey": "",
        "slack": {
            "webhookURL": ""
        }
    },
    {
        "id": "fc99e179-57c1-4ba2-8e59-45dbf184c78c",
        "name": "xya",
        "type": "email",
        "labelDefault": "security@example.com",
        "labelKey": "",
        "email": {
            "server": "smtp.example.com:587",
            "sender": "acs-reports@example.com",
            "from": "ACS Reports",
            "username": "",
            "disableTLS": false,
            "startTLSAuthMethod": "DISABLED"
        }
    },
    {
        "id": "3df8c2d4-da0c-44b8-9604-1dfada9f3708",
        "name": "ROX-23570-mpedrott",
        "type": "email",
        "labelDefault": "security@example.com",
        "labelKey": "",
        "email": {
            "server": "smtp.example.com:587",
            "sender": "acs-reports@example.com",
            "from": "ACS Reports",
            "username": "",
            "disableTLS": false,
            "startTLSAuthMethod": "DISABLED"
        }
    },
    {
        "id": "07e79343-43da-4018-8bf7-90255c06707d",
        "name": "Test",
        "type": "email",
        "labelDefault": "security@example.com",
        "labelKey": "",
        "email": {
            "server": "smtp.example.com:587",
            "sender": "acs-reports@example.com",
            "from": "ACS Reports",
            "username": "",
            "disableTLS": false,
            "startTLSAuthMethod": "DISABLED"
        }
    },
    {
        "id": "85a9ada1-9b71-482e-8fd9-d44347332b9e",
        "name": "Boaz",
        "type": "email",
        "labelDefault": "security@example.com",
        "labelKey": "",
        "email": {
            "server": "smtp.example.com:587",
            "sender": "acs-reports@example.com",
            "from": "ACS Reports",
            "username": "",
            "disableTLS": false,
            "startTLSAuthMethod": "DISABLED"
        }
    }
];

const MOCK_REPORTS = [
    {
        "id": "82817ddb-e7b9-491a-915b-4612afaec2f7",
        "name": "alan-test",
        "description": "",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "BOTH",
            "severities": [
                "CRITICAL_VULNERABILITY_SEVERITY",
                "IMPORTANT_VULNERABILITY_SEVERITY",
                "MODERATE_VULNERABILITY_SEVERITY",
                "LOW_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "WATCHED",
                "DEPLOYED"
            ],
            "allVuln": true,
            "includeNvdCvss": true,
            "includeEpssProbability": true,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [],
        "schedule": null,
        "resourceScope": {
            "collectionScope": {
                "collectionId": "b703d50e-b003-4a6a-bf1b-7ab36c9af184",
                "collectionName": "All"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    },
    {
        "id": "1061dad5-851f-4ca8-bdaa-492b46c3c275",
        "name": "Boaz for Demo apps",
        "description": "important and above, scoped to demo apps ",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "FIXABLE",
            "severities": [
                "CRITICAL_VULNERABILITY_SEVERITY",
                "IMPORTANT_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "DEPLOYED"
            ],
            "allVuln": true,
            "includeNvdCvss": false,
            "includeEpssProbability": false,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [
            {
                "emailConfig": {
                    "notifierId": "85a9ada1-9b71-482e-8fd9-d44347332b9e",
                    "mailingLists": [
                        "security@example.com"
                    ],
                    "customSubject": "",
                    "customBody": ""
                },
                "notifierName": "Boaz"
            }
        ],
        "schedule": null,
        "resourceScope": {
            "collectionScope": {
                "collectionId": "4a4004a8-220c-4919-b49b-2aaada74c1ad",
                "collectionName": "Demo - All"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    },
    {
        "id": "2de4838d-beef-4901-aef3-916d9c43fc2c",
        "name": "Charmik's test report",
        "description": "",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "BOTH",
            "severities": [
                "CRITICAL_VULNERABILITY_SEVERITY",
                "IMPORTANT_VULNERABILITY_SEVERITY",
                "MODERATE_VULNERABILITY_SEVERITY",
                "LOW_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "DEPLOYED",
                "WATCHED"
            ],
            "allVuln": true,
            "includeNvdCvss": false,
            "includeEpssProbability": false,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [],
        "schedule": null,
        "resourceScope": {
            "collectionScope": {
                "collectionId": "bfc5914b-aee3-4ee0-992e-bee967ef9488",
                "collectionName": "Collection with incorrect regex"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    },
    {
        "id": "6ab0f93a-9cf0-4081-ad2b-107f7f6a9890",
        "name": "charmik-test",
        "description": "",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "BOTH",
            "severities": [
                "CRITICAL_VULNERABILITY_SEVERITY",
                "IMPORTANT_VULNERABILITY_SEVERITY",
                "MODERATE_VULNERABILITY_SEVERITY",
                "LOW_VULNERABILITY_SEVERITY",
                "UNKNOWN_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "WATCHED"
            ],
            "allVuln": true,
            "includeNvdCvss": false,
            "includeEpssProbability": false,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [
            {
                "emailConfig": {
                    "notifierId": "07e79343-43da-4018-8bf7-90255c06707d",
                    "mailingLists": [
                        "security@example.com"
                    ],
                    "customSubject": "",
                    "customBody": ""
                },
                "notifierName": "Test"
            }
        ],
        "schedule": {
            "intervalType": "WEEKLY",
            "hour": 0,
            "minute": 0,
            "daysOfWeek": {
                "days": [
                    3
                ]
            }
        },
        "resourceScope": {
            "collectionScope": {
                "collectionId": "90e56de8-2371-43f0-8453-e44f8fb55a83",
                "collectionName": "Backend NS"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    },
    {
        "id": "f1515141-acd4-4faf-811c-ccc987d8bee5",
        "name": "davec-test",
        "description": "",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "BOTH",
            "severities": [
                "LOW_VULNERABILITY_SEVERITY",
                "MODERATE_VULNERABILITY_SEVERITY",
                "IMPORTANT_VULNERABILITY_SEVERITY",
                "CRITICAL_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "DEPLOYED",
                "WATCHED"
            ],
            "allVuln": true,
            "includeNvdCvss": false,
            "includeEpssProbability": false,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [
            {
                "emailConfig": {
                    "notifierId": "185ffa68-d569-4386-87db-c01e3ee8396b",
                    "mailingLists": [
                        "security@example.com"
                    ],
                    "customSubject": "",
                    "customBody": ""
                },
                "notifierName": "sink"
            }
        ],
        "schedule": null,
        "resourceScope": {
            "collectionScope": {
                "collectionId": "b703d50e-b003-4a6a-bf1b-7ab36c9af184",
                "collectionName": "All"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    },
    {
        "id": "3a5002a2-1169-44a9-ae53-c371e4cb24ca",
        "name": "dv-test-delete",
        "description": "",
        "type": "VULNERABILITY",
        "vulnReportFilters": {
            "fixability": "BOTH",
            "severities": [
                "IMPORTANT_VULNERABILITY_SEVERITY",
                "CRITICAL_VULNERABILITY_SEVERITY"
            ],
            "imageTypes": [
                "DEPLOYED"
            ],
            "allVuln": true,
            "includeNvdCvss": true,
            "includeEpssProbability": true,
            "includeAdvisory": false,
            "query": ""
        },
        "notifiers": [],
        "schedule": null,
        "resourceScope": {
            "collectionScope": {
                "collectionId": "b703d50e-b003-4a6a-bf1b-7ab36c9af184",
                "collectionName": "All"
            }
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "lastUpdatedAt": "2025-01-01T00:00:00Z",
        "creator": {
            "id": "user-1",
            "name": "demo-user"
        }
    }
];

const SCOPE_CLUSTERS = [
    {
        "id": "82855fd3-0490-4d75-b0f0-1353ce7170ad",
        "name": "sc-test-1",
        "type": "KUBERNETES_CLUSTER",
        "labels": [
            {
                "key": "test-key1",
                "value": "test-val1"
            }
        ]
    },
    {
        "id": "65673bd7-da6a-4cdc-a5fc-95765d1b9724",
        "name": "staging-central-cluster",
        "type": "OPENSHIFT4_CLUSTER",
        "labels": []
    },
    {
        "id": "f781e077-fb39-4529-a19d-7a3403e181b2",
        "name": "staging-secured-cluster",
        "type": "OPENSHIFT4_CLUSTER",
        "labels": []
    },
    {
        "id": "fa769ee2-afeb-405f-910d-0f514e6b1d78",
        "name": "test-unhealthy",
        "type": "OPENSHIFT4_CLUSTER",
        "labels": []
    },
    {
        "id": "e491900d-b0bc-4c20-910d-f090f22effab",
        "name": "test_external_ips",
        "type": "KUBERNETES_CLUSTER",
        "labels": []
    }
];

const SCOPE_NAMESPACES = [
    {
        "metadata": {
            "id": "e83ac6c8-8bbe-4297-883b-accf9a63d5d0",
            "name": "acc-clemson",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "acc-clemson"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "e18f322e-76bc-4d45-8e15-e4d7d1082055",
            "name": "acc-duke",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "acc-duke"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "cc2054dd-32be-44c5-b369-0227341fb046",
            "name": "acc-unc",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "acc-unc"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "665556ff-ac9b-4c83-a6e7-06b5b8255b03",
            "name": "backend",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "backend"
                },
                {
                    "key": "name",
                    "value": "backend"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "40178fa0-986d-4d36-ba25-bd949c536593",
            "name": "cert-manager",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "cert-manager"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "bc13ba5f-e08f-4054-a47b-ab5d85bb23cb",
            "name": "cert-manager",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "cert-manager"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "370fe7f7-f977-465c-92a1-1a242b119baf",
            "name": "cert-manager-operator",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "cert-manager-operator"
                },
                {
                    "key": "olm.operatorgroup.uid/b07b2adc-324a-49bd-b01e-3f2781a0b1df",
                    "value": ""
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "fe549838-a31f-48f4-82c0-8c2248791222",
            "name": "cert-manager-operator",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "cert-manager-operator"
                },
                {
                    "key": "olm.operatorgroup.uid/11254917-dcc6-4e1a-b8af-48ce60caefe8",
                    "value": ""
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "e96963ff-155f-44a6-9157-9a7f4754f3b4",
            "name": "default",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "default"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "43e3fa6b-ebb7-4bdc-b904-a113cf4af3e6",
            "name": "default",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "default"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "7a08806d-7fd2-4ced-ae4f-94b288515107",
            "name": "default",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "default"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "48a805b4-45f2-4167-88db-2c60b74cbd97",
            "name": "default-broker",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "default-broker"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "ee054e74-bbb7-44f5-ae4b-e600645c0d92",
            "name": "frontend",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "frontend"
                },
                {
                    "key": "name",
                    "value": "frontend"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "071f804d-985a-47d4-a39e-31064f325fee",
            "name": "gke-managed-cim",
            "labels": [
                {
                    "key": "addonmanager.kubernetes.io/mode",
                    "value": "Reconcile"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "gke-managed-cim"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "7660d820-ba64-4bb8-9bdc-cc98126252f8",
            "name": "gke-managed-system",
            "labels": [
                {
                    "key": "addonmanager.kubernetes.io/mode",
                    "value": "Reconcile"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "gke-managed-system"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "8d4d0f31-ad19-4768-9ca3-aac64d39b35e",
            "name": "gke-managed-volumepopulator",
            "labels": [
                {
                    "key": "addonmanager.kubernetes.io/mode",
                    "value": "Reconcile"
                },
                {
                    "key": "k8s-app",
                    "value": "gke-volume-populator"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "gke-managed-volumepopulator"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "af1cec43-1ee9-4caf-bd62-0773005bfca7",
            "name": "gmp-public",
            "labels": [
                {
                    "key": "addonmanager.kubernetes.io/mode",
                    "value": "Reconcile"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "gmp-public"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "374a9019-9519-4e37-98da-1b312a76fd08",
            "name": "gmp-system",
            "labels": [
                {
                    "key": "addonmanager.kubernetes.io/mode",
                    "value": "Reconcile"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "gmp-system"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "a1565315-76b6-4f67-8a0f-6125d8f03ae8",
            "name": "hive",
            "labels": [
                {
                    "key": "hive.openshift.io/target-namespace",
                    "value": "true"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "hive"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "82214c9d-6ae5-4d8c-b72b-2912fc2b0cb7",
            "name": "hypershift",
            "labels": [
                {
                    "key": "hypershift.openshift.io/monitoring",
                    "value": "true"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "hypershift"
                },
                {
                    "key": "olm.operatorgroup.uid/3dcaa378-950c-4a2e-b3f2-74e2bedfdc9f",
                    "value": ""
                },
                {
                    "key": "openshift.io/cluster-monitoring",
                    "value": "true"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "f9544785-f6c0-4a34-9e24-d41056b83a96",
            "name": "ingress-nginx",
            "labels": [
                {
                    "key": "app.kubernetes.io/instance",
                    "value": "ingress-nginx"
                },
                {
                    "key": "app.kubernetes.io/name",
                    "value": "ingress-nginx"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "ingress-nginx"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "02bc4a7a-1b84-4344-95b7-38cc71d70802",
            "name": "kube-node-lease",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-node-lease"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "1dcfe07c-a486-44c3-b085-41e1770b26b7",
            "name": "kube-node-lease",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-node-lease"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "4b670a74-aba6-4361-878e-eafcafd560cc",
            "name": "kube-node-lease",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-node-lease"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "d32a6466-605d-4993-87f1-da850aed1be3",
            "name": "kube-public",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-public"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "e019fee3-44c9-409f-b92f-15f0f8665e30",
            "name": "kube-public",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-public"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "09ca5fbc-2f60-4c5a-bbb0-a17ce801c142",
            "name": "kube-public",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-public"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "f2e360ec-73b2-4fcf-9795-96727f68d165",
            "name": "kube-system",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-system"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "36d331c9-c0a5-4331-b6b4-e27f467c17d1",
            "name": "kube-system",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-system"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "afac9049-070d-4d3b-9c19-a77e5ed2717c",
            "name": "kube-system",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "kube-system"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/enforce",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "b0c446ce-3d33-4025-b2c1-97768944b7da",
            "name": "local-cluster",
            "labels": [
                {
                    "key": "cluster.open-cluster-management.io/managedCluster",
                    "value": "local-cluster"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "local-cluster"
                },
                {
                    "key": "open-cluster-management.io/cluster-name",
                    "value": "local-cluster"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "f9347250-e63b-41f4-a413-ebfb62de1675",
            "name": "medical",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "medical"
                },
                {
                    "key": "name",
                    "value": "medical"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "dfcc7d80-d0ba-4bcc-aa8f-bed07c2fad3c",
            "name": "ms-demo",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "ms-demo"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-reconcile-version",
                    "value": "1.22.0"
                },
                {
                    "key": "openshift-pipelines.tekton.dev/namespace-trusted-configmaps-version",
                    "value": "1.22.0"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "baseline"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "dddcf348-dfc2-43ff-861b-e821a1606420",
            "name": "multicluster-engine",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "multicluster-engine"
                },
                {
                    "key": "olm.operatorgroup.uid/3dcaa378-950c-4a2e-b3f2-74e2bedfdc9f",
                    "value": ""
                },
                {
                    "key": "olm.operatorgroup.uid/dff8ce4e-8695-45b3-b156-e89837584939",
                    "value": ""
                },
                {
                    "key": "openshift.io/cluster-monitoring",
                    "value": "true"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "328c54c1-ef94-4cf8-8d5f-f58ce0626197",
            "name": "narnia",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "narnia"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "5fe8d9d7-07db-4a20-8c31-05dfdad27342",
            "name": "open-cluster-management",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "open-cluster-management"
                },
                {
                    "key": "olm.operatorgroup.uid/3dcaa378-950c-4a2e-b3f2-74e2bedfdc9f",
                    "value": ""
                },
                {
                    "key": "olm.operatorgroup.uid/850d598f-f9cd-4226-9405-6b765235e4b6",
                    "value": ""
                },
                {
                    "key": "openshift.io/cluster-monitoring",
                    "value": "true"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "c0d7fd70-c1af-4f21-b26a-1891d4f1b9f8",
            "name": "open-cluster-management-agent",
            "labels": [
                {
                    "key": "createdByKlusterlet",
                    "value": "klusterlet"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "open-cluster-management-agent"
                },
                {
                    "key": "operator.open-cluster-management.io/klusterlet",
                    "value": "klusterlet"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "c10c3d4e-6d97-4906-9df7-019928694177",
            "name": "open-cluster-management-agent-addon",
            "labels": [
                {
                    "key": "addon.open-cluster-management.io/namespace",
                    "value": "true"
                },
                {
                    "key": "createdByKlusterlet",
                    "value": "klusterlet"
                },
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "open-cluster-management-agent-addon"
                },
                {
                    "key": "olm.operatorgroup.uid/3dcaa378-950c-4a2e-b3f2-74e2bedfdc9f",
                    "value": ""
                },
                {
                    "key": "openshift.io/cluster-monitoring",
                    "value": "true"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "privileged"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "68c1e8b2-efc1-44ea-8aa3-cc242aef482a",
            "name": "open-cluster-management-global-set",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "open-cluster-management-global-set"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    },
    {
        "metadata": {
            "id": "b15de0f5-32f9-42c0-8b7b-fde1a8244998",
            "name": "open-cluster-management-hub",
            "labels": [
                {
                    "key": "kubernetes.io/metadata.name",
                    "value": "open-cluster-management-hub"
                },
                {
                    "key": "pod-security.kubernetes.io/audit",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/audit-version",
                    "value": "latest"
                },
                {
                    "key": "pod-security.kubernetes.io/warn",
                    "value": "restricted"
                },
                {
                    "key": "pod-security.kubernetes.io/warn-version",
                    "value": "latest"
                }
            ],
            "annotations": []
        }
    }
];

const SCOPE_DEPLOYMENTS = [
    {
        "id": "569b9c22-7499-43e2-b5ac-24da7ec5d3a8",
        "name": "insights-metrics",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "policyreport"
            },
            {
                "key": "chart",
                "value": "policyreport-2.12.0"
            },
            {
                "key": "component",
                "value": "insights-metrics"
            },
            {
                "key": "heritage",
                "value": "release-service"
            },
            {
                "key": "installer.name",
                "value": "multiclusterhub"
            },
            {
                "key": "installer.namespace",
                "value": "open-cluster-management"
            },
            {
                "key": "release",
                "value": "policyreport"
            }
        ],
        "annotations": []
    },
    {
        "id": "cc36143b-b27c-4eb0-9d67-2e2a9920c636",
        "name": "networking-console-plugin",
        "type": "Deployment",
        "labels": [
            {
                "key": "app.kubernetes.io/component",
                "value": "networking-console-plugin"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "cluster-network-operator"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "networking-console-plugin"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "cluster-network-operator"
            },
            {
                "key": "networkoperator.openshift.io/generates-operator-status",
                "value": "stand-alone"
            }
        ],
        "annotations": []
    },
    {
        "id": "5518b924-98f8-4c56-864f-1a06fb0fca00",
        "name": "kube-controller-manager-staging-central-sshg4-master-0.c.acs-team-automation.internal",
        "type": "Pod",
        "labels": [
            {
                "key": "app",
                "value": "kube-controller-manager"
            },
            {
                "key": "kube-controller-manager",
                "value": "true"
            },
            {
                "key": "revision",
                "value": "53"
            }
        ],
        "annotations": []
    },
    {
        "id": "3350b82d-02b4-4491-a382-437a4ae3cf92",
        "name": "etcd-guard-staging-central-sshg4-master-2.c.acs-team-automation.internal",
        "type": "Pod",
        "labels": [
            {
                "key": "app",
                "value": "guard"
            }
        ],
        "annotations": []
    },
    {
        "id": "c0d91d7e-cc6d-4a12-a3d2-2bf8088e8627",
        "name": "kube-apiserver-staging-secured-clust-pnltj-master-1",
        "type": "Pod",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-kube-apiserver"
            },
            {
                "key": "revision",
                "value": "225"
            }
        ],
        "annotations": []
    },
    {
        "id": "1d719963-00d3-4929-8ba5-93db9266658f",
        "name": "old-pci-rerunner",
        "type": "CronJob",
        "labels": [],
        "annotations": []
    },
    {
        "id": "646b6c67-f486-4601-b540-4d35d63f209d",
        "name": "nvidia-gpu-device-plugin-medium-cos",
        "type": "DaemonSet",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            },
            {
                "key": "k8s-app",
                "value": "nvidia-gpu-device-plugin"
            }
        ],
        "annotations": []
    },
    {
        "id": "89d66c3b-4aba-4bf5-b04d-c02ec55bffcd",
        "name": "rhacs-operator-controller-manager",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "rhacs-operator"
            },
            {
                "key": "control-plane",
                "value": "controller-manager"
            },
            {
                "key": "olm.deployment-spec-hash",
                "value": "eqG5sP428eGZB1QNWYdWPWaFooPpNFtY2p4nx"
            },
            {
                "key": "olm.managed",
                "value": "true"
            },
            {
                "key": "olm.owner",
                "value": "rhacs-operator.v4.11.0-nightly-20260504"
            },
            {
                "key": "olm.owner.kind",
                "value": "ClusterServiceVersion"
            },
            {
                "key": "olm.owner.namespace",
                "value": "openshift-operators"
            },
            {
                "key": "operators.coreos.com/rhacs-operator.openshift-operators",
                "value": ""
            }
        ],
        "annotations": []
    },
    {
        "id": "9a79fd01-5171-4989-b470-b7df94687800",
        "name": "rhcos4-moderate-rev-4-worker-rs",
        "type": "Deployment",
        "labels": [],
        "annotations": []
    },
    {
        "id": "6235745e-9ef9-4e2e-aff4-d0cbd8c0ff4c",
        "name": "csi-snapshot-controller",
        "type": "Deployment",
        "labels": [
            {
                "key": "hypershift.openshift.io/managed-by",
                "value": "csi-snapshot-controller-operator"
            }
        ],
        "annotations": []
    },
    {
        "id": "52cc1d57-3c77-4c6a-8f29-a250eeff992b",
        "name": "machine-approver",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "machine-approver"
            },
            {
                "key": "machine-approver",
                "value": "true"
            }
        ],
        "annotations": []
    },
    {
        "id": "129f0085-265b-4615-92b6-6eb89f8df9be",
        "name": "pyroscope",
        "type": "StatefulSet",
        "labels": [
            {
                "key": "app.kubernetes.io/component",
                "value": "all"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "pyroscope"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "Helm"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "pyroscope"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "1.15.0"
            },
            {
                "key": "helm.sh/chart",
                "value": "pyroscope-1.15.1"
            }
        ],
        "annotations": []
    },
    {
        "id": "2437f0c0-33bb-4ebc-a148-31e84462c76b",
        "name": "etcd-staging-central-sshg4-master-1.c.acs-team-automation.internal",
        "type": "Pod",
        "labels": [
            {
                "key": "app",
                "value": "etcd"
            },
            {
                "key": "etcd",
                "value": "true"
            },
            {
                "key": "k8s-app",
                "value": "etcd"
            },
            {
                "key": "revision",
                "value": "19"
            }
        ],
        "annotations": []
    },
    {
        "id": "9eb91cc0-6ed8-4489-b4ac-016000ca858f",
        "name": "admission-control",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/component",
                "value": "admission-control"
            },
            {
                "key": "app.kubernetes.io/instance",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "Helm"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "stackrox"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "stackrox-secured-cluster-services"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "4.11.x-nightly-20260504"
            },
            {
                "key": "app.stackrox.io/managed-by",
                "value": "operator"
            },
            {
                "key": "auto-upgrade.stackrox.io/component",
                "value": "sensor"
            },
            {
                "key": "helm.sh/chart",
                "value": "stackrox-secured-cluster-services-400.11.0-nightly-20260504"
            }
        ],
        "annotations": []
    },
    {
        "id": "dc874eb4-734a-4ca5-a75b-ae931332d9f5",
        "name": "cluster-proxy",
        "type": "Deployment",
        "labels": [
            {
                "key": "proxy.open-cluster-management.io/configuration-generation",
                "value": "3"
            }
        ],
        "annotations": []
    },
    {
        "id": "c1bc0f54-b6cc-4eb3-880c-d9d6583c3649",
        "name": "openshift-config-operator",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "openshift-config-operator"
            }
        ],
        "annotations": []
    },
    {
        "id": "3a65f139-9a79-4bde-b7bc-80bf989f2b25",
        "name": "cluster-baremetal-operator",
        "type": "Deployment",
        "labels": [
            {
                "key": "k8s-app",
                "value": "cluster-baremetal-operator"
            }
        ],
        "annotations": []
    },
    {
        "id": "b8d13601-ac57-4939-906a-da0fc30a0d35",
        "name": "openshift-kube-scheduler-guard-staging-secured-clust-pnltj-master-0",
        "type": "Pod",
        "labels": [
            {
                "key": "app",
                "value": "guard"
            }
        ],
        "annotations": []
    },
    {
        "id": "9a24c052-1362-4293-a7f5-f32d8582236b",
        "name": "telemeter-client",
        "type": "Deployment",
        "labels": [
            {
                "key": "app.kubernetes.io/component",
                "value": "telemetry-metrics-collector"
            },
            {
                "key": "app.kubernetes.io/managed-by",
                "value": "cluster-monitoring-operator"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "telemeter-client"
            },
            {
                "key": "app.kubernetes.io/part-of",
                "value": "openshift-monitoring"
            }
        ],
        "annotations": []
    },
    {
        "id": "1a002ac6-ecfe-43f7-8da5-c9899e968876",
        "name": "metadata-proxy-v0.1",
        "type": "DaemonSet",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            },
            {
                "key": "k8s-app",
                "value": "metadata-proxy"
            },
            {
                "key": "kubernetes.io/cluster-service",
                "value": "true"
            },
            {
                "key": "version",
                "value": "v0.1"
            }
        ],
        "annotations": []
    },
    {
        "id": "d41d4bab-9b28-4c16-bc1d-f74728d39ffa",
        "name": "openshift-routes",
        "type": "Deployment",
        "labels": [
            {
                "key": "app.kubernetes.io/component",
                "value": "controller"
            },
            {
                "key": "app.kubernetes.io/name",
                "value": "openshift-routes"
            },
            {
                "key": "app.kubernetes.io/version",
                "value": "v0.8.4"
            }
        ],
        "annotations": []
    },
    {
        "id": "8106f47b-c973-471b-9645-ed943227a917",
        "name": "gke-metrics-agent-scaling-50",
        "type": "DaemonSet",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            },
            {
                "key": "component",
                "value": "gke-metrics-agent"
            },
            {
                "key": "k8s-app",
                "value": "gke-metrics-agent"
            }
        ],
        "annotations": []
    },
    {
        "id": "1016c643-1b1e-4ab8-893e-6e996657aeef",
        "name": "kube-apiserver-staging-secured-clust-pnltj-master-2",
        "type": "Pod",
        "labels": [
            {
                "key": "apiserver",
                "value": "true"
            },
            {
                "key": "app",
                "value": "openshift-kube-apiserver"
            },
            {
                "key": "revision",
                "value": "225"
            }
        ],
        "annotations": []
    },
    {
        "id": "776c82a7-cfb9-4f96-a06c-c89a2bb9cad4",
        "name": "rule-evaluator",
        "type": "Deployment",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            }
        ],
        "annotations": []
    },
    {
        "id": "86c41d3c-f44f-46ea-a95b-a44148a51740",
        "name": "ocp4-pci-dss-3-2-rs",
        "type": "Deployment",
        "labels": [],
        "annotations": []
    },
    {
        "id": "7337533a-7ae1-48e2-9ead-59ebbb21ebd4",
        "name": "pdcsi-node-windows",
        "type": "DaemonSet",
        "labels": [
            {
                "key": "addonmanager.kubernetes.io/mode",
                "value": "Reconcile"
            },
            {
                "key": "k8s-app",
                "value": "gcp-compute-persistent-disk-csi-driver"
            }
        ],
        "annotations": []
    },
    {
        "id": "bc0d69f9-7ac0-4390-85ec-e9c6fd381734",
        "name": "varnish",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "varnish"
            }
        ],
        "annotations": []
    },
    {
        "id": "b5c12096-bf14-4751-87e3-7a4b999fe27a",
        "name": "marketplace-operator",
        "type": "Deployment",
        "labels": [],
        "annotations": []
    },
    {
        "id": "eebd74c6-2a33-41f0-9da7-534333c55cd6",
        "name": "kube-rbac-proxy-crio-staging-central-sshg4-master-0.c.acs-team-automation.internal",
        "type": "Pod",
        "labels": [
            {
                "key": "k8s-app",
                "value": "kube-rbac-proxy-crio"
            }
        ],
        "annotations": []
    },
    {
        "id": "7141a756-f33c-4e5b-aec9-fbe544aedbac",
        "name": "oauth-openshift",
        "type": "Deployment",
        "labels": [
            {
                "key": "app",
                "value": "oauth-openshift"
            }
        ],
        "annotations": []
    }
];


const MOCK_ALERTS = [{"id":"9db47be3-47c9-4efb-9672-73585e792f51","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:26.451378Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-metric-signer"}},{"id":"a2ba3c72-5665-42e3-8212-5f495862ef21","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:26.250412Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-signer"}},{"id":"8be499cb-3d75-4909-a353-5d80ac17e77e","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:25.967578Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-apiserver","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-client"}},{"id":"895a40b7-e8e6-48b1-9a93-64f207c49139","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:25.874378Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-config","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"openshift-api-tls"}},{"id":"11eed5ea-9df8-44ee-b857-28dfb49eea14","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:25.870643Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-all-certs"}},{"id":"5fdd966d-e69e-4431-b710-6e38eff18228","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:25.863941Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"kube-system","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"kubeadmin"}},{"id":"601cf881-3e48-4995-b08d-8011542a810a","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:25.854258Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-oauth-apiserver","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-client"}},{"id":"6f2ef444-d46a-471a-9ac0-2f573ee5fb1f","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:24.997690Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-machine-api","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"worker-user-data-managed"}},{"id":"dab677d7-a4a5-4f05-84e3-ab880a0caabe","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:24.985312Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-machine-api","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"master-user-data-managed"}},{"id":"7d6b08d9-ec9b-4416-a009-41b478542439","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:21.981650Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-machine-config-operator","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"node-bootstrapper-token"}},{"id":"d3a028e0-1ed8-4d84-840b-a504f87610ce","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:19.988303Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"multicluster-engine","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"cluster-image-set-git-repo"}},{"id":"2d7fcf80-66fc-4e04-a78c-0d4aee878565","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:19.068908Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"open-cluster-management-agent","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"open-cluster-management-image-pull-credentials"}},{"id":"18e70e51-f36e-4580-acf5-85c57a8e2055","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:19.053640Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"open-cluster-management-agent","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"bootstrap-hub-kubeconfig"}},{"id":"b7d5acc6-b817-40f2-bd9a-865b24e44488","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:18.996529Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"open-cluster-management-agent-addon","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"cluster-proxy-ca"}},{"id":"3db01fa0-ea48-4b15-bb25-e71d48d7ccbe","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:18.980249Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"open-cluster-management-agent-addon","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"cluster-proxy-service-proxy-server-certificates"}},{"id":"2aef8ac7-2350-4bcd-8775-598bd1a315d0","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:18.133035Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-serving-metrics-staging-central-sshg4-master-2.c.acs-team-automation.internal"}},{"id":"ea48c9a8-a843-423d-a1f6-c0def412a5d7","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:17.930856Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-serving-staging-central-sshg4-master-2.c.acs-team-automation.internal"}},{"id":"28d06b79-d7ab-4f8d-9de1-3f787ff26cc9","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:17.732072Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-peer-staging-central-sshg4-master-2.c.acs-team-automation.internal"}},{"id":"d8ae5db0-3cc6-4779-83a9-df856d703865","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:17.532428Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-serving-metrics-staging-central-sshg4-master-1.c.acs-team-automation.internal"}},{"id":"15912402-7fcc-40ce-b717-f901e1c1e8ee","lifecycleStage":"RUNTIME","time":"2026-05-04T20:16:17.332231Z","state":"ACTIVE","enforcementCount":0,"enforcementAction":"UNSET_ENFORCEMENT","policy":{"id":"dfa6aaeb-a387-4782-83e3-2dad75270406","name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY","description":"Applications must not use Kubernetes Secrets at all since they are not encrypted at rest.  Instead they must use encrypted secrets from a 3rd part solution (e.g. Vault, Bitnami, etc)","categories":["DevOps Best Practices"]},"commonEntityInfo":{"clusterName":"staging-central-cluster","namespace":"openshift-etcd","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespaceId":"","resourceType":"SECRETS"},"deployment":null,"resource":{"name":"etcd-serving-staging-central-sshg4-master-1.c.acs-team-automation.internal"}}];
const MOCK_ALERT_COUNT = 15579;
const MOCK_ALERT_SUMMARY_GROUPS = [{"group":"Anomalous Activity","counts":[{"severity":"LOW_SEVERITY","count":"485"},{"severity":"HIGH_SEVERITY","count":"9"}]},{"group":"BSI","counts":[{"severity":"MEDIUM_SEVERITY","count":"794"},{"severity":"HIGH_SEVERITY","count":"567"},{"severity":"CRITICAL_SEVERITY","count":"443"}]},{"group":"CIS-Docker","counts":[{"severity":"MEDIUM_SEVERITY","count":"626"},{"severity":"HIGH_SEVERITY","count":"377"},{"severity":"CRITICAL_SEVERITY","count":"63"}]},{"group":"Container Runtime","counts":[{"severity":"HIGH_SEVERITY","count":"3"},{"severity":"CRITICAL_SEVERITY","count":"63"}]},{"group":"Cryptocurrency Mining","counts":[{"severity":"LOW_SEVERITY","count":"458"}]},{"group":"DevOps Best Practices","counts":[{"severity":"LOW_SEVERITY","count":"1307"},{"severity":"MEDIUM_SEVERITY","count":"518"},{"severity":"HIGH_SEVERITY","count":"360"}]},{"group":"Docker CIS","counts":[{"severity":"LOW_SEVERITY","count":"46"},{"severity":"MEDIUM_SEVERITY","count":"86"}]},{"group":"File Activity Monitoring","counts":[{"severity":"LOW_SEVERITY","count":"6"}]},{"group":"HIPAA","counts":[{"severity":"HIGH_SEVERITY","count":"370"},{"severity":"CRITICAL_SEVERITY","count":"63"}]},{"group":"Host Security","counts":[{"severity":"MEDIUM_SEVERITY","count":"87"},{"severity":"HIGH_SEVERITY","count":"23"}]},{"group":"Kubernetes","counts":[{"severity":"LOW_SEVERITY","count":"23"},{"severity":"HIGH_SEVERITY","count":"1"}]},{"group":"Kubernetes Events","counts":[{"severity":"HIGH_SEVERITY","count":"4"}]},{"group":"NIST 800-190","counts":[{"severity":"MEDIUM_SEVERITY","count":"88"},{"severity":"HIGH_SEVERITY","count":"508"},{"severity":"CRITICAL_SEVERITY","count":"63"}]},{"group":"NIST-800-30","counts":[{"severity":"MEDIUM_SEVERITY","count":"1040"},{"severity":"HIGH_SEVERITY","count":"351"},{"severity":"CRITICAL_SEVERITY","count":"443"}]},{"group":"Network Tools","counts":[{"severity":"MEDIUM_SEVERITY","count":"1"},{"severity":"HIGH_SEVERITY","count":"1"}]},{"group":"PCI","counts":[{"severity":"MEDIUM_SEVERITY","count":"709"},{"severity":"HIGH_SEVERITY","count":"212"},{"severity":"CRITICAL_SEVERITY","count":"63"}]},{"group":"PCI-DSS","counts":[{"severity":"MEDIUM_SEVERITY","count":"231"},{"severity":"HIGH_SEVERITY","count":"200"}]},{"group":"Privilege Escalation","counts":[{"severity":"HIGH_SEVERITY","count":"445"}]},{"group":"Privileges","counts":[{"severity":"MEDIUM_SEVERITY","count":"615"},{"severity":"HIGH_SEVERITY","count":"62"}]},{"group":"Risk-Assessment","counts":[{"severity":"MEDIUM_SEVERITY","count":"1040"},{"severity":"HIGH_SEVERITY","count":"351"},{"severity":"CRITICAL_SEVERITY","count":"443"}]},{"group":"Runtime Security","counts":[{"severity":"MEDIUM_SEVERITY","count":"1"},{"severity":"HIGH_SEVERITY","count":"1"}]},{"group":"Security Best Practices","counts":[{"severity":"LOW_SEVERITY","count":"254"},{"severity":"MEDIUM_SEVERITY","count":"1379"},{"severity":"HIGH_SEVERITY","count":"1262"}]},{"group":"Supply Chain Security","counts":[{"severity":"LOW_SEVERITY","count":"219"},{"severity":"MEDIUM_SEVERITY","count":"52"},{"severity":"HIGH_SEVERITY","count":"390"}]},{"group":"System Modification","counts":[{"severity":"LOW_SEVERITY","count":"1"},{"severity":"HIGH_SEVERITY","count":"2"}]},{"group":"Vulnerability Management","counts":[{"severity":"LOW_SEVERITY","count":"1054"},{"severity":"MEDIUM_SEVERITY","count":"52"},{"severity":"HIGH_SEVERITY","count":"1180"},{"severity":"CRITICAL_SEVERITY","count":"1"}]},{"group":"Zero Trust","counts":[{"severity":"MEDIUM_SEVERITY","count":"123"},{"severity":"HIGH_SEVERITY","count":"6"}]}];
const MOCK_DEPLOYMENTS_AT_RISK = [{"deployment":{"id":"d0e8d816-5707-448a-b91a-dbd5f991a895","hash":"10669088494942513310","name":"node-ca","cluster":"staging-secured-cluster","clusterId":"f781e077-fb39-4529-a19d-7a3403e181b2","namespace":"openshift-image-registry","created":"2024-02-20T19:11:01Z","priority":"53"},"baselineStatuses":[{"containerName":"node-ca","baselineStatus":"LOCKED","anomalousProcessesExecuted":false}]},{"deployment":{"id":"3969a240-7651-45c2-8c64-c8610cb5f8e5","hash":"9468497868806281624","name":"machine-config-operator","cluster":"staging-secured-cluster","clusterId":"f781e077-fb39-4529-a19d-7a3403e181b2","namespace":"openshift-machine-config-operator","created":"2024-02-20T18:55:55Z","priority":"78"},"baselineStatuses":[{"containerName":"machine-config-operator","baselineStatus":"LOCKED","anomalousProcessesExecuted":false}]},{"deployment":{"id":"1107cef8-23fd-41df-84fb-59085f3b2229","hash":"10145038420541986043","name":"nvidia-gpu-device-plugin-large-cos","cluster":"test_external_ips","clusterId":"e491900d-b0bc-4c20-910d-f090f22effab","namespace":"kube-system","created":"2025-06-03T17:30:49Z","priority":"138"},"baselineStatuses":[{"containerName":"nvidia-gpu-device-plugin","baselineStatus":"NOT_GENERATED","anomalousProcessesExecuted":false},{"containerName":"nvidia-metrics-collector","baselineStatus":"NOT_GENERATED","anomalousProcessesExecuted":false}]},{"deployment":{"id":"a05d96ee-45ec-4d97-9fe4-cec0310311ea","hash":"6470366581403279889","name":"tekton-triggers-controller","cluster":"staging-secured-cluster","clusterId":"f781e077-fb39-4529-a19d-7a3403e181b2","namespace":"openshift-pipelines","created":"2026-04-23T18:09:56Z","priority":"106"},"baselineStatuses":[{"containerName":"tekton-triggers-controller","baselineStatus":"LOCKED","anomalousProcessesExecuted":false}]},{"deployment":{"id":"02208d54-de9f-4a3d-81ba-a2bd58617f07","hash":"7322156612366917580","name":"volsync-addon-controller","cluster":"staging-central-cluster","clusterId":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","namespace":"open-cluster-management","created":"2025-10-14T15:54:11Z","priority":"54"},"baselineStatuses":[{"containerName":"volsync-addon-controller","baselineStatus":"LOCKED","anomalousProcessesExecuted":false}]}];
const MOCK_COMPLIANCE_STANDARDS = [{"id":"HIPAA_164","name":"HIPAA 164","description":"","numImplementedChecks":18,"scopes":["CLUSTER","NAMESPACE","DEPLOYMENT"],"dynamic":false,"hideScanResults":true},{"id":"ocp4-cis-node","name":"ocp4-cis-node","description":"This profile defines a baseline that aligns to the Center for Internet Security\u00ae Red Hat OpenShift Container Platform 4 Benchmark\u2122, V1.9.0. This profile includes Center for Internet Security\u00ae Red Hat OpenShift Container Platform 4 CIS Benchmarks\u2122 content. Note that this part of the profile is meant to run on the Operating System that Red Hat OpenShift Container Platform 4 runs on top of. This profile is applicable to OpenShift versions 4.12 and greater.","numImplementedChecks":103,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":false},{"id":"rhcos4-moderate-rev-4","name":"rhcos4-moderate-rev-4","description":"This compliance profile reflects the core set of Moderate-Impact Baseline configuration settings for deployment of Red Hat Enterprise Linux CoreOS into U.S. Defense, Intelligence, and Civilian agencies. Development partners and sponsors include the U.S. National Institute of Standards and Technology (NIST), U.S. Department of Defense, the National Security Agency, and Red Hat. This baseline implements configuration requirements from the following sources: - NIST 800-53 control selections for Moderate-Impact systems (NIST 800-53) For any differing configuration requirements, e.g. password lengths, the stricter security setting was chosen. Security Requirement Traceability Guides (RTMs) and sample System Security Configuration Guides are provided via the scap-security-guide-docs package. This profile reflects U.S. Government consensus content and is developed through the ComplianceAsCode initiative, championed by the National Security Agency. Except for differences in formatting to accommodate publishing processes, this profile mirrors ComplianceAsCode content as minor divergences, such as bugfixes, work through the consensus and release processes.","numImplementedChecks":241,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-high","name":"ocp4-high","description":"This compliance profile reflects the core set of High-Impact Baseline configuration settings for deployment of Red Hat OpenShift Container Platform into U.S. Defense, Intelligence, and Civilian agencies. Development partners and sponsors include the U.S. National Institute of Standards and Technology (NIST), U.S. Department of Defense, the National Security Agency, and Red Hat. This baseline implements configuration requirements from the following sources: - NIST 800-53 control selections for High-Impact systems (NIST 800-53) For any differing configuration requirements, e.g. password lengths, the stricter security setting was chosen. Security Requirement Traceability Guides (RTMs) and sample System Security Configuration Guides are provided via the scap-security-guide-docs package. This profile reflects U.S. Government consensus content and is developed through the ComplianceAsCode initiative, championed by the National Security Agency. Except for differences in formatting to accommodate publishing processes, this profile mirrors ComplianceAsCode content as minor divergences, such as bugfixes, work through the consensus and release processes.","numImplementedChecks":136,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-high-node","name":"ocp4-high-node","description":"This compliance profile reflects the core set of High-Impact Baseline configuration settings for deployment of Red Hat OpenShift Container Platform into U.S. Defense, Intelligence, and Civilian agencies. Development partners and sponsors include the U.S. National Institute of Standards and Technology (NIST), U.S. Department of Defense, the National Security Agency, and Red Hat. This baseline implements configuration requirements from the following sources: - NIST 800-53 control selections for High-Impact systems (NIST 800-53) For any differing configuration requirements, e.g. password lengths, the stricter security setting was chosen. Security Requirement Traceability Guides (RTMs) and sample System Security Configuration Guides are provided via the scap-security-guide-docs package. This profile reflects U.S. Government consensus content and is developed through the ComplianceAsCode initiative, championed by the National Security Agency. Except for differences in formatting to accommodate publishing processes, this profile mirrors ComplianceAsCode content as minor divergences, such as bugfixes, work through the consensus and release processes.","numImplementedChecks":123,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"NIST_SP_800_53_Rev_4","name":"NIST SP 800-53","description":"","numImplementedChecks":22,"scopes":["CLUSTER","NAMESPACE","DEPLOYMENT"],"dynamic":false,"hideScanResults":true},{"id":"ocp4-pci-dss-3-2","name":"ocp4-pci-dss-3-2","description":"Ensures PCI-DSS v3.2.1 security configuration settings are applied.","numImplementedChecks":109,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-bsi","name":"ocp4-bsi","description":"This profile defines a baseline that aligns to the BSI (Federal Office for Security Information) IT-Grundschutz Basic-Protection. This baseline implements configuration requirements from the following sources: - Building-Block SYS.1.6 Containerisation - Building-Block APP.4.4 Kubernetes","numImplementedChecks":86,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-cis","name":"ocp4-cis","description":"This profile defines a baseline that aligns to the Center for Internet Security\u00ae Red Hat OpenShift Container Platform 4 Benchmark\u2122, V1.9.0. This profile includes Center for Internet Security\u00ae Red Hat OpenShift Container Platform 4 CIS Benchmarks\u2122 content. Note that this part of the profile is meant to run on the Platform that Red Hat OpenShift Container Platform 4 runs on top of. This profile is applicable to OpenShift versions 4.12 and greater.","numImplementedChecks":96,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":false},{"id":"ocp4-stig","name":"ocp4-stig","description":"This profile contains configuration checks that align to the DISA STIG for Red Hat OpenShift Container Platform 4.","numImplementedChecks":50,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"rhcos4-stig-v2r3","name":"rhcos4-stig-v2r3","description":"This profile contains configuration checks that align to the DISA STIG for Red Hat Enterprise Linux CoreOS 4.","numImplementedChecks":118,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-bsi-node","name":"ocp4-bsi-node","description":"This profile defines a baseline that aligns to the BSI (Federal Office for Security Information) IT-Grundschutz Basic-Protection. This baseline implements configuration requirements from the following sources: - Building-Block SYS.1.6 Containerisation - Building-Block APP.4.4 Kubernetes","numImplementedChecks":19,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-pci-dss-node-4-0","name":"ocp4-pci-dss-node-4-0","description":"Ensures PCI-DSS v4.0.0 security configuration settings are applied.","numImplementedChecks":117,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":false},{"id":"rhcos4-bsi","name":"rhcos4-bsi","description":"This profile defines a baseline that aligns to the BSI (Federal Office for Security Information) IT-Grundschutz Basic-Protection. This baseline implements OS-Level configuration requirements from the following sources: - Building-Block SYS.1.1 General Server - Building-Block SYS.1.3 Linux Server - Building-Block SYS.1.6 Containerisation - Building-Block APP.4.4 Kubernetes","numImplementedChecks":173,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"NIST_800_190","name":"NIST SP 800-190","description":"","numImplementedChecks":14,"scopes":["CLUSTER","NAMESPACE","DEPLOYMENT","NODE"],"dynamic":false,"hideScanResults":true},{"id":"PCI_DSS_3_2","name":"PCI DSS 3.2.1","description":"","numImplementedChecks":24,"scopes":["CLUSTER","NAMESPACE","DEPLOYMENT"],"dynamic":false,"hideScanResults":true},{"id":"rhcos4-nerc-cip","name":"rhcos4-nerc-cip","description":"This compliance profile reflects a set of security recommendations for the usage of Red Hat Enterprise Linux CoreOS in critical infrastructure in the energy sector. This follows the recommendations coming from the following CIP standards: - CIP-002-5 - CIP-003-8 - CIP-004-6 - CIP-005-6 - CIP-007-3 - CIP-007-6 - CIP-009-6","numImplementedChecks":241,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"rhcos4-stig","name":"rhcos4-stig","description":"This profile contains configuration checks that align to the DISA STIG for Red Hat Enterprise Linux CoreOS 4.","numImplementedChecks":118,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"ocp4-pci-dss-4-0","name":"ocp4-pci-dss-4-0","description":"Ensures PCI-DSS v4.0.0 security configuration settings are applied.","numImplementedChecks":122,"scopes":["CLUSTER"],"dynamic":true,"hideScanResults":true},{"id":"CIS_Kubernetes_v1_5","name":"CIS Kubernetes v1.5","description":"","numImplementedChecks":122,"scopes":["CLUSTER","NODE"],"dynamic":false,"hideScanResults":true}];
const MOCK_COMPLIANCE_AGG_RESULTS = [{"aggregationKeys":[{"id":"CIS_Kubernetes_v1_5","scope":"STANDARD"}],"numFailing":107,"numPassing":15,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"HIPAA_164","scope":"STANDARD"}],"numFailing":12,"numPassing":6,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"NIST_800_190","scope":"STANDARD"}],"numFailing":10,"numPassing":4,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"NIST_SP_800_53_Rev_4","scope":"STANDARD"}],"numFailing":12,"numPassing":10,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"PCI_DSS_3_2","scope":"STANDARD"}],"numFailing":18,"numPassing":6,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-bsi","scope":"STANDARD"}],"numFailing":24,"numPassing":33,"numSkipped":29,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-bsi-node","scope":"STANDARD"}],"numFailing":1,"numPassing":18,"numSkipped":0,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-cis","scope":"STANDARD"}],"numFailing":9,"numPassing":63,"numSkipped":28,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-cis-1-7","scope":"STANDARD"}],"numFailing":9,"numPassing":63,"numSkipped":28,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-cis-node","scope":"STANDARD"}],"numFailing":0,"numPassing":94,"numSkipped":9,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-cis-node-1-7","scope":"STANDARD"}],"numFailing":0,"numPassing":94,"numSkipped":9,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-high","scope":"STANDARD"}],"numFailing":25,"numPassing":80,"numSkipped":31,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-high-node","scope":"STANDARD"}],"numFailing":4,"numPassing":107,"numSkipped":12,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-nerc-cip-node","scope":"STANDARD"}],"numFailing":5,"numPassing":106,"numSkipped":12,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-pci-dss-3-2","scope":"STANDARD"}],"numFailing":12,"numPassing":72,"numSkipped":29,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-pci-dss-4-0","scope":"STANDARD"}],"numFailing":18,"numPassing":75,"numSkipped":30,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-pci-dss-node-4-0","scope":"STANDARD"}],"numFailing":4,"numPassing":104,"numSkipped":9,"unit":"CONTROL"},{"aggregationKeys":[{"id":"ocp4-stig","scope":"STANDARD"}],"numFailing":22,"numPassing":15,"numSkipped":13,"unit":"CONTROL"},{"aggregationKeys":[{"id":"rhcos4-bsi","scope":"STANDARD"}],"numFailing":72,"numPassing":93,"numSkipped":6,"unit":"CONTROL"},{"aggregationKeys":[{"id":"rhcos4-moderate-rev-4","scope":"STANDARD"}],"numFailing":194,"numPassing":39,"numSkipped":8,"unit":"CONTROL"},{"aggregationKeys":[{"id":"rhcos4-nerc-cip","scope":"STANDARD"}],"numFailing":193,"numPassing":40,"numSkipped":8,"unit":"CONTROL"},{"aggregationKeys":[{"id":"rhcos4-stig","scope":"STANDARD"}],"numFailing":98,"numPassing":17,"numSkipped":2,"unit":"CONTROL"},{"aggregationKeys":[{"id":"rhcos4-stig-v2r3","scope":"STANDARD"}],"numFailing":98,"numPassing":17,"numSkipped":2,"unit":"CONTROL"}];
const MOCK_COMPLIANCE_AGG_STANDARDS = [{"id":"PCI_DSS_3_2","name":"PCI DSS 3.2.1"},{"id":"ocp4-cis-node","name":"ocp4-cis-node"},{"id":"NIST_SP_800_53_Rev_4","name":"NIST SP 800-53"},{"id":"rhcos4-nerc-cip","name":"rhcos4-nerc-cip"},{"id":"ocp4-pci-dss-3-2","name":"ocp4-pci-dss-3-2"},{"id":"ocp4-pci-dss-4-0","name":"ocp4-pci-dss-4-0"},{"id":"ocp4-cis-node-1-7","name":"ocp4-cis-node-1-7"},{"id":"rhcos4-stig-v2r3","name":"rhcos4-stig-v2r3"},{"id":"ocp4-high-node","name":"ocp4-high-node"},{"id":"rhcos4-stig","name":"rhcos4-stig"},{"id":"NIST_800_190","name":"NIST SP 800-190"},{"id":"HIPAA_164","name":"HIPAA 164"},{"id":"ocp4-nerc-cip-node","name":"ocp4-nerc-cip-node"},{"id":"ocp4-high","name":"ocp4-high"},{"id":"ocp4-pci-dss-node-4-0","name":"ocp4-pci-dss-node-4-0"},{"id":"ocp4-bsi","name":"ocp4-bsi"},{"id":"ocp4-cis","name":"ocp4-cis"},{"id":"rhcos4-moderate-rev-4","name":"rhcos4-moderate-rev-4"},{"id":"ocp4-cis-1-7","name":"ocp4-cis-1-7"},{"id":"CIS_Kubernetes_v1_5","name":"CIS Kubernetes v1.5"},{"id":"rhcos4-bsi","name":"rhcos4-bsi"},{"id":"ocp4-bsi-node","name":"ocp4-bsi-node"},{"id":"ocp4-stig","name":"ocp4-stig"}];
const MOCK_NAMESPACES_BY_CLUSTER = [{"id":"82855fd3-0490-4d75-b0f0-1353ce7170ad","name":"sc-test-1","namespaces":[]},{"id":"65673bd7-da6a-4cdc-a5fc-95765d1b9724","name":"staging-central-cluster","namespaces":[{"metadata":{"id":"e83ac6c8-8bbe-4297-883b-accf9a63d5d0","name":"acc-clemson"}},{"metadata":{"id":"e18f322e-76bc-4d45-8e15-e4d7d1082055","name":"acc-duke"}},{"metadata":{"id":"cc2054dd-32be-44c5-b369-0227341fb046","name":"acc-unc"}},{"metadata":{"id":"40178fa0-986d-4d36-ba25-bd949c536593","name":"cert-manager"}},{"metadata":{"id":"370fe7f7-f977-465c-92a1-1a242b119baf","name":"cert-manager-operator"}},{"metadata":{"id":"e96963ff-155f-44a6-9157-9a7f4754f3b4","name":"default"}},{"metadata":{"id":"48a805b4-45f2-4167-88db-2c60b74cbd97","name":"default-broker"}},{"metadata":{"id":"a1565315-76b6-4f67-8a0f-6125d8f03ae8","name":"hive"}},{"metadata":{"id":"82214c9d-6ae5-4d8c-b72b-2912fc2b0cb7","name":"hypershift"}},{"metadata":{"id":"1dcfe07c-a486-44c3-b085-41e1770b26b7","name":"kube-node-lease"}},{"metadata":{"id":"e019fee3-44c9-409f-b92f-15f0f8665e30","name":"kube-public"}},{"metadata":{"id":"36d331c9-c0a5-4331-b6b4-e27f467c17d1","name":"kube-system"}},{"metadata":{"id":"b0c446ce-3d33-4025-b2c1-97768944b7da","name":"local-cluster"}},{"metadata":{"id":"dddcf348-dfc2-43ff-861b-e821a1606420","name":"multicluster-engine"}},{"metadata":{"id":"328c54c1-ef94-4cf8-8d5f-f58ce0626197","name":"narnia"}},{"metadata":{"id":"5fe8d9d7-07db-4a20-8c31-05dfdad27342","name":"open-cluster-management"}},{"metadata":{"id":"c0d7fd70-c1af-4f21-b26a-1891d4f1b9f8","name":"open-cluster-management-agent"}},{"metadata":{"id":"c10c3d4e-6d97-4906-9df7-019928694177","name":"open-cluster-management-agent-addon"}},{"metadata":{"id":"68c1e8b2-efc1-44ea-8aa3-cc242aef482a","name":"open-cluster-management-global-set"}},{"metadata":{"id":"b15de0f5-32f9-42c0-8b7b-fde1a8244998","name":"open-cluster-management-hub"}},{"metadata":{"id":"80986289-8200-4cd0-aa22-0436542800f4","name":"open-cluster-management-policies"}},{"metadata":{"id":"858e2468-4c67-423e-902a-efb9ff71c163","name":"openshift"}},{"metadata":{"id":"5a4e4f28-b590-4238-9a15-5f00c7d8610e","name":"openshift-apiserver"}},{"metadata":{"id":"e3c64428-599a-47a0-ab59-cff93eb29bfe","name":"openshift-apiserver-operator"}},{"metadata":{"id":"a2d80a4b-a2e8-4f3a-bf73-15c7ec8d1569","name":"openshift-authentication"}},{"metadata":{"id":"c08b85e8-3637-4030-8c92-35fbc79e7d5b","name":"openshift-authentication-operator"}},{"metadata":{"id":"96e74f25-7322-4f42-bd90-a73f8365460b","name":"openshift-catalogd"}},{"metadata":{"id":"2f8727a5-3162-4ca4-8174-aefdcf5e91f4","name":"openshift-cloud-controller-manager"}},{"metadata":{"id":"06fc00f5-d050-4375-9bbe-3479e755d957","name":"openshift-cloud-controller-manager-operator"}},{"metadata":{"id":"49bcda9f-1486-4d0e-8298-212b53adafbe","name":"openshift-cloud-credential-operator"}},{"metadata":{"id":"2766fea4-48f6-4b14-a826-0bf7a6c97fa7","name":"openshift-cloud-network-config-controller"}},{"metadata":{"id":"ef52cf4c-bafd-480b-9358-2d63709e406e","name":"openshift-cloud-platform-infra"}},{"metadata":{"id":"90773211-ac58-413d-83ed-c9235876bb1d","name":"openshift-cluster-csi-drivers"}},{"metadata":{"id":"42304518-fbd9-4308-9ab6-acc48ea9dfb0","name":"openshift-cluster-machine-approver"}},{"metadata":{"id":"7d0ad0b7-0064-459f-be8b-a259b40a78e2","name":"openshift-cluster-node-tuning-operator"}},{"metadata":{"id":"1e729a45-7472-470e-85b0-148fb089a86b","name":"openshift-cluster-olm-operator"}},{"metadata":{"id":"48106293-7bda-4457-afb8-fe335b4e2848","name":"openshift-cluster-samples-operator"}},{"metadata":{"id":"92c44400-7c68-4886-9980-789ef48c593c","name":"openshift-cluster-storage-operator"}},{"metadata":{"id":"3ce86b3c-b867-4aef-baee-d8ef5598fdb1","name":"openshift-cluster-version"}},{"metadata":{"id":"95bb5fa8-31f9-4691-ac47-67401d664c7a","name":"openshift-compliance"}},{"metadata":{"id":"7183b425-99e0-4631-9520-c30292e2a30e","name":"openshift-config"}},{"metadata":{"id":"d14b0543-949f-4c7e-a139-bb6119f3084c","name":"openshift-config-managed"}},{"metadata":{"id":"92309f49-b89d-4e8c-8623-6b19bc707e67","name":"openshift-config-operator"}},{"metadata":{"id":"69fb2f13-5f32-4c55-b2e1-cdba9c6e805b","name":"openshift-console"}},{"metadata":{"id":"3f4b9007-52f0-4402-856b-f07edb4f893a","name":"openshift-console-operator"}},{"metadata":{"id":"472acf49-0f0e-42ac-9306-e7fec10e7e3f","name":"openshift-console-user-settings"}},{"metadata":{"id":"62d7dc93-8fcc-497d-90c3-6e03591fec03","name":"openshift-controller-manager"}},{"metadata":{"id":"efffa5ef-bb90-4f8e-9be1-3ad8bb2cde1a","name":"openshift-controller-manager-operator"}},{"metadata":{"id":"d7385c39-ccb2-492a-99a1-daf310029594","name":"openshift-dns"}},{"metadata":{"id":"01702639-197a-48cb-9eb4-507b9b0ad65b","name":"openshift-dns-operator"}},{"metadata":{"id":"fbbe6c87-e245-4f84-abf2-5cfec2f699c1","name":"openshift-etcd"}},{"metadata":{"id":"c931228d-284c-4941-9c36-0fba9cdad249","name":"openshift-etcd-operator"}},{"metadata":{"id":"51d459e8-9d1d-46ca-b080-c096989dc954","name":"openshift-host-network"}},{"metadata":{"id":"a2906f7e-19c8-445c-959f-9bf598997af3","name":"openshift-image-registry"}},{"metadata":{"id":"48540a4b-9f7b-49b7-8f3a-e4ad10025c52","name":"openshift-infra"}},{"metadata":{"id":"1bd05158-4897-466b-820b-1cd4760725c3","name":"openshift-ingress"}},{"metadata":{"id":"ca29b117-a417-448a-8652-569914b4c76c","name":"openshift-ingress-canary"}},{"metadata":{"id":"b4c119e7-884d-4b89-9eb8-82de519c75a4","name":"openshift-ingress-operator"}},{"metadata":{"id":"3d760df3-ff94-4a79-af0b-5fde97c2964c","name":"openshift-insights"}},{"metadata":{"id":"ebe86f79-03ac-44f4-a804-87a92f270d4a","name":"openshift-kni-infra"}},{"metadata":{"id":"381e68aa-6d2a-4a2e-a5cf-bd9a031a0b97","name":"openshift-kube-apiserver"}},{"metadata":{"id":"581970cc-193a-4937-b520-b9b92066e721","name":"openshift-kube-apiserver-operator"}},{"metadata":{"id":"d297efd5-39c1-4be5-b71b-cd4da2511439","name":"openshift-kube-controller-manager"}},{"metadata":{"id":"e4d87df2-b07a-4d75-883f-89edcc12c9a3","name":"openshift-kube-controller-manager-operator"}},{"metadata":{"id":"cf257096-c1c6-4183-ad71-242c80050a4d","name":"openshift-kube-scheduler"}},{"metadata":{"id":"123a69bf-38a6-4b31-a546-a582eb7130ac","name":"openshift-kube-scheduler-operator"}},{"metadata":{"id":"db273d43-60da-4963-b8fd-44080289a22b","name":"openshift-kube-storage-version-migrator"}},{"metadata":{"id":"d201665a-22d2-42d3-8ba0-cb4d80526065","name":"openshift-kube-storage-version-migrator-operator"}},{"metadata":{"id":"b985674a-1b59-4a6e-9a16-73f59769795b","name":"openshift-lightspeed"}},{"metadata":{"id":"f92a3de7-f289-4114-b98d-c4971a3a50cf","name":"openshift-machine-api"}},{"metadata":{"id":"c0e253c5-2ec1-45ea-8a9d-5d912753c03d","name":"openshift-machine-config-operator"}},{"metadata":{"id":"f5936529-dda7-4228-9a2e-7a790a7bb333","name":"openshift-marketplace"}},{"metadata":{"id":"f541d6ef-7c49-4250-ae7f-7a7eadf4e7ee","name":"openshift-monitoring"}},{"metadata":{"id":"ba01e6f7-606f-4b8c-9855-0b2e42f0783e","name":"openshift-multus"}},{"metadata":{"id":"7db54982-9f1e-4831-b1f6-ffe43327b68c","name":"openshift-network-console"}},{"metadata":{"id":"0d5dbc4d-b439-41bf-87ba-b54f16b0ca61","name":"openshift-network-diagnostics"}},{"metadata":{"id":"933bc606-f5c8-4e34-8f5a-b6dd53164e4b","name":"openshift-network-node-identity"}},{"metadata":{"id":"caa4450c-388d-4a1e-bb30-4331bc951152","name":"openshift-network-operator"}},{"metadata":{"id":"de962a68-eb5c-402f-9dea-5f3d2ca82eaa","name":"openshift-node"}},{"metadata":{"id":"6b2d6eed-3381-4c84-a78e-5baad49b380d","name":"openshift-nutanix-infra"}},{"metadata":{"id":"3ccb7b4f-8a29-46c5-a78e-59d9bf12eaa3","name":"openshift-oauth-apiserver"}},{"metadata":{"id":"e380c612-6948-4b66-b990-c712efe2a407","name":"openshift-openstack-infra"}},{"metadata":{"id":"5adc89d9-ca52-4fc5-bb81-69b57347c05d","name":"openshift-operator-controller"}},{"metadata":{"id":"8ed8b54b-d2dc-4c14-9538-61a33a9dd67b","name":"openshift-operator-lifecycle-manager"}},{"metadata":{"id":"2fbad464-bb1a-4a1f-9c86-c6106060a1e8","name":"openshift-operators"}},{"metadata":{"id":"b99e3908-f8c1-461e-a5ab-0780a9fbb2ac","name":"openshift-ovirt-infra"}},{"metadata":{"id":"4edfb349-be7f-45ac-8763-0338fb6d90e0","name":"openshift-ovn-kubernetes"}},{"metadata":{"id":"cd7b86e9-d1e1-4318-864a-1b94ccf197d0","name":"openshift-route-controller-manager"}},{"metadata":{"id":"e143bc90-9dba-46e2-8957-ddc157876a6d","name":"openshift-scooby"}},{"metadata":{"id":"4f3483a7-d391-4013-b700-d24a3bdc677b","name":"openshift-service-ca"}},{"metadata":{"id":"65dd76be-ce95-47ae-bb72-3d67a3bae6bc","name":"openshift-service-ca-operator"}},{"metadata":{"id":"d7387729-9edc-43a3-8709-957631dd045d","name":"openshift-user-workload-monitoring"}},{"metadata":{"id":"be409320-41af-4519-9798-c9645501edf3","name":"openshift-vsphere-infra"}},{"metadata":{"id":"8a319d2a-7f15-4f24-9a2a-2ee2b78f8543","name":"pyroscope"}},{"metadata":{"id":"bb9e66c5-e15a-4bff-8104-a3f1cec11d18","name":"qa"}},{"metadata":{"id":"fa0ea968-542a-4721-82ca-ca35920fff8b","name":"route-monitor-operator"}},{"metadata":{"id":"0e64457b-ae35-4222-ae83-f294e694fec9","name":"scooby"}},{"metadata":{"id":"02579570-98dd-4bd2-93ce-96703d061446","name":"sec-auburn"}},{"metadata":{"id":"8a249fea-0a37-489d-9fc6-102d13e7247e","name":"service-now"}},{"metadata":{"id":"a17886d1-6c50-4593-820e-e3ec76590596","name":"stackrox"}},{"metadata":{"id":"e3453d56-7a21-40a3-973e-409caa90eb6d","name":"trusted-artifact-signer"}}]},{"id":"f781e077-fb39-4529-a19d-7a3403e181b2","name":"staging-secured-cluster","namespaces":[{"metadata":{"id":"665556ff-ac9b-4c83-a6e7-06b5b8255b03","name":"backend"}},{"metadata":{"id":"bc13ba5f-e08f-4054-a47b-ab5d85bb23cb","name":"cert-manager"}},{"metadata":{"id":"fe549838-a31f-48f4-82c0-8c2248791222","name":"cert-manager-operator"}},{"metadata":{"id":"7a08806d-7fd2-4ced-ae4f-94b288515107","name":"default"}},{"metadata":{"id":"ee054e74-bbb7-44f5-ae4b-e600645c0d92","name":"frontend"}},{"metadata":{"id":"f9544785-f6c0-4a34-9e24-d41056b83a96","name":"ingress-nginx"}},{"metadata":{"id":"02bc4a7a-1b84-4344-95b7-38cc71d70802","name":"kube-node-lease"}},{"metadata":{"id":"09ca5fbc-2f60-4c5a-bbb0-a17ce801c142","name":"kube-public"}},{"metadata":{"id":"afac9049-070d-4d3b-9c19-a77e5ed2717c","name":"kube-system"}},{"metadata":{"id":"f9347250-e63b-41f4-a413-ebfb62de1675","name":"medical"}},{"metadata":{"id":"dfcc7d80-d0ba-4bcc-aa8f-bed07c2fad3c","name":"ms-demo"}},{"metadata":{"id":"7123fc9a-3368-4ce8-b6d5-f88149fef6d7","name":"openshift"}},{"metadata":{"id":"a1451986-9d7a-432a-9d8b-03956a4d3b5c","name":"openshift-apiserver"}},{"metadata":{"id":"553453f2-9b73-4700-995e-c816dcdccd01","name":"openshift-apiserver-operator"}},{"metadata":{"id":"efd0d29c-bf77-4dee-b476-7e93606d300a","name":"openshift-authentication"}},{"metadata":{"id":"fa05163a-7bcd-4892-95ff-8a982b2b6ffd","name":"openshift-authentication-operator"}},{"metadata":{"id":"a2aab475-58d2-46e0-83eb-8f1992ab0dc4","name":"openshift-catalogd"}},{"metadata":{"id":"03dbddc6-1b05-42d0-bb2c-c613ed84b947","name":"openshift-cloud-controller-manager"}},{"metadata":{"id":"45089bb0-f34d-44ae-9148-98dc40d60569","name":"openshift-cloud-controller-manager-operator"}},{"metadata":{"id":"4462a8bc-52da-4210-a72d-9c0dd7725571","name":"openshift-cloud-credential-operator"}},{"metadata":{"id":"a1905b7e-ce00-46cc-9868-9b9cb1a1301c","name":"openshift-cloud-network-config-controller"}},{"metadata":{"id":"1136ef0f-d019-4322-a678-ec85440074e8","name":"openshift-cloud-platform-infra"}},{"metadata":{"id":"a70985d4-b4f2-4c93-ade8-a3bdcde649f6","name":"openshift-cluster-csi-drivers"}},{"metadata":{"id":"12bf5e21-3bf2-4e0f-87dd-ae187da07886","name":"openshift-cluster-machine-approver"}},{"metadata":{"id":"93a8bb50-1984-4d0c-b5ac-bc9900ed2e8f","name":"openshift-cluster-node-tuning-operator"}},{"metadata":{"id":"981c4776-0a9e-45a2-b602-92ccc74f6c09","name":"openshift-cluster-olm-operator"}},{"metadata":{"id":"454b0c56-014c-4b3a-b446-7d1bd6a52d1b","name":"openshift-cluster-samples-operator"}},{"metadata":{"id":"0e299b38-1549-4af0-b590-d7b23d74719e","name":"openshift-cluster-storage-operator"}},{"metadata":{"id":"df9136e1-7c78-4098-aee5-e6db3905b4d8","name":"openshift-cluster-version"}},{"metadata":{"id":"b14c5b7f-2f09-473d-93c6-c213f5cc1de3","name":"openshift-compliance"}},{"metadata":{"id":"b630d21a-caac-40b8-a19f-0acb9fe4c3d1","name":"openshift-config"}},{"metadata":{"id":"0cb8f0ba-03af-4cad-bf96-211a99c5e812","name":"openshift-config-managed"}},{"metadata":{"id":"1dc77a87-9bc9-4a61-ae7b-005211b3f88d","name":"openshift-config-operator"}},{"metadata":{"id":"e6a65a24-18aa-4e09-9a4c-b9067ca31e1e","name":"openshift-console"}},{"metadata":{"id":"3a5addd4-900f-4e81-9395-f073da8df171","name":"openshift-console-operator"}},{"metadata":{"id":"cd40e3b8-9025-4b9a-bc8b-a223e82cdca8","name":"openshift-console-user-settings"}},{"metadata":{"id":"84f863d3-b951-4d4d-82b4-e9bf76cbbcda","name":"openshift-controller-manager"}},{"metadata":{"id":"cde078cf-bb9f-4ebd-bf01-282152acb8ca","name":"openshift-controller-manager-operator"}},{"metadata":{"id":"84268265-d2b7-4adb-b6f9-ec5451829463","name":"openshift-dns"}},{"metadata":{"id":"5a097f88-34b3-49ee-b6ae-3d197ed14082","name":"openshift-dns-operator"}},{"metadata":{"id":"2c215fc3-e430-464f-89ab-145cf674bc05","name":"openshift-etcd"}},{"metadata":{"id":"2da35fdf-ae93-4d6d-8686-01481dd6144c","name":"openshift-etcd-operator"}},{"metadata":{"id":"823f3abc-79dc-4cf1-83da-8d4325eec195","name":"openshift-host-network"}},{"metadata":{"id":"ce41b302-2a4a-4444-9d6f-7086dea80080","name":"openshift-image-registry"}},{"metadata":{"id":"e0e4fcf6-f87c-4f25-b1a9-f9602457909c","name":"openshift-infra"}},{"metadata":{"id":"a11fce05-cd78-481b-8de0-66830547124a","name":"openshift-ingress"}},{"metadata":{"id":"7198987f-3c28-46a4-9ce6-e7763276513e","name":"openshift-ingress-canary"}},{"metadata":{"id":"9ca81e19-c237-47dd-b82d-a9e4a9bcb6eb","name":"openshift-ingress-operator"}},{"metadata":{"id":"6742b1f7-ed46-4d27-932a-a67b2c916f52","name":"openshift-insights"}},{"metadata":{"id":"7f4d3854-3b9b-440a-9aeb-571517a44b50","name":"openshift-kni-infra"}},{"metadata":{"id":"4be44d0a-ce0b-4674-9854-7d653de9d5a9","name":"openshift-kube-apiserver"}},{"metadata":{"id":"f013e4a7-8d35-48b6-8b86-1407a8393fb5","name":"openshift-kube-apiserver-operator"}},{"metadata":{"id":"e59f4216-1ca5-474d-b841-a368e178f710","name":"openshift-kube-controller-manager"}},{"metadata":{"id":"a6d0ad3f-57ba-4b4e-9570-40d5f7837526","name":"openshift-kube-controller-manager-operator"}},{"metadata":{"id":"95ac5cc6-5f8d-4a16-8e5e-e3ec433bfd63","name":"openshift-kube-scheduler"}},{"metadata":{"id":"c4205739-dde6-4d2e-897f-ff789fa39942","name":"openshift-kube-scheduler-operator"}},{"metadata":{"id":"d6b98473-70f4-4af5-a526-fd20f1b88f14","name":"openshift-kube-storage-version-migrator"}},{"metadata":{"id":"5b8a020a-5886-4c6a-8061-d07d38ece3c9","name":"openshift-kube-storage-version-migrator-operator"}},{"metadata":{"id":"690c471d-e962-4240-9cd2-45a8a7b6cc8c","name":"openshift-lightspeed"}},{"metadata":{"id":"ffd8d103-32b7-4bdb-a863-8240a0deb125","name":"openshift-machine-api"}},{"metadata":{"id":"f82b418f-e56c-4b50-b967-44cff3f4f63d","name":"openshift-machine-config-operator"}},{"metadata":{"id":"66e3c3d3-5e98-4aa7-8f22-00da643abf48","name":"openshift-marketplace"}},{"metadata":{"id":"3d8a497d-80fa-445d-b91d-94e752e049ce","name":"openshift-monitoring"}},{"metadata":{"id":"18b752e1-59f7-4a18-a933-e8a9a947c235","name":"openshift-multus"}},{"metadata":{"id":"7ef95e18-2125-46d1-b96c-b531c14ca163","name":"openshift-network-console"}},{"metadata":{"id":"5179d1d1-54fa-4d8a-bc69-93050b80418f","name":"openshift-network-diagnostics"}},{"metadata":{"id":"2cf386bd-3e83-4fa2-9033-88a9b936f60c","name":"openshift-network-node-identity"}},{"metadata":{"id":"9a820d81-0c2e-4afb-90f4-d3908077af4a","name":"openshift-network-operator"}},{"metadata":{"id":"5f17f619-87e5-41c0-9658-44832a481363","name":"openshift-node"}},{"metadata":{"id":"fdaf5849-d816-45c7-b3aa-3cc3acdeae33","name":"openshift-nutanix-infra"}},{"metadata":{"id":"09bcbea1-e1bc-421b-8e64-bcbc49719caf","name":"openshift-oauth-apiserver"}},{"metadata":{"id":"12dbdd0e-dc8b-4c20-8b20-bd7ee6963be6","name":"openshift-openstack-infra"}},{"metadata":{"id":"03bf7199-4087-434b-8144-78105f40064d","name":"openshift-operator-controller"}},{"metadata":{"id":"35572d3e-e540-4a15-8950-46f08110cdb8","name":"openshift-operator-lifecycle-manager"}},{"metadata":{"id":"6aaa7c74-cd9a-47bf-b883-59480944defb","name":"openshift-operators"}},{"metadata":{"id":"918dfb43-2fbf-4c93-80cf-b5673d85d033","name":"openshift-ovirt-infra"}},{"metadata":{"id":"38dd3d2f-b6f4-493e-8253-7380a00a7b44","name":"openshift-ovn-kubernetes"}},{"metadata":{"id":"02aac256-0bb9-4cb6-ab38-97323deb4580","name":"openshift-pipelines"}},{"metadata":{"id":"4cadda8f-9b89-4f9e-a03c-1e821a913231","name":"openshift-route-controller-manager"}},{"metadata":{"id":"d82d06a6-6ca4-4f46-a089-a24ef46ea39c","name":"openshift-service-ca"}},{"metadata":{"id":"219f6287-4895-4ae9-956c-a0cd52c72554","name":"openshift-service-ca-operator"}},{"metadata":{"id":"54836eef-d723-4c87-907b-b7ff1a87e332","name":"openshift-user-workload-monitoring"}},{"metadata":{"id":"0dfb9422-835a-4de2-b4bb-0ad20c908aab","name":"openshift-vsphere-infra"}},{"metadata":{"id":"84d667e9-eda7-4f4a-87ed-202516919604","name":"operations"}},{"metadata":{"id":"63e01bf6-1633-4c8b-ae21-9447054ed888","name":"payments"}},{"metadata":{"id":"4b3bbeea-63a3-4679-9d70-83fd1fddcb39","name":"pipeline-demo"}},{"metadata":{"id":"94431232-643b-4201-a350-1d09a887b308","name":"service-now"}},{"metadata":{"id":"f125c3c9-0f72-4238-899d-bca7d7dfa119","name":"stackrox"}},{"metadata":{"id":"0a5d88b1-1718-41a6-87c1-014fb24ef920","name":"test-cronjob"}},{"metadata":{"id":"92d0453a-fa9d-425a-a571-787fbba74e86","name":"union-pacific"}}]},{"id":"fa769ee2-afeb-405f-910d-0f514e6b1d78","name":"test-unhealthy","namespaces":[]},{"id":"e491900d-b0bc-4c20-910d-f090f22effab","name":"test_external_ips","namespaces":[{"metadata":{"id":"43e3fa6b-ebb7-4bdc-b904-a113cf4af3e6","name":"default"}},{"metadata":{"id":"071f804d-985a-47d4-a39e-31064f325fee","name":"gke-managed-cim"}},{"metadata":{"id":"7660d820-ba64-4bb8-9bdc-cc98126252f8","name":"gke-managed-system"}},{"metadata":{"id":"8d4d0f31-ad19-4768-9ca3-aac64d39b35e","name":"gke-managed-volumepopulator"}},{"metadata":{"id":"af1cec43-1ee9-4caf-bd62-0773005bfca7","name":"gmp-public"}},{"metadata":{"id":"374a9019-9519-4e37-98da-1b312a76fd08","name":"gmp-system"}},{"metadata":{"id":"4b670a74-aba6-4361-878e-eafcafd560cc","name":"kube-node-lease"}},{"metadata":{"id":"d32a6466-605d-4993-87f1-da850aed1be3","name":"kube-public"}},{"metadata":{"id":"f2e360ec-73b2-4fcf-9795-96727f68d165","name":"kube-system"}},{"metadata":{"id":"ca9c4b3a-632f-460d-85bc-bda392ef4834","name":"qa"}},{"metadata":{"id":"01558023-56b5-427f-a741-88baf9f16b88","name":"stackrox"}}]}];
const MOCK_IMAGES_AT_RISK = [{"id":"b54d0c5b-dacf-5d00-aa98-1fd01b5dd4b4","name":{"remote":"openshift4/ose-aws-efs-csi-driver-rhel8-operator","fullName":"registry.redhat.io/openshift4/ose-aws-efs-csi-driver-rhel8-operator:v4.13.0-202403070943.p0.g66ed06c.assembly.stream.el8"},"priority":1,"imageVulnerabilityCounter":{"important":{"total":14,"fixable":14},"critical":{"total":4,"fixable":4}}},{"id":"f7f9fc91-0b9e-5441-8f18-ac057ffef39d","name":{"remote":"openshift-service-mesh/kiali-rhel8-operator","fullName":"registry.redhat.io/openshift-service-mesh/kiali-rhel8-operator:1.73.4-21"},"priority":1,"imageVulnerabilityCounter":{"important":{"total":61,"fixable":54},"critical":{"total":5,"fixable":5}}},{"id":"981a6b4e-2ed0-57d5-b66f-486712704e69","name":{"remote":"ubi8","fullName":"registry.access.redhat.com/ubi8:8.9-1107.1706791207"},"priority":2,"imageVulnerabilityCounter":{"important":{"total":36,"fixable":31},"critical":{"total":0,"fixable":0}}},{"id":"5e7d9f52-0c38-573a-a835-f74adfbd745f","name":{"remote":"openshift-gitops-1/kam-delivery-rhel8","fullName":"registry.redhat.io/openshift-gitops-1/kam-delivery-rhel8:v1.10.4-1"},"priority":2,"imageVulnerabilityCounter":{"important":{"total":74,"fixable":68},"critical":{"total":5,"fixable":5}}},{"id":"8f10d2a7-48c6-5d05-aa74-8379812e3684","name":{"remote":"ubi8/ubi","fullName":"registry.redhat.io/ubi8/ubi:8.9-1028"},"priority":2,"imageVulnerabilityCounter":{"important":{"total":36,"fixable":31},"critical":{"total":0,"fixable":0}}},{"id":"5dcb10a7-e024-55a8-9daf-d190ad53630f","name":{"remote":"jboss-webserver-5/jws58-openjdk17-openshift-rhel8","fullName":"registry.redhat.io/jboss-webserver-5/jws58-openjdk17-openshift-rhel8:5.8.1-3.1733303777"},"priority":2,"imageVulnerabilityCounter":{"important":{"total":62,"fixable":50},"critical":{"total":0,"fixable":0}}}];
const MOCK_AGING_IMAGES = {"timeRange0":166,"timeRange1":190,"timeRange2":245,"timeRange3":299};
const MOCK_RECENT_ALERTS = [{"id":"11eed5ea-9df8-44ee-b857-28dfb49eea14","time":"2026-05-04T20:15:17.76115Z","deployment":null,"resource":{"resourceType":"SECRETS","name":"etcd-all-certs"},"policy":{"name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY"}},{"id":"760f3567-1673-4b2b-b673-49d649206c9f","time":"2026-05-04T20:15:17.559371Z","deployment":null,"resource":{"resourceType":"SECRETS","name":"etcd-serving-metrics-staging-central-sshg4-master-0.c.acs-team-automation.internal"},"policy":{"name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY"}},{"id":"4709346b-cdda-4189-81d6-ad11675e5530","time":"2026-05-04T20:15:17.359705Z","deployment":null,"resource":{"resourceType":"SECRETS","name":"etcd-serving-staging-central-sshg4-master-0.c.acs-team-automation.internal"},"policy":{"name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY"}},{"id":"f314810c-22aa-43e9-a4c0-e4f225610841","time":"2026-05-04T20:15:17.160572Z","deployment":null,"resource":{"resourceType":"SECRETS","name":"etcd-peer-staging-central-sshg4-master-0.c.acs-team-automation.internal"},"policy":{"name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY"}},{"id":"2aef8ac7-2350-4bcd-8775-598bd1a315d0","time":"2026-05-04T20:15:16.961128Z","deployment":null,"resource":{"resourceType":"SECRETS","name":"etcd-serving-metrics-staging-central-sshg4-master-2.c.acs-team-automation.internal"},"policy":{"name":"[BM] Alert on using any secret","severity":"LOW_SEVERITY"}}];
const MOCK_SUMMARY_COUNTS = {"clusterCount":5,"nodeCount":17,"violationCount":15579,"deploymentCount":525,"imageCount":347,"secretCount":1962};
const MOCK_ALERT_SEVERITY_COUNTS = {"LOW_SEVERITY":3768,"MEDIUM_SEVERITY":5583,"HIGH_SEVERITY":5038,"CRITICAL_SEVERITY":1190};

function makeImageCVECountBySeverity(c: number, i: number, m: number, l: number) {
    return { critical: { total: c }, important: { total: i }, moderate: { total: m }, low: { total: l }, unknown: { total: 0 } };
}
async function parseBody(request: Request): Promise<Record<string, unknown>> {
    try { return (await request.clone().json()) as Record<string, unknown>; } catch { return {}; }
}

const graphqlHandler = http.post('/api/graphql', async ({ request }) => {
    const body = await parseBody(request);
    const operationName = (body?.operationName as string) ?? '';
    const variables = (body?.variables as Record<string, unknown>) ?? {};
    switch (operationName) {
        case 'getImageCVEList': return HttpResponse.json({ data: { imageCVEs: MOCK_CVES } });
        case 'getUnfilteredImageCount': return HttpResponse.json({ data: { imageCount: MOCK_IMAGES.length } });
        case 'getWorkloadCveSummaryData':
        case 'getWorkloadCvesSummaryData': return HttpResponse.json({ data: { imageCVECount: MOCK_CVES.length, imageCVEs: MOCK_CVES.slice(0,3), imageCount: MOCK_IMAGES.length } });
        case 'getEntityTypeCounts': return HttpResponse.json({ data: { imageCount: MOCK_IMAGES.length, deploymentCount: MOCK_DEPLOYMENTS.length, imageCVECount: MOCK_CVES.length } });
        case 'getImageList': return HttpResponse.json({ data: { images: MOCK_IMAGES.map((img) => ({ id: img.id, digest: img.id, name: img.name, operatingSystem: img.operatingSystem, deploymentCount: img.deploymentCount, watchStatus: img.watchStatus, metadata: img.metadata ?? { v1: { layers: [] }, layerShas: [] }, scanTime: img.scanTime, imageCVECountBySeverity: img.imageCVECountBySeverity })) } });
        case 'getDeploymentList': return HttpResponse.json({ data: { deployments: MOCK_DEPLOYMENTS } });
        case 'getNamespaceViewNamespaces': return HttpResponse.json({ data: { namespaces: MOCK_NAMESPACES.map((ns) => ({ metadata: ns.metadata, deploymentCount: ns.numDeployments, imageCVECountBySeverity: makeImageCVECountBySeverity(2,4,8,3) })) } });
        case 'getImagesForCVE': return HttpResponse.json({ data: { images: MOCK_IMAGES.slice(0,3).map((img) => ({ id: img.id, name: img.name, metadata: img.metadata ?? { v1: { layers: [] } }, operatingSystem: img.operatingSystem, watchStatus: img.watchStatus, imageComponents: [{ name: 'openssl', version: '3.0.2', location: '/usr/lib', source: 'OS', layerIndex: 2, inBaseImageLayer: true, imageVulnerabilities: [{ severity: 'CRITICAL_VULNERABILITY_SEVERITY', fixedByVersion: '3.0.3', advisory: null, pendingExceptionCount: 0 }] }] })) } });
        case 'getDeploymentsForCVE': return HttpResponse.json({ data: { deployments: MOCK_DEPLOYMENTS.slice(0,4).map((d) => ({ id: d.id, name: d.name, namespace: d.namespace, type: d.type, clusterName: d.clusterName, created: d.created, unknownImageCount: 0, lowImageCount: d.imageCVECountBySeverity?.low?.total ?? 0, moderateImageCount: d.imageCVECountBySeverity?.moderate?.total ?? 0, importantImageCount: d.imageCVECountBySeverity?.important?.total ?? 0, criticalImageCount: d.imageCVECountBySeverity?.critical?.total ?? 0, images: [{ id: MOCK_IMAGES[0]?.id, name: MOCK_IMAGES[0]?.name, metadata: { v1: { layers: [] } }, imageComponents: [{ name: 'openssl', version: '3.0.2', location: '/usr/lib', source: 'OS', layerIndex: 0, inBaseImageLayer: true, imageVulnerabilities: [{ severity: 'CRITICAL_VULNERABILITY_SEVERITY', fixedByVersion: '3.0.3', advisory: null, pendingExceptionCount: 0 }] }] }] })) } });
        case 'getImageCveMetadata': {
            const cveId = (variables.cve as string) ?? MOCK_CVES[0].cve;
            const cve = MOCK_CVES.find((c) => c.cve === cveId) ?? MOCK_CVES[0];
            return HttpResponse.json({ data: { imageCVE: { cve: cve.cve, firstDiscoveredInSystem: cve.firstDiscoveredInSystem, publishedOn: cve.publishedOn, distroTuples: cve.distroTuples.map((dt: Record<string,unknown>) => ({ summary: dt.summary, link: `https://nvd.nist.gov/vuln/detail/${cve.cve}`, operatingSystem: dt.operatingSystem, cveBaseInfo: dt.cveBaseInfo })) } } });
        }
        case 'getImageCveSummaryData': {
            const cveId2 = (variables.cve as string) ?? MOCK_CVES[0].cve;
            const cve2 = MOCK_CVES.find((c) => c.cve === cveId2) ?? MOCK_CVES[0];
            return HttpResponse.json({ data: { totalImageCount: MOCK_IMAGES.length, imageCount: MOCK_IMAGES.length, deploymentCount: MOCK_DEPLOYMENTS.length, imageCVE: { cve: cve2.cve, affectedImageCount: cve2.affectedImageCount, affectedImageCountBySeverity: { critical: { total: cve2.affectedImageCountBySeverity.critical.total, fixable: Math.ceil(cve2.affectedImageCountBySeverity.critical.total*0.7), notFixable: Math.floor(cve2.affectedImageCountBySeverity.critical.total*0.3) }, important: { total: cve2.affectedImageCountBySeverity.important.total, fixable: Math.ceil(cve2.affectedImageCountBySeverity.important.total*0.6), notFixable: Math.floor(cve2.affectedImageCountBySeverity.important.total*0.4) }, moderate: { total: cve2.affectedImageCountBySeverity.moderate?.total ?? 0, fixable: 1, notFixable: 1 }, low: { total: cve2.affectedImageCountBySeverity.low?.total ?? 0, fixable: 0, notFixable: 0 }, unknown: { total: 0, fixable: 0, notFixable: 0 } } } } });
        }
        case 'getDeploymentSummaryData': return HttpResponse.json({ data: { deployment: MOCK_DEPLOYMENTS[0], imageCount: 1 } });
        case 'getDeploymentDetails':
        case 'getDeploymentMetadata':
        case 'getDeploymentResources': return HttpResponse.json({ data: { deployment: { ...MOCK_DEPLOYMENTS[0], serviceAccount: 'default', automountServiceAccountToken: false, hostNetwork: false, hostPid: false, hostIpc: false, runtimeClass: '', containers: [{ id: 'container-1', name: 'main', image: { id: MOCK_IMAGES[0]?.id ?? 'img-1', name: MOCK_IMAGES[0]?.name }, securityContext: { privileged: false, readOnlyRootFilesystem: true }, resources: { cpuCoresRequest: 0.1, cpuCoresLimit: 1.0, memoryMbRequest: 128, memoryMbLimit: 512 }, ports: [{ name: 'http', protocol: 'TCP', containerPort: 8080 }], volumes: [], secrets: [], envs: [] }] } } });
        case 'getCVEsForImage': return HttpResponse.json({ data: { image: { ...MOCK_IMAGES[0], imageVulnerabilities: MOCK_CVES.slice(0,6).map((cve) => ({ id: cve.cve, cve: cve.cve, severity: cve.affectedImageCountBySeverity.critical.total > 0 ? 'CRITICAL_VULNERABILITY_SEVERITY' : 'IMPORTANT_VULNERABILITY_SEVERITY', isFixable: true, fixedBy: '1.2.3', cvss: cve.topCVSS, nvdCvss: cve.topNvdCVSS, publishedOn: cve.publishedOn, discoveredAtImage: '2024-02-01T00:00:00Z', summary: cve.distroTuples[0]?.summary ?? '', pendingExceptionCount: 0 })) }, imageVulnerabilityCount: 6 } });
        case 'getCvesForDeployment': return HttpResponse.json({ data: { deployment: { ...MOCK_DEPLOYMENTS[0], imageVulnerabilities: MOCK_CVES.slice(0,5).map((cve) => ({ id: cve.cve, cve: cve.cve, severity: cve.affectedImageCountBySeverity.critical.total > 0 ? 'CRITICAL_VULNERABILITY_SEVERITY' : 'IMPORTANT_VULNERABILITY_SEVERITY', isFixable: true })) }, imageVulnerabilityCount: 5 } });
        case 'getImageDetails':
        case 'getImageResources': return HttpResponse.json({ data: { image: { ...MOCK_IMAGES[0], digest: MOCK_IMAGES[0].id, deployments: MOCK_DEPLOYMENTS.slice(0,2), deploymentCount: 2, components: [] } } });
        case 'workloadScopeWizardCentral': return HttpResponse.json({ data: { clusters: SCOPE_CLUSTERS, namespaces: SCOPE_NAMESPACES, deployments: SCOPE_DEPLOYMENTS } });
        case 'autocomplete': {
            const rawQuery = (variables.query as string) ?? '';
            const lastSegment = rawQuery.split('+').pop()?.toLowerCase() ?? '';
            const colonIdx = lastSegment.indexOf(':');
            const searchTermPart = colonIdx >= 0 ? lastSegment.slice(0,colonIdx).trim() : lastSegment;
            const filterPart = colonIdx >= 0 ? lastSegment.slice(colonIdx+1).replace(/^r\//, '').trim() : '';
            const CLUSTER_NAMES = ["test-unhealthy", "staging-central-cluster", "staging-secured-cluster", "sc-test-1", "test_external_ips"];
            const NAMESPACE_NAMES = ["acc-clemson", "cert-manager", "frontend", "gmp-public", "acc-unc", "acc-duke", "default", "ingress-nginx", "hypershift", "backend", "gmp-system", "gke-managed-cim", "gke-managed-volumepopulator", "kube-public", "hive", "gke-managed-system", "cert-manager-operator", "default-broker", "kube-node-lease"];
            const DEPLOYMENT_NAMES = ["adservice", "api-server", "admission-control", "apiserver-watcher-staging-central-sshg4-master-1.c.acs-team-automation.internal", "alertmanager-main", "alertmanager", "apiserver-watcher-staging-central-sshg4-master-0.c.acs-team-automation.internal", "apiserver-watcher-staging-central-sshg4-master-2.c.acs-team-automation.internal", "apiserver"];
            const IMAGE_NAMES = ["docker.io/apache/kafka:4.1.0", "docker.io/grafana/alloy:v1.8.1", "docker.io/library/busybox:1.28", "docker.io/library/busybox:latest", "docker.io/library/nginx:1.27.2", "docker.io/library/nginx:1.7.9", "docker.io/library/nginx:latest", "docker.io/library/nginx:latest", "docker.io/library/nginx:stable-alpine-perl", "docker.io/library/redis:alpine"];
            const CVE_IDS = ["CVE-2026-33186", "CVE-2025-68121", "CVE-2024-45337", "CVE-2024-24790", "CVE-2026-31789", "CVE-2024-41110", "CVE-2025-21613", "CVE-2023-45853", "CVE-2026-33816", "CVE-2026-1229", "CVE-2026-33211", "CVE-2026-33747", "CVE-2022-23305", "CVE-2022-1996", "CVE-2024-53677", "CVE-2021-31805", "CVE-2020-17530", "CVE-2025-7458", "CVE-2016-1000031", "CVE-2019-17571", "CVE-2019-0230", "CVE-2023-49569", "CVE-2022-23307", "CVE-2023-50164", "CVE-2023-6879"];
            let results: string[] = [];
            if (searchTermPart === 'cve') results = CVE_IDS;
            else if (searchTermPart === 'cluster') results = CLUSTER_NAMES;
            else if (searchTermPart === 'namespace') results = NAMESPACE_NAMES;
            else if (searchTermPart === 'deployment') results = DEPLOYMENT_NAMES;
            else if (searchTermPart === 'image') results = IMAGE_NAMES;
            else if (searchTermPart === 'image os') results = [...new Set(MOCK_IMAGES.map((i) => i.operatingSystem).filter(Boolean))];
            else if (searchTermPart === 'image tag') results = MOCK_IMAGES.map((i) => i.name?.tag).filter(Boolean) as string[];
            else if (searchTermPart === 'image registry') results = ['quay.io', 'docker.io', 'registry.redhat.io'];
            else if (searchTermPart === 'component') results = ['openssl', 'curl', 'glibc', 'libssl', 'python3', 'nodejs', 'bash', 'tar', 'wget', 'zlib'];
            else if (searchTermPart === 'component version') results = ['3.0.2-0ubuntu1.12', '7.81.0-1ubuntu1.13', '1.22.4', '18.17.0', '3.11.5'];
            else if (searchTermPart === 'cluster id') results = MOCK_CLUSTERS.map((c) => c.id);
            else if (searchTermPart === 'namespace id') results = MOCK_NAMESPACES.map((ns) => ns.metadata.id);
            else if (searchTermPart === 'deployment id') results = MOCK_DEPLOYMENTS.map((d) => d.id);
            else if (searchTermPart === 'cvss') results = ['7.0','7.5','8.0','8.5','9.0','9.5','10.0'];
            else if (searchTermPart === 'fixable') results = ['true','false'];
            else if (searchTermPart === 'severity') results = ['CRITICAL_VULNERABILITY_SEVERITY','IMPORTANT_VULNERABILITY_SEVERITY','MODERATE_VULNERABILITY_SEVERITY','LOW_VULNERABILITY_SEVERITY'];
            if (filterPart) results = results.filter((r) => r.toLowerCase().includes(filterPart));
            return HttpResponse.json({ data: { searchAutocomplete: results } });
        }
        case 'summary_counts': return HttpResponse.json({ data: MOCK_SUMMARY_COUNTS });
        case 'getAllNamespacesByCluster': return HttpResponse.json({ data: { clusters: MOCK_NAMESPACES_BY_CLUSTER } });
        case 'alertCountsBySeverity': return HttpResponse.json({ data: MOCK_ALERT_SEVERITY_COUNTS });
        case 'mostRecentAlerts': return HttpResponse.json({ data: { alerts: MOCK_RECENT_ALERTS } });
        case 'getImagesAtMostRisk': return HttpResponse.json({ data: { images: MOCK_IMAGES_AT_RISK } });
        case 'agingImagesQuery': return HttpResponse.json({ data: MOCK_AGING_IMAGES });
        case 'getAggregatedResults': return HttpResponse.json({ data: { results: { results: MOCK_COMPLIANCE_AGG_RESULTS }, controls: { results: MOCK_COMPLIANCE_AGG_RESULTS }, complianceStandards: MOCK_COMPLIANCE_AGG_STANDARDS } });
        case 'getAggregatedResultsAcrossEntity_CLUSTER':
        case 'getAggregatedResultsAcrossEntity_NAMESPACE':
        case 'getAggregatedResultsAcrossEntity_NODE':
        case 'getAggregatedResultsAcrossEntity_DEPLOYMENT':
            return HttpResponse.json({ data: { results: { results: MOCK_COMPLIANCE_AGG_RESULTS }, controls: { results: MOCK_COMPLIANCE_AGG_RESULTS }, complianceStandards: MOCK_COMPLIANCE_AGG_STANDARDS } });
        case 'getAggregatedResultsByEntity_CLUSTER':
        case 'getAggregatedResultsByEntity_NAMESPACE':
        case 'getAggregatedResultsByEntity_NODE':
        case 'getAggregatedResultsByEntity_DEPLOYMENT':
            return HttpResponse.json({ data: { results: { results: [] }, controls: { results: [] }, complianceStandards: MOCK_COMPLIANCE_AGG_STANDARDS, clusters: MOCK_CLUSTERS.map((c: any) => ({ id: c.id, name: c.name })) } });
        case 'runStatuses': return HttpResponse.json({ data: { complianceRunStatuses: { runs: [] } } });
        case 'clustersCount': return HttpResponse.json({ data: { results: MOCK_NAMESPACES_BY_CLUSTER.length } });
        case 'nodesCount': return HttpResponse.json({ data: { results: MOCK_SUMMARY_COUNTS.nodeCount } });
        case 'namespacesCount': return HttpResponse.json({ data: { results: MOCK_NAMESPACES_BY_CLUSTER.reduce((acc: number, c: any) => acc + (c.namespaces?.length ?? 0), 0) } });
        case 'deploymentsCount': return HttpResponse.json({ data: { results: MOCK_SUMMARY_COUNTS.deploymentCount } });
        case 'getDeploymentCount': return HttpResponse.json({ data: { deploymentCount: MOCK_SUMMARY_COUNTS.deploymentCount } });
        // Node CVEs handlers
        case 'getNodeCVEs': return HttpResponse.json({ data: { nodeCVEs: [{ cve: 'CVE-2024-21626', affectedNodeCountBySeverity: { critical: { total: 3 }, important: { total: 5 }, moderate: { total: 2 }, low: { total: 1 }, unknown: { total: 0 } }, topCVSS: 8.6, affectedNodeCount: 5, firstDiscoveredInSystem: '2024-02-01T00:00:00Z', distroTuples: [{ summary: 'A flaw was found in runc which can be exploited to escape the container.', operatingSystem: 'linux', cvss: 8.6, scoreVersion: 'V3' }] }, { cve: 'CVE-2023-4911', affectedNodeCountBySeverity: { critical: { total: 5 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 }, unknown: { total: 0 } }, topCVSS: 7.8, affectedNodeCount: 5, firstDiscoveredInSystem: '2023-10-03T00:00:00Z', distroTuples: [{ summary: 'A buffer overflow was discovered in glibc dynamic loader.', operatingSystem: 'linux', cvss: 7.8, scoreVersion: 'V3' }] }] } });
        case 'getNodeCVEEntityCounts': return HttpResponse.json({ data: { nodeCVECount: 2, nodeCount: MOCK_SUMMARY_COUNTS.nodeCount } });
        case 'getTotalNodeCount': return HttpResponse.json({ data: { nodeCount: MOCK_SUMMARY_COUNTS.nodeCount } });
        case 'getNodeCVEMetadata': return HttpResponse.json({ data: { nodeCVE: { cve: 'CVE-2024-21626', firstDiscoveredInSystem: '2024-02-01T00:00:00Z', publishedOn: '2024-01-31T00:00:00Z', distroTuples: [{ summary: 'A flaw was found in runc.', operatingSystem: 'linux', cvss: 8.6, scoreVersion: 'V3' }] } } });
        case 'getNodeCVESummaryData': return HttpResponse.json({ data: { totalNodeCount: MOCK_SUMMARY_COUNTS.nodeCount, nodeCount: MOCK_SUMMARY_COUNTS.nodeCount, nodeCVE: { distroTuples: [{ operatingSystem: 'linux' }], affectedNodeCountBySeverity: { critical: { total: 3 }, important: { total: 5 }, moderate: { total: 2 }, low: { total: 1 }, unknown: { total: 0 } } } } });
        case 'getAffectedNodes': return HttpResponse.json({ data: { nodes: [] } });
        case 'getNodes': return HttpResponse.json({ data: { nodes: [] } });
        case 'getNodeMetadata': return HttpResponse.json({ data: { node: { id: 'node-1', name: 'node-1', clusterName: MOCK_CLUSTERS[0]?.name ?? 'test-cluster', joinedAt: '2024-01-01T00:00:00Z', nodeComponents: [] } } });
        case 'getNodeVulnerabilities': return HttpResponse.json({ data: { node: { nodeVulnerabilityCount: 0, nodeCVECountBySeverity: { critical: { total: 0, fixable: 0 }, important: { total: 0, fixable: 0 }, moderate: { total: 0, fixable: 0 }, low: { total: 0, fixable: 0 }, unknown: { total: 0, fixable: 0 } }, nodeVulnerabilities: [] } } });
        case 'getNodeVulnSummary': return HttpResponse.json({ data: { totalNodeCount: MOCK_SUMMARY_COUNTS.nodeCount, nodeCount: MOCK_SUMMARY_COUNTS.nodeCount, node: { nodeCVECountBySeverity: { critical: { total: 0, fixable: 0 }, important: { total: 0, fixable: 0 }, moderate: { total: 0, fixable: 0 }, low: { total: 0, fixable: 0 }, unknown: { total: 0, fixable: 0 } } } } });
        case 'getNodeExtendedDetails': return HttpResponse.json({ data: { node: { id: 'node-1', osImage: 'Red Hat Enterprise Linux 8', kernelVersion: '4.18.0-477.10.1.el8_8.x86_64', containerRuntimeVersion: 'containerd://1.6.6', } } });
        // Platform CVEs handlers
        case 'getPlatformCves': return HttpResponse.json({ data: { platformCVEs: [] } });
        case 'getPlatformCVEEntityCounts': return HttpResponse.json({ data: { platformCVECount: 0, clusterCount: MOCK_CLUSTERS.length } });
        case 'getPlatformClusters': return HttpResponse.json({ data: { clusters: MOCK_CLUSTERS.map((c: any) => ({ id: c.id, name: c.name, clusterVulnerabilityCount: 0, clusterVulnerabilityCountBySeverity: { critical: { total: 0 }, important: { total: 0 }, moderate: { total: 0 }, low: { total: 0 } } })) } });
        case 'getPlatformCVEMetadata': {
            const cveId3 = (variables.cveID as string) ?? 'CVE-2024-0001';
            return HttpResponse.json({ data: { totalClusterCount: MOCK_CLUSTERS.length, clusterCount: MOCK_CLUSTERS.length, platformCVE: { cve: cveId3, clustersByType: { generic: [], kubernetes: [], openshift: [], openshift4: [] } } } });
        }
        // Exception Management
        case 'getPendingVulnerabilityExceptions':
        case 'getApprovedDeferrals':
        case 'getApprovedFalsePositives':
        case 'getDeniedVulnerabilityExceptions':
        case 'getVulnerabilityExceptionsByStatus':
            return HttpResponse.json({ data: { vulnerabilityExceptions: [] } });
        case 'getExceptionCount': return HttpResponse.json({ data: { count: 0 } });
        default: return HttpResponse.json({ data: {} });
    }
});

export const handlers = [
    http.get('/v1/auth/status', () => HttpResponse.json(MOCK_AUTH_STATUS)),
    http.get('/v1/authProviders', () => HttpResponse.json({ authProviders: [] })),
    http.get('/v1/login/authproviders', () => HttpResponse.json({ authProviders: [] })),
    http.get('/v1/groups', () => HttpResponse.json({ groups: [] })),
    http.get('/v1/roles', () => HttpResponse.json({ roles: [] })),
    http.get('/v1/mypermissions', () => HttpResponse.json({ resourceToAccess: MOCK_AUTH_STATUS.userInfo.permissions.resourceToAccess })),
    http.get('/v1/database/status', () => HttpResponse.json({ databaseAvailable: true, databaseType: 'RocksDB', databaseVersion: '7.7.3' })),
    http.get('/v1/featureflags', () => HttpResponse.json({ featureFlags: [] })),
    http.get('/v1/metadata', () => HttpResponse.json({ version: '4.11.x-prototype', buildFlavor: 'release', releaseBuild: true, licenseStatus: 'VALID' })),
    http.get('/v1/central-capabilities', () => HttpResponse.json({ centralCanDisplayDeclarativeConfigHealth: 'YES', centralCanUpdateCert: 'YES', centralCanUseCloudBackupIntegrations: 'YES', centralCanDisplayAdministrationEvents: 'YES' })),
    http.get('/v1/config/public', () => HttpResponse.json({ publicConfig: { header: null, footer: null, loginNotice: null, telemetry: { enabled: false, userId: '' } } })),
    http.get('/v1/telemetry/configure', () => HttpResponse.json({ enabled: false, userId: 'mock-user-1', properties: {} })),
    http.get('/v1/clusters', () => HttpResponse.json({ clusters: MOCK_CLUSTERS })),
    http.get('/v1/cluster-defaults', () => HttpResponse.json({})),
    http.get('/v1/namespaces', () => HttpResponse.json({ namespaces: MOCK_NAMESPACES })),
    http.get('/v1/deployments', () => HttpResponse.json({ deployments: MOCK_DEPLOYMENTS })),
    http.get('/v1/deployments/:id', ({ params }) => HttpResponse.json(MOCK_DEPLOYMENTS.find((d) => d.id === params.id) ?? MOCK_DEPLOYMENTS[0])),
    http.get('/v1/images', () => HttpResponse.json({ images: MOCK_IMAGES })),
    http.get('/v1/images/:id', ({ params }) => HttpResponse.json(MOCK_IMAGES.find((i) => i.id === params.id) ?? MOCK_IMAGES[0])),
    http.get('/v1/nodes', () => HttpResponse.json({ nodes: [] })),
    http.get('/v1/pods', () => HttpResponse.json({ pods: [] })),
    http.get('/v1/policies', () => HttpResponse.json({ policies: [] })),
    http.get('/v1/search/metadata/options', ({ request }) => {
        const url = new URL(request.url);
        const categories = url.searchParams.get('categories') ?? '';
        let options: string[] = [];
        if (categories.includes('IMAGE_VULNERABILITIES') || categories.includes('IMAGE_VULN') || categories.includes('CLUSTER_VULN')) options = ['CVE','Severity','Fixable','Image','Image Tag','Image OS','CVSS','Component','Component Version','Namespace','Cluster','Deployment'];
        else if (categories.includes('IMAGES')) options = ['Image','Image Tag','Image OS','Registry','Cluster','Namespace','Deployment'];
        else if (categories.includes('DEPLOYMENTS')) options = ['Deployment','Namespace','Cluster','Label','Annotation'];
        else options = ['CVE','Severity','Fixable','Image','Image Tag','Namespace','Cluster','Deployment','Component'];
        return HttpResponse.json({ options });
    }),
    http.get('/v1/search/autocomplete', ({ request }) => {
        const url = new URL(request.url);
        const query = (url.searchParams.get('query') ?? '').toLowerCase();
        let values: string[] = [];
        if (query.includes('cluster:')) values = MOCK_CLUSTERS.map((c) => c.name);
        else if (query.includes('namespace:')) values = [...new Set(MOCK_NAMESPACES.map((ns) => ns.metadata.name))];
        else if (query.includes('deployment:')) values = MOCK_DEPLOYMENTS.map((d) => d.name);
        else if (query.includes('image:')) values = MOCK_IMAGES.map((i) => i.name?.fullName).filter(Boolean) as string[];
        else if (query.includes('cve:')) values = MOCK_CVES.map((c) => c.cve);
        else if (query.includes('severity:')) values = ['CRITICAL_VULNERABILITY_SEVERITY','IMPORTANT_VULNERABILITY_SEVERITY','MODERATE_VULNERABILITY_SEVERITY','LOW_VULNERABILITY_SEVERITY'];
        else if (query.includes('fixable:')) values = ['true','false'];
        else values = MOCK_CLUSTERS.map((c) => c.name);
        return HttpResponse.json({ values });
    }),
    http.get('/v1/search', () => HttpResponse.json({ results: [], counts: [{ category: 'DEPLOYMENTS', count: String(MOCK_DEPLOYMENTS.length) }, { category: 'IMAGES', count: String(MOCK_IMAGES.length) }, { category: 'NAMESPACES', count: String(MOCK_NAMESPACES.length) }] })),
    http.get('/v1/collections', () => HttpResponse.json({ collections: MOCK_COLLECTIONS, totalCount: MOCK_COLLECTIONS.length })),
    http.get('/v1/collections/:id', ({ params }) => HttpResponse.json({ collection: MOCK_COLLECTIONS.find((c) => c.id === params.id) ?? MOCK_COLLECTIONS[0] })),
    http.get('/v1/collectionscount', () => HttpResponse.json({ count: MOCK_COLLECTIONS.length })),
    http.get('/v2/collections', () => HttpResponse.json({ collections: [], totalCount: 0 })),
    http.post('/v1/collections/autocomplete', async ({ request }) => {
        const body = await request.clone().json().catch(() => ({})) as Record<string,string>;
        const field = body?.fieldName ?? '';
        let values: string[] = [];
        if (field === 'Cluster') values = MOCK_CLUSTERS.map((c) => c.name);
        else if (field === 'Namespace') values = [...new Set(MOCK_NAMESPACES.map((ns) => ns.metadata.name))];
        else if (field === 'Deployment') values = MOCK_DEPLOYMENTS.map((d) => d.name);
        return HttpResponse.json({ values });
    }),
    http.get('/v2/compliance/scan/configurations', () => HttpResponse.json({ configurations: [], totalCount: 0 })),
    http.get('/v2/compliance/scan/configurations/:id', () => HttpResponse.json({})),
    http.post('/v2/compliance/scan/configurations', () => HttpResponse.json({})),
    http.post('/v2/compliance/scan/configurations/:id/run', () => HttpResponse.json({})),
    http.get('/v2/compliance/scan/stats/profiles', () => HttpResponse.json({ scanStats: [], totalCount: 0 })),
    http.get('/v2/compliance/scan/stats/profiles/clusters/:clusterId', () => HttpResponse.json({ scanStats: [], totalCount: 0, clusterId: '', clusterName: '' })),
    http.get('/v2/compliance/scan/stats/profiles/:profileName/clusters', () => HttpResponse.json({ clusterResults: [], totalCount: 0 })),
    http.get('/v2/compliance/scan/results/checks', () => HttpResponse.json({ checkResults: [], totalCount: 0 })),
    http.get('/v2/compliance/scan/results/stats/checks', () => HttpResponse.json({ checkStats: [], totalCount: 0 })),
    http.get('/v2/compliance/scan/results/stats/profiles/clusters', () => HttpResponse.json({ scanStats: [], totalCount: 0 })),
    http.get('/v2/compliance/profiles', () => HttpResponse.json({ profiles: [], totalCount: 0 })),
    http.get('/v2/compliance/profiles/:name', () => HttpResponse.json({})),
    http.get('/v2/compliance/integrations', () => HttpResponse.json({ integrations: [], totalCount: 0 })),
    http.get('/v2/reports/configuration-count', () => HttpResponse.json({ count: MOCK_REPORTS.length })),
    http.get('/v2/reports/configurations', () => HttpResponse.json({ reportConfigs: MOCK_REPORTS, totalCount: MOCK_REPORTS.length })),
    http.get('/v2/reports/configurations/:id/history', () => HttpResponse.json({ reportSnapshots: [], totalCount: 0 })),
    http.get('/v2/reports/configurations/:id/my-history', () => HttpResponse.json({ reportSnapshots: [], totalCount: 0 })),
    http.get('/v2/reports/configurations/:id', ({ params }) => HttpResponse.json(MOCK_REPORTS.find((r) => r.id === params.id) ?? MOCK_REPORTS[0])),
    http.get('/v2/reports/last-status/:id', () => HttpResponse.json({ status: null })),
    http.get('/v2/reports/jobs/:id/status', () => HttpResponse.json({ status: null })),
    http.get('/v2/reports/jobs/:id/download', () => HttpResponse.json('', { status: 200 })),
    http.delete('/v2/reports/jobs/:id/delete', () => HttpResponse.json({})),
    http.get('/v2/reports/jobs', () => HttpResponse.json({ reportJobs: [], totalCount: 0 })),
    http.get('/v2/reports/view-based/history', () => HttpResponse.json({ reportJobs: [], totalCount: 0 })),
    http.get('/v2/reports/view-based/my-history', () => HttpResponse.json({ reportJobs: [], totalCount: 0 })),
    http.post('/v2/reports/configurations', async ({ request }) => { const body = await request.clone().json(); return HttpResponse.json({ ...body, id: `created-${Date.now()}` }); }),
    http.put('/v2/reports/configurations/:id', async ({ request }) => HttpResponse.json(await request.clone().json())),
    http.delete('/v2/reports/configurations/:id', () => HttpResponse.json({})),
    http.post('/v2/reports/run', () => HttpResponse.json({ reportConfigId: 'mock-run' })),
    http.post('/v2/reports/send', () => HttpResponse.json({})),
    http.get('/v1/notifiers', () => HttpResponse.json({ notifiers: MOCK_NOTIFIERS })),
    http.get('/v1/integrations', () => HttpResponse.json({ integrations: {} })),
    http.get('/v1/cve/requests', () => HttpResponse.json({ approvalRequests: [] })),
    http.get('/v1/imageintegrations', () => HttpResponse.json({ integrations: [{ id: 'mock-scannerv4', name: 'Scanner V4', type: 'scannerv4', categories: ['SCANNER'], autogenerated: true, clusterId: '', skipTestIntegration: false }] })),
    http.get('/v1/externalbackups', () => HttpResponse.json({ externalBackups: [] })),
    http.get('/v1/signatureintegrations', () => HttpResponse.json({ integrations: [] })),
    http.get('/v1/auth/m2m', () => HttpResponse.json({ items: [] })),
    http.get('/v1/cloud-sources', () => HttpResponse.json({ cloudSources: [], totalCount: 0 })),
    http.get('/v1/apitokens', () => HttpResponse.json({ tokens: [] })),
    http.get('/v1/groups', () => HttpResponse.json({ groups: [] })),
    http.get('/v1/roles', () => HttpResponse.json({ roles: [] })),
    http.get('/v1/rolebindings', () => HttpResponse.json({ bindings: [] })),
    http.get('/v1/permissionsets', () => HttpResponse.json({ permissionSets: [] })),
    http.get('/v1/accessscopes', () => HttpResponse.json({ accessScopes: [] })),
    http.get('/v1/alerts', ({ request }) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('pagination.limit') || '20', 10);
        return HttpResponse.json({ alerts: MOCK_ALERTS.slice(0, limit) });
    }),
    http.get('/v1/alertscount', () => HttpResponse.json({ count: MOCK_ALERT_COUNT })),
    http.get('/v1/alerts/summary/counts', () => HttpResponse.json({ groups: MOCK_ALERT_SUMMARY_GROUPS })),
    http.get('/v1/alerts/:id', ({ params }) => {
        const alert: any = MOCK_ALERTS.find((a: any) => a.id === params.id) ?? MOCK_ALERTS[0];
        // Enrich resource object with fields the detail page needs
        if (alert.resource && alert.commonEntityInfo) {
            alert.resource = {
                resourceType: alert.commonEntityInfo.resourceType ?? 'SECRETS',
                clusterName: alert.commonEntityInfo.clusterName ?? '',
                clusterId: alert.commonEntityInfo.clusterId ?? '',
                namespace: alert.commonEntityInfo.namespace ?? '',
                namespaceId: alert.commonEntityInfo.namespaceId ?? '',
                name: alert.resource.name ?? '',
            };
        }
        // Ensure required fields exist for the detail page
        const enriched = {
            violations: [],
            processViolation: null,
            fileAccessViolation: null,
            enforcement: { action: alert.enforcementAction ?? 'UNSET_ENFORCEMENT', count: alert.enforcementCount ?? 0, message: '' },
            firstOccurred: alert.time ?? new Date().toISOString(),
            resolvedAt: null,
            snoozeTill: null,
            ...alert,
        };
        return HttpResponse.json(enriched);
    }),
    http.get('/v1/deploymentswithprocessinfo', ({ request }) => {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('pagination.limit') || '5', 10);
        return HttpResponse.json({ deployments: MOCK_DEPLOYMENTS_AT_RISK.slice(0, limit) });
    }),
    http.get('/v1/compliance/standards', () => HttpResponse.json({ standards: MOCK_COMPLIANCE_STANDARDS })),
    http.get('/v1/compliance/runstatuses', () => HttpResponse.json({ runs: [] })),
    http.get('/v1/networkgraph/cluster/:id', () => HttpResponse.json({ nodes: [], edges: [] })),
    http.get('/v1/networkpolicies/graph/epoch', () => HttpResponse.json({ response: { epoch: 1 } })),
    http.get('/v1/networkpolicies', () => HttpResponse.json({ networkPolicies: [] })),
    http.get('/v1/networkbaseline/:id', ({ params }) => HttpResponse.json({ id: params.id, locked: false, peers: [], namespace: '' })),
    http.post('/v1/networkbaseline/:id/status', () => HttpResponse.json({ statuses: [] })),
    http.patch('/v1/networkbaseline/:id/peers', () => HttpResponse.json({})),
    http.get('/v1/administration/events', () => HttpResponse.json({ events: [], totalCount: 0 })),
    http.get('/v1/count/administration/events', () => HttpResponse.json({ count: 0 })),
    http.get('/v1/administration/events/:id', () => HttpResponse.json({ event: null })),
    http.get('/v1/config/private/exception/vulnerabilities', () => HttpResponse.json({ config: { expiryOptions: { dayOptions: [{ numDays: 14, enabled: true }, { numDays: 30, enabled: true }, { numDays: 60, enabled: false }, { numDays: 90, enabled: true }], fixableCveOptions: { allFixable: true, anyFixable: true }, customDate: false, indefinite: false } } })),
    http.put('/v1/config/private/exception/vulnerabilities', async ({ request }) => HttpResponse.json(await request.clone().json())),
    http.get('/v1/declarative-config/health', () => HttpResponse.json({ healths: [] })),
    http.get('/v1/integrationhealth/externalbackups', () => HttpResponse.json({ integrationHealth: [] })),
    http.get('/v1/integrationhealth/imageintegrations', () => HttpResponse.json({ integrationHealth: [] })),
    http.get('/v1/integrationhealth/notifiers', () => HttpResponse.json({ integrationHealth: [] })),
    http.get('/v1/integrationhealth/declarativeconfigs', () => HttpResponse.json({ integrationHealth: [] })),
    http.get('/v1/integrationhealth/vulndefinitions', () => HttpResponse.json({ lastUpdatedTimestamp: new Date().toISOString() })),
    http.get('/v1/credentialexpiry', () => HttpResponse.json({ expiry: null })),
    http.get('/v2/administration/events/count', () => HttpResponse.json({ count: 0 })),
    http.get('/v1/sac/clusters', () => HttpResponse.json({ clusters: MOCK_CLUSTERS.map((c: any) => ({ id: c.id, name: c.name })) })),
    http.get('/v1/:rest*', () => HttpResponse.json({})),
    http.post('/v1/:rest*', () => HttpResponse.json({})),
    http.patch('/v1/:rest*', () => HttpResponse.json({})),
    http.delete('/v1/:rest*', () => HttpResponse.json({})),
    http.get('/v2/:rest*', () => HttpResponse.json({})),
    http.post('/v2/:rest*', () => HttpResponse.json({})),
    http.patch('/v2/:rest*', () => HttpResponse.json({})),
    http.delete('/v2/:rest*', () => HttpResponse.json({})),
    graphqlHandler,
];
