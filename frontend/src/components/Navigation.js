import React, { useState, useEffect } from 'react';
import { Nav, Navbar, NavbarBrand, NavLink } from 'reactstrap';

import { useAuth } from "../hooks/AuthProvider";

export function Navigation() {
    const auth = useAuth();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access') != null) {
            setIsAuth(true);
        }
    }, [isAuth]);
    
    return (
        <div>
            <Navbar color="light" light className="mb-2">
                <NavbarBrand href="/">Baxter's Stuff</NavbarBrand>            
                <Nav navbar> 
                    {isAuth ? <NavLink href="/">Grocery List</NavLink> : null}
                </Nav>
                <Nav navbar className="mr-1">
                    {isAuth ? <NavLink href="#" onClick={() =>auth.logOut()}>Logout</NavLink> : 
                              <NavLink href="/login">Login</NavLink> }
                </Nav>
            </Navbar>
        </div>
    );
}