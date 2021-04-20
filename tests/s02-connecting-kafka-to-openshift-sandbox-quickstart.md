# S02 - Connecting Kafka to OpenShift Sandbox Quickstart

## Description

Test the Connecting Red Hat OpenShift Streams for Apache Kafka to OpenShift Quickstart on OpenShift Sandbox

## Prerequisites

Follow the **Getting Started with Red Hat OpenShift Streams for Apache Kafka** to create the Kafka Instance, Service Account and Topic name (There is a test specific for the Getting Started, so you can go through this step as faster as you want)

## Steps

1. Go to https://developers.redhat.com/developer-sandbox

2. Click on **Launch your Developer Sandbox for Red Hat OpenShift**
   Note: the button could appear after ~30s

3. Wait for the Sandbox environment to be ready and click on **Start using your sandbox**

4. Login to OpenShift using the DevSandbox IDP

5. Select the Question Mark Icon on the Top Right corner and click on **Quick Starts**

   **Attention**: The sandbox quickstarts are not yet on the sandbox production clusters therefore in the quickstart list you will not see this quickstart!

   We have prepared a cluster here with the quickstart installed for this reason:
   https://console-openshift-console.apps.huayra.intlyqe.com/quickstart

   use this cluster to follow the quickstart but execute the quickstart on the sandbox cluster.

6. Select and follow the **Connecting Red Hat OpenShift Streams for Apache Kafka to OpenShift** Quickstart

   Note: during the summit workshop the Kafka instance will be already provisioned, but in this test it has to be provisioned manually.

   > You should:
   >
   > - Start the tools Pod with the CLI
   > - Connect the Kafka instance to the cluster using the CLI
   > - Inspect the Kafka connection details
