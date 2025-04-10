import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const RecipeActions = ({ onAddRecipe }) => {
  return (
    <div className="recipe-action-buttons mb-4">
      <Button
        color="primary"
        onClick={onAddRecipe}
        className="d-flex align-items-center"
      >
        <span className="me-1">+</span> Add Recipe
      </Button>
    </div>
  );
};

export default RecipeActions;
