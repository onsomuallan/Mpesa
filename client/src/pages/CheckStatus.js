import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import 'primeflex/primeflex.css';
import '../styles/mpesa.css';

const Status = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const dt = useRef(null); // Reference for DataTable

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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Transaction ID", "Phone Number", "Amount", "Status"];
    const tableRows = [];

    transactions.forEach(transaction => {
      const transactionData = [
        transaction.TransactionID,
        transaction.PhoneNumber,
        transaction.Amount,
        transaction.Status
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Transaction Status", 14, 15);
    doc.save("transaction_status.pdf");
    toast.current.show({ severity: 'success', summary: 'Export', detail: 'Data exported as PDF successfully' });
  };

  const items = [
    {
      label: 'Refresh',
      icon: 'pi pi-refresh',
      command: () => {
        setLoading(true);
        fetchTransactions();
      }
    },
    {
      label: 'Export CSV',
      icon: 'pi pi-file-excel',
      command: () => {
        if (dt.current) {
          dt.current.exportCSV();
          toast.current.show({ severity: 'success', summary: 'Export', detail: 'Data exported as CSV successfully' });
        }
      }
    },
    {
      label: 'Export PDF',
      icon: 'pi pi-file-pdf',
      command: () => {
        exportPDF();
      }
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        toast.current.show({ severity: 'info', summary: 'Settings', detail: 'Settings opened' });
      }
    }
  ];

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" onClick={() => { setLoading(true); fetchTransactions(); }} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" onClick={() => { if (dt.current) { dt.current.exportCSV(); toast.current.show({ severity: 'success', summary: 'Export', detail: 'Data exported as CSV successfully' }); } }} />;

  return (
    <div className="status-container">
      <Card title="Transaction Status" className="status-card">
        <Menubar model={items} className="status-menubar" />
        <DataTable ref={dt} value={transactions} loading={loading} loadingIcon="pi pi-spin pi-spinner" emptyMessage="No transactions found" paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
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
