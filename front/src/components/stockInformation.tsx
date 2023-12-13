import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IStock } from "../interfaces/stock";
import { Button } from "flowbite-react";


export function StockInformation({stock}) {

  const [ isStockSelected, setIsStockSelected ] = useState(false);

  function onSelectStock(event) {
    setIsStockSelected(prevState => !prevState);

    const stocksInStorage = sessionStorage.getItem('stocks');
    let chosenStocks: IStock[];

    if(stocksInStorage) {
      chosenStocks = JSON.parse(stocksInStorage);
    }
    else {
      chosenStocks = [];
    }

    if(event.target.checked){
      chosenStocks.push(stock);
    }
    else {
      chosenStocks = chosenStocks.filter(ChosenStock => ChosenStock.id !== stock.id);
    }

    sessionStorage.setItem('stocks', JSON.stringify(chosenStocks));
    console.log(sessionStorage.getItem('stocks'));
  }

  useEffect(() => {
    const chosenStocks = JSON.parse(sessionStorage.getItem('stocks')) || [];
    setIsStockSelected(chosenStocks.some(chosenStock => chosenStock.id === stock.id));
  }, [stock.id]);

  return (
    <>
    <input type="checkbox" checked={isStockSelected} onChange={onSelectStock}></input>
    <div className="m-auto">
      <p>ID: {stock.id}</p>
      <p>label: {stock.label}</p>
      <p>Company: {stock.name}</p>
      <p>Price: {stock.price}</p>
    </div>
    <Link to={`/history/${stock.id}`}><Button color="purple" outline>History</Button></Link>
    </>
  )
}