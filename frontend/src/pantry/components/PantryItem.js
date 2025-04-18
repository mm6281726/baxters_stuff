import React from 'react';
import { ListGroupItem, Button, Badge } from 'reactstrap';
import '../pages/List.css';

const PantryItem = ({ item, onEdit, onDelete }) => {
  const handleRowClick = (e) => {
    // Only edit if not clicking on buttons
    if (!e.target.closest('.pantry-item-actions')) {
      onEdit(item);
    }
  };

  // Stock level colors for visual indication
  const stockLevelColors = {
    high: 'success',
    medium: 'warning',
    low: 'danger',
    out: 'dark'
  };

  // Stock level icons
  const stockLevelIcons = {
    high: 'bi-battery-full',
    medium: 'bi-battery-half',
    low: 'bi-battery-low',
    out: 'bi-battery'
  };

  return (
    <ListGroupItem
      key={item.id}
      className="d-flex justify-content-between align-items-center pantry-item"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center mb-1">
          <Badge
            color={stockLevelColors[item.stock_level || 'medium']}
            className="me-2 d-flex align-items-center"
          >
            <i className={`bi ${stockLevelIcons[item.stock_level || 'medium']} me-1`}></i>
            {item.stock_level ? item.stock_level.charAt(0).toUpperCase() + item.stock_level.slice(1) : 'Medium'}
          </Badge>
          <span className="pantry-item-title">
            {item.ingredient_details?.name}
          </span>
        </div>
        {(item.quantity != null && item.quantity !== "") && (
          <small className="pantry-item-details text-muted">
            Quantity: {item.quantity} {item.unit || ''}
          </small>
        )}
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
