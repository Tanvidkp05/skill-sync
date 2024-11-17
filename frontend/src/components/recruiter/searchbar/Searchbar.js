import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import data from './Data.js'; // Import data

function Searchbar() {
  const [search, setSearch] = useState('');

  return (
    <div className='Search'>
      <Container>
        <h1 className='text-center mt-1'>Jobs</h1>
        <Form>
          <InputGroup className='my-3'>
            <Form.Control onChange={(e) => setSearch(e.target.value)} placeholder='Search Candidates ' />
          </InputGroup>
        </Form>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Skill</th>
              <th>Language</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.filter((item) => {
                return search.toLowerCase() === '' ? true : item.skill.toLowerCase().includes(search.toLowerCase());
              }).map((item) => (
                <tr key={item.id}>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.skill}</td>
                  <td>{item.language}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No data available.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}

export default Searchbar;