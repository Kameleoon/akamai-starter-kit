/// <reference types="akamai-edgeworkers"/>

import { Cookies, SetCookie } from "cookies";
import { logger } from "log";
import {
  KameleoonClient,
  KameleoonUtils,
  GetClientConfigurationResultType,
} from "@kameleoon/nodejs-sdk";
import { getClientConfiguration, generateRandomUserId } from "./helpers";

const KAMELEOON_USER_ID = "kameleoon_user_id";
const VARIABLE_NAME_USER_ID = "PMUSER_KAMELEOON_USER_ID";

const KAMELEOON_SITE_CODE = "YOUR_SITE_CODE_HERE"; // your site code

let logStash: string[] = [];

// Helper function to log to the debug logger and print to the response body.
function logAndPrint(message: string) {
  logStash.push(message);
  logger.log(message);
}

/**
 * 1. User ID: Get the useId from cookie if it exists. Otherwise, generate a new userId.
 * 2. Save a User ID in request variable, so later in clientResponse you can retrieve it and pass it to user.
 * 3. Client Configuration: Get the client configuration data from Kameleoon CDN based on given site code.
 * 4. Initialize KameleoonClient SDK: Create an instance of KameleoonClient using fetched client configuration.
 * 5. Use kameleoonClient instance to access SDK methods. Using methdos get result for this particular userId.
 */
export async function onClientRequest(request: EW.IngressClientRequest) {
  logStash = [];
  const cookies = new Cookies(request.getHeader("Cookie"));

  // Get the useId from cookie if it exists. Otherwise, generate a new userId.
  const userId = cookies.get(KAMELEOON_USER_ID) || generateRandomUserId();

  // onClientRequest handler does not allow setting the cookie. Saving the User ID in a variable
  // to be retrieved and set when onClientResponse handler is executed later on.
  request.setVariable(VARIABLE_NAME_USER_ID, userId);

  // Get the Kameleoon Client Configuration URL from KameleoonUtils
  const url = KameleoonUtils.getClientConfigurationUrl(KAMELEOON_SITE_CODE);

  const clientConfig = await getClientConfiguration(url);

  if (!clientConfig) {
    logAndPrint(
      "[KAMELEOON] Failed to fetch the client cofiguration, please check the site code"
    );

    sendGenericReponse(request, logStash);
    return;
  }

  const kameleoonClient = new KameleoonClient({
    siteCode: KAMELEOON_SITE_CODE,
    integrations: {
      externalClientConfiguration:
        clientConfig as GetClientConfigurationResultType,
    },
  });

  await kameleoonClient.initialize();

  const featureKey = "YOUR_FEATURE_KEY"; // your feature key
  const variationKey = kameleoonClient.getFeatureFlagVariationKey(
    userId,
    featureKey
  );

  logAndPrint(
    `[KAMELEOON] The variationKey of userId: ${userId} is ${variationKey}`
  );

  sendGenericReponse(request, logStash);
}

/**
 * 1. onClientRequest handler does not allow setting the cookie. We are saving the cookie in a variable and then settig it here.
 */
export async function onClientResponse(
  request: EW.IngressClientRequest,
  response: EW.EgressClientResponse
): Promise<void> {
  const userId = request.getVariable(VARIABLE_NAME_USER_ID);
  const cookie = new SetCookie({
    name: KAMELEOON_USER_ID,
    value: userId,
  });

  response.setHeader("Set-Cookie", cookie.toHeader());
}

function sendGenericReponse(
  request: EW.IngressClientRequest,
  logStash: string[]
) {
  request.respondWith(
    200,
    { "Content-Type": "text/plain" },
    "Welcome to the Kameleoon Starter Kit for Akamai Edge Workers. Check log messages in response headers for decision results.\n\n" +
      "Log Messages:\n" +
      logStash.join("\n")
  );
}
