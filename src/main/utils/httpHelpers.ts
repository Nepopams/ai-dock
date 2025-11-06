const runtime = require("./httpHelpers.js") as {
  joinURL: (baseUrl: string, path: string) => string;
  headersToObject: (headers: Headers) => Record<string, string>;
  isJsonContent: (contentType?: string | null) => boolean;
  redactHeaders: (headers: Record<string, string>) => Record<string, string>;
};

export const joinURL = runtime.joinURL;
export const headersToObject = runtime.headersToObject;
export const isJsonContent = runtime.isJsonContent;
export const redactHeaders = runtime.redactHeaders;
