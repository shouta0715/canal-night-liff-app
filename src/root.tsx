import liff from "@line/liff";
import { useEffect, useState } from "react";
import "@/global.css";
import { Provider } from "@/providers";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <Provider>
      <h1>create-liff-app</h1>

      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      <a
        href="https://developers.line.biz/ja/docs/liff/"
        rel="noreferrer"
        target="_blank"
      >
        LIFF Documentation
      </a>
    </Provider>
  );
}

export default App;
