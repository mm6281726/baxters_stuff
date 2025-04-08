import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Row, Col, Spinner, Alert } from 'reactstrap';
import axios from "axios";

import IngredientModal from "../components/IngredientModal";
import IngredientItem from "../components/IngredientItem";
import CategoryGroup from "../components/CategoryGroup";
import IngredientSearch from "../components/IngredientSearch";
import IngredientActions from "../components/IngredientActions";
import "./List.css";

const Ingredients = () => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("category");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [activeItem, setActiveItem] = useState({
        name: "",
        description: "",
        categories: [],
    });

    // Fetch ingredients and categories on component mount
    useEffect(() => {
        refreshList();
        fetchCategories();
    }, []);

    // Filter ingredients when search term or selected category changes
    useEffect(() => {
        filterIngredients();
    }, [ingredients, searchTerm, selectedCategory]);

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/ingredients/");
            setIngredients(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching ingredients:", err);
            setError("Failed to load ingredients. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("/api/ingredients/categories/");
            setCategories(response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const filterIngredients = () => {
        let filtered = [...ingredients];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(ingredient =>
                ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by selected category
        if (selectedCategory) {
            filtered = filtered.filter(ingredient =>
                ingredient.categories.some(category => category.name === selectedCategory)
            );
        }

        setFilteredIngredients(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const handleSubmit = async (item, categoryIds) => {
        toggle();
        try {
            if (item.id) {
                item.categories = categoryIds;
                await axios.put(`/api/ingredients/${item.id}/`, item);
            } else {
                await axios.post("/api/ingredients/", item);
            }
            refreshList();
            fetchCategories(); // Refresh categories in case new ones were added
        } catch (err) {
            console.error("Error saving ingredient:", err);
            setError("Failed to save ingredient. Please try again.");
        }
    };

    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/ingredients/${item.id}/`);
            refreshList();
        } catch (err) {
            console.error("Error deleting ingredient:", err);
            setError("Failed to delete ingredient. Please try again.");
        }
    };

    const createItem = () => {
        const item = { name: "", description: "", categories: [] };
        setActiveItem(item);
        setModal(true);
    };

    const editItem = (item) => {
        setActiveItem(item);
        setModal(true);
    };

    // Group ingredients by category
    const groupIngredientsByCategory = () => {
        if (!filteredIngredients || filteredIngredients.length === 0) {
            return {};
        }

        // Create a map of categories with their ingredients
        const categoryMap = {};

        // Add "Uncategorized" group for ingredients without categories
        categoryMap["Uncategorized"] = [];

        // Group ingredients by category
        filteredIngredients.forEach(ingredient => {
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

    const renderIngredients = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (!filteredIngredients || filteredIngredients.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">🌿</div>
                    <h4>No ingredients found</h4>
                    <p>Add some ingredients or adjust your search filters.</p>
                    <Button color="success" onClick={createItem}>Add Ingredient</Button>
                </div>
            );
        }

        if (viewMode === "category") {
            const groupedIngredients = groupIngredientsByCategory();
            const categoryNames = Object.keys(groupedIngredients).sort();

            if (categoryNames.length === 0) {
                return (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h4>No matching ingredients</h4>
                        <p>Try adjusting your search filters.</p>
                    </div>
                );
            }

            return categoryNames.map(categoryName => (
                <CategoryGroup
                    key={categoryName}
                    categoryName={categoryName}
                    ingredients={groupedIngredients[categoryName].sort((a, b) =>
                        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                    )}
                    onEdit={editItem}
                    onDelete={handleDelete}
                />
            ));
        } else {
            // Alphabetical view
            const sortedIngredients = [...filteredIngredients].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
            );

            return (
                <ListGroup className="mb-3">
                    {sortedIngredients.map(ingredient => (
                        <IngredientItem
                            key={ingredient.id}
                            ingredient={ingredient}
                            onEdit={editItem}
                            onDelete={handleDelete}
                        />
                    ))}
                </ListGroup>
            );
        }
    };

    if (loading && ingredients.length === 0) {
        return (
            <div className="text-center mt-5">
                <Spinner color="success" />
                <p className="mt-2">Loading ingredients...</p>
            </div>
        );
    }

    return (
        <div className="ingredients-container">
            <h1 className="text-center my-4">Ingredients</h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <IngredientSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            selectedCategory={selectedCategory}
                            categories={categories}
                            onCategoryChange={setSelectedCategory}
                        />

                        <IngredientActions
                            onAddIngredient={createItem}
                        />

                        {renderIngredients()}
                    </Card>
                </Col>
            </Row>

            {modal && (
                <IngredientModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
};

export default Ingredients;