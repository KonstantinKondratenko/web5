import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { IBuyData } from '../interfaces';


@Controller('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService) {  };

  @Get('date')
  @Header('Content-Type', 'application/json')
  async getDate()
  {
    return await this.auctionService.getDate();
  }

  @Post('buy')
  @Header('Content-Type', 'application/json')
  async buyStock(@Body() data: IBuyData) {
    return await this.auctionService.buyStock(data);
  }

  @Post('sell')
  @Header('Content-Type', 'application/json')
  async sellStock(@Body() data: IBuyData) {
    return await this.auctionService.sellStock(data);
  }
}
