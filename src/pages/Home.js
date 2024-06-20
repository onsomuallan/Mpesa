import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';
import '../styles/mpesa.css';

const Mpesa = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // State to track button processing state
  const toast = useRef(null);

  const items = [
    { id: 1, name: 'Phone', amount: 1 },
    { id: 2, name: 'Laptop Charger', amount: 20 },
    { id: 3, name: 'Tablet', amount: 30 }
  ];

  const handleCheckboxChange = (item) => {
    const selectedIndex = selectedItems.findIndex((selected) => selected.id === item.id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, item]);
    } else {
      const updatedItems = [...selectedItems];
      updatedItems.splice(selectedIndex, 1);
      setSelectedItems(updatedItems);
    }
  };

  const calculateTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + item.amount, 0);
  };

  const handlePay = async () => {
    if (selectedItems.length === 0) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select at least one item' });
      return;
    }
  
    // Set button to processing state
    setIsProcessing(true);
  
    try {
      const totalAmount = calculateTotalAmount();
      const response = await fetch('http://localhost:5000/api/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber, totalAmount }) // totalAmount is already a number
      });
  
      const data = await response.json();
      console.log(data);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Payment request sent!' });
    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment request failed!' });
    } finally {
      // Reset button to original state after processin
      setIsProcessing(false);
    }
  };
  

  return (
    <div className="mpesa-container">
      <div className="items-container">
        {items.map(item => (
          <Card key={item.id} title={item.name} className={`item-card ${selectedItems.some(selected => selected.id === item.id) ? 'selected' : ''}`} onClick={() => handleCheckboxChange(item)}>
            <div className="item-amount">Amount: Ksh {item.amount}</div>
            <div className="p-checkbox">
              <input type="checkbox" checked={selectedItems.some(selected => selected.id === item.id)} readOnly />
            </div>
          </Card>
        ))}
      </div>
      <div className="payment-details">
        <Card title="Payment Details" className="payment-card">
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <InputText id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <Button
              label={isProcessing ? 'Processing...' : `Pay ${calculateTotalAmount()} Ksh`}
              icon="pi pi-check"
              onClick={handlePay}
              className="p-mt-2"
              disabled={isProcessing} // Disable button while processing
            />
          </div>
        </Card>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Mpesa;
