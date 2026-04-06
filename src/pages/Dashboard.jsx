import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import Card from '../components/common/Card';
import { AuthContext } from '../context/AuthContext';
import { getCurrencySymbol, formatCurrency } from '../utils/currency';
import { TrendingUp, TrendingDown, Wallet, PieChart, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
} from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const primaryCurrency = user?.primaryCurrency || 'INR';
  const currencySymbol = getCurrencySymbol(primaryCurrency);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setSummary(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;

  const stats = [
    { title: 'Total Income', value: summary?.totalIncome || 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Expenses', value: summary?.totalExpenses || 0, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Net Balance', value: summary?.netBalance || 0, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const expensePieData = Object.entries(summary?.categoryTotals?.expense || {}).map(([name, value]) => ({ name, value }));
  const incomeCategoryTotals = Object.entries(summary?.categoryTotals?.income || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} contentClassName="p-4" className="hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{formatCurrency(stat.value, primaryCurrency)}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card title="Monthly Trend" icon={TrendingUp} contentClassName="p-4">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={summary?.monthlyTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name) => [formatCurrency(value, primaryCurrency), name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title="Income Distribution" icon={PieChart} contentClassName="p-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[220px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RePieChart>
                  <Pie
                    data={incomeCategoryTotals}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {incomeCategoryTotals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none transition-all duration-300 hover:opacity-80 cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = incomeCategoryTotals.reduce((sum, item) => sum + item.value, 0);
                        const percent = ((data.value / total) * 100).toFixed(1);
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-50 text-[11px]">
                            <p className="font-bold text-gray-900 mb-1 uppercase tracking-wider">{data.name}</p>
                            <div className="space-y-0.5">
                              <p className="text-gray-500 flex justify-between gap-4">Amount: <span className="font-bold text-gray-900">{formatCurrency(data.value, primaryCurrency)}</span></p>
                              <p className="text-gray-500 flex justify-between gap-4">Share: <span className="font-bold text-green-600">{percent}%</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2.5">
              {incomeCategoryTotals.length > 0 ? incomeCategoryTotals.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-600 truncate font-medium">{item.name}</span>
                  <span className="font-bold ml-auto text-gray-900">{formatCurrency(item.value, primaryCurrency)}</span>
                </div>
              )) : (
                <p className="text-xs text-gray-400 italic text-center py-4">No income data available</p>
              )}
            </div>
          </div>
        </Card>

        <Card title="Expense Distribution" icon={PieChart} contentClassName="p-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-[220px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RePieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none transition-all duration-300 hover:opacity-80 cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const total = expensePieData.reduce((sum, item) => sum + item.value, 0);
                        const percent = ((data.value / total) * 100).toFixed(1);
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-50 text-[11px]">
                            <p className="font-bold text-gray-900 mb-1 uppercase tracking-wider">{data.name}</p>
                            <div className="space-y-0.5">
                              <p className="text-gray-500 flex justify-between gap-4">Amount: <span className="font-bold text-gray-900">{formatCurrency(data.value, primaryCurrency)}</span></p>
                              <p className="text-gray-500 flex justify-between gap-4">Share: <span className="font-bold text-indigo-600">{percent}%</span></p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-2.5">
              {expensePieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-gray-600 truncate font-medium">{item.name}</span>
                  <span className="font-bold ml-auto text-gray-900">{formatCurrency(item.value, primaryCurrency)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card title="Category Wise Totals" icon={PieChart} contentClassName="p-4" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Income Categories
              </h4>
              <div className="space-y-3">
                {incomeCategoryTotals.length > 0 ? (
                  incomeCategoryTotals.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-green-50/30 border border-green-100/50">
                      <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-green-700">{formatCurrency(item.value, primaryCurrency)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No income categories found.</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingDown size={14} /> Expense Categories
              </h4>
              <div className="space-y-3">
                {expensePieData.length > 0 ? (
                  expensePieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-red-50/30 border border-red-100/50">
                      <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                      <span className="text-sm font-bold text-red-700">{formatCurrency(item.value, primaryCurrency)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No expense categories found.</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity" icon={Clock} contentClassName="p-4" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary?.recentActivity?.length > 0 ? (
              summary.recentActivity.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${record.type === 'income' ? 'bg-green-100/50 text-green-700' : 'bg-red-100/50 text-red-700'}`}>
                      {record.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{record.category}</p>
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount, record.currency)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8 col-span-full">No recent activity found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
