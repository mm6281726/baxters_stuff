import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const PantryActions = ({ onAddItem }) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <Button
        color="primary"
        onClick={onAddItem}
        className="d-flex align-items-center"
      >
        <span className="me-1">+</span> Add Pantry Item
      </Button>
    </div>
  );
};

export default PantryActions;
