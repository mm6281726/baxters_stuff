import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/Detail.css';

const RecipeIngredient = ({ item, onEdit }) => {
  const handleRowClick = () => {
    onEdit(item);
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
    </ListGroupItem>
  );
};

export default RecipeIngredient;
