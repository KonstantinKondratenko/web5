import {Link} from 'react-router-dom';
import { Component } from 'react';
import React from 'react';
import { Navbar } from 'flowbite-react';


export default class Navigation extends Component {
  render() {
    return (
    <Navbar>
      <Navbar.Collapse>
        <Navbar.Link href="/brokers">
          Брокеры
        </Navbar.Link>
        <Navbar.Link href="/stocks">
          Акции
        </Navbar.Link>
        <Navbar.Link href="/settings">
          Настройки торгов
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    )
  }
}