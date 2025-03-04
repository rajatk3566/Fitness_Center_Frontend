import { useState, useEffect } from "react";
import axios from "axios";

const UserMembership: React.FC = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const API_BASE_URL = "http://localhost:8000/api";

  const getAccessToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    setLoading(true);
    setError("");

    const token = getAccessToken();
    if (!token) {
      setError("Authentication token missing! Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/membershipshistory/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMemberships(response.data);
    } catch (err) {
      setError("Failed to fetch memberships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Membership List
      </h2>

      {loading && <p>Loading memberships...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && memberships.length === 0 && <p>No memberships found.</p>}

      {!loading && memberships.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-300 p-2">Member Name</th>
                <th className="border border-gray-300 p-2">Start Date</th>
                <th className="border border-gray-300 p-2">End Date</th>
                <th className="border border-gray-300 p-2">Membership Type</th>
                <th className="border border-gray-300 p-2">Amount Paid</th>
                <th className="border border-gray-300 p-2">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id} className="text-center bg-gray-800">
                  <td className="border border-gray-300 p-2">{membership.member_name}</td>
                  <td className="border border-gray-300 p-2">{membership.start_date}</td>
                  <td className="border border-gray-300 p-2">{membership.end_date}</td>
                  <td className="border border-gray-300 p-2">{membership.membership_type}</td>
                  <td className="border border-gray-300 p-2">{membership.amount_paid}</td>
                  <td className="border border-gray-300 p-2">{membership.payment_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserMembership;
