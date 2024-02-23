import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Alchemy, Network} from 'alchemy-sdk';


const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default function Navigation() {
  const [selectedItem, setSelectedItem] = useState("Select");
  const [showDropdown, setShowDropdown] = useState(false);
  const [Data, setData] = useState(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (itemName) => {
    setSelectedItem(itemName);
    setShowDropdown(false);
  };

  const searchDisplay = () => {
    switch (selectedItem) {
      case "Address":
        return "Enter an address (e.g., 0xe73...)";
      case "Block":
        return "Enter Block tag / number (e.g., 12345)";
      case "Transaction":
        return "Enter Transaction Hash (e.g., 0x7d6...)";
      default:
        return "Select a category";
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(true);
    fetchBlockData();
  };

  const fetchBlockData = async () => {
    if (selectedItem === 'Block' && value.trim()) {
      setLoading(true);
      try {
        const block = await alchemy.core.getBlock(value.trim());
        setData(block);
      } catch (error) {
        console.error(error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    if(selectedItem === 'Transaction' && value.trim()){
      setLoading(true);
      try {
        const Reciept = await alchemy.core.getTransactionReceipt(value.trim())
        setData(Reciept)
      } catch (error) {
        console.error(error);
        setData(null);
      }finally{
        setLoading(false)
      }
    }
    if(selectedItem === 'Address' && value.trim()){
      setLoading(true);
      try {
        const balance = await alchemy.core.getBalance(value.trim())
        setData(balance)
      } catch (error) {
        console.error(error);
        setData(null);
      }finally{
        setLoading(false)
      }
    }
  };

  useEffect(() => {
    // Reset block data and hide dropdown when the selected item changes
    setData(null);
    setShowDropdown(false);
  }, [selectedItem]);

  const renderEth = (hexValue)=> parseInt(hexValue, 16);


  

  const renderData = ()=>{
    switch (selectedItem) {
      case "Address":
          return Object.entries(Data).map(([key, value]) =>{
          if(key ==="_hex"){
          return <Row key={key}>
            <Col>Balance</Col>
            <Col>{renderEth(value)} wei</Col>
          </Row>
          }
          return ''
          }
        )
      default:
        return Object.entries(Data).map(([key, value]) =>
          <Row key={key}>
            <Col>{key}</Col>
            <Col>{JSON.stringify(value)}</Col>
          </Row>
        )
        
    }
    }
  

  return (
    <>
      <Navbar className="bg-body-tertiary justify-content-between p-2">
        <Form onSubmit={handleSearch}>
          <Row>
            <Col xs="auto">
              <NavDropdown title={selectedItem} id="basic-nav-dropdown" className='p-2'>
                <NavDropdown.Item onClick={() => handleSelect('Block')}>Block</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleSelect('Address')}>Address</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleSelect('Transaction')}>Transaction</NavDropdown.Item>
              </NavDropdown>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder={searchDisplay()}
                className="d-flex mr-sm-2"
                value={value}
                onChange={(e) => setValue(e.target.value)} // Corrected to update value state
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" className="btn fs-base btn-primary">Search</Button>
            </Col>
          </Row>
        </Form>
      </Navbar>

      {showDropdown && (
        <div className="dropdown-container" style={{ marginTop: '20px' }}>
          {loading ? <div>Loading {selectedItem} details...</div> : Data && renderData()}
        </div>
      )}
    </>
  );
}

