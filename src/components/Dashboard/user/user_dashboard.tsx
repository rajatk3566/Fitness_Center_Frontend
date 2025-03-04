import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MembershipRenewal from "@components/Dashboard/user/renewalmembership";
import MembershipHistoryComponent from "@components/Dashboard/user/membershipHistory";


const UserHome = () => {
  const navigate = useNavigate();
  const [, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const [] = await Promise.all([
        axios.get("http://localhost:8000/api/members/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/api/members/history/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
    } catch (error) {
      setError("Failed to fetch data.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if no token
      return;
    }
    fetchData(token);
  }, [navigate, fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="absolute top-4 right-4 flex items-center space-x-4">
        <span className="text-lg font-semibold text-white">Welcome</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 text-center text-white">User Dashboard</h1>

      <MembershipRenewal  />
      <MembershipHistoryComponent/>
    </div>
  );
};

export default UserHome;
