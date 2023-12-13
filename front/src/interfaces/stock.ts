
export interface IStock
{
  id: number,
  label: string,
  name: string,
  price: number,
  date?: string
}

export interface IHistoricalData {
  id: number,
  label: string,
  stocks: {
    date: string,
    open: string
  }[]
}