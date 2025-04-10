import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const GroceryListActions = ({ onAddList }) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <Button
        color="primary"
        onClick={onAddList}
        className="d-flex align-items-center"
      >
        <span className="me-1">+</span> Add List
      </Button>
    </div>
  );
};

export default GroceryListActions;
