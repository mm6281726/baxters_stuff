import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/Detail.css';

const RecipeIngredient = ({ item, onEdit, onDelete }) => {
  const handleRowClick = (e) => {
    // Only edit if not clicking on buttons
    if (!e.target.closest('.recipe-ingredient-actions')) {
      onEdit(item);
    }
  };

  return (
    <ListGroupItem
      key={item.id}
      className="d-flex justify-content-between align-items-center recipe-ingredient"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex flex-column">
        <span className="recipe-ingredient-title">
          {item.unit ? item.quantity : Math.round(item.quantity)} {item.unit} {item.ingredient_details?.name}
        </span>
        {item.notes && <small className="text-muted">{item.notes}</small>}
      </div>
      <div className="recipe-ingredient-actions">
        <Button
          color="secondary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click handler from firing
            onEdit(item);
          }}
          size="sm"
          className="me-2"
        >
          Edit
        </Button>
        <Button
          color="danger"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click handler from firing
            onDelete(item);
          }}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default RecipeIngredient;
