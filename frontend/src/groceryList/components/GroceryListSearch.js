import React from 'react';
import { Input, FormGroup, Label, Row, Col } from 'reactstrap';
import '../pages/List.css';

const GroceryListSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-filter-bar">
      <Row>
        <Col>
          <FormGroup>
            <Label for="grocery-list-search">Search Lists</Label>
            <Input
              type="text"
              id="grocery-list-search"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default GroceryListSearch;
