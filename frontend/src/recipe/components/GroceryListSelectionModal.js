import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroceryListSelectionModal = ({ isOpen, toggle, onSelect }) => {
  const [groceryLists, setGroceryLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedListId, setSelectedListId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroceryLists();
  }, []);

  const fetchGroceryLists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/grocerylist/');
      // Filter to only show incomplete grocery lists
      const incompleteLists = response.data.filter(list => !list.completed);
      setGroceryLists(incompleteLists);
      setError('');
    } catch (err) {
      console.error('Error fetching grocery lists:', err);
      setError('Failed to load grocery lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (listId) => {
    setSelectedListId(listId);
  };

  const handleConfirm = () => {
    if (selectedListId) {
      onSelect(selectedListId);
    } else {
      setError('Please select a grocery list');
    }
  };

  const createNewList = async () => {
    try {
      setLoading(true);

      // Get current date in MM/dd/yyyy format
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const formattedDate = `${month}/${day}/${year}`;

      // Create a new grocery list with default values
      const newList = {
        title: `Grocery List ${formattedDate}`,
        description: '',
        completed: false
      };

      const response = await axios.post('/api/grocerylist/', newList);

      // Close the modal
      toggle();

      // Add recipe items to the new grocery list
      onSelect(response.data.id);

      // Navigate to the new grocery list
      navigate(`/grocerylist/${response.data.id}/items`);

    } catch (err) {
      console.error('Error creating grocery list:', err);
      setError('Failed to create grocery list. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">Select Grocery List</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}

        <p>Select a grocery list to add the recipe ingredients to:</p>

        {loading ? (
          <div className="text-center my-4">
            <Spinner color="primary" />
            <p className="mt-2">Loading grocery lists...</p>
          </div>
        ) : groceryLists.length === 0 ? (
          <div className="text-center my-4">
            <p>No incomplete grocery lists found.</p>
          </div>
        ) : (
          <ListGroup className="mb-4">
            {groceryLists.map(list => (
              <ListGroupItem
                key={list.id}
                action
                active={selectedListId === list.id}
                onClick={() => handleSelect(list.id)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-bold">{list.title}</div>
                  {list.description && <div className="text-muted small">{list.description}</div>}
                </div>
                <div className="text-muted small">
                  {list.item_count} items ({list.purchased_count} purchased)
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}

        <div className="text-center">
          <p className="text-muted">- OR -</p>
          <Button
            color="success"
            onClick={createNewList}
            disabled={loading}
          >
            Create New Grocery List
          </Button>
        </div>
      </ModalBody>
      <ModalFooter className="bg-light">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleConfirm}
          disabled={!selectedListId || loading}
        >
          Add to Selected List
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GroceryListSelectionModal;
