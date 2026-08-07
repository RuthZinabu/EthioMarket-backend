import * as xml2js from "xml2js";

export const parseSOAPResponse = async <T = unknown>(xmlString: string): Promise<T> => {
  const result = await xml2js.parseStringPromise(xmlString, {
    explicitArray: false,
  });
  return result as T;
};

export default parseSOAPResponse;
