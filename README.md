# Kameleoon Akamai Edgeworkers Starter Kit

> The Kameleoon Akamai Edgeworkers Starter Kit demonstrates Kameleoon experimentation and feature flags on [Akamai Edgeworkers service](https://techdocs.akamai.com/edgeworkers/docs).

This repository is home to the Kameleoon starter kit for Akamai Edgeworkers. Kameleoon is a powerful experimentation and personalization platform for product teams that enables you to make insightful discoveries by testing the features on your roadmap. Discover more at https://kameleoon.com, or see the [developer documentation](https://developers.kameleoon.com).

## Getting started

This starter kit provides quickstart instructions for developers using the [Kameleoon NodeJS SDK](https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk) with Akamai Edgeworkers.

### Prerequisites

Make sure you have the following requirements before you get started:

1. A Kameleoon user account. Visit [kameleoon.com](https://www.kameleoon.com/) to learn more.
2. The [Kameleoon NodeJS SDK](https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk) installed with some feature flags or experiments already configured.
3. An Akamai Account with EdgeWorkers Acces. For more information, visit the official [Akamai Edgworkers product page here](https://www.akamai.com/products/serverless-computing-edgeworkers).

### Set up the edge environment

First, you'll set up an Akamai EdgeWorker. For this step, please follow the guide below:

1. Create an [EdgeWorker ID](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id-1).

2. Add the [EdgeWorker Behavior](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1).

3. Install the [Akamai CLI](https://techdocs.akamai.com/developer/docs/about-clis).

4. Install the [EdgeWorkers CLI](https://techdocs.akamai.com/edgeworkers/docs/akamai-cli#edgeworkers-cli).

```
akamai install edgeworkers
```

5. Setup [Authentication credentials](https://techdocs.akamai.com/developer/docs/set-up-authentication-credentials).

## Use the Akamai EdgeWorker Starter Kit

The Kameleoon Akamai EdgeWorker Starter Kit uses and extends the [Kameleoon NodeJS SDK](https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk) to provide experimentation and feature flagging on the edge.

> Note: To run the Kameleoon NodeJS SDK on the edge, you need to provide an `externalClientConfiguration`. This can be accomplished either by referencing a local file or using the supplied `getClientConfiguration` helper function to retrieve your Kameleoon project's client configuration. The `externalClientConfiguration` is a JSON file that encapsulates all of your feature flags and experiments. The Kameleoon NodeJS SDK needs this data to implement and monitor your feature flag deployments and experiments.

Once you succesfully have an Akamai EdgeWorker set up, you can clone this starter kit, edit it, build it, and upload the build to your EdgeWorker.

6. Create a new folder and pull the code from this Starter kit.

```
curl -L https://github.com/Kameleoon/akamai-starter-kit/tarball/main | tar --strip-components=1 -zx
```

or

```
wget --no-check-certificate https://github.com/Kameleoon/akamai-starter-kit/tarball/main -O - | tar --strip-components=1 -zx
```

In the `src` folder of the starter kit, you'll find two Typescript files:

- `src/index.ts` contains sample code that fetches and caches the client configuration, initializes the Kameleoon SDK with this configuration and sets the User ID as a variable in request.
- `src/helpers.ts` contains some additional platform-specific code that demonstrates common features of the Kameleoon SDK.

7. Install node modules.

```
npm install
```

8. Add your Kameleoon `siteCode` and `featureKey` in `src/index.ts`. They can be found in the Kameleoon application.

9. Build the bundle.

```
npm run build
```

10. Upload the bundle

```
akamai edgeworkers upload --bundle="dist/bundle.tgz" {WORKER_ID}
```

11. Activate the version

```
akamai edgeworkers activate {WORKER_ID} {ENVIRONMENT} {EDGEWORKER_VERSION}
```

- `WORKER_ID`: Unique ID for your EdgeWorker. This can be obtained from the Akamai control center.
- `ENVIRONMENT`: The environment the EdgeWorker is being deployed on.
- `EDGEWORKER_VERSION`: The custom version of the EdgeWorker as mentioned in `bundle.json`. This should be updated on every new deployment.

12. Enable [Advanced debug headers](https://techdocs.akamai.com/edgeworkers/docs/enable-enhanced-debug-headers) to receive debug logs in the response headers.

## Additional Resources and Concepts

### Identity Management

Out of the box, Kameleoon's SDKs require a user-provided identifier at runtime to drive experimentation and feature flag results. If the client doesn't provide the User ID directly, this starter kit generates a unique ID as a fallback, stores it into the cookie, and re-uses it to ensure decisions are consistent throughout the user session. Alternatively, you can use an existing unique identifier available within your application and pass it in as the value for the `KAMELEOON_USER_ID` cookie.

### Akamai EdgeWorkers

For more information about Akamai EdgeWorkers, you may visit the following resources:

- [Akamai EdgeWorkers Product Overview](https://developer.akamai.com/akamai-edgeworkers-overview)
- [Akamai EdgeWorkers Official Documentation](https://techdocs.akamai.com/edgeworkers/docs/welcome-to-edgeworkers)
- [Kameleoon NodeJS SDK documentation](https://developers.kameleoon.com/feature-management-and-experimentation/web-sdks/nodejs-sdk)
- [Kameleoon Serverless edge compute starter kits](https://developers.kameleoon.com/feature-management-and-experimentation/serverless-edge-compute-starter-kits)
