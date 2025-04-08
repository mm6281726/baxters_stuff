import React from 'react';
import { Input, FormGroup, Label, Row, Col, Button } from 'reactstrap';
import '../pages/Items.css';

const ItemSearch = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, showPurchased, onShowPurchasedChange }) => {
  return (
    <div className="search-filter-bar">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="item-search">Search Items</Label>
            <Input
              type="text"
              id="item-search"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="view-mode">View Mode</Label>
            <div className="d-flex">
              <Button
                color={viewMode === 'category' ? 'primary' : 'outline-primary'}
                onClick={() => onViewModeChange('category')}
                className="me-2"
                size="sm"
              >
                By Category
              </Button>
              <Button
                color={viewMode === 'alphabetical' ? 'primary' : 'outline-primary'}
                onClick={() => onViewModeChange('alphabetical')}
                size="sm"
              >
                Alphabetical
              </Button>
            </div>
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="show-purchased">Show Purchased</Label>
            <div className="d-flex">
              <Button
                color={showPurchased ? 'success' : 'outline-success'}
                onClick={() => onShowPurchasedChange(!showPurchased)}
                size="sm"
              >
                {showPurchased ? 'Showing Purchased' : 'Hiding Purchased'}
              </Button>
            </div>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ItemSearch;
