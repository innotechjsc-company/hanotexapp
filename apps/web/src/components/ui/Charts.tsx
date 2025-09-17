'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  className?: string;
}

export function LineChart({ className = '' }: ChartProps) {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Technologies',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Users',
        data: [2, 3, 20, 5, 1, 4],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Growth Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <Line data={data} options={options} />
    </div>
  );
}

export function BarChart({ className = '' }: ChartProps) {
  const data = {
    labels: ['Technology', 'Users', 'Auctions', 'Revenue'],
    datasets: [
      {
        label: 'Count',
        data: [65, 59, 80, 81],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'System Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function DoughnutChart({ className = '' }: ChartProps) {
  const data = {
    labels: ['Approved', 'Pending', 'Rejected', 'Draft'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Technology Status Distribution',
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function RevenueChart({ className = '' }: ChartProps) {
  const data = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12000, 19000, 15000, 25000],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Quarterly Revenue',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <Line data={data} options={options} />
    </div>
  );
}

export function UserGrowthChart({ className = '' }: ChartProps) {
  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Users',
        data: [65, 59, 80, 81],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly User Growth',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <Bar data={data} options={options} />
    </div>
  );
}
