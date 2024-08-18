import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register'; 
import HomePage from './Components/HomePage';
import AdminDashboard from './Components/AdminDashboard';
import Menu from './Components/Menu';
import Checkout from './Components/Checkout';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/user/home" element={<Menu />} />
                <Route path='/checkout' element={<Checkout/>}/>


            </Routes>
        </Router>
    );
};

export default App;
