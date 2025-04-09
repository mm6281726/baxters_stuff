import React from 'react';
import { Input, FormGroup, Label } from 'reactstrap';
import '../pages/List.css';

const RecipeSearch = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-filter-bar mb-4">
      <FormGroup>
        <Label for="search-recipe" className="fw-bold">Search Recipes</Label>
        <Input
          type="text"
          id="search-recipe"
          placeholder="Search by recipe name or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </FormGroup>
    </div>
  );
};

export default RecipeSearch;
