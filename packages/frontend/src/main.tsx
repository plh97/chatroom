import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const rootDom = document.querySelector("#root") as HTMLElement;

ReactDOM.createRoot(rootDom).render(<App />);
