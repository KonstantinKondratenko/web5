import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { AuctionService } from 'src/auction/auction.service';
import { SettingsService } from 'src/settings/settings.service';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class WebsocketGateway {
  @WebSocketServer() private server: Server;
  private timer: any;

  constructor(
    private auctionService: AuctionService,
    private settingsService: SettingsService
  ) {}

  @SubscribeMessage('stopAuction') 
  onStop(client: Socket) {
    //console.log(this.timer);
    this.server.emit('stopAuction');
    this.clearTimer();
  }

  @SubscribeMessage('updatePrices')
  async onUpdate(client: Socket) {
    const { speed, isStarted } = this.settingsService.getSettings();
    if(isStarted)
    {
      let { updatedStocks, dataIdx } = await this.auctionService.startAuction();

      this.clearTimer();

      this.server.emit('updatePrices', updatedStocks);
      this.timer = setInterval(async() => {
        let { isStarted } = this.settingsService.getSettings();
        if(isStarted && updatedStocks && dataIdx) {
          let updatingStocksString = await this.auctionService.getNewPrices(--dataIdx);
          updatedStocks = updatingStocksString;
          if(updatedStocks.length)
          {
            this.settingsService.setNewDate(updatedStocks[0].date);
          }
          console.log(updatedStocks);
          this.server.emit('updatePrices', updatedStocks);
        }
      }, 1000*speed);
    }
  }

  private clearTimer() {
    if(this.timer) {
      clearInterval(this.timer);
    }
  }

  onConnect(client: Socket, ...args: any[]): any {
    console.log(`Client connected: ${client.id}`);
  }

  onDisconnect(client: Socket): any {
    console.log(`Client disconnected: ${client.id}`);
  }
}
