import { httpRequest } from "http-request";
import fetch from "node-fetch";

/**
 * getClientConfig - Retrieves the client configuration from the Kameeloon CDN.
 *
 * @param string siteCode
 * @returns client config JSON object or null in case of error
 */
export async function getClientConfig(
  siteCode: string
): Promise<unknown | null> {
  // Akamai edgeworkers do not provide a way to cache the response through code.
  // In order to cache, make sure to enable caching to outgoing request from Akamai control panel
  // https://techdocs.akamai.com/purge-cache/docs/cache-strategies
  const response = await fetch(
    `https://client-config.kameleoon.com/mobile?siteCode=${siteCode}`
  );

  if (response.ok) {
    return await response.json();
  }

  return null;
}
