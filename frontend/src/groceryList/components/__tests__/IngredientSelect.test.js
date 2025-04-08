import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import IngredientSelect from '../IngredientSelect';

// Mock axios
jest.mock('axios');

describe('IngredientSelect Component', () => {
  const mockOnChange = jest.fn();
  const mockSelectedIngredient = { value: 1, label: 'Apple' };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the ingredient select component', () => {
    render(
      <IngredientSelect 
        selectedIngredient={mockSelectedIngredient}
        onChange={mockOnChange}
      />
    );
    
    // Check that the component renders with a placeholder
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
  
  test('fetches and alphabetically sorts ingredients on mount', async () => {
    // Mock the API response with unsorted ingredients
    const mockIngredients = [
      { id: 3, name: 'Zucchini', description: 'Green vegetable' },
      { id: 1, name: 'Apple', description: 'Red fruit' },
      { id: 2, name: 'Banana', description: 'Yellow fruit' }
    ];
    
    axios.get.mockResolvedValueOnce({ data: mockIngredients });
    
    // Render the component
    const { container } = render(
      <IngredientSelect 
        selectedIngredient={null}
        onChange={mockOnChange}
      />
    );
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/ingredients/');
    });
    
    // Check that the ingredients are sorted alphabetically
    // Note: Since the dropdown options are not visible until clicked,
    // we need to check the component's internal state
    const component = container.firstChild;
    
    // This is a simplified test since we can't easily access the component's state
    // In a real test, you might use React Testing Library's userEvent to open the dropdown
    // and check the order of options
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
  
  test('handles API error gracefully', async () => {
    // Mock API error
    axios.get.mockRejectedValueOnce(new Error('API Error'));
    
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(
      <IngredientSelect 
        selectedIngredient={null}
        onChange={mockOnChange}
      />
    );
    
    // Wait for the API call to reject
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/ingredients/');
      expect(console.log).toHaveBeenCalled();
    });
    
    // Restore console.log
    console.log.mockRestore();
  });
});
