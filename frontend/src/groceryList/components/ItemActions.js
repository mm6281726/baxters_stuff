import React from 'react';
import { Button } from 'reactstrap';
import '../pages/Items.css';

const ItemActions = ({ onAddItem, onMarkAllPurchased, onClearPurchased }) => {
  return (
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
  );
};

export default ItemActions;
