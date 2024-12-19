import React, { Component } from "react";
import { Label, } from "reactstrap";
import CreatableSelect from 'react-select/creatable';

import axios from "axios";

export default class CategorySelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selected_categories: [],
        };
    }

    componentDidMount() {
        this.refreshList();
        this.createPreselectedValues();
    }

    refreshList = () => {
        axios
            .get("/api/ingredients/categories/")
            .then((res) => {
                let categories = this.createOptions(res.data)
                this.setState({ categories: categories})
            })
            .catch((err) => console.log(err));
    };
    
    createPreselectedValues = () => {
        let selected_categories = this.createOptions(this.props.selected_categories)
        this.setState({ selected_categories: selected_categories })
    }

    createOptions = (categories) => {
        if(categories === undefined){
            return
        }
        return categories.map(category => ({ label: category.name, value: category.id }));
    }

    createCategory = (category) => {
        axios
            .post("/api/ingredients/categories/", {'name': category})
            .then((res) => { this.selectNewCategory(res) })
            .catch((err) => console.log(err));
    };

    selectNewCategory = (res) => {
        let category = { label: res.data.name, value: res.data.id };
        this.setState({ selected_categories: [...this.state.selected_categories, category] });
    }


    render() {
        return (
            <div>
                <Label for="ingredient-categories">Categories</Label>
                <CreatableSelect 
                    id="ingredient-categories"
                    name="categories"
                    options={this.state.categories}
                    value={this.state.selected_categories}
                    isMulti
                    placeholder="Select categories..."
                    onChange={(categories) => {
                        this.setState({ selected_categories: categories });
                        this.props.updateParentState(categories);
                    }}
                    onCreateOption={this.createCategory}
                />
            </div>
        );
    }
}