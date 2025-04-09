import React from 'react';
import { Button } from 'reactstrap';
import '../pages/Items.css';

const ItemActions = ({ onAddItem, onMarkAllPurchased, onClearPurchased, onDeleteList }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="batch-actions">
        <Button color="primary" onClick={onAddItem}>
          Add Item
        </Button>
        <Button color="success" onClick={onMarkAllPurchased}>
          Mark All Purchased
        </Button>
        <Button color="warning" onClick={onClearPurchased}>
          Clear Purchased
        </Button>
      </div>
      <div>
        <Button color="danger" onClick={onDeleteList}>
          Delete List
        </Button>
      </div>
    </div>
  );
};

export default ItemActions;
