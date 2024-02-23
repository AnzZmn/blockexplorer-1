import React, { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { Alchemy, Network } from 'alchemy-sdk';
import Row from "react-bootstrap/Row";
import Col from 'react-bootstrap/Col';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const block = await alchemy.core.getBlockWithTransactions('latest');
        const transactionList = block.transactions;
        setTransactions(transactionList.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch block details:", error);
        setError("Failed to fetch block details");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 12000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading Transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container bg-dark text-white my-3 p-3">
      <h2>Latest Transactions</h2>
      <Accordion>
        {transactions.map((transaction, index) => (
          <Accordion.Item eventKey={index.toString()} key={transaction.hash}>
            <Accordion.Header>{transaction.hash.slice(0, 20)}...</Accordion.Header>
            <Accordion.Body className="bg-light">
  {Object.entries(transaction).map(([key, val]) => {
    // Handling null values by displaying a placeholder or performing a check before rendering
    let displayValue = '';
    if (val === null) {
      displayValue = 'N/A'; // Placeholder for null values
    } else if (typeof val === 'object' && val !== null && val._hex) {
      displayValue = val._hex;
    } else if (typeof val === 'object' && val !== null) {
        if(key ==="accessList"){
            return ''
        }
        displayValue = JSON.stringify(val);
    } else {
        switch (key) {
            case "wait": 
                return ''
            case "data":
                return ''
            default:
                displayValue = val.toString().slice(0,30);
        }
    }

    return (
      <Row className="my-1" key={key}>
        <Col>{key}</Col>
        <Col>{displayValue}</Col>
      </Row>
    );
  })}
</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

