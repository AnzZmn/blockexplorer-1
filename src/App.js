import React from 'react';



import 'bootstrap/dist/css/bootstrap.min.css'
import Blocks from './Blocks';
import Transactions from './Transactions';
import Navigation from './Navigation';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface

function App() {
  return (<div className='container'>
    <Navigation></Navigation>
    <Row>
      <Col>
    <Blocks></Blocks>
    </Col>
    <Col>
    <Transactions></Transactions>
    </Col>
    </Row>

    </div>

  )
}

export default App;
