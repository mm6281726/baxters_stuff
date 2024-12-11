import React, { Component } from "react";
import Modal from "../components/Modal"

import axios from "axios";

class GroceryList extends Component {
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
        this.setState({ activeItem: item, modal: !this.state.modal });
    };

    displayCompleted = (status) => {
        if (status) {
            return this.setState({ viewCompleted: true });
        }

        return this.setState({ viewCompleted: false });
    };

    renderTabList = () => {
        return (
            <div className="nav nav-tabs">
                <span
                    className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
                    onClick={() => this.displayCompleted(true)}
                >
                    Complete
                </span>
                <span
                    className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => this.displayCompleted(false)}
                >
                    Incomplete
                </span>
            </div>
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
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
                <span
                    className={`grocerylist-title mr-2 ${this.state.viewCompleted ? "completed-grocerylist" : ""
                        }`}
                    title={item.description}
                >
                    {item.title}
                </span>
                <span>
                    <button
                        className="btn btn-secondary mr-2"
                        onClick={() => this.editItem(item)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => this.handleDelete(item)}
                    >
                        Delete
                    </button>
                </span>
            </li>
        ));
    };

    render(){
        return (
            <div>
                <h1 className="text-uppercase text-center my-4">Grocery List</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="mb-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={this.createItem}
                                >
                                    Add List
                                </button>
                            </div>
                            {this.renderTabList()}
                            <ul className="list-group list-group-flush border-top-0">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
    
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

export default GroceryList