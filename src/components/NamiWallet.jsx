import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer';
import useWasm from './useWASM';

function NamiWallet() {
    const [connected, setConnected] = useState(false);

    const wasm = useWasm();

    useEffect(()=>{
        if (!window.cardano || !window.cardano.nami) {
            alert('Nami Wallet is not installed');
            return;
        }

        const checkConnection = async () => {
            const isConnected = await window.cardano.isEnabled();
            setConnected(isConnected);
      
            if (isConnected) {
              getWalletAddress();
            }
        };

        checkConnection();
    },[]);


    const connectWallet = async () => {
        try {
          // Request access to the user's wallet
          await window.cardano.enable();
          setConnected(true);
          console.log(window.cardano)
          getWalletAddress();
        } catch (err) {
          console.error('Connection failed:', err);
        }
    };


    const getWalletAddress = async () => {
        try {
          // Get the user's wallet address in hex format
          const addresses = await window.cardano.getChangeAddress();
          console.log("Address ::" , addresses);
          
          const addressByte = Buffer.from(addresses,'hex');
          const addressBech32 = await wasm.Address.from_bytes(addressByte).to_bech32();;
          console.log("Buffer ::", addressBech32);

        

          // setWalletAddress(bech32Address);
        }
        catch (err) {
          console.error('Failed to fetch wallet address:', err);
        }
      };
    

      return (
        <div>
          <h1>Nami Wallet Integration</h1>
          {connected ? (
            <div>
              <p>Wallet Connected</p>
            </div>
          ) : (
            <button onClick={connectWallet}>Connect Nami Wallet</button>
          )}
        </div>
      );
}

export default NamiWallet