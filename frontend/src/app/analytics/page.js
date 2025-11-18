"use client";
import { useEffect, useState } from "react";
import TokenSummaryCard from "../../components/analytics/TokenSummaryCard";
import TokenChart from "../../components/analytics/TokenChart";
import { apiRequest } from "../../utils/api";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cost, setCost] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest("/analytics/summary");
        setSummary(res.summary);
        console.log("Summary Chart", res)
        setChartData(res.chartData);
        const costData = await apiRequest("/analytics/cost");
        setCost(costData);
      } catch (err) {
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <div className="flex justify-center items-center h-screen text-indigo-600">Loading analytics...</div>;

  if (error)
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          Token Usage Dashboard 💡
        </h1>

        {/* ✅ Summary Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          <TokenSummaryCard title="Today" value={summary.today} color="text-green-600" />
          <TokenSummaryCard title="This Week" value={summary.week} color="text-blue-600" />
          <TokenSummaryCard title="This Month" value={summary.month} color="text-purple-600" />
          <TokenSummaryCard
            title="Remaining"
            value={summary.remaining}
            color={summary.remaining < 500 ? "text-red-500" : "text-indigo-600"}
            subtitle={`${summary.tokensUsed}/${summary.totalBudget} used`}
          />
        </div>

        {/* ✅ Line Chart */}
        <TokenChart data={chartData} />

        {/* ✅ Progress Bar */}
        <div className="bg-white shadow-md rounded-2xl p-4 mt-6">
          <h3 className="text-gray-700 font-semibold mb-2">Token Budget Usage</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                summary.usagePercent > 90 ? "bg-red-500" :
                summary.usagePercent > 75 ? "bg-yellow-400" :
                "bg-indigo-600"
              }`}
              style={{ width: `${(summary.tokensUsed / summary.totalBudget) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {((summary.tokensUsed / summary.totalBudget) * 100).toFixed(1)}% of budget used
          </p>
        </div>

        {/* ✅ Cost Estimate */}
        {cost && (
          <div className="bg-white shadow-md rounded-2xl p-4 text-center mt-6">
            <h3 className="text-gray-700 font-semibold mb-1">Estimated Cost 💰</h3>
            <p className="text-2xl text-indigo-700 font-bold">${cost.costUSD}</p>
            <p className="text-gray-500 text-sm mt-1">Based on {cost.tokensUsed} tokens used</p>
          </div>
        )}
      </div>
    </div>
  );
}
