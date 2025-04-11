import React, { useState } from 'react';
import { ListGroup } from 'reactstrap';
import RecipeIngredient from './RecipeIngredient';
import '../pages/Detail.css';

const CategoryGroup = ({ categoryName, items, onEdit }) => {
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
          {items.map(item => (
            <RecipeIngredient
              key={item.id}
              item={item}
              onEdit={onEdit}
            />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CategoryGroup;
