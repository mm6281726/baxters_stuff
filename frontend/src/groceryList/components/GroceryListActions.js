import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const GroceryListActions = ({ onAddList }) => {
  return (
    <div className="batch-actions">
      <Button color="primary" onClick={onAddList}>
        Add List
      </Button>
    </div>
  );
};

export default GroceryListActions;
