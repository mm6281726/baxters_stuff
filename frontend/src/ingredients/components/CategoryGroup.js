import React, { useState } from 'react';
import { ListGroup } from 'reactstrap';
import IngredientItem from './IngredientItem';
import '../pages/List.css';

const CategoryGroup = ({ categoryName, ingredients, onEdit }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="mb-4">
      <div
        className={`category-header ${isCollapsed ? 'collapsed' : ''}`}
        onClick={toggleCollapse}
      >
        <h5 className="m-0">{categoryName}</h5>
        <span className="toggle-icon">
          {isCollapsed ? '▶' : '▼'}
        </span>
      </div>

      {!isCollapsed && (
        <ListGroup className="mb-3">
          {ingredients.map(ingredient => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={onEdit}
            />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CategoryGroup;
