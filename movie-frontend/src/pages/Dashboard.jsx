import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Sidebar from '../components/common/layout/Sidebar';
import Header from '../components/common/layout/Header';
import '../styles/Dashboard.css'; // Import file CSS

const Dashboard = () => {
    
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="content-area">
                    {/* Outlet sẽ render component con tương ứng với route */}
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default Dashboard;