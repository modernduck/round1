import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import { BalanceResponse, EtherResponseData } from './models';
import { BigNumber } from 'bignumber.js';
import { Environment } from './environment';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  /**
   * Get Wei Balance from Etherscan api
   * @param {string} address
   * @returns {Promise<EtherResponseData>}
   */
  getEtherBalance(address: string) {
    return firstValueFrom(
      this.httpService
        .get<EtherResponseData>(
          `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${Environment.ETHER_SCAN_API_KEY}`,
        )
        .pipe(
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          }),
          map((d) => {
            if (d.data.status !== '1')
              throw new HttpException(d.data.message, 500);
            return d.data;
          }),
        ),
    );
  }

  /**
   * Get Ethereum market price by using Coingecko api
   * @param {string} address
   * @returns {EtherResponseData}
   */
  getEtherPrice(): Promise<string> {
    return firstValueFrom(
      this.httpService.get(Environment.COIN_GECKO_ETH_PRICE_URI).pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
        map((d) => d.data.market_data.current_price.usd),
      ),
    );
  }
  async getBalance(address: string): Promise<BalanceResponse> {
    const ethBalance = await this.getEtherBalance(address);
    const ethPrice = await this.getEtherPrice();
    const currentEthBalance = new BigNumber(ethBalance.result).div(
      '1000000000000000000',
    );
    const currentUsdBalance = currentEthBalance.times(ethPrice);
    return {
      balance: {
        wei: ethBalance.result,
        eth: currentEthBalance.toString(),
        usd: currentUsdBalance.toString(),
      },
    };
  }
}
