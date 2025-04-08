import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/List.css';

const GroceryListItem = ({ list, onView, onDelete, isCompleted }) => {
  return (
    <ListGroupItem
      key={list.id}
      className={`d-flex justify-content-between align-items-center grocery-list-item ${isCompleted ? 'completed' : ''}`}
    >
      <div>
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
      <div className="grocery-list-actions">
        <Button
          color="secondary"
          onClick={() => onView(list)}
          size="sm"
          className="me-2"
        >
          View Items
        </Button>
        <Button
          color="danger"
          onClick={() => onDelete(list)}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default GroceryListItem;
