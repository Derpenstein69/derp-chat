import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { nanoid } from "nanoid";
import { App } from "./ChatInterface";
import { ProfileSettings } from "./UIComponents";
import { CloudflareSecretsSettings } from "./UIComponents";

/**
 * Routing component to manage application routes.
 * 
 * @returns {JSX.Element} The rendered routing component.
 * 
 * @example
 * <Routing />
 */
export function Routing(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${nanoid()}`} />} />
        <Route path="/:room" element={<App />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
