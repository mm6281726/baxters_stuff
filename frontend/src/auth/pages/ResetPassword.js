import { useState, useEffect } from "react";
import { Button, Card, Col, Form, FormGroup, Input, Label, Row, Alert } from 'reactstrap';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [input, setInput] = useState({
        uid: uid || "",
        token: token || "",
        new_password1: "",
        new_password2: "",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!uid || !token) {
            setError("Invalid password reset link. Please request a new one.");
        }
    }, [uid, token]);

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.new_password1 !== "" && input.new_password2 !== "") {
            if (input.new_password1 !== input.new_password2) {
                setError("Passwords don't match.");
                return;
            }

            setIsSubmitting(true);
            setError(null);
            setMessage(null);
            
            axios
                .post("/api/accounts/password-reset/confirm/", JSON.stringify(input))
                .then((res) => {
                    setMessage(res.data.detail || "Password has been reset successfully.");
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                })
                .catch((err) => {
                    setError(err.response?.data?.errors?.new_password1 || 
                             err.response?.data?.errors?.new_password2 || 
                             err.response?.data?.errors?.token ||
                             err.response?.data?.errors?.uid ||
                             err.response?.data?.errors || 
                             "An error occurred. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
            return;
        }
        setError("Please provide valid passwords.");
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
                        <h3>Reset Password</h3>
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
                                    name='new_password1'
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    value={input.new_password1}
                                    onChange={handleInput}
                                    disabled={isSubmitting || !uid || !token}
                                />
                                <Label for="new_password1">New Password</Label>
                            </FormGroup>
                            <FormGroup floating>
                                <Input 
                                    name='new_password2'
                                    type="password"
                                    placeholder="Confirm New Password"
                                    required
                                    value={input.new_password2}
                                    onChange={handleInput}
                                    disabled={isSubmitting || !uid || !token}
                                />
                                <Label for="new_password2">Confirm New Password</Label>
                            </FormGroup>
                            <Button color="primary" disabled={isSubmitting || !uid || !token}>
                                {isSubmitting ? "Resetting..." : "Reset Password"}
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
