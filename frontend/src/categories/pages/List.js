import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Row, Col, Spinner, Alert } from 'reactstrap';
import axios from "axios";

import CategoryModal from "../components/CategoryModal";
import CategoryItem from "../components/CategoryItem";
import CategorySearch from "../components/CategorySearch";
import CategoryActions from "../components/CategoryActions";
import "./List.css";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeItem, setActiveItem] = useState({
        name: "",
        description: "",
    });

    // Fetch categories on component mount
    useEffect(() => {
        refreshList();
    }, []);

    // Filter categories when search term changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        filterCategories();
    }, [categories, searchTerm]);

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/ingredients/categories/");
            setCategories(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterCategories = () => {
        let filtered = [...categories];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredCategories(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const handleSubmit = async (item) => {
        toggle();
        try {
            if (item.id) {
                console.log('Updating category:', item);
                await axios.put(`/api/ingredients/categories/${item.id}/`, item);
            } else {
                console.log('Creating new category:', item);
                await axios.post("/api/ingredients/categories/", item);
            }
            refreshList();
        } catch (err) {
            console.error("Error saving category:", err);
            setError("Failed to save category. Please try again.");
        }
    };

    const handleDelete = async (item) => {
        try {
            await axios.delete(`/api/ingredients/categories/${item.id}/`);
            refreshList();
        } catch (err) {
            console.error("Error deleting category:", err);
            setError("Failed to delete category. Please try again.");
        }
    };

    const createItem = () => {
        const item = { name: "", description: "" };
        setActiveItem(item);
        setModal(true);
    };

    const editItem = (item) => {
        setActiveItem(item);
        setModal(true);
    };

    const renderCategories = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (!filteredCategories || filteredCategories.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">📁</div>
                    <h4>No categories found</h4>
                    <p>Add some categories or adjust your search filters.</p>
                    <Button color="primary" onClick={createItem}>Add Category</Button>
                </div>
            );
        }

        // Sort categories alphabetically
        const sortedCategories = [...filteredCategories].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );

        return (
            <ListGroup className="mb-3">
                {sortedCategories.map(category => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        onEdit={editItem}
                        onDelete={handleDelete}
                    />
                ))}
            </ListGroup>
        );
    };

    if (loading && categories.length === 0) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="categories-container">
            <h1 className="text-center my-4">Categories</h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <CategorySearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />

                        <CategoryActions
                            onAddCategory={createItem}
                        />

                        {renderCategories()}
                    </Card>
                </Col>
            </Row>

            {modal && (
                <CategoryModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default Categories;