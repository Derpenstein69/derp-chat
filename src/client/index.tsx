/**
 * @file index.tsx
 * @description Main application component and related components for managing the chat interface.
 * @module Client
 */

import { createRoot } from "react-dom/client";
import { Routing } from "./Routing";
import { ErrorBoundary } from "./ErrorHandling";
import React, { Suspense, lazy } from "react";

// Lazy load the Routing component
const LazyRouting = lazy(() => import("./Routing"));

// Render the application
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <LazyRouting />
    </Suspense>
  </ErrorBoundary>,
);
