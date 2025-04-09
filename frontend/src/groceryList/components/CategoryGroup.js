import React, { useState } from 'react';
import { ListGroup } from 'reactstrap';
import GroceryItem from './GroceryItem';
import '../pages/Items.css';

const CategoryGroup = ({ categoryName, items, onTogglePurchased, onEdit, onDelete }) => {
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
            <GroceryItem
              key={item.id}
              item={item}
              onTogglePurchased={onTogglePurchased}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CategoryGroup;
