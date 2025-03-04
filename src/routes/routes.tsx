import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import HomePage from "@components/home/home";
import Loginpage from "@components/Auth/login";
import Registerpage from "@components/Auth/register";
import AdminHome from "@src/components/Dashboard/admin/admin_dashboard";
import UserHome from "@src/components/Dashboard/user/user_dashboard";
import MembershipRenewal from "@components/Dashboard/user/renewalmembership";
import AdminHistoryView  from "@src/components/Dashboard/admin/admin_viewMebershihistory";



const AdminRoute: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("is_admin") || "false");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (!isAdmin) {
      navigate("/userhome", { replace: true });
    }
  }, [token, isAdmin, navigate]);

  return token && isAdmin ? <Outlet /> : null;
};

const UserRoute: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("is_admin") || "false");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    } else if (isAdmin) {
      navigate("/adminhome", { replace: true });
    }
  }, [token, isAdmin, navigate]);

  return token && !isAdmin ? <Outlet /> : null;
};


export const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <Loginpage /> },
  { path: "/register", element: <Registerpage /> },

  {
    element: <AdminRoute />,
    children: [{ path: "/adminhome", element: <AdminHome /> }],
  },
  {
    element: <UserRoute />,
    children: [
      { path: "/userhome", element: <UserHome /> },
      
      { path: "/membership/:membershipId/renew", element: <MembershipRenewal /> }, 

      { path: "/membership/history", element: <AdminHistoryView /> }, 
    ],
  },
]);
