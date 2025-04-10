import React, { useState, useEffect } from "react";
import { Button, Card, Row, Col, Spinner, Alert } from 'reactstrap';
import axios from "axios";

import PantryItemModal from "../components/PantryItemModal";
import PantryItem from "../components/PantryItem";
import CategoryGroup from "../components/CategoryGroup";
import PantrySearch from "../components/PantrySearch";
import PantryActions from "../components/PantryActions";
import "./List.css";

const PantryItems = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [activeItem, setActiveItem] = useState({
        ingredient: null,
        ingredient_details: null,
        quantity: 1,
        unit: "",
        notes: ""
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("category"); // "category" or "alphabetical"

    // Fetch pantry items on component mount
    useEffect(() => {
        refreshList();
    }, []);

    // Filter items when search term or view mode changes
    useEffect(() => {
        filterItems();
    }, [items, searchTerm]);

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/pantry/");
            setItems(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching pantry items:", err);
            setError("Failed to load pantry items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterItems = () => {
        let filtered = [...items];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.ingredient_details?.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredItems(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const createItem = () => {
        setActiveItem({
            ingredient: null,
            ingredient_details: null,
            quantity: 1,
            unit: "",
            notes: ""
        });
        toggle();
    };

    const editItem = (item) => {
        setActiveItem(item);
        toggle();
    };

    const handleSubmit = async (item) => {
        toggle();

        try {
            if (item.id) {
                // Update existing item
                await axios.put(`/api/pantry/${item.id}/`, item);
            } else {
                // Create new item
                await axios.post("/api/pantry/", item);
            }
            refreshList();
        } catch (err) {
            console.error("Error saving pantry item:", err);
            setError("Failed to save pantry item. Please try again.");
        }
    };

    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/pantry/${item.id}/`);
            refreshList();
        } catch (err) {
            console.error("Error deleting pantry item:", err);
            setError("Failed to delete pantry item. Please try again.");
        }
    };

    // Group items by category
    const groupItemsByCategory = () => {
        if (!filteredItems || filteredItems.length === 0) {
            return {};
        }

        // Create a map of categories with their items
        const categoryMap = {};

        // Add "Uncategorized" group for items without categories
        categoryMap["Uncategorized"] = [];

        // Group items by category
        filteredItems.forEach(item => {
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
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (!filteredItems || filteredItems.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">🍽️</div>
                    <h4>No pantry items found</h4>
                    <p>Add items to your pantry to get started.</p>
                    <Button color="primary" onClick={createItem} className="d-flex align-items-center mx-auto">
                        <span className="me-1">+</span> Add Pantry Item
                    </Button>
                </div>
            );
        }

        if (viewMode === "category") {
            const groupedItems = groupItemsByCategory();
            const categoryNames = Object.keys(groupedItems).sort();

            if (categoryNames.length === 0) {
                return (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h4>No matching items</h4>
                        <p>Try adjusting your search filters.</p>
                    </div>
                );
            }

            return categoryNames.map(categoryName => (
                <CategoryGroup
                    key={categoryName}
                    categoryName={categoryName}
                    items={groupedItems[categoryName]}
                    onEdit={editItem}
                    onDelete={handleDelete}
                />
            ));
        } else {
            // Alphabetical view
            const sortedItems = [...filteredItems].sort((a, b) =>
                a.ingredient_details?.name.localeCompare(b.ingredient_details?.name)
            );

            return (
                <div className="pantry-items-list">
                    {sortedItems.map(item => (
                        <PantryItem
                            key={item.id}
                            item={item}
                            onEdit={editItem}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            );
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading pantry items...</p>
            </div>
        );
    }

    return (
        <div className="pantry-items-container">
            <h1 className="text-center my-4">Pantry</h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <PantrySearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />

                        <PantryActions
                            onAddItem={createItem}
                        />

                        {renderItems()}
                    </Card>
                </Col>
            </Row>

            {modal && (
                <PantryItemModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
};

export default PantryItems;
