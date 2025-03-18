import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router'

import AuthProvider from "./auth/hooks/AuthProvider";
import PrivateRoute from "./auth/components/PrivateRoute";
import { Navigation } from './auth/components/Navigation';
import { Login } from "./auth/pages/Login";
import { Register } from "./auth/pages/Register";

import GroceryLists from "./groceryList/pages/List";
import Ingredients from "./ingredients/pages/List";
import Categories from "./categories/pages/List";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <main>
        <BrowserRouter>
          <AuthProvider>
            <Navigation></Navigation>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<GroceryLists />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/ingredients" element={<Ingredients />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/categories" element={<Categories />} />
              </Route>
            </Routes>
            </AuthProvider>
        </BrowserRouter>
      </main>
    );
  }
}

export default App;