export class Environment {
  static ETHER_SCAN_API_KEY = process.env.ETHER_SCAN_API_KEY;
  static COIN_GECKO_ETH_BALANCE_URI =
    'https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false';
}
