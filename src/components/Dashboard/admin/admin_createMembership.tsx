import { useState, useEffect } from "react";
import axios from "axios";

interface MembershipData {
  id?: number;
  member: string;
  member_name: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  amount_paid: string;
  payment_date?: string;
}

interface MembershipCreateProps {
  isEditing?: boolean;
  membershipData?: MembershipData;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const MembershipCreate: React.FC<MembershipCreateProps> = ({
  isEditing = false,
  membershipData,
  onSubmitSuccess,
  onCancel,
}) => {
  const [memberId, setMemberId] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [membershipType, setMembershipType] = useState<string>("MONTHLY");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const API_BASE_URL = "http://localhost:8000/api";

  const getAccessToken = () => localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (isEditing && membershipData) {
      setMemberId(membershipData.member || "");
      setMemberName(membershipData.member_name || "");
      setMembershipType(membershipData.membership_type || "MONTHLY");
      setStartDate(membershipData.start_date || "");
      setEndDate(membershipData.end_date || "");
      setAmountPaid(membershipData.amount_paid || "");
      setPaymentDate(membershipData.payment_date || "");
    }
  }, [isEditing, membershipData]);

  const validateDates = () => {
    if (!startDate || !endDate) {
      setError("Start Date and End Date are required.");
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End Date must be after Start Date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!validateDates()) {
      setLoading(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setError("Authentication token missing! Please log in.");
      setLoading(false);
      return;
    }

    const membershipPayload = {
      member: memberId,
      member_name: memberName,
      membership_type: membershipType,
      start_date: startDate,
      end_date: endDate,
      amount_paid: amountPaid,
      payment_date: paymentDate,
    };

    try {
      let response;

      if (isEditing && membershipData?.id) {
        response = await axios.put(
          `${API_BASE_URL}/admin/memberships/${membershipData.id}/update/`,
          membershipPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage("Membership updated successfully!");
      } else {
        response = await axios.post(
          `${API_BASE_URL}/admin/memberships/create/`,
          membershipPayload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage(
          response.data.message || "Membership created successfully!"
        );
        if (!isEditing) {
          setMemberId("");
          setMemberName("");
          setMembershipType("MONTHLY");
          setStartDate("");
          setEndDate("");
          setAmountPaid("");
          setPaymentDate("");
        }
      }
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
        } else {
          setError(
            err.response.data.error || "An error occurred. Please try again."
          );
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      <div className="bg-gray-800 shadow-md rounded-lg p-4 md:p-6 text-white">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          {isEditing ? "Edit Membership" : "Create New Membership"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Member ID"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white h-10"
              required
              disabled={isEditing} 
            />
            <input
              type="text"
              placeholder="Member Name"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white h-10"
              required
            />
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white h-10"
                required
              />
            </div>
            <select 
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white h-10"
              required
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
            <input
              type="number"
              placeholder="Amount Paid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white h-10"
              required
            />
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="border border-gray-600 bg-gray-700 p-2 rounded-md text-white"
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              {loading
                ? "Processing..."
                : isEditing
                ? "Update Membership"
                : "Create Membership"}
            </button>
            {isEditing && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && (
          <div className="text-red-400 mt-4 text-sm md:text-base">{error}</div>
        )}
        {successMessage && (
          <div className="text-green-400 mt-4 text-sm md:text-base">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCreate;
