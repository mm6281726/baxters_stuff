import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router'

import AuthProvider from "./auth/hooks/AuthProvider";
import PrivateRoute from "./auth/components/PrivateRoute";
import { Navigation } from './auth/components/Navigation';
import { Login } from "./auth/pages/Login";
import { Register } from "./auth/pages/Register";

import GroceryLists from "./groceryList/pages/List";
import GroceryListItems from "./groceryList/pages/Items";
import Ingredients from "./ingredients/pages/List";
import Categories from "./categories/pages/List";
import PantryItems from "./pantry/pages/List";
import Recipes from "./recipe/pages/List";
import RecipeDetail from "./recipe/pages/Detail";

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
                <Route path="/grocerylist/:id/items" element={<GroceryListItems />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/ingredients" element={<Ingredients />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/categories" element={<Categories />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/pantry" element={<PantryItems />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/recipes" element={<Recipes />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path="/recipes/:id" element={<RecipeDetail />} />
              </Route>
            </Routes>
            </AuthProvider>
        </BrowserRouter>
      </main>
    );
  }
}

export default App;