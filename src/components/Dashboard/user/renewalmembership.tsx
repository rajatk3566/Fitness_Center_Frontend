import { useState, useEffect } from "react";
import { getMembershipDetails, renewMembership } from "@src/types/api";

const MembershipRenewal = () => {
  const [membershipId, setMembershipId] = useState<number | null>(null);
  const [renewalType, setRenewalType] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMembershipDetails = async () => {
    try {
      setLoading(true);
      const data = await getMembershipDetails();
      if (data[0]?.id) {
        setMembershipId(data[0].id);
      } else {
        setMessage("No active membership found.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Error fetching membership details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    try {
      if (!membershipId) throw new Error("Membership ID not found");

      const response = await renewMembership(
        membershipId,
        renewalType,
        Number(amountPaid)
      );

      setMessage(
        `Membership renewed until: ${response.new_end_date}. Amount Paid: ${amountPaid}`
      );
    } catch (error: unknown) {
      console.error(
        "Error in handleRenew:",
        error instanceof Error ? error.message : error
      );
      setMessage(
        error instanceof Error ? error.message : "Membership Not Found "
      );
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMembershipDetails();
    })();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">Renew Membership</h2>

      {loading ? (
        <p className="text-gray-600">Loading membership...</p>
      ) : membershipId ? (
        <p className="text-gray-600 mb-2">Membership ID: {membershipId}</p>
      ) : (
        <p className="text-red-500">No active membership</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={renewalType}
          onChange={(e) => setRenewalType(e.target.value)}
          className="border p-2 rounded-md w-full bg-white text-black"
        >
          <option value="">Select Duration</option>
          <option value="MONTHLY">1 Month</option>
          <option value="QUARTERLY">4 Months</option>
          <option value="YEARLY">1 Year</option>
        </select>

        <input
          type="number"
          placeholder="Enter Amount Paid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          className="border p-2 rounded-md w-full bg-white text-black"
        />
      </div>

      <button
        onClick={handleRenew}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
        disabled={!membershipId}
      >
        Renew
      </button>

      {message && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default MembershipRenewal;
