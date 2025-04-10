import React from 'react';
import { Input, FormGroup, Label, Row, Col, ButtonGroup, Button } from 'reactstrap';
import '../pages/Items.css';

const ItemSearch = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, showPurchased, onShowPurchasedChange }) => {
  return (
    <div className="search-filter-bar mb-4">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="item-search" className="fw-bold">Search Items</Label>
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
            <Label className="fw-bold">View Mode</Label>
            <div>
              <ButtonGroup>
                <Button
                  color={viewMode === 'category' ? 'primary' : 'secondary'}
                  onClick={() => onViewModeChange('category')}
                  outline={viewMode !== 'category'}
                >
                  By Category
                </Button>
                <Button
                  color={viewMode === 'alphabetical' ? 'primary' : 'secondary'}
                  onClick={() => onViewModeChange('alphabetical')}
                  outline={viewMode !== 'alphabetical'}
                >
                  Alphabetical
                </Button>
              </ButtonGroup>
            </div>
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="show-purchased" className="fw-bold">Show Purchased</Label>
            <div>
              <ButtonGroup>
                <Button
                  color={showPurchased ? 'primary' : 'secondary'}
                  onClick={() => onShowPurchasedChange(true)}
                  outline={!showPurchased}
                >
                  Show
                </Button>
                <Button
                  color={!showPurchased ? 'primary' : 'secondary'}
                  onClick={() => onShowPurchasedChange(false)}
                  outline={showPurchased}
                >
                  Hide
                </Button>
              </ButtonGroup>
            </div>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default ItemSearch;
