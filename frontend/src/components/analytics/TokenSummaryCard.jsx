// src/components/analytics/TokenSummaryCard.jsx
export default function TokenSummaryCard({ title, value, color = "text-indigo-600", subtitle }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full sm:w-1/4 flex flex-col justify-center items-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}
