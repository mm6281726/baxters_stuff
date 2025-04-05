import React, { useState, useEffect } from 'react';
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import { useLocation, Link } from 'react-router-dom';
import './Navigation.css';

import { useAuth } from "../hooks/AuthProvider";

export function Navigation() {
    const auth = useAuth();
    const [isAuth, setIsAuth] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (localStorage.getItem('access') != null) {
            setIsAuth(true);
        }
    }, [isAuth]);

    // Function to check if a path is active
    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') {
            return true;
        }
        // For grocery list items pages
        if (path === '/' && location.pathname.startsWith('/grocerylist/')) {
            return true;
        }
        return location.pathname === path;
    };

    return (
        <div>
            <Navbar color="light" light expand="md" className="mb-4">
                <NavbarBrand tag={Link} to="/">Baxter's Stuff</NavbarBrand>
                <Nav navbar>
                    {isAuth ? (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/"
                                className={isActive('/') ? 'active' : ''}
                            >
                                Grocery List
                            </NavLink>
                        </NavItem>
                    ) : null}
                    {isAuth ? (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/ingredients"
                                className={isActive('/ingredients') ? 'active' : ''}
                            >
                                Ingredients
                            </NavLink>
                        </NavItem>
                    ) : null}
                    {isAuth ? (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/categories"
                                className={isActive('/categories') ? 'active' : ''}
                            >
                                Categories
                            </NavLink>
                        </NavItem>
                    ) : null}
                </Nav>
                <Nav navbar className="ms-auto">
                    {isAuth ? null : (
                        <NavItem>
                            <NavLink
                                tag={Link}
                                to="/register"
                                className={isActive('/register') ? 'active' : ''}
                            >
                                Register
                            </NavLink>
                        </NavItem>
                    )}
                    <NavItem>
                        {isAuth ? (
                            <NavLink
                                href="#"
                                onClick={() => auth.logOut()}
                            >
                                Logout
                            </NavLink>
                        ) : (
                            <NavLink
                                tag={Link}
                                to="/login"
                                className={isActive('/login') ? 'active' : ''}
                            >
                                Login
                            </NavLink>
                        )}
                    </NavItem>
                </Nav>
            </Navbar>
        </div>
    );
}