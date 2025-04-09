import React from 'react';
import { Button } from 'reactstrap';
import '../pages/Items.css';

const ItemActions = ({ onAddItem, onMarkAllPurchased, onClearPurchased, onDeleteList, onCompleteList }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="batch-actions">
        <Button color="primary" onClick={onAddItem} className="me-2">
          Add Item
        </Button>
        <Button color="success" onClick={onMarkAllPurchased} className="me-2">
          Mark All Purchased
        </Button>
        <Button color="warning" onClick={onClearPurchased} className="me-2">
          Clear Purchased
        </Button>
        <Button color="info" onClick={onCompleteList} className="me-2">
          Complete & Add to Pantry
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
