import {useState, useEffect} from 'react'
import { IBroker } from "../interfaces/broker.ts"
import axios from 'axios'


export function BrokersService()
{
  const [brokers, setBrokers] = useState<IBroker[]>([]);

  async function addBroker(broker: IBroker)
  {
    setBrokers(prev => [...prev, broker]);
  }

  async function deleteBroker(id: number)
  {
    //delete from server
    const response = await axios.post('http://localhost:3001/brokers/delete', {id: id});

    if(response.status)
    {
      //delete from client
      setBrokers(brokers.filter(
        broker => broker.id !== id
      ));
    }
  }

  async function updateBroker(brokerInfo: IBroker)
  {
    setBrokers(prev => prev.map((broker) => broker.id === brokerInfo.id ? { ...broker, ...brokerInfo} : broker));
  }

  async function getBrokers()
  {
    const response = await axios.get<IBroker[]>('http://localhost:3001/brokers');
    console.log(response.data);
    setBrokers(response.data);
  }

  useEffect(() => {
    getBrokers()
  }, [])

  return { brokers, addBroker, deleteBroker, updateBroker }
}