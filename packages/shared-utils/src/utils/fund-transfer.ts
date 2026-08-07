import { A2AStaticConfig, MoneyTransferPayload, XMLQueryGenerator } from "./xml-generator";
import { HttpRequestType, sendHttpRequest } from "./http-request-sender";
import parseSOAPResponse from "./xml";
import { logger } from "./logger";

interface ReplyResp {
  status: "0" | "1";
  localTransactionDateTime: Date;
  errorCode: string;
  refnum: string;
  beneficiaryName: string;
  errorDescription: string;
}
interface AccountLookupResult {
  success: boolean;
  data?: ReplyResp | null;
}
interface SOAPResponse {
  "env:Envelope"?: {
    "env:Body"?: {
      "ns2:a2aEnquiryResponse"?: {
        reply?: ReplyResp;
      };
    };
  };
}
export const fundTransfer = async (
  url: string,
  body: MoneyTransferPayload,
  config: A2AStaticConfig,
): Promise<AccountLookupResult> => {
  try {
    const _xmlQuery = XMLQueryGenerator["OtherBankTransfer"];
    const accountLookUpQuery = _xmlQuery(body, config);
    const _requestConfig: HttpRequestType = {
      method: "post",
      url: url,
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      data: accountLookUpQuery,
    };
    const response = await sendHttpRequest(_requestConfig);
    if (!response) {
      throw new Error("No response received from SOAP service");
    }
    const _parser: SOAPResponse = await parseSOAPResponse(response);
    const _BODY = _parser["env:Envelope"]?.["env:Body"]?.["ns2:a2aEnquiryResponse"]?.reply;
    return {
      data: _BODY,
      success: true,
    };
  } catch (error) {
    logger.error("error white sending account look up API", error);
    return {
      data: null,
      success: false,
    };
  }
};
