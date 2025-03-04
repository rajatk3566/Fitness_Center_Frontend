import { useState, useEffect } from "react";
import { getMembershipHistory, getMembershipDetails } from "@src/types/api";

interface MembershipHistoryItem {
  id: number;
  member: number;
  renewed_on: string;
  previous_end_date: string;
  new_end_date: string;
  renewal_type: string;
  amount_paid: string;
}

const MembershipHistoryComponent: React.FC = () => {
  const [memberId, setMemberId] = useState<number | null>(null);
  const [history, setHistory] = useState<MembershipHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemberId = async () => {
      try {
        setLoading(true);
        const data = await getMembershipDetails();
        if (data[0]?.member) {
          setMemberId(data[0].member);
        } else {
          setError("No active member found.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching member details"
        );
      }
    };

    fetchMemberId();
  }, []);

  useEffect(() => {
    if (!memberId) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getMembershipHistory(memberId);
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

    fetchHistory();
  }, [memberId]);

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
  if (!memberId)
    return <div className="text-red-500 py-4">No member found.</div>;
  if (history.length === 0)
    return (
      <div className="text-center py-4">No renewal history available.</div>
    );

  return (
    <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Membership Renewal History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                Date Renewed
              </th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                Previous End Date
              </th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                New End Date
              </th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                Renewal Type
              </th>
              <th className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                Amount Paid
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                  {formatDate(item.renewed_on)}
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                  {formatDate(item.previous_end_date)}
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                  {formatDate(item.new_end_date)}
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs md:text-sm">
                  {getRenewalTypeText(item.renewal_type)}
                </td>
                <td className="py-2 px-2 md:px-4 border text-xs md:text-sm">
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

export default MembershipHistoryComponent;
