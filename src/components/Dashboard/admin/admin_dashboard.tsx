import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MembershipCreate from "@src/components/Dashboard/admin/admin_createMembership";
import MembershipList from "@src/components/Dashboard/admin/admin_membershiplist";
import AdminviewMebershihistory from "@src/components/Dashboard/admin/admin_viewMembershiphistory";
import Adminmembers from "@components/Dashboard/admin/admin_members";

const AdminHome: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [activeForm, setActiveForm] = useState<
    "member" | "membership" | "viewMemberships" | "renewHistory" | "members"|""
  >("");

  const API_BASE_URL = "http://localhost:8000/api";
  const getAccessToken = () => localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const token = getAccessToken();
    if (!token) {
      setError("Authentication token missing! Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/members/create/`,
        { user: 1, first_name: firstName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setFirstName("");
    } catch (err) {
      setError("An error occurred while creating the member.");
    } finally {
      setLoading(false);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setActiveForm("");
      }
    };

    if (activeForm) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeForm]);

  const handleMembershipSuccess = () => {
    setSuccessMessage("Membership operation completed successfully!");
  };

  return (
    <div className="p-4 md:p-6 relative min-h-screen bg-gray-900 text-white flex flex-col items-center w-full max-w-7xl mx-auto">
      <div className="absolute top-4 right-4 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
        <span className="text-lg font-semibold">Welcome</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center mt-16 md:mt-0">
        Admin Dashboard
      </h1>
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-lg mb-6">
        <button
          onClick={() =>
            setActiveForm(activeForm === "membership" ? "" : "membership")
          }
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Create Membership
        </button>
        <button
          onClick={() =>
            setActiveForm(
              activeForm === "viewMemberships" ? "" : "viewMemberships"
            )
          }
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          View Memberships
        </button>
        <button
          onClick={() =>
            setActiveForm(activeForm === "renewHistory" ? "" : "renewHistory")
          }
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          Renew Memberships
        </button>
        <button
          onClick={() =>
            setActiveForm(activeForm === "members" ? "" : "members")
          }
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
        >
          view Members
        </button>
      </div>
      <div ref={formRef} className="w-full max-w-4xl">
        {activeForm === "member" && (
          <div className="bg-white shadow-md rounded-lg p-4 text-black">
            <h2 className="text-lg font-semibold mb-3">Create New Member</h2>
            <form
              onSubmit={handleCreateMember}
              className="flex flex-col space-y-3"
            >
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="First Name"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {loading ? "Creating..." : "Create Member"}
              </button>
              
            </form>
            {error && <div className="mt-2 text-red-500">{error}</div>}
            {successMessage && (
              <div className="mt-2 text-green-500">{successMessage}</div>
            )}
          </div>
        )}
        {activeForm === "membership" && (
          <MembershipCreate onSubmitSuccess={handleMembershipSuccess} />
        )}
        {activeForm === "viewMemberships" && <MembershipList />}
        {activeForm === "renewHistory" && <AdminviewMebershihistory />}
        {activeForm === "members" && <Adminmembers />}
      </div>
    </div>
  );
};

export default AdminHome;
