import { IStock } from "./stock";

export interface ISettings {
  speed: number,
  startDate: string,
  currentDate: string,
  chosenStocks: IStock[],
  isStarted: boolean
}