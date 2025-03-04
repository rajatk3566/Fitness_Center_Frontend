import { useState, useEffect } from "react";
import { getRenewHistory } from "@src/types/api";

interface MembershipHistoryItem {
  id: number;
  member_id: number;
  member_name: string; // ✅ Added this
  renewed_on: string;
  previous_end_date: string;
  new_end_date: string;
  renewal_type: string;
  amount_paid: string;
}

const AdminViewMembershipHistory: React.FC = () => {
  const [history, setHistory] = useState<MembershipHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFullHistory = async () => {
      try {
        setLoading(true);
        const data = await getRenewHistory();
        console.log("Fetched renewal history:", data);
        setHistory(data);
      } catch (err) {
        console.error("Error fetching renewal history:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch renewal history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFullHistory();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRenewalTypeText = (type: string) => {
    const types = {
      MONTHLY: "1 Month",
      QUARTERLY: "4 Months",
      YEARLY: "1 Year",
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;
  if (history.length === 0)
    return (
      <div className="text-center py-4">No renewal history available.</div>
    );

  return (
    <div className="p-4 md:p-10 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Membership Renewal History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-white">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Member Name</th> {/* ✅ Added */}
              <th className="border border-gray-300 p-2">Date Renewed</th>
              <th className="border border-gray-300 p-2">Previous End Date</th>
              <th className="border border-gray-300 p-2">New End Date</th>
              <th className="border border-gray-300 p-2">Renewal Type</th>
              <th className="border border-gray-300 p-2">Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="text-center bg-gray-800">
                <td className="border border-gray-300 p-2">{item.member_name}</td> {/* ✅ Added */}
                <td className="border border-gray-300 p-2">
                  {formatDate(item.renewed_on)}
                </td>
                <td className="border border-gray-300 p-2">
                  {formatDate(item.previous_end_date)}
                </td>
                <td className="border border-gray-300 p-2">
                  {formatDate(item.new_end_date)}
                </td>
                <td className="border border-gray-300 p-2">
                  {getRenewalTypeText(item.renewal_type)}
                </td>
                <td className="border border-gray-300 p-2">
                  Rs {parseFloat(item.amount_paid).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminViewMembershipHistory;
