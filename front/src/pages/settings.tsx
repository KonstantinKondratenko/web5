import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { ISettings } from "../interfaces/settings.ts";
import { IStock } from "../interfaces/stock.ts";
import { Button, ListGroup, ListGroupItem } from 'flowbite-react';


export function SettingsPage()
{
  function checkSessionStorage() {
    return sessionStorage.getItem('stocks') !== null &&
      sessionStorage.getItem('stocks') !== '' && 
      sessionStorage.getItem('stocks') !== '[]'
  }

  const [socket, setSocket] = useState<Socket>();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [settings, setSettings] = useState<ISettings>({
    speed: 0,
    startDate: '',
    currentDate: '',
    chosenStocks: checkSessionStorage() ? JSON.parse(sessionStorage.getItem('stocks')) : [],
    isStarted: false
  });

  useEffect(() => {
    const newSocket = io("http://localhost:3002", { transports: ['websocket'] });
    setSocket(newSocket);
  }, [setSocket]);

  function onChangeSpeed(event) {
    let speed = event.target.value.replace(/\D/g, '');
    setSettings({
      speed: parseInt(speed),
      startDate: settings.startDate,
      currentDate: settings.currentDate,
      chosenStocks: settings.chosenStocks,
      isStarted: settings.isStarted
    })
  }

  function onChangeStartDate(event) {
    let startDate = event.target.value;
    setSettings({
      speed: settings.speed,
      startDate: startDate,
      currentDate: settings.currentDate,
      chosenStocks: settings.chosenStocks,
      isStarted: settings.isStarted
    })
  }

  function onChangeStock(stocks: IStock[]) {
    console.log(stocks);
    setStocks(stocks);
  }

  async function onSubmit(event) {
    event.preventDefault();

    setSettings({
      speed: settings.speed,
      startDate: settings.startDate,
      currentDate: settings.currentDate,
      chosenStocks: settings.chosenStocks,
      isStarted: !settings.isStarted
    });

    if(!settings.isStarted) // торги начинаются
    {
      //console.log(settings);
      axios.post('http://localhost:3001/settings', {
        speed: settings.speed,
        startDate: settings.startDate,
        currentDate: settings.currentDate,
        chosenStocks: settings.chosenStocks,
        isStarted: true
      }).then(res => {
        socket?.open();
        socket?.emit('updatePrices');
      })
    }
    else { // торги заканчиваются
      socket?.emit('stopAuction');
      socket?.close();
      axios.post('http://localhost:3001/settings', {
        speed: settings.speed,
        startDate: settings.startDate,
        currentDate: settings.currentDate,
        chosenStocks: [],
        isStarted: false
      });
    }
  }

  async function setNewDate() {
    const newDate = (await axios.get('http://localhost:3001/auction/date')).data;
    setCurrentDate(newDate);
  }

  useEffect(() => {
    socket?.on('updatePrices', onChangeStock);
    setNewDate();
    return () => {
      socket?.off('updatePrices', onChangeStock);
    };
  }, [onChangeStock]);

  return (
    <>
    <div className="ml-4">
      <Link to="http://localhost:3000/stocks"><Button color="purple" outline>Back</Button></Link>
    </div>

    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-center flex-col">
        <p className="text-2xl mb-4">Auction settings</p>
        <div>
          {/* <div>
            <p>Current date</p>
            <input type="date" disabled={true} value={settings.currentDate}/>
          </div> */}

          <div className="flex items-center mb-4">
            <p className="mr-5">Start date</p>
            <input type="date" disabled={settings.isStarted} value={settings.startDate} onChange={onChangeStartDate}/>
          </div>

          <div className="flex items-center mb-4">
            <p className="mr-5">Speed</p>
            <input type="number" disabled={settings.isStarted} value={settings.speed} onChange={onChangeSpeed} />
          </div>
        </div>
        
        <div>
          {
            !settings.isStarted &&
              <Button type="submit" color="purple" outline className="mb-2">Start auction</Button>
          }

          {
            settings.isStarted &&
              <Button type="submit" color="purple" outline className="mb-2">End auction</Button>
          }
        </div>

        {
          settings.isStarted && currentDate &&
            <p>Current date: {currentDate}</p>
        }
        {
          settings.isStarted && !currentDate &&
          <p>Current date: {settings.startDate}</p>
        }

      </div>
    </form>

    <ListGroup>
          { stocks.length > 0 && settings.isStarted &&
            stocks.map((stock) => (
              <ListGroupItem key={stock.id}>
                <div className="m-auto">
                  <p>ID: {stock.id}</p>
                  <p>Label: {stock.label}</p>
                  <p>Name: {stock.name}</p>
                  <p>Price: {stock.price}</p>
                </div>
              </ListGroupItem>
            ))
          }
    </ListGroup>

    </>
  )
}