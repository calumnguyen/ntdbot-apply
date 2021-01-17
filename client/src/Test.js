import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import "./styles.css";
// import TextField from "@material-ui/core/TextField";

import Barcode from "react-hooks-barcode";

export default function Test() {
  const config = {
    background: "#f5f5f5",
    marginTop: "20px",
    marginBottom: "20px",
    width: 1
  };

  const [value, setValue] = useState("https://reactjs.org");
  const [message, setMessage] = useState(null);

  useEffect(
    () => {
      if (!value) {
        setMessage("Please enter a value");
      } else setMessage(null);
    },
    [value]
  );

  return (
    <div className="Test">
      <h2>React Hooks Barcode Demo</h2>
      <input
        label="Enter value here"
        value={value}
        onChange={e => setValue(e.target.value)}
        margin="normal"
      />
      <br />
      <br />
      <Barcode value={value} {...config} />
      {message && <p>{message}</p>}
    </div>
  );
}