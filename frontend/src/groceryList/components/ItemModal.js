import React, { Component } from "react";
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
} from "reactstrap";
import IngredientSelect from "./IngredientSelect";

export default class ItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    const activeItem = { ...this.state.activeItem };

    if (e.target.type === "checkbox") {
      value = e.target.checked;
    } else if (name === "quantity") {
      // If no unit is assigned, convert quantity to integer
      if (!activeItem.unit) {
        value = parseInt(value) || 1; // Default to 1 if parsing fails
      } else {
        // Otherwise, allow decimal values
        value = parseFloat(value) || 1; // Default to 1 if parsing fails
      }
    } else if (name === "unit") {
      // If unit is being cleared and we have a decimal quantity, convert to integer
      if (!value && activeItem.quantity && !Number.isInteger(activeItem.quantity)) {
        activeItem.quantity = Math.round(activeItem.quantity);
      }
    }

    activeItem[name] = value;
    this.setState({ activeItem });
  };

  handleIngredientChange = (selectedIngredient) => {
    if (selectedIngredient) {
      const activeItem = {
        ...this.state.activeItem,
        ingredient: selectedIngredient.value,
        ingredient_details: { id: selectedIngredient.value, name: selectedIngredient.label }
      };
      this.setState({ activeItem });
    } else {
      const activeItem = {
        ...this.state.activeItem,
        ingredient: null,
        ingredient_details: null
      };
      this.setState({ activeItem });
    }
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Grocery List Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="item-ingredient">Ingredient</Label>
              <IngredientSelect
                selectedIngredient={this.state.activeItem.ingredient_details ? {
                  value: this.state.activeItem.ingredient_details.id,
                  label: this.state.activeItem.ingredient_details.name
                } : null}
                onChange={this.handleIngredientChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item-quantity">Quantity</Label>
              <Input
                type="number"
                id="item-quantity"
                name="quantity"
                value={this.state.activeItem.quantity}
                onChange={this.handleChange}
                min="1"
                step={this.state.activeItem.unit ? "0.01" : "1"}
              />
            </FormGroup>
            <FormGroup>
              <Label for="item-unit">Unit</Label>
              <Input
                type="text"
                id="item-unit"
                name="unit"
                value={this.state.activeItem.unit || ""}
                onChange={this.handleChange}
                placeholder="e.g., kg, g, lbs, cups, etc."
              />
            </FormGroup>
            <FormGroup>
              <Label for="item-notes">Notes</Label>
              <Input
                type="textarea"
                id="item-notes"
                name="notes"
                value={this.state.activeItem.notes || ""}
                onChange={this.handleChange}
                placeholder="Add any notes about this item"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="purchased"
                  checked={this.state.activeItem.purchased}
                  onChange={this.handleChange}
                />
                Purchased
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
            disabled={!this.state.activeItem.ingredient}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
