import React from 'react';
import './Card.css';

export const Card = ({ itemName, price, imageUrl, handlePurchase, quantity, setQuantity }) => {
  const validateQuantity = (value) => {
    if (value > 100) {
      alert('Quantity should not exceed 100.');
      return quantity;
    }
    return value;
 };
  return (
    <div className="card-container">
      <div className="card">
      <img src={imageUrl} alt={itemName} className="card-image" width="300" height="300" position='top'/>
        <h2>{itemName}</h2>
        <p>Price: {price} USDT</p>
        <div className="card-input">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id={itemName}
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(validateQuantity(parseInt(e.target.value)))}
          />
        </div>
        <button onClick={handlePurchase}>Purchase</button>
      </div>
    </div>
  );
};

export const UserInfo = ({ walletAddress, currentNetwork, currentBalance, totalAllowence, totalBalance, tier1PassesOwned, tier2PassesOwned }) => {
  return (
    <div className="card-container">
      <div className="card">
        <h2>User Info</h2>
        <p>Wallet Address: {walletAddress}</p>
        <p>Network: {currentNetwork}</p>
        <p>Balance: {currentBalance} {currentNetwork}</p>
        <p>Balance: {totalBalance} USDT</p>
        <p>Total Approved Allownece : {totalAllowence} USDT</p>
        <p>Tier 1 Owned Passes: {tier1PassesOwned}</p>
        <p>Tier 2 Owned Passes: {tier2PassesOwned}</p>
      </div>
    </div>
  );
};
