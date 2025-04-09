import React from 'react';
import { Button } from 'reactstrap';
import '../pages/List.css';

const CategoryActions = ({ onAddCategory }) => {
  return (
    <div className="batch-actions">
      <Button color="primary" onClick={onAddCategory}>
        Add Category
      </Button>
    </div>
  );
};

export default CategoryActions;
