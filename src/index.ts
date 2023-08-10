import cookie from "cookie";
import { getClientConfig } from "./helpers";

const KAMELEOON_SITE_CODE = "YOUR_SITE_CODE_HERE";
const KAMELEOON_USER_ID = "kameleoon_user_id";
const VARIABLE_NAME_USER_ID = "PMUSER_KAMELEOON_USER_ID";

let logStash: string[] = [];

/**
 * generateRandomUserId - Generates a random User ID.
 *
 * @returns string
 */
function generateRandomUserId(): string {
  // console.log("[KAMELEOON] Generating new random User ID...");
  const userId = (Math.random() + 1).toString(32).substring(2);
  // console.log(`[KAMELEOON] Generated User ID: ${userId}`);

  return userId;
}

// Helper function to print to the response body.
function printLog(message: string) {
  logStash.push(message);
}

/**
 * 1. User ID: Get the useId from cookie if it exists. Otherwise, generate a new userId.
 * 2. Client Configuration: Get the client configuration data from Kameleoon CDN based on given site code.
 * 3. Initialize KameleoonClient SDK: Create an instance of KameleoonClient using fetched client configuration.
 * 4. Use kameleoonClient instance to access SDK methods. Using methdos get result for this particular userId.
 * 5. Result: Return the result to the caller via appending headers or cookies to the callback function.
 */
export async function onClientRequest(request) {
  logStash = [];
  const cookies = cookie.parse(request.headers.get("Cookie") || "");

  // Get the useId from cookie if it exists. Otherwise, generate a new userId.
  const userId = cookies[KAMELEOON_USER_ID] || generateRandomUserId();

  // onClientRequest handler does not allow setting the cookie. Saving the User ID in a variable
  // to be retrieved and set when onClientResponse handler is executed later on.
  request.setVariable(VARIABLE_NAME_USER_ID, userId);

  // Add your site code here.
  const clientConfig = await getClientConfig(KAMELEOON_SITE_CODE);

  if (!clientConfig) {
    printLog(
      "[KAMELEOON] Failed to fetch the client cofiguration, please check the site code"
    );

    sendGenericReponse(request, logStash);
    return;
  }
}

function sendGenericReponse(request, logStash) {
  request.respondWith(
    200,
    { "Content-Type": "text/plain" },
    "Welcome to the Kameleoon Starter Kit for Akamai Edge Workers. Check log messages in response headers for decision results.\n\n" +
      "Log Messages:\n" +
      logStash.join("\n")
  );
}
