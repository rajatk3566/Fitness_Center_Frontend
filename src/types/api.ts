import axios from "axios";

const API_URL = "http://localhost:8000/api";
const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });

export const renewMembership = async (membershipId: number, renewalType: string, amountPaid: number) => {
    try {
        const response = await axios.post(`${API_URL}/memberships/${membershipId}/renew/`, 
        { renewal_type: renewalType, amount_paid: amountPaid }, 
        { headers: getAuthHeaders() });
        return response.data;
    } catch (error: unknown) {
        throw axios.isAxiosError(error) ? error.response?.data || "Error renewing membership" : "Unexpected error";
    }
};


export const getMembershipDetails = async () => {
    try {
        const response = await axios.get(`${API_URL}/memberships/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: unknown) {
        throw axios.isAxiosError(error) ? error.response?.data || "Error fetching membership details" : "Unexpected error";
    }
};

export const getMembershipHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/memberships/history/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: unknown) {
        throw axios.isAxiosError(error) ? error.response?.data || "Error fetching membership history" : "Unexpected error";
    }
};



export const getRenewHistory = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/history/`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error: unknown) {
        throw axios.isAxiosError(error) ? error.response?.data || "Error fetching membership history" : "Unexpected error";
    }
};
