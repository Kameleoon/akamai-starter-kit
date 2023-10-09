import { GetClientConfigurationResultType } from "@kameleoon/javascript-sdk-core";
import { httpRequest } from "http-request";

/**
 * generateRandomUserId - Generates a random User ID.
 *
 * @returns string
 */
export function generateRandomUserId(): string {
  const userId = (Math.random() + 1).toString(32).substring(2);

  return userId;
}

/**
 * getClientConfig - Retrieves the client configuration from the Kameeloon CDN.
 *
 * @param {string} url - Kameleoon Client Configuration URL
 * @returns client config JSON object or null in case of error
 */
export async function getClientConfiguration(
  url: string
): Promise<GetClientConfigurationResultType | string> {
  let clientConfig = '';
  // Akamai edgeworkers do not provide a way to cache the response through code.
  // In order to cache, make sure to enable caching to outgoing request from Akamai control panel
  // https://techdocs.akamai.com/purge-cache/docs/cache-strategies
  const response = await httpRequest(url);

  if (response.ok) {
    clientConfig = await response.json();
  }

  return clientConfig;
}

// /**
//  * requestDispatcher - Request dispatcher to manage external network calls such as tracking and retrieving data from remote source.
//  *
//  * @param {string} url - tracking or remote data url
//  * @param {RequestParametersType} params - tracking or remote data params
//  * @returns
//  */
// export function requestDispatcher(
//   url: string,
//   params: RequestParametersType
// ): Promise<HttpResponse> {
//   return httpRequest(url, params);
// }
