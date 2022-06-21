export type EtherResponseData = {
  status: '1' | '2';
  message: 'OK' | 'NOTOK';
  result: string;
};

export type BalanceResponse = {
  balance: {
    wei: string;
    eth: string;
    usd: string;
  };
};
