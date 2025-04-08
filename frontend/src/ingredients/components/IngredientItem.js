import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/List.css';

const IngredientItem = ({ ingredient, onEdit, onDelete }) => {
  return (
    <ListGroupItem
      key={ingredient.id}
      className="d-flex justify-content-between align-items-center ingredient-item"
    >
      <div>
        <div className="ingredient-title">
          {ingredient.name}
        </div>
        {ingredient.description && (
          <div className="ingredient-description">
            {ingredient.description}
          </div>
        )}
      </div>
      <div className="ingredient-actions">
        <Button
          color="secondary"
          onClick={() => onEdit(ingredient)}
          size="sm"
          className="me-2"
        >
          Edit
        </Button>
        <Button
          color="danger"
          onClick={() => onDelete(ingredient)}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default IngredientItem;
