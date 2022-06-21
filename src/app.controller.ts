import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return 'Hello World!';
  }

  @Get('getAddressValue')
  async getAddressValue(@Query('address') address: string) {
    return this.appService.getBalance(address);
  }
}
