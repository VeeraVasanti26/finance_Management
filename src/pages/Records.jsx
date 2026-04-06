import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { Plus, Filter, Trash2, Edit2, Search } from 'lucide-react';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ amount: '', type: 'expense', category: '', notes: '', date: new Date().toISOString().split('T')[0] });
  const [filters, setFilters] = useState({ type: '', category: '', search: '', startDate: '', endDate: '', page: 1, limit: 10 });
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const { user } = useAuth();

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', filters.page);
      params.append('limit', filters.limit);
      
      const res = await api.get(`/records?${params.toString()}`);
      setRecords(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filters.type, filters.category, filters.startDate, filters.endDate, filters.page, filters.limit]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page !== 1) {
        setFilters(prev => ({ ...prev, page: 1 }));
      } else {
        fetchRecords();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/records/${editingId}`, formData);
      } else {
        await api.post('/records', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ amount: '', type: 'expense', category: '', notes: '', date: new Date().toISOString().split('T')[0] });
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} record`);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record._id);
    setFormData({
      amount: record.amount,
      type: record.type,
      category: record.category,
      notes: record.notes || '',
      date: new Date(record.date).toISOString().split('T')[0]
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api.delete(`/records/${id}`);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Financial Records</h2>
        {user?.role === 'admin' && (
          <button
            onClick={() => {
              if (showForm && editingId) {
                setEditingId(null);
                setFormData({ amount: '', type: 'expense', category: '', notes: '', date: new Date().toISOString().split('T')[0] });
              }
              setShowForm(!showForm);
            }}
            className={`${editingId ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-100`}
          >
            {editingId ? <Plus className="rotate-45" size={20} /> : <Plus size={20} />}
            {editingId ? 'Cancel Edit' : 'Add Record'}
          </button>
        )}
      </div>

      {showForm && (
        <Card title={editingId ? 'Edit Record' : 'New Record'} className="animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
              <select
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Salary, Rent"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Optional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="flex items-end md:col-span-3 gap-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                {editingId ? 'Update Record' : 'Save Record'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ amount: '', type: 'expense', category: '', notes: '', date: new Date().toISOString().split('T')[0] });
                }}
                className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-gray-500 uppercase">Filters:</span>
          </div>
          <select
            className="text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
              title="Start Date"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              className="text-sm bg-white border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
              title="End Date"
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search category or notes..."
              className="w-full text-sm bg-white border border-gray-200 rounded-md pl-10 pr-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Notes</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                {user?.role === 'admin' && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">Loading records...</td>
                </tr>
              ) : records.length > 0 ? (
                records.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{record.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[200px]">{record.notes || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        record.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold ${
                      record.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString()}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-indigo-400 hover:text-indigo-600 p-1 transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/30 gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-700">{(filters.page - 1) * filters.limit + 1}</span> to <span className="font-bold text-gray-700">{Math.min(filters.page * filters.limit, pagination.total)}</span> of <span className="font-bold text-gray-700">{pagination.total}</span> records
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
              >
                Prev
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first, last, and pages around current
                if (
                  pageNum === 1 || 
                  pageNum === pagination.pages || 
                  (pageNum >= filters.page - 1 && pageNum <= filters.page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                      className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                        filters.page === pageNum
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                // Show ellipsis
                if (pageNum === 2 || pageNum === pagination.pages - 1) {
                  return <span key={pageNum} className="px-1 text-gray-400 text-xs">...</span>;
                }
                return null;
              })}

              <button
                disabled={filters.page === pagination.pages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1.5 text-xs font-bold border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Records;
