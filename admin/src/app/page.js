"use client";

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ ordersToday: 24, salesToday: 18450, newCustomers: 7 });
  const [recentOrders, setRecentOrders] = useState([
    { id: '#BM1024', customer: 'Aravind', items: 'Chicken Curry Cut (1kg), Chicken Breast (1kg)', total: 840, status: 'CONFIRMED' },
    { id: '#BM1023', customer: 'Sneha', items: 'Mutton Curry Cut (500g)', total: 1240, status: 'PROCESSING' },
    { id: '#BM1022', customer: 'Rahul', items: 'Rohu Fish (1kg)', total: 680, status: 'DELIVERED' },
  ]);

  // In a real app, we would fetch from our Node.js backend:
  // useEffect(() => {
  //   fetch('http://localhost:5000/api/admin/dashboard', { headers: { Authorization: \`Bearer \${token}\` } })
  //     .then(res => res.json())
  //     .then(data => { setStats(data.stats); setRecentOrders(data.recentOrders); });
  // }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'PROCESSING': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'PACKED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'DELIVERED': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Today's Overview</h2>
        <p className="text-gray-400 mt-1">Real-time metrics for Bushman Meat operations.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Orders Today</div>
          <div className="text-4xl font-black text-white">{stats.ordersToday}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Sales Today</div>
          <div className="text-4xl font-black text-red-500">{formatCurrency(stats.salesToday)}</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <div className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">New Customers</div>
          <div className="text-4xl font-black text-white">{stats.newCustomers}</div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <button className="text-sm font-medium text-red-500 hover:text-red-400">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121212]">
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#1a1a1a] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{formatCurrency(order.total)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={\`px-2.5 py-1 text-xs font-bold rounded-full border \${getStatusColor(order.status)}\`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-white bg-[#262626] px-3 py-1.5 rounded transition opacity-0 group-hover:opacity-100">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
