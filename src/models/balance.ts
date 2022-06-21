import { EtherResponseData } from './dto';
import { BigNumber } from 'bignumber.js';
export class Balance {
  wei: BigNumber;
  constructor(private etherResponse: EtherResponseData) {
    this.wei = new BigNumber(this.etherResponse.result);
  }
  toEth() {
    return this.wei.div('1000000000000000000');
  }
}
