import { useState, useEffect } from "react";
import axios from "axios";
import MembershipCreate from "./admin_createMembership";

const MembershipList: React.FC = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);

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
      const response = await axios.get(`${API_BASE_URL}/memberships/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMemberships(response.data);
    } catch (err) {
      setError("Failed to fetch memberships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this membership?")) return;

    try {
      const token = getAccessToken();
      await axios.delete(`${API_BASE_URL}/admin/memberships/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMemberships(memberships.filter((m) => m.id !== id));
    } catch (err) {
      setError("Failed to delete membership.");
    }
  };

  const handleEditClick = (membership: any) => {
    setEditingId(membership.id);
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditSuccess = () => {
    setEditingId(null);
    fetchMemberships();
  };

  return (
    <div className="p-4 md:p-10 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Memberships List
      </h2>

      {editingId !== null && (
        <div className="mb-8">
          <MembershipCreate
            isEditing={true}
            membershipData={memberships.find((m) => m.id === editingId)}
            onSubmitSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      )}

      {loading && <p>Loading memberships...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && memberships.length === 0 && <p>No memberships found.</p>}
      {!loading && memberships.length > 0 && !editingId && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-300 p-2">Member ID</th>
                <th className="border border-gray-300 p-2">Member Name</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Start Date</th>
                <th className="border border-gray-300 p-2">End Date</th>
                <th className="border border-gray-300 p-2">Amount Paid</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <tr key={membership.id} className="text-center bg-gray-800">
                  <td className="border border-gray-300 p-2">
                    {membership.member}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {membership.member_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {membership.membership_type}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {membership.start_date}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {membership.end_date}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {membership.amount_paid}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(membership)}
                        className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(membership.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MembershipList;
