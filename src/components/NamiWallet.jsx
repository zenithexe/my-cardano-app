import React, { useEffect, useState } from 'react'
import { Address } from '@emurgo/cardano-serialization-lib-browser';
import { Buffer } from 'buffer';

function NamiWallet() {
    const [connected, setConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

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
          
          const addressBuffer = Uint8Array.from(Buffer.from(addresses, 'hex'));;
          console.log("Buffer ::", addressBuffer);

          const bech32Address = Address.from_bytes(addressBuffer).to_bech32();
          console.log(bech32Address);

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
              <p>Address: {walletAddress}</p>
            </div>
          ) : (
            <button onClick={connectWallet}>Connect Nami Wallet</button>
          )}
        </div>
      );
}

export default NamiWallet