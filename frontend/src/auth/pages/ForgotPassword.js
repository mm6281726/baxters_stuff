import { useState } from "react";
import { Button, Card, Col, Form, FormGroup, Input, Label, Row, Alert } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
    const [input, setInput] = useState({
        email: "",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.email !== "") {
            setIsSubmitting(true);
            setError(null);
            setMessage(null);
            
            axios
                .post("/api/accounts/password-reset/", JSON.stringify(input))
                .then((res) => {
                    setMessage(res.data.detail || "Password reset email has been sent. Please check your inbox.");
                    setInput({ email: "" });
                })
                .catch((err) => {
                    setError(err.response?.data?.errors?.email || 
                             err.response?.data?.errors || 
                             "An error occurred. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
            return;
        }
        setError("Please provide a valid email address.");
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <Row>
                <Col
                    md={{
                        offset: 3,
                        size: 5
                    }}
                >
                    <Card className="p-3">
                        <h3>Forgot Password</h3>
                        {message && (
                            <Alert color="success" className="mt-3">
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert color="danger" className="mt-3">
                                {error}
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmitEvent} className="mt-3">
                            <FormGroup floating>
                                <Input 
                                    name='email'
                                    placeholder="Email"
                                    type='email'
                                    required
                                    value={input.email}
                                    onChange={handleInput}
                                    disabled={isSubmitting}
                                />
                                <Label for="email">Email</Label>
                            </FormGroup>
                            <Button color="primary" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Reset Password"}
                            </Button>
                            <div className="mt-3">
                                <Link to="/login">Back to Login</Link>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
