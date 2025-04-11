import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/Detail.css';

const RecipeStep = ({ step, onEdit }) => {
  const handleRowClick = () => {
    onEdit(step);
  };

  return (
    <ListGroupItem
      key={step.id}
      className="d-flex justify-content-between align-items-start recipe-step"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex-grow-1">
        <div className="d-flex flex-grow-1">
          <span className="recipe-step-number">Step {step.step_number}:</span>
          <span className="recipe-step-description">{step.description}</span>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default RecipeStep;
