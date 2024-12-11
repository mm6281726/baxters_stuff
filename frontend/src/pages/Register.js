import { useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';

import axios from 'axios';

import { useAuth } from "../hooks/AuthProvider";

export const Register = () => {
    const auth = useAuth();
    const [input, setInput] = useState({
        email: "",
        username: "",
        password: "",
        password1: "",
        password2: "",
    });

    const handleSubmitEvent = (e) => {
        e.preventDefault();
        if (input.username !== "" && input.password1 !== "" 
            && input.password2 !== "") {
            axios
                .post("/api/accounts/", JSON.stringify(input))
                .then((res) => {
                    if(res.data.user){
                        input.password = input.password1
                        auth.loginAction(input);
                    }
                })
                .catch((err)=>{
                    alert("Username already exists.");
                });
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
        <div className="container">
            <Row>
                <Col
                    md={{
                        offset: 3,
                        size: 5
                    }}
                >
                    <h3>Register</h3>
                    <Form onSubmit={handleSubmitEvent} className="mt-3">
                        <FormGroup floating>
                            <Input 
                                name='email'
                                placeholder="Email"
                                type='email'
                                onChange={handleInput}
                                />
                            <Label for="email">Email</Label>
                        </FormGroup>
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
                                name='password1'
                                type="password"
                                placeholder="Password"
                                required
                                onChange={handleInput}
                                />
                            <Label for="password1">Password</Label>
                        </FormGroup>
                        <FormGroup floating>
                            <Input 
                                name='password2'
                                type="password"
                                placeholder="Confirm Password"
                                required
                                onChange={handleInput}
                                />
                            <Label for="password2">Confirm Password</Label>
                        </FormGroup>
                        <Button color="primary">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
