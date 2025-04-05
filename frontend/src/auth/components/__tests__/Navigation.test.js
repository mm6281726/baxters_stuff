import React from 'react';
import { render, screen } from '@testing-library/react';
import { Navigation } from '../Navigation';

// Mock the required modules
jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/ingredients' }),
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  )
}));

jest.mock('../../hooks/AuthProvider', () => ({
  useAuth: () => ({
    logOut: jest.fn()
  })
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Navigation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });
  
  test('renders navigation links when authenticated', () => {
    // Set up localStorage to simulate authenticated user
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    render(<Navigation />);
    
    // Check that the navigation links are rendered
    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Login and Register should not be rendered when authenticated
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
  });
  
  test('renders login and register links when not authenticated', () => {
    // Set up localStorage to simulate unauthenticated user
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<Navigation />);
    
    // Check that login and register links are rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    
    // Navigation links should not be rendered when not authenticated
    expect(screen.queryByText('Grocery List')).not.toBeInTheDocument();
    expect(screen.queryByText('Ingredients')).not.toBeInTheDocument();
    expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });
  
  test('highlights the active tab', () => {
    // Set up localStorage to simulate authenticated user
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    render(<Navigation />);
    
    // Get all navigation links
    const groceryListLink = screen.getByText('Grocery List').closest('a');
    const ingredientsLink = screen.getByText('Ingredients').closest('a');
    const categoriesLink = screen.getByText('Categories').closest('a');
    
    // Check that the Ingredients link has the active class
    expect(ingredientsLink.className).toContain('active');
    
    // Check that the other links don't have the active class
    expect(groceryListLink.className).not.toContain('active');
    expect(categoriesLink.className).not.toContain('active');
  });
});
