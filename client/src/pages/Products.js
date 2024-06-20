import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';
import '../styles/mpesa.css';

const Mpesa = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const toast = useRef(null);

  const items = [
    { id: 1, name: 'Item 1', image: 'item1.jpg', amount: 100 },
    { id: 2, name: 'Item 2', image: 'item2.jpg', amount: 200 },
    { id: 3, name: 'Item 3', image: 'item3.jpg', amount: 300 }
  ];

  const handleCardSelect = (item) => {
    setSelectedItem(item);
  };

  const handlePay = async () => {
    if (!selectedItem) {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select an item' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemName: selectedItem.name, phoneNumber, amount: selectedItem.amount })
      });

      const data = await response.json();
      console.log(data);
      console.log(selectedItem.amount);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Payment request sent!' });
    } catch (error) {
      console.error(error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Payment request failed!' });
    }
  };

  return (
    <div className="mpesa-container">
      <div className="items-container">
        {items.map(item => (
          <Card key={item.id} title={item.name} className={`item-card ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`} onClick={() => handleCardSelect(item)}>
            <img src={require(`../assets/${item.image}`).default} alt={item.name} className="item-image" />
            <div className="item-amount">Amount: Ksh{item.amount}</div>
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
            <Button label="Pay" icon="pi pi-check" onClick={handlePay} className="p-mt-2" />
          </div>
        </Card>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default Mpesa;
