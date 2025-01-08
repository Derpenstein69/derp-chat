import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { nanoid } from "nanoid";
import { App } from "./ChatInterface";
import { ProfileSettings } from "./UIComponents";
import { CloudflareSecretsSettings } from "./UIComponents";

export function Routing() {
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
