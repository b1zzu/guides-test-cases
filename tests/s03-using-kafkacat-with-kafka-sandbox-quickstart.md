---
tags:
  - sandbox
---

# S03 - Using Kafkacat with Kafka Sandbox Quickstart

## Description

Test the **Using Kafkacat with Kafka instances in Red Hat OpenShift Streams for Apache Kafka** on OpenShift Sandbox

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

6. Select and follow the **Using Kafkacat with Kafka instances in Red Hat OpenShift Streams for Apache Kafka** Quickstart

   > You should:
   >
   > - Start the tools Pod with kafkacat
   > - Configure Kafkcat to connect to your Kafka Instance
   > - Produce and consume messages using Kafkacat
