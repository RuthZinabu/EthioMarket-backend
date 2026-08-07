export enum XMLQueries {
  AccountEnquiry = "AccountEnquiry",
  OtherBankTransfer = "OtherBankTransfer",
}

export interface AccountEnquiryPayload {
  bank_code: string;
  account_number: string;
  msgID: string;
  date_time: string;
  long_date_time: string;
}
export interface MoneyTransferPayload {
  msgID: string;
  debit_ref: string;
  bank_code: string;
  account_number: string | number;
  amount: number;
  narrative?: string;
  date_time: string;
  long_date_time: string;
}
export interface A2AStaticConfig {
  A2A_USERNAME: string;
  A2A_PWD: string;
  A2A_CCY: string;
  A2A_TERMINALID: string;
  A2A_TERMINALNAME: string;
  A2A_MERCHANTID: string;
  A2A_MCC: string;
  A2A_ACQUIRINGINSTITUTIONID: string;
  A2A_SOURCEBIN: string;
}

interface XMLQueryMap {
  [XMLQueries.AccountEnquiry]: (data: AccountEnquiryPayload, config: A2AStaticConfig) => string;
  [XMLQueries.OtherBankTransfer]: (data: MoneyTransferPayload, config: A2AStaticConfig) => string;
}
export const XMLQueryGenerator: XMLQueryMap = {
  [XMLQueries.AccountEnquiry]: (data, config) =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.webgate.bpc.ru/">
     <soapenv:Header>
       <ws:credentials>
         <user>${config.A2A_USERNAME}</user>
         <pass>${config.A2A_PWD}</pass>
       </ws:credentials>
     </soapenv:Header>
     <soapenv:Body>
       <ws:a2aEnquiry>
         <a2aEnquiry>
           <destAccount>
               <instId>${data.bank_code}</instId>
               <accountNumber>${data.account_number}</accountNumber>
               <currency>${config.A2A_CCY}</currency>
           </destAccount>
           <acqTerminalDetails>
             <terminalId>${config.A2A_TERMINALID}</terminalId>
             <terminalName>${config.A2A_TERMINALNAME}</terminalName>
             <merchantId>${config.A2A_MERCHANTID}</merchantId>
             <mcc>${config.A2A_MCC}</mcc>
             <acqInstId>${config.A2A_ACQUIRINGINSTITUTIONID}</acqInstId>
           </acqTerminalDetails>
           <sourceBin>${config.A2A_SOURCEBIN}</sourceBin>
           <refNum>${data.msgID}</refNum>
           <message>account lookup</message>
           <localTransactionDateTime>${data.date_time}</localTransactionDateTime>
           <sttlDate>${data.long_date_time}</sttlDate>
         </a2aEnquiry>
       </ws:a2aEnquiry>
     </soapenv:Body>
</soapenv:Envelope>`,

  [XMLQueries.OtherBankTransfer]: (data, config) =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.webgate.bpc.ru/">
  <soapenv:Header>
      <ws:credentials>
          <user>${config.A2A_USERNAME}</user>
          <pass>${config.A2A_PWD}</pass>
      </ws:credentials>
  </soapenv:Header>
  <soapenv:Body>
      <ws:a2aCredit>
          <a2aCredit>
              <destAccount>
                  <instId>${data.bank_code}</instId>
                  <accountNumber>${data.account_number}</accountNumber>
              </destAccount>
              <acqTerminalDetails>
                  <terminalId>${config.A2A_TERMINALID}</terminalId>
                  <terminalName>${config.A2A_TERMINALNAME}</terminalName>
                  <merchantId>${config.A2A_MERCHANTID}</merchantId>
                  <mcc>${config.A2A_MCC}</mcc>
                  <acqInstId>${config.A2A_ACQUIRINGINSTITUTIONID}</acqInstId>
              </acqTerminalDetails>
              <sourceBin>${config.A2A_SOURCEBIN}</sourceBin>
              <refNum>${data.msgID}</refNum>
              <message>${data.narrative}</message>
              <localTransactionDateTime>${data.date_time}</localTransactionDateTime>
              <sttlDate>${data.date_time}</sttlDate>
              <amount>
                  <amount>${data.amount}</amount>
                  <currency>${config.A2A_CCY}</currency>
              </amount>
              <origRefNum>${data.debit_ref}</origRefNum>
          </a2aCredit>
      </ws:a2aCredit>
  </soapenv:Body>
</soapenv:Envelope>`,
};
