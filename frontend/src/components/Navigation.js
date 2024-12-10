import React, { useState, useEffect } from 'react';
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';

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
            <Navbar color="light" light className="mb-4">
                <NavbarBrand href="/">Baxter's Stuff</NavbarBrand>            
                <Nav navbar> 
                    {isAuth ? <NavLink href="/">Grocery List</NavLink> : null}
                </Nav>
                <Nav navbar className="mr-1">
                    <NavItem>
                        {isAuth ? null : <NavLink href="/register">Register</NavLink>}
                    </NavItem>
                    <NavItem>
                        {isAuth ? <NavLink href="#" onClick={() =>auth.logOut()}>Logout</NavLink> : 
                              <NavLink href="/login">Login</NavLink> }
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}