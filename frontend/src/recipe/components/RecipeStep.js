import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/Detail.css';

const RecipeStep = ({ step, onEdit, onDelete }) => {
  const handleRowClick = (e) => {
    // Only edit if not clicking on buttons
    if (!e.target.closest('.recipe-step-actions')) {
      onEdit(step);
    }
  };

  return (
    <ListGroupItem
      key={step.id}
      className="d-flex justify-content-between align-items-start recipe-step"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex-grow-1">
        <div className="d-flex">
          <span className="recipe-step-number">Step {step.step_number}:</span>
          <span className="recipe-step-description">{step.description}</span>
        </div>
      </div>
      <div className="recipe-step-actions">
        <Button
          color="secondary"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click handler from firing
            onEdit(step);
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
            onDelete(step);
          }}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default RecipeStep;
