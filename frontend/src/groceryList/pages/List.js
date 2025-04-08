import React, { Component } from "react";
import { Button, Card, ListGroup, ListGroupItem, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import './List.css';

import Modal from "../components/ListModal"

import axios from "axios";

// Wrapper function to use hooks with class component
function withRouter(Component) {
  return props => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }
}

class GroceryLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewCompleted: false,
            groceryList: [],
            modal: false,
            activeItem: {
                title: "",
                description: "",
                completed: false,
            },
        };
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/grocerylist/")
            .then(
                (res) => this.setState({ groceryList: res.data }),
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
                .put(`/api/grocerylist/${item.id}/`, item)
                .then((res) => this.refreshList());
        } else {
            axios
                .post("/api/grocerylist/", item)
                .then((res) => this.refreshList());
        }
    };

    handleDelete = (item) => {
        axios
            .delete(`/api/grocerylist/${item.id}/`)
            .then((res) => this.refreshList());
    };

    createItem = () => {
        const item = { title: "", description: "", completed: false };

        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    editItem = (item) => {
        // Navigate to the items page for this grocery list
        this.props.navigate(`/grocerylist/${item.id}/items`);
    };

    displayCompleted = (status) => {
        if (status) {
            return this.setState({ viewCompleted: true });
        }

        return this.setState({ viewCompleted: false });
    };

    renderTabList = () => {
        return (
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.viewCompleted})}
                        onClick={() => this.displayCompleted(true)}
                        href="#"
                        style={{ cursor: 'pointer' }}
                    >
                        Complete
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: !this.state.viewCompleted})}
                        onClick={() => this.displayCompleted(false)}
                        href="#"
                        style={{ cursor: 'pointer' }}
                    >
                        Incomplete
                    </NavLink>
                </NavItem>
            </Nav>
        );
    };

    renderItems = () => {
        const { viewCompleted } = this.state;

        const groceryList = this.state.groceryList;
        if(!groceryList){
            return;
        }

        const newItems = groceryList.filter(
            (item) => item.completed === viewCompleted
        );

        return newItems.map((item) => (
            <ListGroupItem
                key={item.id}
                className="d-flex justify-content-between align-items-center"
            >
                <span
                    className={`
                        grocerylist-title
                        ${this.state.viewCompleted ? "completed-grocerylist" : ""}
                    `}
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
                <h1 className="text-center my-4">Grocery Lists</h1>
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
                                    Add List
                                </Button>
                            </div>
                            {this.renderTabList()}
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

export default withRouter(GroceryLists)