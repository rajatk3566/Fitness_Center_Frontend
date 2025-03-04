import { useState, useEffect } from "react";
import { getMembershipDetails, renewMembership } from "@src/types/api";

const MembershipRenewal = () => {
  const [membershipId, setMembershipId] = useState<number | null>(null);
  const [renewalType, setRenewalType] = useState("MONTHLY");
  const [amountPaid, setAmountPaid] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMembershipDetails = async () => {
      try {
        const data = await getMembershipDetails();
        if (data.length > 0 && data[0]?.id) {
          setMembershipId(data[0].id);
        } else {
          setMessage("Membership not found");
        }
      } catch (error) {
        setMessage("Error fetching membership details");
      }
    };

    fetchMembershipDetails();
  }, []);

  const handleRenew = async () => {
    try {
      if (!membershipId || !renewalType || !amountPaid) {
        setMessage("Please enter all required fields.");
        return;
      }
      const response = await renewMembership( renewalType, Number(amountPaid));
      setMessage(`Membership renewed until: ${response.new_end_date}. Amount Paid: ${amountPaid}`);
      setRenewalType("MONTHLY");
      setAmountPaid("");
    } catch (error) {
      setMessage("Membership not found");
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Renew Membership</h2>
      {membershipId === null ? (
        <p className="text-red-500">Membership not found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-600 rounded-md">
            <tbody>
              <tr>
                <td className="p-2 border border-gray-600">Renewal Type</td>
                <td className="p-2 border border-gray-600">
                  <select
                    value={renewalType}
                    onChange={(e) => setRenewalType(e.target.value)}
                    className="border border-gray-600 bg-gray-700 p-2 rounded-md w-full"
                  >
                    <option value="MONTHLY">1 Month</option>
                    <option value="QUARTERLY">4 Months</option>
                    <option value="YEARLY">1 Year</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-600">Amount Paid</td>
                <td className="p-2 border border-gray-600">
                  <input
                    type="number"
                    placeholder="Enter Amount Paid"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="border border-gray-600 bg-gray-700 p-2 rounded-md w-full"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleRenew}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Renew
          </button>
        </div>
      )}
      {message && (
        <div
          className={`mt-4 p-2 rounded-md ${
            message.includes("error") || message.includes("not found")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default MembershipRenewal;