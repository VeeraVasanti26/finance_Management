import Record from '../models/record.model.js';

const getSummary = async () => {
  const records = await Record.find({ isDeleted: { $ne: true } });
  
  const totalIncome = records
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
    
  const totalExpenses = records
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
    
  const netBalance = totalIncome - totalExpenses;

  // Category-wise totals (separated by type)
  const categoryTotals = records.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = {};
    acc[r.type][r.category] = (acc[r.type][r.category] || 0) + r.amount;
    return acc;
  }, { income: {}, expense: {} });

  // Monthly Trend (Last 6 months)
  const monthlyTrend = records.reduce((acc, r) => {
    const month = new Date(r.date).toLocaleString('default', { month: 'short' });
    const year = new Date(r.date).getFullYear();
    const key = `${month} ${year}`;
    
    if (!acc[key]) {
      acc[key] = { month: key, income: 0, expense: 0, sortKey: new Date(r.date).getTime() };
    }
    
    if (r.type === 'income') acc[key].income += r.amount;
    else acc[key].expense += r.amount;
    
    return acc;
  }, {});

  const sortedTrend = Object.values(monthlyTrend)
    .sort((a, b) => a.sortKey - b.sortKey)
    .slice(-6)
    .map(({ month, income, expense }) => ({ month, income, expense }));

  const recentActivity = await Record.find({ isDeleted: { $ne: true } }).sort('-date').limit(6);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    monthlyTrend: sortedTrend,
    recentActivity,
  };
};

export default { getSummary };
