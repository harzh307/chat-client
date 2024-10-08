import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.ts";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();
