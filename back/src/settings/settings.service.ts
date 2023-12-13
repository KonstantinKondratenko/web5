import { Injectable } from '@nestjs/common';
import * as fs from "fs";
import { ISettings } from '../interfaces';

@Injectable()
export class SettingsService {
  private settings: ISettings;

  constructor() {
    const settingsJSON: Buffer = fs.readFileSync('./src/json/settings.json');
    this.settings = JSON.parse(String(settingsJSON));
  };

  getSettings() {
    return this.settings;
  }

  setNewDate(date: string) {
    this.settings.currentDate = date;
  }

  async updateSettings(newSettings: ISettings) {
    this.settings = {
      speed: newSettings.speed,
      startDate: newSettings.startDate,
      currentDate: newSettings.currentDate,
      chosenStocks: newSettings.chosenStocks,
      isStarted: newSettings.isStarted
    };
  }
}
