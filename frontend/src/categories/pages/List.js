import React, { Component } from "react";
import { Button, Card, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';

import Modal from "../components/ListModal"

import axios from "axios";

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
            },
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/ingredients/categories/")
            .then(
                (res) => this.setState({ categoryList: res.data }),
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
                .put(`/api/ingredients/categories/${item.id}/`, item)
                .then((res) => this.refreshList());
        } else {
            axios
                .post("/api/ingredients/categories/", item)
                .then((res) => this.refreshList());
        }
    };

    handleDelete = (item) => {
        axios
            .delete(`/api/ingredients/categories/${item.id}/`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = { title: "", description: "", };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    renderItems = () => {
        const categoryList = this.state.categoryList;
        if(!categoryList){
            return;
        }

        return categoryList.map((item) => (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
            >
                <span
                    className={`
                        categories-title
                    `}
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
        ));
    };

    render(){
        return (
            <div>
                <h1 className="text-uppercase text-center my-4">Categories</h1>
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
                                    Add Category
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

export default Categories