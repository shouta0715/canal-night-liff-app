import { Suspense, useEffect } from "react";
import "@/global.css";
import { ErrorBoundary } from "react-error-boundary";

import { DrawingApp } from "@/features/drawing/components";
import { LineAuthProvider, Provider } from "@/providers";

function App() {
  useEffect(() => {
    // スクロール禁止
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <ErrorBoundary
      fallback={<p>Something went wrong. Please refresh the page.</p>}
    >
      <Provider>
        <ErrorBoundary
          fallback={<p>LineAuthProvider failed. Please refresh the page.</p>}
        >
          <Suspense fallback={<p>Loading...</p>}>
            <LineAuthProvider>
              <DrawingApp />
            </LineAuthProvider>
          </Suspense>
        </ErrorBoundary>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
