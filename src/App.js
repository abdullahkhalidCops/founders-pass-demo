import logo from './logo.svg';
import './App.css';
import tier1PassImage from './images/founders-pass-silver.png';
import tier2PassImage from './images/founders-pass-gold.png';
import { FounderPassAbi, USDTAbi } from './abi/FounderPassAbi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {Card, UserInfo} from './Card';
import BigNumber from 'bignumber.js';
BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

function App() {
  const [userData, setUserData] = useState({
    currentNetwork: '',
    currentBalance: '',
    userAddress: '',
    // userBalance: '',
    // totalAllowence: '',
    // tier1PassesOwned: '',
    // tier2PassesOwned: ''
  });
  const [quantities, setQuantities] = useState([0, 0]);
  const tier1Price = 250; // Replace with actual price
  const tier2Price = 4500; // Replace with actual price
  const foundersPassContractAddress = '0x2Fe777A6886203B1cB05D1f38b7bB17694C4B8E0'; //'0x0027570f438E427eE9F85F9cda5DF1cf47E609Fc'; old address is without flush functionality 
  const usdtContractAddress = '0x860a925E8f5E7D40501b311D9c8167d824Aa2e44'; //'0x1e2673D6365C8066B577e1CE5F7035FB5D115890'
  const conversionFactor = new BigNumber(10).exponentiatedBy(18);

  // let userAddress, userBalance, totalAllowence, tier1PassesOwned, tier2PassesOwned;

  const populateUserData = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();
      
      const signer = provider.getSigner();
      const usdtContract = new ethers.Contract(usdtContractAddress, USDTAbi, signer); // Replace with USDT contract details
      const foundersPassContract = new ethers.Contract(foundersPassContractAddress, FounderPassAbi, signer); // Replace with your smart contract ABI

      const accounts = await provider.listAccounts();
      const userAddress = accounts[0];
      const currentNetwork = await provider.getNetwork();
      const currentBalance = await provider.getBalance(userAddress);
      const userBalance = await usdtContract.balanceOf(await signer.getAddress());
      const totalAllowence = await usdtContract.allowance(await signer.getAddress(), foundersPassContractAddress);
      const tier1PassesOwned = await foundersPassContract.balanceOf(await signer.getAddress(), 1);
      const tier2PassesOwned = await foundersPassContract.balanceOf(await signer.getAddress(), 2);
      console.log("currentNetwork : ", currentNetwork);
      console.log("currentBalance : ", currentBalance);
      console.log("userAddress : ", userAddress);
      console.log("userBalance : ", userBalance.toString());
      console.log("totalAllowence : ", totalAllowence.toString());
      console.log("tier1PassesOwned : ", tier1PassesOwned.toString());
      console.log("tier2PassesOwned : ", tier2PassesOwned.toString());
      setUserData({
        currentNetwork: currentNetwork.name,
        currentBalance: currentBalance.toString(),
        userAddress,
        userBalance: ethers.utils.formatEther(userBalance.toString()),
        totalAllowence: ethers.utils.formatEther(totalAllowence.toString()),
        tier1PassesOwned: tier1PassesOwned.toString(),
        tier2PassesOwned: tier2PassesOwned.toString(),
      });
    } else {
      // Metamask not found
      console.error('Metamask not installed');
    }
  }
  

  const handlePurchaseForTier = async (tier) => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();
      
      const signer = provider.getSigner();
      const usdtContract = new ethers.Contract(usdtContractAddress, USDTAbi, signer); // Replace with USDT contract details
      const foundersPassContract = new ethers.Contract(foundersPassContractAddress, FounderPassAbi, signer); // Replace with your smart contract ABI

      try {
        const amount = ethers.utils.parseUnits(tier == 1? tier1Price.toString(): tier2Price.toString(), 18); // Assuming 18 decimals for USDT
        const quantity = parseInt(document.getElementById((tier == 1? 'Tier 1 Pass' : 'Tier 2 Pass')).value); 
        console.log("Quantity : ", quantity)
        const totalAmount = amount * quantity;        
        // Send transaction to Metamask wallet
        let userBalance = await usdtContract.balanceOf(await signer.getAddress());
        // userBalance = parseFloat(ethers.utils.formatUnits(userBalance)) / Math.pow(10, 18);
        console.log("User Account : ", await signer.getAddress())
        console.log("User Balance : ", userBalance.toString());
        console.log("Amount : ", amount.toString())
        console.log("type of TotalAmount : ", new BigNumber(totalAmount).toString())
        console.log("TotalAmount : ", totalAmount.toString())
        console.log("Balance is greater than total amount? : ", userBalance >= totalAmount)
        if(userBalance >= totalAmount)
        {
          const approvalTx = await usdtContract.approve(foundersPassContractAddress, new BigNumber(totalAmount).toString());
          toast("Approval Pending");
          const receipt = await approvalTx.wait();
          if (receipt && receipt.blockNumber) {
            const transaction = await (tier == 1 ? foundersPassContract.buyTier1Pass(quantity): foundersPassContract.buyTier2Pass(quantity)); // Call your smart contract function here
            toast("Minting Passes");
            console.log('Transaction hash:', transaction.hash);
          }
          else {
            alert("Approval failed");
          }
        }
        else
          alert("Insuffcient Balance")
        
        // Send transaction to your smart contract
        
        // Handle success
      } catch (error) {
        // Handle error
        console.error(error);
      }
    } else {
      // Metamask not found
      console.error('Metamask not installed');
    }
  };

  // const handlePurchaseForTier2 = async () => {
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     await window.ethereum.enable();
      
  //     const signer = provider.getSigner();
  //     const usdtContract = new ethers.Contract(usdtContractAddress, USDTAbi, signer); // Replace with USDT contract details
  //     const foundersPassContract = new ethers.Contract(foundersPassContractAddress, FounderPassAbi, signer); // Replace with your smart contract ABI

  //     try {
  //       const amount = ethers.utils.parseUnits(tier2Price.toString(), 18); // Assuming 18 decimals for USDT
  //       const quantity = parseInt(document.getElementById('quantity').value); 

  //       const totalAmount = amount.mul(quantity);
  //       let userBalance = await usdtContract.balanceOf(await signer.getAddress());
  //       console.log("User Account : ", await signer.getAddress())
  //       console.log("User Balance : ", userBalance.toString());
  //       console.log("Amount : ", amount.toString())
  //       // Send transaction to Metamask wallet
        
  //       if(userBalance >= totalAmount)
  //         await usdtContract.approve(foundersPassContractAddress, totalAmount.toString());
  //       else
  //         alert("Insuffcient Balance")
        
  //       // Send transaction to your smart contract
  //       const transaction = await foundersPassContract.buyTier2Pass(quantity); // Call your smart contract function here

  //       console.log('Transaction hash:', transaction.hash);
  //       // Handle success
  //     } catch (error) {
  //       // Handle error
  //       console.error(error);
  //     }
  //   } else {
  //     // Metamask not found
  //     console.error('Metamask not installed');
  //   }
  // };

  useEffect(() => {
    populateUserData();
 }, [userData]);

  return (
    <div className="App">
      <h1 class="sal-heading">Items for Sale</h1>
      <div>
        <ToastContainer />
      </div>
      <UserInfo walletAddress={userData.userAddress} currentNetwork={userData.currentNetwork} currentBalance={userData.currentBalance} totalAllowence={userData.totalAllowence} totalBalance={userData.userBalance} tier1PassesOwned={userData.tier1PassesOwned} tier2PassesOwned={userData.tier2PassesOwned}/>
      <Card itemName="Tier 1 Pass" price={tier1Price} imageUrl={"https://assets.playgroundai.com/27866d57-e6f8-471e-9acc-eb77aa669c97.jpg"} handlePurchase={event => handlePurchaseForTier(1)} quantity={quantities[0]} setQuantity={(quantity) => setQuantities([quantity, quantities[1]])}/>
      <Card itemName="Tier 2 Pass" price={tier2Price} imageUrl={"https://assets.playgroundai.com/16d0a622-bc92-4a38-aaa2-1e9787acaa3b.jpg"} handlePurchase={event => handlePurchaseForTier(2)} quantity={quantities[1]} setQuantity={(quantity) => setQuantities([quantities[0], quantity])}/>
    </div>
  );
}

export default App;
