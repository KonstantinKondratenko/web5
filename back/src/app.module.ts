import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrokersController } from './brokers/brokers.controller';
import { BrokersService } from './brokers/brokers.service';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { SettingsController } from './settings/settings.controller';
import { SettingsService } from './settings/settings.service';
import { WebsocketGateway } from './websocket.gateway';
import { AuctionService } from './auction/auction.service';
import { AuctionController } from './auction/auction.controller';

@Module({
  imports: [],
  controllers: [AppController, BrokersController, StocksController, SettingsController, AuctionController],
  providers: [AppService, BrokersService, StocksService, SettingsService, WebsocketGateway, AuctionService],
})
export class AppModule {}
