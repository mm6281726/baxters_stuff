import React, { Component } from "react";
import CategorySelect from "./CategorySelect";
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
      categoryIds: []
    };
    this.handleCategoriesChange = this.handleCategoriesChange.bind(this);
  }

  componentDidMount = () => {
    this.createCategoryIds();
  }

  createCategoryIds = () => {
    let categoryIds = this.state.activeItem.categories.map(category => (category.id));
    this.setState({ categoryIds });
  }

  handleChange = (e) => {
    let { name, value } = e.target;

    const activeItem = { ...this.state.activeItem, [name]: value };

    this.setState({ activeItem });
  };

  handleCategoriesChange = (categories) => {
    const activeItem = { ...this.state.activeItem, ['categories']: categories };
    this.setState({ activeItem });
    
    const categoryIds = categories.map(category => (category.value));
    this.setState({ categoryIds })
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
            <FormGroup>
              <CategorySelect 
                selected_categories={this.state.activeItem.categories}
                updateParentState={this.handleCategoriesChange.bind(this)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(this.state.activeItem, this.state.categoryIds)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}