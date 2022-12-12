import { ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import theme from "./theme";

const rootDom = document.querySelector("#root") as HTMLElement;

ReactDOM.createRoot(rootDom).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </React.StrictMode>
);
