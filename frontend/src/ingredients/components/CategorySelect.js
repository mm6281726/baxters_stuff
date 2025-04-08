import React, { useState, useEffect } from "react";
import { Label } from "reactstrap";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";

const CategorySelect = ({ selected_categories, updateParentState }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        refreshList();
        createPreselectedValues();
    }, []);

    // Update selected categories when props change
    useEffect(() => {
        createPreselectedValues();
    }, [selected_categories]);

    const refreshList = async () => {
        try {
            const res = await axios.get("/api/ingredients/categories/");
            const formattedCategories = createOptions(res.data);
            setCategories(formattedCategories);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const createPreselectedValues = () => {
        console.log('Creating preselected values from:', selected_categories);
        const formattedCategories = createOptions(selected_categories);
        console.log('Formatted preselected categories:', formattedCategories);
        setSelectedCategories(formattedCategories || []);
    };

    const createOptions = (categories) => {
        if (!categories) {
            return [];
        }

        return categories.map(category => {
            // Handle different possible formats of category objects
            if (category.label && category.value) {
                // Already in the correct format
                return category;
            } else if (category.name && category.id) {
                // Standard API format
                return {
                    label: category.name,
                    value: category.id
                };
            } else if (typeof category === 'object') {
                // Try to extract name/id or label/value
                const label = category.name || category.label || 'Unknown';
                const value = category.id || category.value || 0;
                console.log(`Extracted category: label=${label}, value=${value}`);
                return { label, value };
            } else {
                console.error('Invalid category format:', category);
                return null;
            }
        }).filter(Boolean); // Remove any null entries
    };

    const createCategory = async (categoryName) => {
        try {
            const res = await axios.post("/api/ingredients/categories/", {'name': categoryName});
            selectNewCategory(res);
        } catch (err) {
            console.error("Error creating category:", err);
        }
    };

    const selectNewCategory = (res) => {
        const category = { label: res.data.name, value: res.data.id };
        const updatedCategories = [...selectedCategories, category];
        setSelectedCategories(updatedCategories);
        updateParentState(updatedCategories);
    };

    const handleChange = (categories) => {
        console.log('Categories changed in CategorySelect:', categories);

        // Ensure categories are in the correct format
        const validCategories = categories || [];

        // Verify each category has label and value
        validCategories.forEach((cat, index) => {
            if (!cat.label || !cat.value) {
                console.error(`Category at index ${index} is missing label or value:`, cat);
            }
        });

        console.log('Setting selected categories to:', validCategories);
        setSelectedCategories(validCategories);
        updateParentState(validCategories);
    };

    return (
        <div>
            <Label for="ingredient-categories" className="fw-bold">Categories</Label>
            <CreatableSelect
                id="ingredient-categories"
                name="categories"
                options={categories}
                value={selectedCategories}
                isMulti
                placeholder="Select or create categories..."
                onChange={handleChange}
                onCreateOption={createCategory}
                classNamePrefix="react-select"
                isClearable
                noOptionsMessage={() => "No categories found"}
                formatCreateLabel={(inputValue) => `Create category "${inputValue}"`}
                // Ensure the component displays the category names
                getOptionLabel={(option) => option.label}
                getOptionValue={(option) => option.value}
            />
            <small className="text-muted">You can create new categories by typing and pressing enter</small>
        </div>
    );
};

export default CategorySelect;