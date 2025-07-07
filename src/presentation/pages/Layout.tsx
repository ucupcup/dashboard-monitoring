import { Dashboard } from "../components/organisms/Dashboard/Dashboard";
import { LoginPage } from "./Login/LoginPage";

export const Layout = () => {
  const token = localStorage.getItem("token");
  return <>{token ? <Dashboard /> : <LoginPage />}</>;
};
