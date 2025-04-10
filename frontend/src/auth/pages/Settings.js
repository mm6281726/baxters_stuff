import React, { useState, useEffect } from "react";
import { Button, Card, Col, Form, FormGroup, Input, Label, Row, Alert, Nav, NavItem, NavLink, TabContent, TabPane, Spinner } from 'reactstrap';

import classnames from 'classnames';
import axios from 'axios';

import { useAuth } from "../hooks/AuthProvider";

export const Settings = () => {
    const auth = useAuth();
    const [activeTab, setActiveTab] = useState('1');
    const [profileInput, setProfileInput] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
    });
    const [passwordInput, setPasswordInput] = useState({
        current_password: "",
        new_password1: "",
        new_password2: "",
    });
    const [profileMessage, setProfileMessage] = useState(null);
    const [profileError, setProfileError] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load user data when component mounts
        if (auth.user) {
            setProfileInput({
                username: auth.user.username || "",
                email: auth.user.email || "",
                first_name: auth.user.first_name || "",
                last_name: auth.user.last_name || "",
            });
        }
    }, [auth.user]);

    const toggle = tab => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const handleProfileInput = (e) => {
        const { name, value } = e.target;
        setProfileInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordInput = (e) => {
        const { name, value } = e.target;
        setPasswordInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setProfileError(null);
        setProfileMessage(null);

        try {
            await axios.put(`/api/accounts/${auth.user.id}/`, JSON.stringify(profileInput));
            setProfileMessage("Profile updated successfully.");

            // Refresh the user data in the auth context
            await auth.fetchUserData();
        } catch (err) {
            setProfileError(err.response?.data?.detail || "Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (passwordInput.new_password1 !== passwordInput.new_password2) {
            setPasswordError("New passwords don't match.");
            return;
        }

        setIsSubmitting(true);
        setPasswordError(null);
        setPasswordMessage(null);

        try {
            await axios.post("/api/accounts/change-password/", JSON.stringify(passwordInput));
            setPasswordMessage("Password updated successfully.");
            setPasswordInput({
                current_password: "",
                new_password1: "",
                new_password2: "",
            });
        } catch (err) {
            setPasswordError(err.response?.data?.detail || "Failed to update password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading spinner if user data is not yet available
    if (auth.loading || !auth.user) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner color="primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-center my-4">Account Settings</h1>

            <Row>
                <Col
                    lg="8"
                    md="10"
                    sm="12"
                    className="mx-auto p-0"
                >
                    <Card className="p-4 shadow-sm">
                        <Nav tabs className="mb-4">
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '1' })}
                                    onClick={() => { toggle('1'); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Profile
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: activeTab === '2' })}
                                    onClick={() => { toggle('2'); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Change Password
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                {profileMessage && (
                                    <Alert color="success" className="mt-3">
                                        {profileMessage}
                                    </Alert>
                                )}
                                {profileError && (
                                    <Alert color="danger" className="mt-3">
                                        {profileError}
                                    </Alert>
                                )}
                                <Form onSubmit={handleProfileSubmit}>
                                    <FormGroup>
                                        <Label for="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            value={profileInput.username}
                                            onChange={handleProfileInput}
                                            disabled={isSubmitting}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={profileInput.email}
                                            onChange={handleProfileInput}
                                            disabled={isSubmitting}
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="first_name">First Name</Label>
                                                <Input
                                                    id="first_name"
                                                    name="first_name"
                                                    value={profileInput.first_name}
                                                    onChange={handleProfileInput}
                                                    disabled={isSubmitting}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label for="last_name">Last Name</Label>
                                                <Input
                                                    id="last_name"
                                                    name="last_name"
                                                    value={profileInput.last_name}
                                                    onChange={handleProfileInput}
                                                    disabled={isSubmitting}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Button color="primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Form>
                            </TabPane>

                            <TabPane tabId="2">
                                {passwordMessage && (
                                    <Alert color="success" className="mt-3">
                                        {passwordMessage}
                                    </Alert>
                                )}
                                {passwordError && (
                                    <Alert color="danger" className="mt-3">
                                        {passwordError}
                                    </Alert>
                                )}
                                <Form onSubmit={handlePasswordSubmit}>
                                    <FormGroup>
                                        <Label for="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            name="current_password"
                                            type="password"
                                            value={passwordInput.current_password}
                                            onChange={handlePasswordInput}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="new_password1">New Password</Label>
                                        <Input
                                            id="new_password1"
                                            name="new_password1"
                                            type="password"
                                            value={passwordInput.new_password1}
                                            onChange={handlePasswordInput}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="new_password2">Confirm New Password</Label>
                                        <Input
                                            id="new_password2"
                                            name="new_password2"
                                            type="password"
                                            value={passwordInput.new_password2}
                                            onChange={handlePasswordInput}
                                            disabled={isSubmitting}
                                            required
                                        />
                                    </FormGroup>
                                    <Button color="primary" disabled={isSubmitting}>
                                        {isSubmitting ? "Updating..." : "Update Password"}
                                    </Button>

                                </Form>
                            </TabPane>
                        </TabContent>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Settings;
