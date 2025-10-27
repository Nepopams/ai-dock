import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container not found");
}

ReactDOM.createRoot(container).render(<App />);
