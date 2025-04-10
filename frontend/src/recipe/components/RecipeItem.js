import React from 'react';
import { ListGroupItem } from 'reactstrap';
import '../pages/List.css';

const RecipeItem = ({ recipe, onView }) => {
  const handleRowClick = () => {
    onView(recipe);
  };

  // Format time display
  const formatTime = (minutes) => {
    if (!minutes) return '';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  // Calculate total time
  const totalTime = () => {
    const prepTime = recipe.prep_time || 0;
    const cookTime = recipe.cook_time || 0;
    return formatTime(prepTime + cookTime);
  };

  return (
    <ListGroupItem
      key={recipe.id}
      className="d-flex justify-content-between align-items-center recipe-item"
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex-grow-1">
        <div className="recipe-title" title={recipe.description}>
          {recipe.title}
        </div>
        {recipe.description && (
          <div className="recipe-description">
            {recipe.description.length > 100 
              ? `${recipe.description.substring(0, 100)}...` 
              : recipe.description}
          </div>
        )}
        <div className="recipe-meta d-flex mt-1">
          {recipe.prep_time && (
            <div className="me-3">
              <i className="bi bi-clock"></i> Prep: {formatTime(recipe.prep_time)}
            </div>
          )}
          {recipe.cook_time && (
            <div className="me-3">
              <i className="bi bi-fire"></i> Cook: {formatTime(recipe.cook_time)}
            </div>
          )}
          {(recipe.prep_time || recipe.cook_time) && (
            <div className="me-3">
              <i className="bi bi-hourglass"></i> Total: {totalTime()}
            </div>
          )}
          {recipe.servings && (
            <div>
              <i className="bi bi-people"></i> Serves: {recipe.servings}
            </div>
          )}
        </div>
      </div>
    </ListGroupItem>
  );
};

export default RecipeItem;
