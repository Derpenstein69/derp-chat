/**
 * @file index.tsx
 * @description Main application component and related components for managing the chat interface.
 * @module Client
 */

import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./ErrorHandling";
import React, { Suspense, lazy } from "react";

// Lazy load the Routing component
const LazyRouting = lazy(() => import("./Routing"));

/**
 * Renders the main application component.
 * Uses ErrorBoundary to catch and handle errors in the component tree.
 * Uses Suspense to lazy load the Routing component.
 * 
 * @example
 * <App />
 */
function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyRouting />
      </Suspense>
    </ErrorBoundary>
  );
}

// Render the application
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(<App />);
