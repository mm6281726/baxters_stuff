import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const IngredientActions = ({ onAddIngredient }) => {
  return (
    <div className="batch-actions">
      <Button color="success" onClick={onAddIngredient}>
        Add Ingredient
      </Button>
    </div>
  );
};

export default IngredientActions;
