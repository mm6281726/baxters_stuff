import React, { Component } from "react";
import { Button, Card, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';

import Modal from "../components/ListModal"

import axios from "axios";

class Ingredients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
            modal: false,
            activeItem: {
                name: "",
                description: "",
                categories: [],
            },
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/ingredients/")
            .then((res) => this.setState({ ingredients: res.data }))
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item, categoryIds) => {
        this.toggle();

        if (item.id) {
            console.log(item)
            item.categories = categoryIds
            console.log(item)
            axios
                .put(`/api/ingredients/${item.id}/`, item)
                .then((res) => this.refreshList());
        } else {
            axios
                .post("/api/ingredients/", item)
                .then((res) => this.refreshList());
        }
    };

    handleDelete = (item) => {
        axios
            .delete(`/api/ingredients/${item.id}/`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = { name: "", description: "", categories: [] };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    // Group ingredients by category
    groupIngredientsByCategory = () => {
        const ingredients = this.state.ingredients;
        if (!ingredients || ingredients.length === 0) {
            return {};
        }

        // Create a map of categories with their ingredients
        const categoryMap = {};

        // Add "Uncategorized" group for ingredients without categories
        categoryMap["Uncategorized"] = [];

        // Group ingredients by category
        ingredients.forEach(ingredient => {
            if (ingredient.categories.length === 0) {
                categoryMap["Uncategorized"].push(ingredient);
            } else {
                ingredient.categories.forEach(category => {
                    if (!categoryMap[category.name]) {
                        categoryMap[category.name] = [];
                    }
                    categoryMap[category.name].push(ingredient);
                });
            }
        });

        // Remove empty categories
        if (categoryMap["Uncategorized"].length === 0) {
            delete categoryMap["Uncategorized"];
        }

        return categoryMap;
    };

    renderIngredientItem = (item) => {
        return (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
            >
                <span
                    className="ingredients-title"
                    title={item.description}
                >
                    {item.name}
                </span>
                <span>
                    <Button
                        color="secondary"
                        onClick={() => this.editItem(item)}
                    >
                        Edit
                    </Button>
                    {" "}
                    <Button
                        color="danger"
                        onClick={() => this.handleDelete(item)}
                    >
                        Delete
                    </Button>
                </span>
            </ListGroupItem>
        );
    };

    renderItems = () => {
        const groupedIngredients = this.groupIngredientsByCategory();
        const categoryNames = Object.keys(groupedIngredients).sort();

        if (categoryNames.length === 0) {
            return <div className="text-center">No ingredients found</div>;
        }

        return categoryNames.map(categoryName => {
            // Sort ingredients alphabetically within each category
            const sortedIngredients = [...groupedIngredients[categoryName]].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            );

            return (
                <div key={categoryName} className="mb-4">
                    <h5 className="category-header bg-light p-2 rounded">{categoryName}</h5>
                    <ListGroup className="mb-3">
                        {sortedIngredients.map(item => this.renderIngredientItem(item))}
                    </ListGroup>
                </div>
            );
        });
    };

    render(){
        return (
            <div>
                <h1 className="text-uppercase text-center my-4">Ingredients</h1>
                <Row>
                    <Col
                        md="6"
                        sm="10"
                        className="mx-auto p-0"
                    >
                        <Card className="p-3">
                            <div className="mb-4">
                                <Button
                                    color="primary"
                                    onClick={this.createItem}
                                >
                                    Add Ingredient
                                </Button>
                            </div>
                            <ListGroup flush className="border-top-0">
                                {this.renderItems()}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>

                {this.state.modal ? (
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />
                ) : null}
            </div>
        );
    }
}

export default Ingredients