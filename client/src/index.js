import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hydrate, render } from "react-dom";

import MainPage from "./pages/MainPage";
import { GIProvider } from "./context";

import "./theme.css";

// font is marmelad for favicon
require("../public/favicon.ico");

const rootElement = document.getElementById("root");

render(
  <GIProvider>
    <Router>
      <MainPage />
    </Router>
  </GIProvider>,
  rootElement
);
