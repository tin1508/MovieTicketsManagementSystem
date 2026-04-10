import React, { useEffect, useState } from 'react';
import { FaFilm, FaUsers, FaMoneyBillWave, FaTicketAlt } from 'react-icons/fa'; 
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
    LineChart, Line 
} from 'recharts';
import * as dashboardService from '../services/dashboardService';
import StatsCard from '../../src/pages/admin/StatsCard.jsx'; 
import '../styles/Dashboard.css'; 
import MovieRevenueTable from './admin/MovieRevenueTable.jsx'; 

const DashboardOverview = () => {
    // State
    const [stats, setStats] = useState(null);
    const [movieChartData, setMovieChartData] = useState([]);
    const [userChartData, setUserChartData] = useState([]);
    
    const [allMovieStats, setAllMovieStats] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [topMoviesData, setTopMoviesData] = useState([]);
    const [financialSummary, setFinancialSummary] = useState({ totalRevenue: 0, totalTickets: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const formatCurrency = (value) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const formatChartData = (dataMap) => {
        if (!dataMap) return [];
        return Object.keys(dataMap).map(key => ({ name: key, value: dataMap[key] }));
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                
                // 1. Load các API thống kê
                const allStats = await dashboardService.getAllStats();
                setStats(allStats);
                setMovieChartData(formatChartData(await dashboardService.getMoviesByMonth()));
                setUserChartData(formatChartData(await dashboardService.getUsersByMonth()));

                const revenueStats = await dashboardService.getDailyRevenueStats();
                const topMovies = await dashboardService.getTopMoviesStats();
                const allMovies = await dashboardService.getAllMovieStats();

                // 2. Xử lý dữ liệu an toàn (Ép kiểu số)
                const cleanRevenue = (Array.isArray(revenueStats) ? revenueStats : []).map(item => ({
                    ...item,
                    revenue: Number(item.revenue || 0),
                    ticketCount: Number(item.ticketCount || 0)
                }));

                const cleanTopMovies = (Array.isArray(topMovies) ? topMovies : []).map(item => ({
                    ...item,
                    revenue: Number(item.revenue || 0),
                    movieName: item.movieName || "Unknown"
                }));

                // Dữ liệu bảng chi tiết (Tất cả phim)
                const cleanAllMovies = (Array.isArray(allMovies) ? allMovies : []).map(item => ({
                    ...item,
                    revenue: Number(item.revenue || 0),
                    ticketCount: Number(item.ticketCount || 0)
                }));

                // 3. SET STATE
                setRevenueData(cleanRevenue);
                setTopMoviesData(cleanTopMovies);
                setAllMovieStats(cleanAllMovies);

                // --- FIX LỆCH TIỀN: Tính tổng dựa trên BẢNG CHI TIẾT (cleanAllMovies) ---
                // Thay vì tính từ biểu đồ ngày (có thể chứa rác), ta tính từ danh sách phim thực tế
                let totalRev = 0;
                let totalTic = 0;
                if (cleanAllMovies.length > 0) {
                    totalRev = cleanAllMovies.reduce((acc, curr) => acc + curr.revenue, 0);
                    totalTic = cleanAllMovies.reduce((acc, curr) => acc + curr.ticketCount, 0);
                }
                setFinancialSummary({ totalRevenue: totalRev, totalTickets: totalTic });

            } catch (error) {
                console.error("Lỗi tải dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Fake dữ liệu vẽ biểu đồ đường (nếu ít dữ liệu quá nó chỉ hiện 1 chấm)
    const displayRevenue = (!revenueData || revenueData.length < 2) 
        ? [ { date: '21/12', revenue: 0 }, { date: '22/12', revenue: 0 }, ...(revenueData || []) ]
        : revenueData;

    if (isLoading) return <p className="loading-text">Đang tải thống kê...</p>;

    return (
        <div className="dashboard-overview">
            <h2 className="page-title">Tổng Quan Hệ Thống</h2>

            {/* --- CARDS --- */}
            <div className="stats-grid">
                <StatsCard title="Doanh thu thực tế" value={formatCurrency(financialSummary.totalRevenue)} icon={<FaMoneyBillWave />} color="#2ecc71" />
                <StatsCard title="Vé đã bán" value={financialSummary.totalTickets} icon={<FaTicketAlt />} color="#e84393" />
                <StatsCard title="Tổng người dùng" value={stats?.users?.totalUsers || 0} icon={<FaUsers />} color="#00d2d3" />
                <StatsCard title="Phim Đang Chiếu" value={stats?.movies?.nowShowingCount || 0} icon={<FaFilm />} color="#ff9f43" />
            </div>

            {/* --- CHART 1: LINE CHART (Doanh thu ngày) --- */}
            <div className="charts-grid" style={{marginTop: '20px'}}>
                <div className="chart-box" style={{gridColumn: 'span 2'}}>
                    <h3>Biểu đồ doanh thu (7 ngày gần nhất)</h3>
                    <div style={{ width: '100%', height: 400 }}> 
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayRevenue} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" stroke="#a9b3c1" />
                                <YAxis stroke="#a9b3c1" tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : val} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e272e', border: 'none', color: '#fff' }} formatter={(val) => formatCurrency(val)} />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke="#2ecc71" strokeWidth={3} dot={{ r: 5, fill: '#2ecc71' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- CHART 2: BAR CHART (Top Phim) --- */}
            <div className="charts-grid">
                <div className="chart-box">
                    <h3>Top 5 Phim Doanh Thu Cao</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        {topMoviesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={topMoviesData} 
                                    layout="vertical" 
                                    // FIX CĂN CHỈNH: Left 0 để sát lề, vì YAxis width đã chiếm chỗ
                                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }} 
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                                    
                                    <XAxis type="number" stroke="#a9b3c1" tick={{ fill: '#a9b3c1' }} />
                                    
                                    <YAxis 
                                        dataKey="movieName" 
                                        type="category" 
                                        stroke="#fff" 
                                        width={110} // Độ rộng vừa đủ cho tên phim
                                        tick={{ fill: '#fff', fontSize: 13, fontWeight: 'bold' }} 
                                        interval={0}
                                    />
                                    
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e272e', border: 'none', color: '#fff' }} formatter={(val) => formatCurrency(val)} />
                                    
                                    <Bar 
                                        dataKey="revenue" 
                                        name="Doanh thu" 
                                        fill="#3498db" 
                                        barSize={35} // Cột to đẹp hơn
                                        radius={[0, 4, 4, 0]} 
                                    /> 
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa'}}>
                                Chưa có dữ liệu phim
                            </div>
                        )}
                    </div>
                </div>

                <div className="chart-box">
                    <h3>Người dùng đăng ký mới</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#a9b3c1" />
                                <YAxis stroke="#a9b3c1" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e272e', border: 'none', color: '#fff' }} />
                                <Line type="monotone" dataKey="value" name="User mới" stroke="#00d2d3" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="stats-grid"> 
                <div style={{ gridColumn: '1 / -1' }}>
                    <MovieRevenueTable data={allMovieStats} />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;