import React, { useEffect, useState } from 'react';
import { FaFilm, FaUsers, FaChartLine } from 'react-icons/fa';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line 
} from 'recharts';
import * as dashboardService from '../services/dashboardService';
import StatsCard from '../../src/pages/admin/StatsCard.jsx';
import '../styles/Dashboard.css'; 

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [movieChartData, setMovieChartData] = useState([]);
    const [userChartData, setUserChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatChartData = (dataMap) => {
        if (!dataMap) return [];
        return Object.keys(dataMap).map(key => ({
            name: key,
            value: dataMap[key]
        }));
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const allStats = await dashboardService.getAllStats();
                setStats(allStats);

                const moviesByMonth = await dashboardService.getMoviesByMonth();
                setMovieChartData(formatChartData(moviesByMonth));

                const usersByMonth = await dashboardService.getUsersByMonth();
                setUserChartData(formatChartData(usersByMonth));

            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Định nghĩa style cho Tooltip ở đây để code JSX gọn hơn (Recharts yêu cầu object)
    const tooltipStyle = {
        backgroundColor: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: '#fff'
    };

    if (isLoading) return <p className="loading-text">Đang tải thống kê...</p>;

    return (
        <div className="dashboard-overview">
            <h2 className="page-title">Tổng Quan Hệ Thống</h2>

            {/* --- PHẦN 1: CÁC THẺ SỐ LIỆU (Sử dụng class .stats-grid) --- */}
            <div className="stats-grid">
                <StatsCard 
                    title="Tổng số phim" 
                    value={stats?.movies?.totalMovies || 0} 
                    icon={<FaFilm />} 
                    color="#ffc107" 
                />
                
                <StatsCard 
                    title="Tổng người dùng" 
                    value={stats?.users?.totalUsers || 0} 
                    icon={<FaUsers />} 
                    color="#00d2d3" 
                />

                <StatsCard 
                    title="Phim Đang Chiếu" 
                    value={stats?.movies?.nowShowingCount || 0} 
                    icon={<FaChartLine />} 
                    color="#ff9f43" 
                />
            </div>

            {/* --- PHẦN 2: BIỂU ĐỒ (Sử dụng class .charts-grid và .chart-box) --- */}
            <div className="charts-grid">
                
                {/* Biểu đồ 1 */}
                <div className="chart-box">
                    <h3>Phim mới theo tháng</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={movieChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#a9b3c1" />
                                <YAxis stroke="#a9b3c1" />
                                <Tooltip 
                                    contentStyle={tooltipStyle} 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                                <Bar dataKey="value" name="Số lượng phim" fill="#ffc107" barSize={30} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ 2 */}
                <div className="chart-box">
                    <h3>Người dùng đăng ký</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#a9b3c1" />
                                <YAxis stroke="#a9b3c1" />
                                <Tooltip contentStyle={tooltipStyle} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }}/>
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    name="Người dùng mới" 
                                    stroke="#00d2d3" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#00d2d3' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardOverview;