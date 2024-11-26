import {
  KameleoonUtils,
  IExternalRequester,
  SendRequestParametersType,
  RequestType,
} from "@kameleoon/nodejs-sdk";
import { NAMESPACE, GROUP, SITE_CODE } from "./constants";
// @ts-ignore
import { EdgeKV } from "./edgekv.js";

export class AkamaiWorkerRequester implements IExternalRequester {
  public async sendRequest<T extends RequestType>({
    requestType,
  }: SendRequestParametersType<T>) {
    if (requestType === "configuration") {
      const ek = new EdgeKV(NAMESPACE, GROUP);
      const config = await ek.getText({ item: SITE_CODE });

      if (config) {
        return KameleoonUtils.simulateSuccessRequest(
          requestType,
          JSON.parse(config)
        );
      } else {
        throw new Error("Edgekv failure");
      }
    }

    return await KameleoonUtils.simulateSuccessRequest(
      requestType,
      null as never
    );
  }
}
