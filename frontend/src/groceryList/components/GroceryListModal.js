import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
  Alert
} from "reactstrap";
import "../pages/List.css";

const GroceryListModal = ({ activeItem: initialItem, toggle, onSave }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveItem(initialItem);
  }, [initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (e.target.type === "checkbox") {
      setActiveItem({
        ...activeItem,
        [name]: e.target.checked
      });
    } else {
      setActiveItem({
        ...activeItem,
        [name]: value
      });
    }
  };

  const handleSubmit = () => {
    if (!activeItem.title.trim()) {
      setError("Please enter a title for the grocery list");
      return;
    }
    onSave(activeItem);
  };

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Grocery List</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="grocery-title" className="fw-bold">Title *</Label>
            <Input
              type="text"
              id="grocery-title"
              name="title"
              value={activeItem.title}
              onChange={handleChange}
              placeholder="Enter Grocery List Title"
              className="form-control-lg"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="grocery-description" className="fw-bold">Description</Label>
            <Input
              type="textarea"
              id="grocery-description"
              name="description"
              value={activeItem.description || ""}
              onChange={handleChange}
              placeholder="Enter Grocery List Description"
              rows="3"
            />
          </FormGroup>
          <FormGroup check className="mb-3">
            <div className="form-check form-switch">
              <Input
                type="checkbox"
                className="form-check-input"
                id="grocery-completed"
                name="completed"
                checked={activeItem.completed}
                onChange={handleChange}
              />
              <Label check for="grocery-completed" className="form-check-label">
                Completed
              </Label>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="bg-light">
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default GroceryListModal;
