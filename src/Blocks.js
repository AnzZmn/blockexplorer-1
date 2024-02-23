import React, { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Accordion from 'react-bootstrap/Accordion';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default function Blocks() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      setLoading(true);
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        const blockPromises = [];
        for (let i = 0; i < 10; i++) {
          const blockNumber = latestBlockNumber - i;
          blockPromises.push(alchemy.core.getBlock(blockNumber));
        }
        const blocksData = await Promise.all(blockPromises);
        setBlocks(blocksData);
      } catch (error) {
        console.error("Failed to fetch block details:", error);
        setError("Failed to fetch block details");
      }
      setLoading(false);
    };

    fetchBlocks();
  }, []);

  if (loading) {
    return <div>Loading block details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Helper function to format the block timestamp
  const getTime = (timeStamp) => {
    const blockTime = new Date(timeStamp * 1000);
    const currentTime = new Date();
    const elapsedTime = currentTime - blockTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes % 60} min ${seconds % 60}s ago`;
  };

  return (
    <div className="container-fluid bg-dark my-3 p-3">
      <h2 className="text-white">Latest Blocks</h2>
      <Accordion>
        {blocks.map((block, index) => (
          <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>Block #{block.number}</Accordion.Header>
            <Accordion.Body className="bg-light">
              {Object.entries(block).map(([key, value]) => {
                if (key === "transactions") {
                  return (
                    <div key={key} className="container text-center my-1 bg-dark text-white">
                      <div className="row align-items-start">
                        <div className="col"><div className="p-3">{key}:</div></div>
                        <div className="col"><div className="p-3">{value.length}</div></div>
                      </div>
                    </div>
                  );
                }
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="container px-4 my-1 text-center bg-dark text-white">
                      <div className="row gx-5">
                        <div className="col"><div className="p-3">{key}:</div></div>
                        <div className="col"><div className="p-3">{value._hex}</div></div>
                      </div>
                    </div>
                  );
                }
                if (key === "timestamp") {
                  return (
                    <div key={key} className="container px-4 my-1 text-center bg-dark text-white">
                      <div className="row gx-5">
                        <div className="col"><div className="p-3">Time:</div></div>
                        <div className="col"><div className="p-3">{getTime(value)}</div></div>
                      </div>
                    </div>
                  );
                }
                if(typeof value === 'string'&& value.slice(0,2)==="0x"){
                  return (
                    <div key={key} className="container px-4 my-1 text-center bg-dark text-white">
                      <div className="row gx-5">
                        <div className="col">
                          <div className="p-3">{key}:</div>
                        </div>
                        <div className="col">
                          <div className="p-3">{(value.toString()).slice(0,20)}...</div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={key} className="container px-4 my-1 text-center bg-dark text-white">
                    <div className="row gx-5">
                      <div className="col">
                        <div className="p-3">{key}:</div>
                      </div>
                      <div className="col">
                        <div className="p-3">{value.toString()}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}


