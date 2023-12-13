import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StocksService } from "../services/stocks.service.tsx";
import { ViewHistoricalData } from "../components/viewHistoricalData.tsx";
import { StockInformation } from "../components/stockInformation.tsx";
import { Button, ListGroup, ListGroupItem } from 'flowbite-react';

export function StocksPage()
{
  const { stocks } = StocksService();


  return (
    <>
    <div className="flex mb-4 items-center justify-center">
      <Link to="http://localhost:3000/settings"><Button color="purple" outline>Auction</Button></Link>
    </div>
    <div className='stocks'>
      <ListGroup>
        {
          stocks.map((stock) => (
            <ListGroupItem key={stock.id}>
              <StockInformation stock={stock} />
            </ListGroupItem>
          ))
        }
      </ListGroup>
    </div>
    </>
  )
}