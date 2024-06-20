// Status.js

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';
import '../styles/mpesa.css';

const Status = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null); // useRef usage

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions'); // Replace with your backend API endpoint
        const data = await response.json();
        setTransactions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch transactions' });
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="status-container">
      <Card title="Transaction Status" className="status-card">
        <DataTable value={transactions} loading={loading} loadingIcon="pi pi-spin pi-spinner" emptyMessage="No transactions found">
          <Column field="TransactionID" header="Transaction ID" sortable></Column>
          <Column field="PhoneNumber" header="Phone Number" sortable></Column>
          <Column field="Amount" header="Amount" sortable></Column>
          <Column field="Status" header="Status" sortable></Column>
        </DataTable>
      </Card>
      <Toast ref={toast} />
    </div>
  );
};

export default Status;
