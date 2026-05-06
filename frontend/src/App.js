import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Header from './components/Header';
import Promotions from './components/Promotions';
import Menu from './components/Menu';
import Burger2 from './components/Burger2';
import BookTable from './components/BookTable';
import TestimonialSlider from './components/TestimonialSlider';
import Footer from './components/Footer';
import CartPage from "./components/CartPage";
import AdminPage from "./components/AdminPage";
import LandingPage from "./components/LandingPage";
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("user_id") !== null
  );

  const handleLogin = (userId, email) => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <Router>
        <LandingPage onLogin={handleLogin} />
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <NavBar onLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Header />
                <Promotions />
                <Menu />
                <Burger2 />
                <BookTable />
                <TestimonialSlider />
                <Footer />
              </div>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<Burger2 />} />
          <Route path="/add-address" element={<BookTable />} />
          <Route path="/testimonial" element={<TestimonialSlider />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
