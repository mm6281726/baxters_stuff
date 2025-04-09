import React, { useState } from 'react';
import { ListGroup } from 'reactstrap';
import PantryItem from './PantryItem';
import '../pages/List.css';

const CategoryGroup = ({ categoryName, items, onEdit, onDelete }) => {
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
            <PantryItem
              key={item.id}
              item={item}
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
