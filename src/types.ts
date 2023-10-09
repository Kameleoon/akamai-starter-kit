import {
  GetClientConfigurationResultType,
  Header,
  HttpMethod,
  SDKConfigurationType,
} from "@kameleoon/javascript-sdk-core";

export type RequestParametersType = {
  method: HttpMethod;
  headers?: Partial<Record<Header, string>>;
  body?: string;
};

type ExternalRequestDispatcherType = (
  url: string,
  params: RequestParametersType
) => Promise<Response>;

type IntegrationType = {
  externalClientConfiguration?: GetClientConfigurationResultType;
  externalRequestDispatcher?: ExternalRequestDispatcherType;
};

export type SDKParameters = {
  siteCode: string;
  configuration?: Partial<SDKConfigurationType>;
  integrations?: IntegrationType;
};
