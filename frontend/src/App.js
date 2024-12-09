import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router'
import PrivateRoute from "./components/PrivateRoute";
import { Navigation } from './components/Navigation';
import { Login } from "./pages/Login";
import GroceryList from "./pages/GroceryList";
import AuthProvider from "./hooks/AuthProvider";

import axios from "axios";

axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

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
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<GroceryList />} />
              </Route>
            </Routes>
            </AuthProvider>
        </BrowserRouter>
      </main>
    );
  }
}

export default App;