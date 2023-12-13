import React, {useState} from 'react';
import { IBroker, IBrokerAdd } from '../interfaces/broker';
import { Button } from "flowbite-react";
import axios from 'axios';

interface IOnAddBrokerFunction {
  onAdd: (broker: IBroker) => void
}


export function AddBroker({onAdd}: IOnAddBrokerFunction)
{
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  async function onSubmit(event)
  {
    event.preventDefault();

    if(name !== '' && balance !== '') {
      let newBroker: IBrokerAdd = {
        name: name,
        balance: parseInt(balance)
      };

      const response = await axios.post<IBroker>('http://localhost:3001/brokers/add', newBroker);
      console.log(response.data);
      onAdd(response.data);
    }
    else {
      alert("Пустое имя или баланс");
    }
  }

  function onChangeName(event) {
    setName(event.target.value);
  }

  function onChangeBalance(event) {
    setBalance(event.target.value);
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder='new broker name' value={name} onChange={onChangeName} />
        <input type="number" placeholder='balance' value={balance} onChange={onChangeBalance} className='mb-2'/>
        <Button color="purple" outline type="submit" className="mb-2">Add</Button>
      </form>
    </>
  )
}