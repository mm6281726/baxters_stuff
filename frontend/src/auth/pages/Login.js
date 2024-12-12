import { useState } from "react";
import { Button, Card, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import { useAuth } from "../hooks/AuthProvider";

export const Login = () => {
    const [input, setInput] = useState({
        username: "",
        password: "",
    });

    const auth = useAuth();
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password !== "") {
            auth.loginAction(input);
            return;
        }
        alert("Please provide valid input.");
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
                        <h3>Login</h3>
                        <Form onSubmit={handleSubmitEvent} className="mt-3">
                            <FormGroup floating>
                                <Input 
                                    name='username'
                                    placeholder="Username"
                                    type='text'
                                    required
                                    onChange={handleInput}
                                    />
                                <Label for="username">Username</Label>
                            </FormGroup>
                            <FormGroup floating>
                                <Input 
                                    name='password'
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={handleInput}
                                    />
                                <Label for="password">Password</Label>
                            </FormGroup>
                            <Button color="primary">
                                Submit
                            </Button>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
