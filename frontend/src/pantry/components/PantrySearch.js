import React from 'react';
import { Input, FormGroup, Label, Row, Col, ButtonGroup, Button } from 'reactstrap';
import '../pages/List.css';

const PantrySearch = ({ searchTerm, onSearchChange, viewMode, onViewModeChange }) => {
  return (
    <div className="search-filter-bar mb-4">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="search-pantry" className="fw-bold">Search Pantry</Label>
            <Input
              type="text"
              id="search-pantry"
              placeholder="Search by ingredient name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
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
      </Row>
    </div>
  );
};

export default PantrySearch;
