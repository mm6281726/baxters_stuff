import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Row, Col, Spinner, Alert } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import GroceryListSelectionModal from "../components/GroceryListSelectionModal";

import RecipeItemModal from "../components/RecipeItemModal";
import RecipeStepModal from "../components/RecipeStepModal";

import RecipeStep from "../components/RecipeStep";
import CategoryGroup from "../components/CategoryGroup";
import RecipeDetailActions from "../components/RecipeDetailActions";
import "./Detail.css";

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipeId] = useState(id);
    const [recipe, setRecipe] = useState(null);
    const [items, setItems] = useState([]);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [itemModal, setItemModal] = useState(false);
    const [stepModal, setStepModal] = useState(false);
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [groceryListSelectionModal, setGroceryListSelectionModal] = useState(false);
    const [activeItem, setActiveItem] = useState({
        recipe: id,
        ingredient: null,
        ingredient_details: null,
        quantity: 1,
        unit: "",
        notes: ""
    });
    const [activeStep, setActiveStep] = useState({
        recipe: id,
        step_number: "",
        description: ""
    });

    // Fetch recipe, items, and steps on component mount
    useEffect(() => {
        fetchRecipe();
        refreshItems();
        refreshSteps();
    }, []);

    const fetchRecipe = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/recipes/${recipeId}/`);
            setRecipe(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching recipe:", err);
            setError("Failed to load recipe. Please try again.");
            navigate('/recipes');
        } finally {
            setLoading(false);
        }
    };

    const refreshItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/recipes/${recipeId}/items/`);
            setItems(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching recipe items:", err);
            setError("Failed to load recipe items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const refreshSteps = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/recipes/${recipeId}/steps/`);
            setSteps(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching recipe steps:", err);
            setError("Failed to load recipe steps. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleItemModal = () => {
        setItemModal(!itemModal);
    };

    const toggleStepModal = () => {
        setStepModal(!stepModal);
    };

    const createItem = () => {
        setActiveItem({
            recipe: recipeId,
            ingredient: null,
            ingredient_details: null,
            quantity: 1,
            unit: "",
            notes: ""
        });
        toggleItemModal();
    };

    const createStep = () => {
        // Find the next step number
        const nextStepNumber = steps.length > 0
            ? Math.max(...steps.map(step => step.step_number)) + 1
            : 1;

        setActiveStep({
            recipe: recipeId,
            step_number: nextStepNumber,
            description: ""
        });
        toggleStepModal();
    };

    const editItem = (item) => {
        setActiveItem(item);
        toggleItemModal();
    };

    const editStep = (step) => {
        setActiveStep(step);
        toggleStepModal();
    };

    const handleItemSubmit = async (item) => {
        toggleItemModal();

        try {
            if (item.id) {
                // Update existing item
                await axios.put(`/api/recipes/items/${item.id}/`, item);
            } else {
                // Create new item
                await axios.post(`/api/recipes/${recipeId}/items/`, item);
            }
            refreshItems();
        } catch (err) {
            console.error("Error saving recipe item:", err);
            setError("Failed to save recipe item. Please try again.");
        }
    };

    const handleStepSubmit = async (step) => {
        toggleStepModal();

        try {
            if (step.id) {
                // Update existing step
                await axios.put(`/api/recipes/steps/${step.id}/`, step);
            } else {
                // Create new step
                await axios.post(`/api/recipes/${recipeId}/steps/`, step);
            }
            refreshSteps();
        } catch (err) {
            console.error("Error saving recipe step:", err);
            setError("Failed to save recipe step. Please try again.");
        }
    };

    const handleDeleteItem = async (item) => {
        try {
            await axios.delete(`/api/recipes/items/${item.id}/`);
            refreshItems();
        } catch (err) {
            console.error("Error deleting recipe item:", err);
            setError("Failed to delete recipe item. Please try again.");
        }
    };

    const handleDeleteStep = async (step) => {
        try {
            await axios.delete(`/api/recipes/steps/${step.id}/`);
            refreshSteps();
        } catch (err) {
            console.error("Error deleting recipe step:", err);
            setError("Failed to delete recipe step. Please try again.");
        }
    };

    const goBack = () => {
        navigate('/recipes');
    };

    const confirmDeleteRecipe = () => {
        setDeleteConfirmationModal(true);
    };

    const deleteRecipe = async () => {
        setDeleteConfirmationModal(false);
        try {
            await axios.delete(`/api/recipes/${recipeId}/`);
            navigate('/recipes');
        } catch (err) {
            console.error("Error deleting recipe:", err);
            setError("Failed to delete recipe. Please try again.");
        }
    };

    const openGroceryListSelectionModal = () => {
        setGroceryListSelectionModal(true);
    };

    const addToGroceryList = async (groceryListId) => {
        setGroceryListSelectionModal(false);
        try {
            const response = await axios.post(`/api/recipes/${recipeId}/add-to-grocery-list/${groceryListId}/`);
            if (response.data.status === "success") {
                alert(`Successfully added ${response.data.count} items to the grocery list.`);
            } else {
                setError("Failed to add items to grocery list. Please try again.");
            }
        } catch (err) {
            console.error("Error adding to grocery list:", err);
            setError("Failed to add items to grocery list. Please try again.");
        }
    };

    // Group items by category
    const groupItemsByCategory = () => {
        if (!items || items.length === 0) {
            return {};
        }

        // Create a map of categories with their items
        const categoryMap = {};

        // Add "Uncategorized" group for items without categories
        categoryMap["Uncategorized"] = [];

        // Group items by category
        items.forEach(item => {
            const categories = item.ingredient_details?.categories || [];

            if (categories.length === 0) {
                categoryMap["Uncategorized"].push(item);
            } else {
                // Add the item to each of its categories
                categories.forEach(category => {
                    if (!categoryMap[category.name]) {
                        categoryMap[category.name] = [];
                    }
                    categoryMap[category.name].push(item);
                });
            }
        });

        // Remove empty categories
        Object.keys(categoryMap).forEach(key => {
            if (categoryMap[key].length === 0) {
                delete categoryMap[key];
            }
        });

        return categoryMap;
    };

    const renderItems = () => {
        if (!items || items.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <h4>No ingredients added</h4>
                    <p>Add ingredients to your recipe to get started.</p>
                </div>
            );
        }

        const groupedItems = groupItemsByCategory();
        const categoryNames = Object.keys(groupedItems).sort();

        return categoryNames.map(categoryName => (
            <CategoryGroup
                key={categoryName}
                categoryName={categoryName}
                items={groupedItems[categoryName]}
                onEdit={editItem}
                onDelete={handleDeleteItem}
            />
        ));
    };

    const renderSteps = () => {
        if (!steps || steps.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h4>No steps added</h4>
                    <p>Add steps to your recipe to get started.</p>
                </div>
            );
        }

        // Sort steps by step number
        const sortedSteps = [...steps].sort((a, b) => a.step_number - b.step_number);

        return (
            <ListGroup className="mb-3">
                {sortedSteps.map(step => (
                    <RecipeStep
                        key={step.id}
                        step={step}
                        onEdit={editStep}
                        onDelete={handleDeleteStep}
                    />
                ))}
            </ListGroup>
        );
    };

    if (loading && !recipe) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading recipe...</p>
            </div>
        );
    }

    return (
        <div className="recipe-detail-container">
            <h1 className="text-center my-4">
                {recipe?.title}
            </h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <div className="mb-4 d-flex justify-content-between">
                            <Button
                                color="secondary"
                                onClick={goBack}
                                className="d-flex align-items-center"
                            >
                                <span className="me-1">←</span> Back to Recipes
                            </Button>
                        </div>

                        {recipe?.description && (
                            <div className="recipe-description mb-4">
                                <h5>Description</h5>
                                <p>{recipe.description}</p>
                            </div>
                        )}

                        <div className="recipe-meta mb-4">
                            <Row>
                                {recipe?.prep_time && (
                                    <Col md={4}>
                                        <div className="recipe-meta-item">
                                            <h6>Prep Time</h6>
                                            <p>{recipe.prep_time} minutes</p>
                                        </div>
                                    </Col>
                                )}
                                {recipe?.cook_time && (
                                    <Col md={4}>
                                        <div className="recipe-meta-item">
                                            <h6>Cook Time</h6>
                                            <p>{recipe.cook_time} minutes</p>
                                        </div>
                                    </Col>
                                )}
                                {recipe?.servings && (
                                    <Col md={4}>
                                        <div className="recipe-meta-item">
                                            <h6>Servings</h6>
                                            <p>{recipe.servings}</p>
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>

                        <RecipeDetailActions
                            onAddItem={createItem}
                            onAddStep={createStep}
                            onDeleteRecipe={confirmDeleteRecipe}
                            onAddToGroceryList={openGroceryListSelectionModal}
                        />

                        <div className="recipe-sections">
                            <div className="recipe-section mb-4">
                                <h3 className="section-title">Ingredients</h3>
                                {renderItems()}
                            </div>

                            <div className="recipe-section">
                                <h3 className="section-title">Steps</h3>
                                {renderSteps()}
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {itemModal && (
                <RecipeItemModal
                    activeItem={activeItem}
                    toggle={toggleItemModal}
                    onSave={handleItemSubmit}
                />
            )}

            {stepModal && (
                <RecipeStepModal
                    activeStep={activeStep}
                    toggle={toggleStepModal}
                    onSave={handleStepSubmit}
                />
            )}

            {deleteConfirmationModal && (
                <DeleteConfirmationModal
                    isOpen={deleteConfirmationModal}
                    toggle={() => setDeleteConfirmationModal(false)}
                    onConfirm={deleteRecipe}
                    itemName={recipe?.title}
                    itemType="recipe"
                />
            )}

            {groceryListSelectionModal && (
                <GroceryListSelectionModal
                    isOpen={groceryListSelectionModal}
                    toggle={() => setGroceryListSelectionModal(false)}
                    onSelect={addToGroceryList}
                />
            )}
        </div>
    );
};

export default RecipeDetail;
