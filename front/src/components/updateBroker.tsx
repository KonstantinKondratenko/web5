import React, {useState} from 'react';
import { IBroker } from '../interfaces/broker';
import { Button } from "flowbite-react";
import axios from 'axios';

interface IOnUpdateBrokerFunction {
  onUpdate: (broker: IBroker) => void
}

interface IUpdateResult {
  isOk: boolean,
  broker: IBroker
}

export function UpdateBroker({onUpdate}: IOnUpdateBrokerFunction)
{
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  let [balance, setBalance] = useState('');

  async function onSubmit(event)
  {
    event.preventDefault();
    if (parseInt(balance) < 0)
    {
      alert('Введено значение < 0. Не жадничай (баланс установлен 500$)')
      console.log("Balance: ", balance)
      balance = '500'
    }
    if(balance !== '' && id !== '') {
      let newBrokerInfo: IBroker = {
        id: parseInt(id),
        name: name,
        balance: parseInt(balance)
      };

      const response = await axios.post<IUpdateResult>('http://localhost:3001/brokers/update', newBrokerInfo);
      console.log(response.data);
      if(response.data.isOk){
        await onUpdate(response.data.broker);
      }
      else {
        alert('Не существует пользователя с таким ID');
      }
    }
  }

  function onChangeId(event) {
    setId(event.target.value);
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
        <input type="number" placeholder='ID' value={id} onChange={onChangeId} />
        <input type="text" placeholder='new broker name' value={name} onChange={onChangeName} />
        <input type="number" placeholder='balance' value={balance} onChange={onChangeBalance} />
        <Button color="purple" outline type="submit" className='mb-2 mt-2'>Update</Button>
      </form>
    </>
  )
}