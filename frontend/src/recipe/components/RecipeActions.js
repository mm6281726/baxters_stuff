import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const RecipeActions = ({ onAddRecipe, onScanRecipe }) => {
  return (
    <div className="recipe-action-buttons mb-4">
      <Button
        color="primary"
        onClick={onAddRecipe}
        className="d-flex align-items-center me-2"
      >
        <span className="me-1">+</span> Add Recipe
      </Button>
      <Button
        color="success"
        onClick={onScanRecipe}
        className="d-flex align-items-center"
      >
        Scan Recipe
      </Button>
    </div>
  );
};

export default RecipeActions;
