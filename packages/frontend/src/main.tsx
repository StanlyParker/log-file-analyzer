import { createRoot } from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";

const el = document.getElementById("root");

if (!el) throw new Error("Root element not found.");
createRoot(el).render(<App />);
