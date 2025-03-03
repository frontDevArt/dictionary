import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DictionaryTable from "../components/Dictionary/DictionaryTable";

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <DictionaryTable />}
    </div>
  );
};

export default DashboardPage;
