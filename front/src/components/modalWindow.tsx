import React, { createContext, useState } from "react";
import { Button } from "flowbite-react";

interface IModalContext {
  isOpen: boolean,
  open: () => void,
  close: () => void
}


export function ModalWindowState() {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    {isOpen, open, close}
  )
}


interface IModalWindowProperties {
  title: string
  content: React.ReactNode,
  onClose: () => void
}

export function ModalWindow({title, content, onClose}: IModalWindowProperties) {
  return (
    <>
      <div>
        <p>{title}</p>
        { content }
        <Button color="purple" outline onClick={onClose}>Close</Button>
      </div>
    </>
  )
}
