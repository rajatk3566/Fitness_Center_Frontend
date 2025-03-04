import { useState, useEffect } from "react";
import axios from "axios";


const adminmembers: React.FC = () => {
    const [member, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<string>("");
    
      const API_BASE_URL = "http://localhost:8000/api";
    
      const getAccessToken = () => localStorage.getItem("token");

      useEffect(() => {
        fetchMembers();
      }, []);

      const fetchMembers = async () => {
        setLoading(true);
        setError("");
    
        const token = getAccessToken();
        if (!token) {
          setError("Authentication token missing! Please log in.");
          setLoading(false);
          return;
        }
    
        try {
          const response = await axios.get(`${API_BASE_URL}/admin/members/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          setMembers(response.data);
        } catch (err) {
          setError("Failed to fetch members. Please try again.");
        } finally {
          setLoading(false);
        }
      };


  return (
    <div className="p-4 md:p-10 text-white bg-gray-900 min-h-screen">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Members List
      </h2>

      {loading && <p>Loading memberships...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && member.length === 0 && <p>No memberships found.</p>}
      {!loading && member.length > 0  && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-300 p-2">first Name</th>
                <th className="border border-gray-300 p-2">user_id</th>                
              </tr>
            </thead>
            <tbody>
              {member.map((member) => (
                <tr key={member.id} className="text-center bg-gray-800">
                  <td className="border border-gray-300 p-2">
                    {member.first_name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {member.user}
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

export default adminmembers;
