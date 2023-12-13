import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ISettings } from '../interfaces';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {

  };

  @Get()
  @Header('Content-Type', 'application/json')
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Post()
  async update(@Body() settings: ISettings)
  {
    //console.log(settings);
    await this.settingsService.updateSettings(settings);
  }

}
