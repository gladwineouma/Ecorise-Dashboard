import React from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { FaUsers, FaTshirt, FaStar, FaProductHunt, FaTruckPickup, FaMonero } from "react-icons/fa";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { usePickups } from '../hooks/useFetchPickups';
import { useProducts } from '../hooks/useFetchProducts';
import { useUsers } from '../hooks/useFetchUsers';
import { usePayment } from '../hooks/useFetchPayments';
function Dashboard() {
  const navigate = useNavigate();
  const { data: pickups, loading: pickupsLoading } = usePickups();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: payment, loading: paymentsLoading } = usePayment();
  const { data: users, loading, error } = useUsers();
  if (loading || pickupsLoading || productsLoading || paymentsLoading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard: {error}</p>;
  const totalMaterialPickups = pickups.length;
  const pendingPickupCount = pickups.filter(p => p.pickup_status === "Pending").length;
  const availableProduct = products.length;
  const totalAmountPaid = payment.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalPointsAwarded = payment.reduce((sum, p) => sum + (Number(p.points_award) || 0), 0);
  const totalTraders = users?.length || 0;
  const totalRecycledClothes = products.reduce((sum, product) => sum + product.quantity, 0);
  const totalMaterial = pickups.reduce((sum, pickup) => {
    const product = products.find(p => p.product_id === pickup.material);
    return sum + (product?.quantity || 0);
  }, 0);
  const recycledPercentage = totalMaterial > 0
    ? Math.min(100, Math.round((totalRecycledClothes / totalMaterial) * 100))
    : 0;
  const locationCounts = {};
  pickups.forEach(pickup => {
    const location = pickup.market_location;
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });
  const totalRequests = pickups.length;
  const marketRequests = Object.entries(locationCounts).map(([name, requests]) => ({
    name,
    percent: totalRequests ? ((requests / totalRequests) * 100).toFixed(1) : 0
  }));
  const formatKsh = (amount) =>
    `Ksh ${amount >= 1000 ? (amount / 1000).toFixed(1) + 'K' : amount.toLocaleString()}`;
  const items = [
    { icon: <FaUsers size={40} />, label: "Total traders", value: totalTraders, color: "#8b0000"},
    { icon: <FaTshirt size={40} />, label: "Total collected materials", value: totalMaterialPickups, color: "#8b0000" },
    { icon: <FaStar size={40} />, label: "Points awarded", value: totalPointsAwarded, color: "#8b0000" },
    { icon: <FaProductHunt size={40} />, label: "Available product reward", value: availableProduct, color: "#8b0000" },
    { icon: <FaTruckPickup size={40} />, label: "Pending pickup requests", value: pendingPickupCount, color: "#8b0000"},
    { icon: <FaMonero size={40} />, label: "Total amount paid", value: formatKsh(totalAmountPaid), color: "#8b0000" }
  ];
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const monthlyData = allMonths.map(month => ({
    month,
    products: 0,
    materials: 0
  }));
  products.forEach(product => {
    if (!product.listed_at) return;
    const date = new Date(product.listed_at);
    if (isNaN(date)) return;
    monthlyData[date.getMonth()].products += Number(product.price) || 0;
  });
  payment.forEach(p => {
    if (!p.paid_at) return;
    const date = new Date(p.paid_at);
    if (isNaN(date)) return;
    monthlyData[date.getMonth()].materials += Number(p.amount) || 0;
  });
  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.products, d.materials)), 1000);
  const yAxisLabels = [];
  const steps = 4;
  for (let i = steps; i >= 0; i--) {
    yAxisLabels.push(Math.round((maxValue / steps) * i));
  }
  return (
    
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="title">ECORISE</h1>
        </div>
        <div className="dashboard-stats-gauge-container">
          <div className="dashboard-stats">
            {items.map((item, idx) => (
              <div key={idx} className="dashboard-stat-card" onClick={() => navigate(item.route)}>
                <div className="stat-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className="stat-info">
                  <div className="stat-value">{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-gauge">
            <h3>Recycled Clothes</h3>
            <CircularProgressbar
              value={recycledPercentage}
              text={`${recycledPercentage}%`}
              styles={buildStyles({
                textColor: '#8b0000',
                pathColor: '#DA6304',
                trailColor: '#f0f0f0'
              })}
            />

          </div>
        </div>
        <div className="dashboard-content">
          <div className="money-spent-chart">
            <div className="chart-body">
              <div className="y-axis">
                {yAxisLabels.map((label, i) => (
                  <div key={i} className="y-axis-label">{formatKsh(label)}</div>
                ))}
              </div>
              <div className="bars-container">
                {monthlyData.map((data, index) => (
                  <div key={index} className="month-group">
                    <div className="bar-group">
                      <div
                        className="bar product-bar"
                        style={{ height: `${(data.products / maxValue) * 100}%` }}
                        title={`Products: ${formatKsh(data.products)}`}
                      />
                      <div
                        className="bar material-bar"
                        style={{ height: `${(data.materials / maxValue) * 100}%` }}
                        title={`Materials: ${formatKsh(data.materials)}`}
                      />
                    </div>
                    <div className="month-label">{data.month}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot product-dot"></span> Products
              </div>
              <div className="legend-item">
                <span className="legend-dot material-dot"></span> Materials
              </div>
            </div>
          </div>
          <div className="dashboard-market">
            <h3 className="market-title">Market Request Percentage</h3>
            <div className="market-list">
              {marketRequests.map((market, idx) => (
                <div className="market-row" key={idx}>
                  <span className="market-name">{market.name}</span>
                  <div className="market-bar-container">
                    <div className="market-bar" style={{ width: `${market.percent}%` }} />
                  </div>
                  <span className="market-percent">{market.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
  );
}
export default Dashboard;






