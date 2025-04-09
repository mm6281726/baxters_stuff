import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/Items.css';

const GroceryItem = ({ item, onTogglePurchased, onEdit, onDelete }) => {
  const handleRowClick = (e) => {
    // Only toggle if not clicking on buttons or checkbox
    if (!e.target.closest('.grocery-item-actions') && !e.target.closest('.grocery-item-checkbox')) {
      onTogglePurchased(item);
    }
  };

  return (
    <ListGroupItem
      key={item.id}
      className={`d-flex justify-content-between align-items-center grocery-item ${item.purchased ? 'purchased' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex align-items-center">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={(e) => {
            e.stopPropagation(); // Prevent row click handler from firing
            onTogglePurchased(item);
          }}
          className="grocery-item-checkbox me-3"
          aria-label={`Mark ${item.ingredient_details?.name} as ${item.purchased ? 'not purchased' : 'purchased'}`}
        />
        <span
          className={`grocery-item-title ${item.purchased ? "text-decoration-line-through text-muted" : ""}`}
          title={item.notes}
        >
          {item.unit ? item.quantity : Math.round(item.quantity)} {item.unit} {item.ingredient_details?.name}
          {item.notes && <small className="d-block text-muted">{item.notes}</small>}
        </span>
      </div>
      <div className="grocery-item-actions">
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

export default GroceryItem;
