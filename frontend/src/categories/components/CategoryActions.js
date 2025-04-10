import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const CategoryActions = ({ onAddCategory }) => {
  return (
    <div className="d-flex justify-content-between mb-4">
      <Button
        color="primary"
        onClick={onAddCategory}
        className="d-flex align-items-center"
      >
        <span className="me-1">+</span> Add Category
      </Button>
    </div>
  );
};

export default CategoryActions;
