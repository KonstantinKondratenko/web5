import { Injectable } from '@nestjs/common';
import { BrokersService } from 'src/brokers/brokers.service';
import { IBrokerPortfolioItem, IBuyData, IHistoricalData, IStock } from '../interfaces';
import { SettingsService } from 'src/settings/settings.service';
import { StocksService } from 'src/stocks/stocks.service';

@Injectable()
export class AuctionService {
  private selectedCompaniesId: number[];
  private historicalData: IHistoricalData[];
  private timer: any;

  constructor(
    private settings: SettingsService,
    private stockService: StocksService,
    private brokerService: BrokersService
  ) {};

  async getDate() {
    const { currentDate } = this.settings.getSettings();
    console.log(this.settings.getSettings());
    console.log(currentDate);
    return currentDate;
  }

  async startAuction() {
    const { startDate, chosenStocks } = this.settings.getSettings();
    this.selectedCompaniesId = AuctionService.getSelectedCompanies(chosenStocks);

    this.historicalData = await this.stockService.getHistoricalData();
    const dataIdx  = this.findIdxDataByDate(new Date(startDate));
    const updatedStocks = await this.getNewPrices(dataIdx);

    console.log(updatedStocks);

    return { updatedStocks, dataIdx };
  }

  async getNewPrices(dataIdx: number) {
    const stocks: IStock[] = await this.stockService.getAllStocks();

    const chosenStocks = stocks.filter((stock) =>
      this.selectedCompaniesId.includes(stock.id)
    );

    const updatedStocks: IStock[] = chosenStocks.map((stock) => {
      const data = this.historicalData.find(
        (data) => data.id === stock.id
      ).stocks;

      return {
        id: stock.id,
        label: stock.label,
        name: stock.name,
        price: parseFloat(data[dataIdx].open),
        date: data[dataIdx].date
      };
    });
    console.log(updatedStocks);
    //sets new prices
    await this.stockService.updateStocksPrice(updatedStocks);

    return updatedStocks;
  }

  private findIdxDataByDate(startDate: Date) {
    let currentDate: Date;
    for(const [idx, stock] of this.historicalData[0].stocks.entries()) {
      currentDate = new Date(stock.date);
      if(currentDate <= startDate) {
        return idx;
      }
    }
    return this.historicalData[0].stocks.length - 1;
  }

  private static getSelectedCompanies(chosenStocks: IStock[]) {
    const companiesId = [];
    for (const stock of chosenStocks) {
      companiesId.push(stock.id);
    }

    return companiesId;
  }

  async buyStock(data: IBuyData) {
    let brokerBalance = await this.brokerService.getBrokerBalance(data.brokerId);
    let newBalance = brokerBalance - data.count * data.price;

    if(data.count >= 0 && newBalance >= 0) 
    {
      let brokerPortfolio = await this.brokerService.getBrokerPortfolio(data.brokerId);

      let stockIdx = brokerPortfolio.map((item: IBrokerPortfolioItem) => {
        return item.id
      }).indexOf(data.stockId);

      for(let i = 0; i < data.count; i++) {
        brokerPortfolio[stockIdx].prices.push({
          date: data.date,
          price: data.price
        })
      }

      let portfolioCopy = JSON.parse(JSON.stringify(brokerPortfolio)); // для глубокого копирования

      await this.brokerService.setBrokerBalance(data.brokerId, newBalance);
      return portfolioCopy;
    }
    
    return { isOk: false,
      reason: "You don't have enough money" };
  }

  async sellStock(data: IBuyData) {
    let brokerPortfolio = await this.brokerService.getBrokerPortfolio(data.brokerId);

    let stockIdx = brokerPortfolio.map((item: IBrokerPortfolioItem) => {
      return item.id
    }).indexOf(data.stockId);

    
    let pricesCopy = JSON.parse(JSON.stringify(brokerPortfolio[stockIdx].prices));

    if(data.count >= 0 && brokerPortfolio[stockIdx].prices.length >= data.count) {
      
      pricesCopy.sort((a, b) => b.price - a.price);
      for(let i = 0; i < data.count; i++) {
        pricesCopy.pop();
      }

      brokerPortfolio[stockIdx].prices = JSON.parse(JSON.stringify(pricesCopy)); // обновили акции брокера с учетом удаления

      let brokerBalance = await this.brokerService.getBrokerBalance(data.brokerId);
      await this.brokerService.setBrokerBalance(data.brokerId, brokerBalance + data.count * data.price);
      return JSON.parse(JSON.stringify(brokerPortfolio)); // кидаем копию портфолио?
    }

    return {
      isOk: false,
      reason: "You try to sell more stocks that you have"
    };
  }
}
