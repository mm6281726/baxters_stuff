import React from 'react';
import { ListGroupItem, Button } from 'reactstrap';
import '../pages/List.css';

const CategoryItem = ({ category, onEdit, onDelete }) => {
  return (
    <ListGroupItem
      key={category.id}
      className="d-flex justify-content-between align-items-center category-item"
    >
      <div>
        <div className="category-title">
          {category.name}
        </div>
        {category.description && (
          <div className="category-description">
            {category.description}
          </div>
        )}
      </div>
      <div className="category-actions">
        <Button
          color="secondary"
          onClick={() => onEdit(category)}
          size="sm"
          className="me-2"
        >
          Edit
        </Button>
        <Button
          color="danger"
          onClick={() => onDelete(category)}
          size="sm"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default CategoryItem;
