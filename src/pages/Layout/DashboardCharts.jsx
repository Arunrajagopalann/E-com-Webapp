import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCharts = ({ dashboardStats }) => {
  // Sales data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales',
        data: [1200, 1900, 1500, 2400, 2700, 1700],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Products by category
  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Home', 'Books'],
    datasets: [
      {
        label: 'Products by Category',
        data: [25, 40, 15, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Customer insights data
  const customerData = {
    labels: ['New', 'Returning', 'Inactive'],
    datasets: [
      {
        label: 'Customer Types',
        data: [63, 25, 12],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
      },
    ],
  };

  // Top products data
  const topProductsData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
      {
        label: 'Sales',
        data: [120, 90, 80, 70, 60],
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-charts">
      <div className="chart-row">
        <div className="chart-container">
          <h3>Sales Overview</h3>
          <Line 
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              }
            }}
          />
        </div>
        <div className="chart-container">
          <h3>Top Products</h3>
          <Bar 
            data={topProductsData}
            options={{
              responsive: true,
              indexAxis: 'y',
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>
      <div className="chart-row">
        <div className="chart-container">
          <h3>Sales by Category</h3>
          <Pie data={categoryData} />
        </div>
        <div className="chart-container">
          <h3>Customer Insights</h3>
          <Pie data={customerData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;