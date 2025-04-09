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
import IngredientSelect from "../../groceryList/components/IngredientSelect";
import "../pages/List.css";

const PantryItemModal = ({ activeItem: initialItem, toggle, onSave }) => {
  const [activeItem, setActiveItem] = useState(initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveItem(initialItem);
  }, [initialItem]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const updatedItem = { ...activeItem };

    if (name === "quantity") {
      // If no unit is assigned, convert quantity to integer
      if (!updatedItem.unit) {
        value = parseInt(value) || 1; // Default to 1 if parsing fails
      } else {
        // Otherwise, allow decimal values
        value = parseFloat(value) || 1; // Default to 1 if parsing fails
      }
    } else if (name === "unit") {
      // If unit is being cleared and we have a decimal quantity, convert to integer
      if (!value && updatedItem.quantity && !Number.isInteger(updatedItem.quantity)) {
        updatedItem.quantity = Math.round(updatedItem.quantity);
      }
    }

    updatedItem[name] = value;
    setActiveItem(updatedItem);
  };

  const handleIngredientChange = (selectedIngredient) => {
    if (selectedIngredient) {
      setActiveItem({
        ...activeItem,
        ingredient: selectedIngredient.value,
        ingredient_details: { id: selectedIngredient.value, name: selectedIngredient.label }
      });
      setError(""); // Clear any error when an ingredient is selected
    } else {
      setActiveItem({
        ...activeItem,
        ingredient: null,
        ingredient_details: null
      });
    }
  };

  const handleSubmit = () => {
    if (!activeItem.ingredient) {
      setError("Please select an ingredient");
      return;
    }
    onSave(activeItem);
  };

  const commonUnits = [
    "g", "kg", "oz", "lb", "ml", "l", "tsp", "tbsp", "cup", "pint", "quart", "gallon"
  ];

  return (
    <Modal isOpen={true} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="bg-light">
        <span className="fw-bold">{activeItem.id ? 'Edit' : 'Add'} Pantry Item</span>
      </ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form>
          <FormGroup className="mb-3">
            <Label for="item-ingredient" className="fw-bold">Ingredient *</Label>
            <IngredientSelect
              selectedIngredient={activeItem.ingredient_details ? {
                value: activeItem.ingredient_details.id,
                label: activeItem.ingredient_details.name
              } : null}
              onChange={handleIngredientChange}
            />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="item-quantity" className="fw-bold">Quantity</Label>
                <Input
                  type="number"
                  id="item-quantity"
                  name="quantity"
                  value={activeItem.quantity || ""}
                  onChange={handleChange}
                  min="0.01"
                  step={activeItem.unit ? "0.01" : "1"}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="item-unit" className="fw-bold">Unit</Label>
                <Input
                  type="select"
                  id="item-unit"
                  name="unit"
                  value={activeItem.unit || ""}
                  onChange={handleChange}
                >
                  <option value="">No Unit</option>
                  {commonUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup className="mb-3">
            <Label for="item-notes" className="fw-bold">Notes</Label>
            <Input
              type="textarea"
              id="item-notes"
              name="notes"
              value={activeItem.notes || ""}
              onChange={handleChange}
              placeholder="Add any notes about this item"
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
          color="success"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PantryItemModal;
