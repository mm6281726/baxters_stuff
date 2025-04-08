import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import GroceryListItems from '../Items';

// Mock the required modules
jest.mock('axios');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock the ItemModal component
jest.mock('../../components/ItemModal', () => {
  return function MockItemModal({ activeItem, toggle, onSave }) {
    return (
      <div data-testid="item-modal">
        <button onClick={() => onSave(activeItem)}>Save</button>
        <button onClick={toggle}>Cancel</button>
      </div>
    );
  };
});

describe('GroceryListItems Component', () => {
  const mockGroceryList = {
    id: 1,
    title: 'Test Grocery List',
    description: 'Test Description',
    completed: false,
    user: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    items: [],
    item_count: 0,
    purchased_count: 0
  };
  
  const mockItems = [
    {
      id: 1,
      grocery_list: 1,
      ingredient: 1,
      ingredient_details: { id: 1, name: 'Apple' },
      quantity: 2,
      unit: null,
      purchased: false,
      notes: ''
    },
    {
      id: 2,
      grocery_list: 1,
      ingredient: 2,
      ingredient_details: { id: 2, name: 'Banana' },
      quantity: 2.5,
      unit: 'kg',
      purchased: true,
      notes: 'Ripe ones'
    }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the API responses
    axios.get.mockImplementation((url) => {
      if (url === '/api/grocerylist/1/') {
        return Promise.resolve({ data: mockGroceryList });
      } else if (url === '/api/grocerylist/1/items/') {
        return Promise.resolve({ data: mockItems });
      }
      return Promise.reject(new Error('Not found'));
    });
  });
  
  test('renders the grocery list items page', async () => {
    render(<GroceryListItems />);
    
    // Wait for the API calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/grocerylist/1/');
      expect(axios.get).toHaveBeenCalledWith('/api/grocerylist/1/items/');
    });
    
    // Check that the page title is rendered
    expect(screen.getByText('Test Grocery List - Items')).toBeInTheDocument();
    
    // Check that the items are rendered
    expect(screen.getByText(/2 Apple/)).toBeInTheDocument();
    expect(screen.getByText(/2.5 kg Banana/)).toBeInTheDocument();
  });
  
  test('displays integer quantity when no unit is assigned', async () => {
    render(<GroceryListItems />);
    
    // Wait for the API calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
    
    // Check that the item without a unit has an integer quantity
    expect(screen.getByText(/2 Apple/)).toBeInTheDocument();
    
    // The text should not contain a decimal point
    const itemText = screen.getByText(/2 Apple/).textContent;
    expect(itemText).not.toContain('2.0');
  });
  
  test('displays decimal quantity when a unit is assigned', async () => {
    render(<GroceryListItems />);
    
    // Wait for the API calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
    
    // Check that the item with a unit has a decimal quantity
    expect(screen.getByText(/2.5 kg Banana/)).toBeInTheDocument();
  });
  
  test('marks purchased items with strikethrough', async () => {
    render(<GroceryListItems />);
    
    // Wait for the API calls to resolve
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
    
    // Get the item elements
    const items = screen.getAllByRole('listitem');
    
    // The second item (Banana) should have the purchased class
    expect(items[1].querySelector('.text-decoration-line-through')).not.toBeNull();
    
    // The first item (Apple) should not have the purchased class
    expect(items[0].querySelector('.text-decoration-line-through')).toBeNull();
  });
});
