import { useState } from "react";
import MembershipRenewal from "@components/Dashboard/user/renewalmembership";
import UserMembership from "@components/Dashboard/user/usermembership";
import MembershipHistoryComponent from "@components/Dashboard/user/membershipHistory";

const UserHome = () => {
  const [selectedComponent, setSelectedComponent] = useState<"membership" | "renewal">("membership");

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
      <h1 className="text-2xl font-bold mb-6 text-center text-white">
        User Dashboard
      </h1>
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setSelectedComponent("membership")}
          className={`px-4 py-2 rounded text-white ${
            selectedComponent === "membership" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Show Active Membership
        </button>

        <button
          onClick={() => setSelectedComponent("renewal")}
          className={`px-4 py-2 rounded text-white ${
            selectedComponent === "renewal" ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          Renew Membership
        </button>
      </div>
      {selectedComponent === "membership" ? <UserMembership /> : <MembershipRenewal />}
      <div className="mt-8">
        <MembershipHistoryComponent />
      </div>
    </div>
  );
};

export default UserHome;