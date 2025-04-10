import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const IngredientActions = ({ onAddIngredient }) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <Button
        color="primary"
        onClick={onAddIngredient}
        className="d-flex align-items-center"
      >
        <span className="me-1">+</span> Add Ingredient
      </Button>
    </div>
  );
};

export default IngredientActions;
