import { Controller, Get, Post, Param, Body, Header } from '@nestjs/common';
import { BrokersService } from './brokers.service';
import { IAddBroker, IBroker } from '../interfaces';

@Controller('brokers')
export class BrokersController {
  constructor(private brokerService: BrokersService) {};

  @Get()
  @Header('Content-Type', 'application/json')
  async getAllBrokers()
  {
    return await this.brokerService.getAllBrokers();
  }

  @Get(':id')
  @Header('Content-Type', 'application/json')
  async getBrokerById(@Param('id') id: number)
  {
    return await this.brokerService.getBrokerById(id);
  }

  @Get('/stocks/:id')
  @Header('Content-Type', 'application/json')
  async getBrokerPortfolio(@Param('id') id: number)
  {
    return await this.brokerService.getBrokerPortfolio(id);
  }

  @Get('/balance/:id')
  @Header('Content-Type', 'application/json')
  async getBrokerBalance(@Param('id') id: number)
  {
    return await this.brokerService.getBrokerBalance(id);
  }

  @Post('add')
  async addBroker(@Body() broker: IAddBroker)
  {
    return await this.brokerService.addBroker(broker);
  }

  @Post('delete')
  async deleteBroker(@Body() id)
  {
    return await this.brokerService.deleteBroker(id.id);
  }

  @Post('update')
  async updateBroker(@Body() broker: IBroker)
  {
    return await this.brokerService.updateBroker(broker);
  }
}
