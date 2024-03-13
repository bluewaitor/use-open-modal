import ReactDOM from "react-dom/client";
import { UseOpenModalContextProvider } from "../dist/use-open-modal/context";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UseOpenModalContextProvider>
    <App />
  </UseOpenModalContextProvider>
);
