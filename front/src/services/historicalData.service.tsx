import React, { useEffect, useState } from "react";
import { IHistoricalData, IStock } from "../interfaces/stock";
import axios from "axios";


export function HistoricalDataService() {
  const [historicalData, setHistoricalData] = useState<IHistoricalData[]>([]);

  async function getHistoricalData() {
    const response = await axios.get<IHistoricalData[]>('http://localhost:3001/stocks/historicalData')
    console.log(response.data);
    setHistoricalData(response.data);
  }

  useEffect(() => {
    getHistoricalData()
  }, []);

  return { historicalData }
}