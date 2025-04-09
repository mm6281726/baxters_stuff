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
  Row,
  Col,
  Alert
} from "reactstrap";
import "../pages/List.css";

const RecipeModal = ({ activeItem: initialItem, toggle, onSave }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveItem(initialItem);
  }, [initialItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'prep_time' || name === 'cook_time' || name === 'servings') {
      const numValue = value === '' ? '' : parseInt(value);
      setActiveItem({
        ...activeItem,
        [name]: numValue
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
      setError("Please enter a title for the recipe");
      return;
    }
    onSave(activeItem);
  };

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Recipe</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="recipe-title" className="fw-bold">Title *</Label>
            <Input
              type="text"
              id="recipe-title"
              name="title"
              value={activeItem.title}
              onChange={handleChange}
              placeholder="Enter Recipe Title"
              className="form-control-lg"
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="recipe-description" className="fw-bold">Description</Label>
            <Input
              type="textarea"
              id="recipe-description"
              name="description"
              value={activeItem.description || ""}
              onChange={handleChange}
              placeholder="Enter Recipe Description"
              rows="3"
            />
          </FormGroup>
          <Row>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Label for="recipe-prep-time" className="fw-bold">Prep Time (minutes)</Label>
                <Input
                  type="number"
                  id="recipe-prep-time"
                  name="prep_time"
                  value={activeItem.prep_time || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Label for="recipe-cook-time" className="fw-bold">Cook Time (minutes)</Label>
                <Input
                  type="number"
                  id="recipe-cook-time"
                  name="cook_time"
                  value={activeItem.cook_time || ""}
                  onChange={handleChange}
                  min="0"
                />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup className="mb-3">
                <Label for="recipe-servings" className="fw-bold">Servings</Label>
                <Input
                  type="number"
                  id="recipe-servings"
                  name="servings"
                  value={activeItem.servings || ""}
                  onChange={handleChange}
                  min="1"
                />
              </FormGroup>
            </Col>
          </Row>
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

export default RecipeModal;
