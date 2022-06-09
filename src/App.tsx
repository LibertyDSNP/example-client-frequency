import React from 'react';
import logo from './logo.svg';
import {Button} from "antd";
import './App.css';
import Main from "./components/Main";

const { ApiPromise, WsProvider } = require('@polkadot/api');

function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
