import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Row, Col, Spinner, Alert } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

import ItemModal from "../components/ItemModal";
import GroceryItem from "../components/GroceryItem";
import CategoryGroup from "../components/CategoryGroup";
import ItemSearch from "../components/ItemSearch";
import ItemActions from "../components/ItemActions";
import "./Items.css";

const GroceryListItems = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [groceryListId] = useState(id);
    const [groceryList, setGroceryList] = useState(null);
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("category");
    const [showPurchased, setShowPurchased] = useState(true);
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const [activeItem, setActiveItem] = useState({
        grocery_list: id,
        ingredient: null,
        ingredient_details: null,
        quantity: 1,
        unit: "",
        purchased: false,
        notes: ""
    });

    // Fetch grocery list and items on component mount
    useEffect(() => {
        fetchGroceryList();
        refreshList();
    }, []);

    // Filter items when search term, view mode, or show purchased changes
    useEffect(() => {
        filterItems();
    }, [items, searchTerm, showPurchased]);

    const fetchGroceryList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/grocerylist/${groceryListId}/`);
            setGroceryList(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching grocery list:", err);
            setError("Failed to load grocery list. Please try again.");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/grocerylist/${groceryListId}/items/`);
            setItems(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching grocery list items:", err);
            setError("Failed to load grocery list items. Please try again.");
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

        // Filter by purchased status
        if (!showPurchased) {
            filtered = filtered.filter(item => !item.purchased);
        }

        setFilteredItems(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const handleSubmit = async (item) => {
        toggle();
        try {
            if (item.id) {
                await axios.put(`/api/grocerylist/items/${item.id}/`, item);
            } else {
                await axios.post(`/api/grocerylist/${groceryListId}/items/`, item);
            }
            refreshList();
        } catch (err) {
            console.error("Error saving item:", err);
            setError("Failed to save item. Please try again.");
        }
    };

    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/grocerylist/items/${item.id}/`);
            refreshList();
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Failed to delete item. Please try again.");
        }
    };

    const createItem = () => {
        const item = {
            grocery_list: groceryListId,
            ingredient: null,
            ingredient_details: null,
            quantity: 1,
            unit: "",
            purchased: false,
            notes: ""
        };

        setActiveItem(item);
        setModal(true);
    };

    const editItem = (item) => {
        setActiveItem(item);
        setModal(true);
    };

    const togglePurchased = async (item) => {
        const updatedItem = { ...item, purchased: !item.purchased };
        try {
            await axios.put(`/api/grocerylist/items/${item.id}/`, updatedItem);
            refreshList();
        } catch (err) {
            console.error("Error updating item:", err);
            setError("Failed to update item. Please try again.");
        }
    };

    const markAllPurchased = async () => {
        try {
            setLoading(true);
            const promises = filteredItems.map(item => {
                if (!item.purchased) {
                    return axios.put(`/api/grocerylist/items/${item.id}/`, { ...item, purchased: true });
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
            refreshList();
        } catch (err) {
            console.error("Error marking all as purchased:", err);
            setError("Failed to mark all items as purchased. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearPurchased = async () => {
        try {
            setLoading(true);
            const promises = items.map(item => {
                if (item.purchased) {
                    return axios.delete(`/api/grocerylist/items/${item.id}/`);
                }
                return Promise.resolve();
            });
            await Promise.all(promises);
            refreshList();
        } catch (err) {
            console.error("Error clearing purchased items:", err);
            setError("Failed to clear purchased items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigate('/');
    };

    const completeList = async () => {
        try {
            setLoading(true);
            // First mark all items as purchased
            await markAllPurchased();

            // Then add the grocery list to the pantry
            await axios.post(`/api/pantry/add-grocery-list/${groceryListId}/`);

            // Refresh the grocery list to show it as completed
            await fetchGroceryList();

            // Show success message
            setError("");
            alert("Grocery list completed and items added to pantry!");

            // Navigate back to the grocery lists page
            navigate('/');
        } catch (err) {
            console.error("Error completing grocery list:", err);
            setError("Failed to complete grocery list. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteList = async () => {
        try {
            await axios.delete(`/api/grocerylist/${groceryListId}/`);
            navigate('/');
        } catch (err) {
            console.error("Error deleting grocery list:", err);
            setError("Failed to delete grocery list. Please try again.");
        }
    };

    const confirmDeleteList = () => {
        setDeleteConfirmationModal(true);
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
        if (categoryMap["Uncategorized"].length === 0) {
            delete categoryMap["Uncategorized"];
        }

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
                    <div className="empty-state-icon">📝</div>
                    <h4>No items found</h4>
                    <p>Add some items to your grocery list or adjust your search filters.</p>
                    <Button color="primary" onClick={createItem} className="d-flex align-items-center mx-auto">
                        <span className="me-1">+</span> Add Item
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
                    onTogglePurchased={togglePurchased}
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
                <ListGroup className="mb-3">
                    {sortedItems.map(item => (
                        <GroceryItem
                            key={item.id}
                            item={item}
                            onTogglePurchased={togglePurchased}
                            onEdit={editItem}
                            onDelete={handleDelete}
                        />
                    ))}
                </ListGroup>
            );
        }
    };

    if (loading && !groceryList) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading grocery list...</p>
            </div>
        );
    }

    return (
        <div className="grocery-list-items-container">
            <h1 className="text-center my-4">
                {groceryList?.title}
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
                                <span className="me-1">←</span> Back to Lists
                            </Button>
                        </div>

                        <ItemSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            showPurchased={showPurchased}
                            onShowPurchasedChange={setShowPurchased}
                        />

                        <ItemActions
                            onAddItem={createItem}
                            onMarkAllPurchased={markAllPurchased}
                            onClearPurchased={clearPurchased}
                            onDeleteList={confirmDeleteList}
                            onCompleteList={completeList}
                        />

                        {renderItems()}
                    </Card>
                </Col>
            </Row>

            {deleteConfirmationModal && (
                <DeleteConfirmationModal
                    isOpen={deleteConfirmationModal}
                    toggle={() => setDeleteConfirmationModal(!deleteConfirmationModal)}
                    onConfirm={deleteList}
                    itemName={groceryList?.title}
                />
            )}

            {modal && (
                <ItemModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
};

export default GroceryListItems;
