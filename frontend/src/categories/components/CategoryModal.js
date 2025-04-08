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

const CategoryModal = ({ activeItem: initialItem, toggle, onSave }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveItem(initialItem);
  }, [initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActiveItem({
      ...activeItem,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (!activeItem.name.trim()) {
      setError("Please enter a category name");
      return;
    }
    onSave(activeItem);
  };

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Category</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="category-name" className="fw-bold">Name *</Label>
            <Input
              type="text"
              id="category-name"
              name="name"
              value={activeItem.name}
              onChange={handleChange}
              placeholder="Enter Category Name"
              className="form-control-lg"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="category-description" className="fw-bold">Description</Label>
            <Input
              type="textarea"
              id="category-description"
              name="description"
              value={activeItem.description || ""}
              onChange={handleChange}
              placeholder="Enter Category Description"
              rows="3"
            />
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

export default CategoryModal;
