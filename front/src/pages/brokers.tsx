import React, { useContext } from "react"
import { AddBroker } from "../components/addBroker.tsx";
import { BrokersService } from "../services/brokers.service.tsx" 
import { ModalWindow, ModalWindowState } from "../components/modalWindow.tsx";
import { IBroker } from "../interfaces/broker.ts";
import { UpdateBroker } from "../components/updateBroker.tsx";
import { Button, ListGroup, ListGroupItem } from 'flowbite-react';

export function BrokersPage(){
  const { isOpen: isOpenAdd, open: openModalAdd, close: closeModalAdd } = ModalWindowState();
  const { isOpen: isOpenUpdate, open: openModalUpdate, close: closeModalUpdate } = ModalWindowState();
  const { brokers, addBroker, deleteBroker, updateBroker } = BrokersService();


  function onAddBroker(broker: IBroker)
  {
    closeModalAdd();
    addBroker(broker);
  }

  function onUpdateBroker(broker: IBroker)
  {
    closeModalUpdate();
    updateBroker(broker);
  }

  return (
    <>
      <div className='brokers'>
        <ListGroup className="mb-4">
          {
            brokers.map((broker) => (
              <ListGroupItem key={broker.id}>
                <div className="m-auto">
                  <p>ID: {broker.id}</p>
                  <p>Name: {broker.name}</p>
                  <p>Balance: ${broker.balance}</p>
                </div>
                
                <Button color="purple" outline onClick={() => deleteBroker(broker.id)}>Delete</Button>
              </ListGroupItem>
            ))
          }
        </ListGroup>
      </div>

      <div className="flex items-center justify-center flex-col">
      <div className="mb-2">
        {
          isOpenAdd && 
            <ModalWindow
              title={"Add broker"}
              content={<AddBroker onAdd={onAddBroker}/>}
              onClose={closeModalAdd}
            />
        }
        
        {
          !isOpenAdd &&
            <Button color='purple' outline onClick={openModalAdd}>Add broker</Button>
        }
      </div>

      <div>
        {
          !isOpenUpdate &&
          <Button color='purple' outline onClick={openModalUpdate}>Change</Button>
        }

        {
          isOpenUpdate &&
          <ModalWindow
            title={"Change information"}
            content={<UpdateBroker onUpdate={onUpdateBroker}/>}
            onClose={closeModalUpdate}
          />
        }
      </div>
      </div>
    </>
  )
}