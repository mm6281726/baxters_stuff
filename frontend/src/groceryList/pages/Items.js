import React, { Component } from "react";
import { Button, Card, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

import ItemModal from "../components/ItemModal";

// Wrapper function to use hooks with class component
function withRouter(Component) {
  return props => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  }
}

class GroceryListItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groceryListId: this.props.params.id,
            groceryList: null,
            items: [],
            modal: false,
            activeItem: {
                grocery_list: this.props.params.id,
                ingredient: null,
                ingredient_details: null,
                quantity: 1,
                unit: "",
                purchased: false,
                notes: ""
            },
        };
    }

    componentDidMount() {
        this.fetchGroceryList();
        this.refreshList();
    }

    fetchGroceryList = () => {
        axios
            .get(`/api/grocerylist/${this.state.groceryListId}/`)
            .then((res) => this.setState({ groceryList: res.data }))
            .catch((err) => {
                console.log(err);
                this.props.navigate('/');
            });
    };

    refreshList = () => {
        axios
            .get(`/api/grocerylist/${this.state.groceryListId}/items/`)
            .then((res) => this.setState({ items: res.data }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();

        if (item.id) {
            axios
                .put(`/api/grocerylist/items/${item.id}/`, item)
                .then((res) => this.refreshList());
        } else {
            axios
                .post(`/api/grocerylist/${this.state.groceryListId}/items/`, item)
                .then((res) => this.refreshList());
        }
    };

    handleDelete = (item) => {
        axios
            .delete(`/api/grocerylist/items/${item.id}/`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = {
            grocery_list: this.state.groceryListId,
            ingredient: null,
            ingredient_details: null,
            quantity: 1,
            unit: "",
            purchased: false,
            notes: ""
        };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    togglePurchased = (item) => {
        const updatedItem = { ...item, purchased: !item.purchased };
        axios
            .put(`/api/grocerylist/items/${item.id}/`, updatedItem)
            .then((res) => this.refreshList());
    };

    goBack = () => {
        this.props.navigate('/');
    };

    // Group items by category
    groupItemsByCategory = () => {
        const items = this.state.items;
        if (!items || items.length === 0) {
            return {};
        }

        // Create a map of categories with their items
        const categoryMap = {};

        // Add "Uncategorized" group for items without categories
        categoryMap["Uncategorized"] = [];

        // Group items by category
        items.forEach(item => {
            const categories = item.ingredient_details?.categories || [];

            if (categories.length === 0) {
                categoryMap["Uncategorized"].push(item);
            } else {
                // Add the item to each of its categories
                categories.forEach(category => {
                    if (!categoryMap[category.name]) {
                        categoryMap[category.name] = [];
                    }
                    categoryMap[category.name].push(item);
                });
            }
        });

        // Remove empty categories
        if (categoryMap["Uncategorized"].length === 0) {
            delete categoryMap["Uncategorized"];
        }

        return categoryMap;
    };

    renderGroceryItem = (item) => {
        return (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
            >
                <div className="d-flex align-items-center">
                    <input
                        type="checkbox"
                        checked={item.purchased}
                        onChange={() => this.togglePurchased(item)}
                        className="me-3"
                    />
                    <span
                        className={`grocery-item-title ${item.purchased ? "text-decoration-line-through text-muted" : ""}`}
                        title={item.notes}
                    >
                        {item.unit ? item.quantity : Math.round(item.quantity)} {item.unit} {item.ingredient_details?.name}
                    </span>
                </div>
                <span>
                    <Button
                        color="secondary"
                        onClick={() => this.editItem(item)}
                        size="sm"
                    >
                        Edit
                    </Button>
                    {" "}
                    <Button
                        color="danger"
                        onClick={() => this.handleDelete(item)}
                        size="sm"
                    >
                        Delete
                    </Button>
                </span>
            </ListGroupItem>
        );
    };

    renderItems = () => {
        const items = this.state.items;
        if (!items || items.length === 0) {
            return (
                <ListGroupItem className="text-center">
                    No items in this grocery list. Add some items!
                </ListGroupItem>
            );
        }

        const groupedItems = this.groupItemsByCategory();
        const categoryNames = Object.keys(groupedItems).sort();

        if (categoryNames.length === 0) {
            return <div className="text-center">No items found</div>;
        }

        return categoryNames.map(categoryName => {
            // Sort items alphabetically within each category (already sorted from backend)
            const categoryItems = groupedItems[categoryName];

            return (
                <div key={categoryName} className="mb-4">
                    <h5 className="category-header bg-light p-2 rounded">{categoryName}</h5>
                    <ListGroup className="mb-3">
                        {categoryItems.map(item => this.renderGroceryItem(item))}
                    </ListGroup>
                </div>
            );
        });
    };

    render() {
        const { groceryList } = this.state;

        if (!groceryList) {
            return <div className="text-center mt-5">Loading...</div>;
        }

        return (
            <div>
                <h1 className="text-uppercase text-center my-4">
                    {groceryList.title} - Items
                </h1>
                <Row>
                    <Col
                        md="8"
                        sm="10"
                        className="mx-auto p-0"
                    >
                        <Card className="p-3">
                            <div className="mb-4 d-flex justify-content-between">
                                <Button
                                    color="secondary"
                                    onClick={this.goBack}
                                >
                                    Back to Lists
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={this.createItem}
                                >
                                    Add Item
                                </Button>
                            </div>
                            <ListGroup flush className="border-top-0">
                                {this.renderItems()}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

                {this.state.modal ? (
                    <ItemModal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </div>
        );
    }
}

export default withRouter(GroceryListItems);
