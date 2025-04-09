import React from 'react';
import { Button } from 'reactstrap';
import '../pages/Detail.css';

const RecipeDetailActions = ({ onAddItem, onAddStep, onDeleteRecipe, onAddToGroceryList }) => {
  return (
    <div className="recipe-detail-action-buttons mb-4">
      <Button
        color="primary"
        onClick={onAddItem}
        className="me-2"
      >
        Add Ingredient
      </Button>
      <Button
        color="secondary"
        onClick={onAddStep}
        className="me-2"
      >
        Add Step
      </Button>
      <Button
        color="success"
        onClick={onAddToGroceryList}
        className="me-2"
      >
        Send to Grocery List
      </Button>
      <Button
        color="danger"
        onClick={onDeleteRecipe}
      >
        Delete Recipe
      </Button>
    </div>
  );
};

export default RecipeDetailActions;
