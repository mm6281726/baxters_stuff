import React, { Component } from "react";
import { Label, } from "reactstrap";
import CreatableSelect from 'react-select/creatable';

import axios from "axios";

export default class CategorySelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selected_categories: this.props.selected_categories,
            onLoad: true,
        };
    }

    createPreselectedValues = (categories) => {
        let selected_categories = categories.filter( (category) =>
            this.state.selected_categories.includes(category.value)
        )

        this.setState({ selected_categories: selected_categories })
    }

    componentDidMount() {
        this.refreshList();
    }

    refreshList = () => {
        axios
            .get("/api/ingredients/categories/")
            .then((res) => {
                let categories = this.createOptions(res.data)
                this.setState({ categories: categories})
                if(this.state.onLoad){
                    // this.createPreselectedValues(categories);
                    this.setState({ onLoad: false });
                }
            })
            .catch((err) => console.log(err));
    };

    createOptions = (categories) => {
        if(categories === undefined){
            return
        }
        return categories.map(category => ({ label: category.name, value: category.id }));
    }

    createCategory = (category) => {
        axios
            .post("/api/ingredients/categories/", {'name': category})
            .then((res) => {
                let data = res.data;
                this.refreshList();

                let category = { label: data.name, value: data.id };
                this.selectNewCategory(category)
            })
            .catch((err) => console.log(err));
    };

    selectNewCategory = (category) => {
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