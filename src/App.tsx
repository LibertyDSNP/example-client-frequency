import React, {useEffect, useState} from 'react';
import './App.css';
import Main from "./components/Main";
import * as wallet from "./services/wallets/wallet";
import {setupProvider} from "./services/dsnpWrapper";


function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
