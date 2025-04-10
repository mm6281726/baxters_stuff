import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/List.css';

const PantryItem = ({ item, onEdit, onDelete }) => {
  const handleRowClick = (e) => {
    // Only edit if not clicking on buttons
    if (!e.target.closest('.pantry-item-actions')) {
      onEdit(item);
    }
  };

  return (
    <ListGroupItem
      key={item.id}
      className="d-flex justify-content-between align-items-center pantry-item"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex flex-column">
        <span className="pantry-item-title">
          {item.unit ? item.quantity : Math.round(item.quantity)} {item.unit} {item.ingredient_details?.name}
        </span>
        {item.notes && <small className="pantry-item-details">{item.notes}</small>}
      </div>
      <div className="pantry-item-actions">
        <Button
          color="danger"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click handler from firing
            onDelete(item);
          }}
          size="sm"
        >
          Remove
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default PantryItem;
