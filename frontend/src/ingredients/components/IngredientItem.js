import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/List.css';

const IngredientItem = ({ ingredient, onEdit }) => {
  const handleRowClick = () => {
    onEdit(ingredient);
  };

  return (
    <ListGroupItem
      key={ingredient.id}
      className="d-flex justify-content-between align-items-center ingredient-item"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
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

    </ListGroupItem>
  );
};

export default IngredientItem;
