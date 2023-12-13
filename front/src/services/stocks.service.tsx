import React, { useEffect, useState } from "react";
import { IStock } from "../interfaces/stock";
import axios from "axios";


export function StocksService() {
  const [stocks, setStocks] = useState<IStock[]>([]);

  async function getStocks() {
    const response = await axios.get<IStock[]>('http://localhost:3001/stocks')
    console.log(response.data);
    setStocks(response.data);
  }

  useEffect(() => {
    getStocks()
  }, []);

  return { stocks }
}