import { PrimeReactProvider } from "primereact/api";
import "./App.css";
import { ListAccounts } from "./components/ListAccounts";
import "@ant-design/v5-patch-for-react-19";
import { useEffect } from "react";
import { api } from "./services/apiClient";

export const App = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      api.get("/accounts/test").catch(() => {});
    }, 5 * 60 * 1000); // 5 dakikada bir
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ListAccounts />
    </>
  );
};

export default App;
