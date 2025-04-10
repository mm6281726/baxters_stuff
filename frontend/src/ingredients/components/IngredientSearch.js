import React from 'react';
import { Input, FormGroup, Label, Row, Col, ButtonGroup, Button } from 'reactstrap';
import '../pages/List.css';

const IngredientSearch = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, selectedCategory, categories, onCategoryChange }) => {
  return (
    <div className="search-filter-bar mb-4">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="ingredient-search" className="fw-bold">Search Ingredients</Label>
            <Input
              type="text"
              id="ingredient-search"
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
            <Label for="category-filter" className="fw-bold">Filter by Category</Label>
            <Input
              type="select"
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};

export default IngredientSearch;
