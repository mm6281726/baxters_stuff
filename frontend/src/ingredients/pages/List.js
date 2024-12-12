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
            },
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/ingredients/")
            .then(
                (res) => this.setState({ ingredients: res.data }),
            )
            .catch((err) => console.log(err));
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal });
    };

    handleSubmit = (item) => {
        this.toggle();

        if (item.id) {
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
        const item = { name: "", description: "" };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    renderItems = () => {
        const ingredients = this.state.ingredients;
        if(!ingredients){
            return;
        }

        return ingredients.map((item) => (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
            >
                <span
                    className="ingredients-title"
                    title={item.description}
                >
                    {item.title}
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
        ));
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