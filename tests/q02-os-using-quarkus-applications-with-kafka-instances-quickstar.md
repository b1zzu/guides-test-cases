---
variants:
  - os: MacOS
  - os: Linux
  - os: Windows
estimate: 30m
---

# Q02 - [{{os}}] Using Quarkus applications with Kafka instances Quickstart

## Description

Test the Using Quarkus applications with Kafka instances Quickstart

## Prerequisites

Operation System: {{os}}

## Steps

1. Go to https://cloud.redhat.com/beta/application-services/streams/resources using {{os}}

2. Select and follow the **Using Quarkus applications with Kafka instances in Red Hat OpenShift Streams for Apache Kafka** Quickstart

   > You should create a Kafka instance, import the Quarkus sample code, configure the Quarkus example, create the prices Kafka topic and run the Quarkus example application locally

3. Wait ~20 seconds and verify that the `Last price` is updated at least three times
