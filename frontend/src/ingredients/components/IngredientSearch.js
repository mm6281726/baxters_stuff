import React from 'react';
import { Input, FormGroup, Label, Row, Col, Button } from 'reactstrap';
import '../pages/List.css';

const IngredientSearch = ({ searchTerm, onSearchChange, viewMode, onViewModeChange, selectedCategory, categories, onCategoryChange }) => {
  return (
    <div className="search-filter-bar">
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="ingredient-search">Search Ingredients</Label>
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
            <Label for="view-mode">View Mode</Label>
            <div className="d-flex">
              <Button
                color={viewMode === 'category' ? 'success' : 'outline-success'}
                onClick={() => onViewModeChange('category')}
                className="me-2"
                size="sm"
              >
                By Category
              </Button>
              <Button
                color={viewMode === 'alphabetical' ? 'success' : 'outline-success'}
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
            <Label for="category-filter">Filter by Category</Label>
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
