import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemModal from '../ItemModal';

// Mock the IngredientSelect component
jest.mock('../IngredientSelect', () => {
  return function MockIngredientSelect({ selectedIngredient, onChange }) {
    return (
      <div data-testid="ingredient-select">
        <button 
          onClick={() => onChange({ value: 1, label: 'Apple' })}
          data-testid="select-ingredient"
        >
          Select Ingredient
        </button>
      </div>
    );
  };
});

describe('ItemModal Component', () => {
  const mockToggle = jest.fn();
  const mockOnSave = jest.fn();
  
  const mockActiveItem = {
    grocery_list: 1,
    ingredient: null,
    ingredient_details: null,
    quantity: 1,
    unit: '',
    purchased: false,
    notes: ''
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the item modal with initial values', () => {
    render(
      <ItemModal 
        activeItem={mockActiveItem}
        toggle={mockToggle}
        onSave={mockOnSave}
      />
    );
    
    // Check that the modal renders with the correct title
    expect(screen.getByText('Grocery List Item')).toBeInTheDocument();
    
    // Check that the quantity input has the correct initial value
    const quantityInput = screen.getByLabelText('Quantity');
    expect(quantityInput.value).toBe('1');
    
    // Check that the unit input is empty
    const unitInput = screen.getByLabelText('Unit');
    expect(unitInput.value).toBe('');
    
    // Check that the purchased checkbox is unchecked
    const purchasedCheckbox = screen.getByLabelText('Purchased');
    expect(purchasedCheckbox.checked).toBe(false);
  });
  
  test('handles quantity as integer when no unit is provided', () => {
    render(
      <ItemModal 
        activeItem={mockActiveItem}
        toggle={mockToggle}
        onSave={mockOnSave}
      />
    );
    
    // Get the quantity input
    const quantityInput = screen.getByLabelText('Quantity');
    
    // Change the quantity to a decimal value
    fireEvent.change(quantityInput, { target: { value: '2.5' } });
    
    // Since there's no unit, the value should be converted to an integer
    expect(quantityInput.value).toBe('2');
  });
  
  test('handles quantity as decimal when unit is provided', () => {
    const itemWithUnit = {
      ...mockActiveItem,
      unit: 'kg'
    };
    
    render(
      <ItemModal 
        activeItem={itemWithUnit}
        toggle={mockToggle}
        onSave={mockOnSave}
      />
    );
    
    // Get the quantity input
    const quantityInput = screen.getByLabelText('Quantity');
    
    // Change the quantity to a decimal value
    fireEvent.change(quantityInput, { target: { value: '2.5' } });
    
    // Since there's a unit, the decimal value should be preserved
    expect(quantityInput.value).toBe('2.5');
  });
  
  test('converts quantity to integer when unit is removed', () => {
    const itemWithUnit = {
      ...mockActiveItem,
      quantity: 2.5,
      unit: 'kg'
    };
    
    render(
      <ItemModal 
        activeItem={itemWithUnit}
        toggle={mockToggle}
        onSave={mockOnSave}
      />
    );
    
    // Get the unit input
    const unitInput = screen.getByLabelText('Unit');
    
    // Remove the unit
    fireEvent.change(unitInput, { target: { value: '' } });
    
    // Get the quantity input
    const quantityInput = screen.getByLabelText('Quantity');
    
    // The quantity should be rounded to an integer
    expect(quantityInput.value).toBe('3');
  });
  
  test('saves the item when save button is clicked', () => {
    render(
      <ItemModal 
        activeItem={mockActiveItem}
        toggle={mockToggle}
        onSave={mockOnSave}
      />
    );
    
    // Select an ingredient
    fireEvent.click(screen.getByTestId('select-ingredient'));
    
    // Change the quantity
    const quantityInput = screen.getByLabelText('Quantity');
    fireEvent.change(quantityInput, { target: { value: '3' } });
    
    // Add a unit
    const unitInput = screen.getByLabelText('Unit');
    fireEvent.change(unitInput, { target: { value: 'kg' } });
    
    // Add notes
    const notesInput = screen.getByLabelText('Notes');
    fireEvent.change(notesInput, { target: { value: 'Test notes' } });
    
    // Mark as purchased
    const purchasedCheckbox = screen.getByLabelText('Purchased');
    fireEvent.click(purchasedCheckbox);
    
    // Click the save button
    fireEvent.click(screen.getByText('Save'));
    
    // Check that onSave was called with the updated item
    expect(mockOnSave).toHaveBeenCalledWith({
      grocery_list: 1,
      ingredient: 1,
      ingredient_details: { id: 1, name: 'Apple' },
      quantity: 3,
      unit: 'kg',
      purchased: true,
      notes: 'Test notes'
    });
    
    // Check that toggle was called
    expect(mockToggle).not.toHaveBeenCalled(); // Toggle is called by the parent component
  });
});
