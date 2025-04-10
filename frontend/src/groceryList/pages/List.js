import React, { useState, useEffect } from "react";
import { Button, Card, ListGroup, Nav, NavItem, NavLink, Row, Col, Spinner, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import axios from "axios";
import './List.css';

import GroceryListModal from "../components/GroceryListModal";
import GroceryListItem from "../components/GroceryListItem";
import GroceryListSearch from "../components/GroceryListSearch";
import GroceryListActions from "../components/GroceryListActions";

const GroceryLists = () => {
    const navigate = useNavigate();

    const [viewCompleted, setViewCompleted] = useState(false);
    const [groceryLists, setGroceryLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modal, setModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeItem, setActiveItem] = useState({
        title: "",
        description: "",
        completed: false,
    });

    // Fetch grocery lists on component mount
    useEffect(() => {
        refreshList();
    }, []);

    // Filter lists when search term or view completed changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        filterLists();
    }, [groceryLists, searchTerm, viewCompleted]);

    const refreshList = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/grocerylist/");
            setGroceryLists(response.data);
            setError("");
        } catch (err) {
            console.error("Error fetching grocery lists:", err);
            setError("Failed to load grocery lists. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filterLists = () => {
        let filtered = [...groceryLists];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(list =>
                list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by completed status
        filtered = filtered.filter(list => list.completed === viewCompleted);

        setFilteredLists(filtered);
    };

    const toggle = () => {
        setModal(!modal);
    };

    const handleSubmit = async (item) => {
        toggle();
        try {
            if (item.id) {
                await axios.put(`/api/grocerylist/${item.id}/`, item);
            } else {
                await axios.post("/api/grocerylist/", item);
            }
            refreshList();
        } catch (err) {
            console.error("Error saving grocery list:", err);
            setError("Failed to save grocery list. Please try again.");
        }
    };

    const createItem = () => {
        // Format current date for the default title in MM/dd/yyyy format
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });

        const item = {
            title: `Grocery List - ${formattedDate}`,
            description: "",
            completed: false
        };

        setActiveItem(item);
        setModal(true);
    };

    const viewItems = (item) => {
        // Navigate to the items page for this grocery list
        navigate(`/grocerylist/${item.id}/items`);
    };

    const displayCompleted = (status) => {
        setViewCompleted(status);
    };

    const renderTabList = () => {
        return (
            <Nav tabs className="mb-3">
                <NavItem>
                    <NavLink
                        className={classnames({ active: viewCompleted})}
                        onClick={() => displayCompleted(true)}
                        href="#"
                        style={{ cursor: 'pointer' }}
                    >
                        Complete
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({ active: !viewCompleted})}
                        onClick={() => displayCompleted(false)}
                        href="#"
                        style={{ cursor: 'pointer' }}
                    >
                        Incomplete
                    </NavLink>
                </NavItem>
            </Nav>
        );
    };

    const renderLists = () => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                </div>
            );
        }

        if (!filteredLists || filteredLists.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h4>No grocery lists found</h4>
                    <p>{viewCompleted ?
                        "You don't have any completed grocery lists." :
                        "Add a new grocery list to get started."}</p>
                    {!viewCompleted && (
                        <Button color="primary" onClick={createItem} className="d-flex align-items-center mx-auto">
                            <span className="me-1">+</span> Add List
                        </Button>
                    )}
                </div>
            );
        }

        return (
            <ListGroup flush className="border-top-0">
                {filteredLists.map(list => (
                    <GroceryListItem
                        key={list.id}
                        list={list}
                        onView={viewItems}
                        isCompleted={viewCompleted}
                    />
                ))}
            </ListGroup>
        );
    };

    if (loading && groceryLists.length === 0) {
        return (
            <div className="text-center mt-5">
                <Spinner color="primary" />
                <p className="mt-2">Loading grocery lists...</p>
            </div>
        );
    }

    return (
        <div className="grocery-lists-container">
            <h1 className="text-center my-4">Grocery Lists</h1>

            {error && <Alert color="danger" className="mx-auto" style={{ maxWidth: '800px' }}>{error}</Alert>}

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <GroceryListSearch
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                        />

                        <GroceryListActions
                            onAddList={createItem}
                        />

                        {renderTabList()}
                        {renderLists()}
                    </Card>
                </Col>
            </Row>

            {modal && (
                <GroceryListModal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            )}
        </div>
    );
};

export default GroceryLists;