import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/List.css';

const GroceryListItem = ({ list, onView, isCompleted }) => {
  const handleRowClick = () => {
    onView(list);
  };

  return (
    <ListGroupItem
      key={list.id}
      className={`d-flex justify-content-between align-items-center grocery-list-item ${isCompleted ? 'completed' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center flex-grow-1">
        <div className="flex-grow-1">
          <div className={`grocery-list-title ${isCompleted ? 'completed-grocery-list' : ''}`} title={list.description}>
            {list.title}
          </div>
          {list.description && (
            <div className="text-muted small">
              {list.description}
            </div>
          )}
          <div className="text-muted small mt-1">
            {list.item_count} items ({list.purchased_count} purchased)
          </div>
        </div>
      </div>

    </ListGroupItem>
  );
};

export default GroceryListItem;
