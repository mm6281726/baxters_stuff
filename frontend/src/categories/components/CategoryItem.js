import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/List.css';

const CategoryItem = ({ category, onEdit }) => {
  const handleRowClick = () => {
    onEdit(category);
  };

  return (
    <ListGroupItem
      key={category.id}
      className="d-flex justify-content-between align-items-center category-item"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
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

    </ListGroupItem>
  );
};

export default CategoryItem;
