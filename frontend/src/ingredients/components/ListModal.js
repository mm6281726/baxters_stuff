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

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: this.props.activeItem,
    };
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  render() {
    const { toggle, onSave } = this.props;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Ingredient</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="ingredient-name">Name</Label>
              <Input
                type="text"
                id="ingredient-name"
                name="name"
                value={this.state.activeItem.name}
                onChange={this.handleChange}
                placeholder="Enter Ingredient Name"
              />
            </FormGroup>
            <FormGroup>
              <Label for="ingredient-description">Description</Label>
              <Input
                type="text"
                id="ingredient-description"
                name="description"
                value={this.state.activeItem.description}
                onChange={this.handleChange}
                placeholder="Enter Ingredient Description"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}