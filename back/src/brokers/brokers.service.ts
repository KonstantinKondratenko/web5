import { Injectable } from '@nestjs/common';
import { IAddBroker, IBroker, IBrokerPortfolioItem } from '../interfaces';
import * as fs from 'fs';


@Injectable()
export class BrokersService {
  private brokers: IBroker[];

  constructor() {
    const brokersJSON: Buffer = fs.readFileSync('./src/json/brokers.json');
    this.brokers = JSON.parse(String(brokersJSON));
    console.log(this.brokers);
  }

  async getAllBrokers() {
    return this.brokers;
  }

  async getBrokerById(id: number) {
    return this.brokers.find((item: IBroker) => {
      return String(item.id) === String(id);
    });
  }

  async getBrokerPortfolio(id: number) {
    return this.brokers.find((item: IBroker) => {
      return item.id === id;
    }).stocks;
  }

  async getBrokerBalance(id: number) {
    let broker = this.brokers.find((broker: IBroker) => {
      return broker.id === id;
    });
    return broker.balance;
  }

  async setBrokerBalance(id: number, newBalance: number) {
    let idx = this.brokers.map((broker) => {
      return broker.id;
    }).indexOf(id);
    this.brokers[idx].balance = newBalance;
  }

  async addBroker(broker: IAddBroker) {
    let maxId: number | undefined = this.brokers.reduce((max, broker) => {
      return broker.id > max ? broker.id : max;
    }, -1);
    maxId = maxId === undefined ? 0 : maxId;

    let newBroker: IBroker = {
      id: maxId + 1,
      name: broker.name,
      balance: broker.balance,
      stocks: []
    }

    for(let i = 1; i<=8; i++) {
      let portfolio: IBrokerPortfolioItem = { id: i, prices: [] };
      newBroker.stocks.push(portfolio);
    }

    this.brokers.push(newBroker);

    return newBroker;
  }

  async deleteBroker(id: number) {
    //console.log(id);
    let brokerIdx = this.brokers.map((broker) => {
      return broker.id
    }).indexOf(id);

    if(brokerIdx != -1)
    {
      this.brokers.splice(brokerIdx, 1);
    }
  }

  async updateBroker(broker: IBroker) {
    //console.log(broker);
    let brokerIdx = this.brokers.map((broker) => {
      return broker.id
    }).indexOf(broker.id);

    if(brokerIdx === -1)
    {
      return {
        isOk: false,
        broker: null
      }
    }
    else {
      if(broker.balance < 0){
        broker.balance = 0;
      }

      this.brokers[brokerIdx].balance = broker.balance;

      if(broker.name !== ""){
        this.brokers[brokerIdx].name = broker.name;
      }
    }

    return {
      isOk: true,
      broker: this.brokers[brokerIdx]
    }
  }
}
