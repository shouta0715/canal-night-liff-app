import { Suspense } from "react";
import "@/global.css";
import { ErrorBoundary } from "react-error-boundary";

import { DrawingApp } from "@/features/drawing/components";
import { Provider } from "@/providers";

function App() {
  return (
    <ErrorBoundary
      fallback={
        <p className="text-center">
          予期せぬエラーが発生しました。ページをリロードしてください。
        </p>
      }
    >
      <Provider>
        <ErrorBoundary
          fallback={
            <p className="text-center">
              予期せぬエラーが発生しました。ページをリロードしてください。
            </p>
          }
        >
          <Suspense fallback={<p className="text-center">Lineに接続中...</p>}>
            {/* <LineAuthProvider> */}
            <DrawingApp />
            {/* </LineAuthProvider> */}
          </Suspense>
        </ErrorBoundary>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
