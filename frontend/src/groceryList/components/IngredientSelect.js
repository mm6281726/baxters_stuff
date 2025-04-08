import React, { Component } from "react";
import Select from 'react-select';
import axios from "axios";

export default class IngredientSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
            isLoading: false
        };
    }

    componentDidMount() {
        this.fetchIngredients();
    }

    fetchIngredients = () => {
        this.setState({ isLoading: true });
        axios
            .get("/api/ingredients/")
            .then((res) => {
                // Sort ingredients alphabetically by name
                const sortedData = [...res.data].sort((a, b) =>
                    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                );

                const ingredients = sortedData.map(ingredient => ({
                    value: ingredient.id,
                    label: ingredient.name
                }));

                this.setState({ ingredients, isLoading: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ isLoading: false });
            });
    };

    render() {
        const { selectedIngredient, onChange } = this.props;
        const { ingredients, isLoading } = this.state;

        return (
            <Select
                id="ingredient-select"
                options={ingredients}
                value={selectedIngredient}
                onChange={onChange}
                isLoading={isLoading}
                isClearable
                placeholder="Select an ingredient..."
                noOptionsMessage={() => "No ingredients found"}
            />
        );
    }
}
