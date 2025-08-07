import { PrimeReactProvider } from "primereact/api";
import "./App.css";
import { ListAccounts } from "./components/ListAccounts";
import "@ant-design/v5-patch-for-react-19";

export const App = () => {
  return (
    <>
      <ListAccounts />
    </>
  );
};

export default App;
