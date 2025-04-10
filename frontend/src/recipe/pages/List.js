import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Row, Col, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './List.css';

import RecipeModal from "../components/RecipeModal";
import RecipeItem from "../components/RecipeItem";
import RecipeSearch from "../components/RecipeSearch";
import RecipeActions from "../components/RecipeActions";

const Recipes = () => {
    const navigate = useNavigate();

    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeItem, setActiveItem] = useState({
        title: "",
        description: "",
        prep_time: "",
        cook_time: "",
        servings: ""
    });

    // Fetch recipes on component mount
    useEffect(() => {
        refreshList();
    }, []);

    // Filter recipes when search term changes
    useEffect(() => {
        filterRecipes();
    }, [recipes, searchTerm]);

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/recipes/");
            setRecipes(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError("Failed to load recipes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterRecipes = () => {
        if (!searchTerm) {
            setFilteredRecipes(recipes);
            return;
        }

        const filtered = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (recipe.description && recipe.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredRecipes(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const createItem = () => {
        setActiveItem({
            title: "",
            description: "",
            prep_time: "",
            cook_time: "",
            servings: ""
        });
        toggle();
    };

    const handleSubmit = async (item) => {
        toggle();

        try {
            if (item.id) {
                // Update existing recipe
                await axios.put(`/api/recipes/${item.id}/`, item);
            } else {
                // Create new recipe
                await axios.post("/api/recipes/", item);
            }
            refreshList();
        } catch (err) {
            console.error("Error saving recipe:", err);
            setError("Failed to save recipe. Please try again.");
        }
    };

    const viewRecipe = (recipe) => {
        navigate(`/recipes/${recipe.id}`);
    };

    const renderRecipes = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (!filteredRecipes || filteredRecipes.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h4>No recipes found</h4>
                    <p>Add a new recipe to get started.</p>
                    <Button color="primary" onClick={createItem} className="d-flex align-items-center mx-auto">
                        <span className="me-1">+</span> Add Recipe
                    </Button>
                </div>
            );
        }

        return (
            <ListGroup flush className="border-top-0">
                {filteredRecipes.map(recipe => (
                    <RecipeItem
                        key={recipe.id}
                        recipe={recipe}
                        onView={viewRecipe}
                    />
                ))}
            </ListGroup>
        );
    };

    if (loading && recipes.length === 0) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading recipes...</p>
            </div>
        );
    }

    return (
        <div className="recipes-container">
            <h1 className="text-center my-4">Recipes</h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <RecipeSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />

                        <RecipeActions
                            onAddRecipe={createItem}
                        />

                        {renderRecipes()}
                    </Card>
                </Col>
            </Row>

            {modal && (
                <RecipeModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
};

export default Recipes;
