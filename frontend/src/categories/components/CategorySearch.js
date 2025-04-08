import React from 'react';
import { Input, FormGroup, Label, Row, Col } from 'reactstrap';
import '../pages/List.css';

const CategorySearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-filter-bar">
      <Row>
        <Col>
          <FormGroup>
            <Label for="category-search">Search Categories</Label>
            <Input
              type="text"
              id="category-search"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default CategorySearch;
