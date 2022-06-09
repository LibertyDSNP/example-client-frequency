import React from 'react';
import logo from './logo.svg';
import {Button} from "antd";
import './App.css';
import ConnectWallet from "./components/ConnectWallet";

const { ApiPromise, WsProvider } = require('@polkadot/api');

function App() {
  return (
    <div className="App">
      <ConnectWallet />
    </div>
  );
}

export default App;
