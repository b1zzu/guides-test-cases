---
tags:
  - sandbox
---

# S01 - Getting Started with Kafka Sandbox Quickstart

## Description

Test the **Getting Started with Red Hat OpenShift Streams for Apache Kafka Quickstart** on OpenShift Sandbox

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

6. Select and follow the **Getting Started with Red Hat OpenShift Streams for Apache Kafka** Quickstart

   Note: during the summit workshop the Kafka instance will be already provisioned, but in this test it has to be provisioned manually.

   > You should:
   >
   > - Create a Kafka instance
   > - Create a Service Account
   > - Create a Topic
