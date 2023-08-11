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
 * @param string siteCode
 * @returns client config JSON object or null in case of error
 */
export async function getClientConfiguration(
  siteCode: string
): Promise<unknown | null> {
  // Akamai edgeworkers do not provide a way to cache the response through code.
  // In order to cache, make sure to enable caching to outgoing request from Akamai control panel
  // https://techdocs.akamai.com/purge-cache/docs/cache-strategies
  const response = await httpRequest(
    `https://client-config.kameleoon.com/mobile?siteCode=${siteCode}`
  );

  if (response.ok) {
    return await response.json();
  }

  return null;
}
