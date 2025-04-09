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
import CategorySelect from "./CategorySelect";
import "../pages/List.css";

const IngredientModal = ({ activeItem: initialItem, toggle, onSave, onDelete }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [categoryIds, setCategoryIds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveItem(initialItem);
    if (initialItem.categories) {
      setCategoryIds(initialItem.categories.map(category => category.id));
    }
  }, [initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActiveItem({
      ...activeItem,
      [name]: value
    });
  };

  const handleCategoriesChange = (categories) => {
    setActiveItem({
      ...activeItem,
      categories: categories
    });

    const ids = categories ? categories.map(category => category.value) : [];
    setCategoryIds(ids);
  };

  const handleSubmit = () => {
    if (!activeItem.name.trim()) {
      setError("Please enter an ingredient name");
      return;
    }
    onSave(activeItem, categoryIds);
  };

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Ingredient</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="ingredient-name" className="fw-bold">Name *</Label>
            <Input
              type="text"
              id="ingredient-name"
              name="name"
              value={activeItem.name}
              onChange={handleChange}
              placeholder="Enter Ingredient Name"
              className="form-control-lg"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="ingredient-description" className="fw-bold">Description</Label>
            <Input
              type="textarea"
              id="ingredient-description"
              name="description"
              value={activeItem.description || ""}
              onChange={handleChange}
              placeholder="Enter Ingredient Description"
              rows="3"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <CategorySelect
              selected_categories={activeItem.categories}
              updateParentState={handleCategoriesChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter className="bg-light d-flex justify-content-between">
        <div>
          {activeItem.id && (
            <Button
              color="danger"
              onClick={() => {
                toggle();
                onDelete(activeItem);
              }}
            >
              Delete
            </Button>
          )}
        </div>
        <div>
          <Button color="secondary" onClick={toggle} className="me-2">
            Cancel
          </Button>
          <Button
            color="success"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default IngredientModal;
