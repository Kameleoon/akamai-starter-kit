import {
  KameleoonCore,
  CLEANUP_TARGETING_DATA_INTERVAL,
  SdkLanguageType,
} from "@kameleoon/javascript-sdk-core";
import { SDKParameters } from "./types";
import {
  MockStorageConstructor,
  MockExternalRequestDispatcher,
  MockExternalEventSourceConstructor,
} from "./constants";

/**
 * @class
 * KameleoonClient - a class for creating kameleoon client instance
 * */
export class KameleoonClient extends KameleoonCore {
  constructor({ siteCode, configuration, integrations }: SDKParameters) {
    const storage = new MockStorageConstructor();
    const eventSource = new MockExternalEventSourceConstructor();
    const requestDispatcher = new MockExternalRequestDispatcher();
    const updatedConfiguration = {
      ...configuration,
      targetingDataCleanupInterval:
        configuration?.targetingDataCleanupInterval ||
        CLEANUP_TARGETING_DATA_INTERVAL,
    };

    super({
      siteCode,
      configuration: updatedConfiguration,
      internalConfiguration: {
        externalStorage: storage,
        externalEventSource: eventSource,
        externalRequestDispatcher: requestDispatcher,
        externalClientConfiguration: integrations?.externalClientConfiguration,
        externalPackageInfo: {
          type: SdkLanguageType.NODEJS,
          version: process.env.npm_package_version as string,
        },
      },
    });
  }

  /**
   * @method initialize - an asynchronous method for KameleoonClient initialization by fetching Kameleoon SDK related data from server or by retrieving data from local source if data is up-to-date or update interval has not been reached
   * @returns {Promise<boolean>} Promise resolved into boolean field indicating success or fail
   * @throws `KameleoonError` with one of the following `type` s:
   *
   * - `KameleoonException.StorageWrite` Couldn't update storage data
   * - `KameleoonException.ClientConfiguration` Couldn't retrieve client configuration from Kameleoon Api
   * - `KameleoonException.MaximumRetriesReached` Maximum retries reached, request failed
   */
  public async initialize(): Promise<boolean> {
    return super.initialize();
  }
}
