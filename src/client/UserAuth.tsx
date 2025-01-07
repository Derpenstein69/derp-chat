import { useEffect } from "react";
import { createClient } from "@openauthjs/openauth/client";

const client = createClient({
  clientID: "your-client-id",
  issuer: "https://auth.myserver.com",
});

export async function handleAuthCallback(location: { search: string }) {
  try {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");
    if (code) {
      const exchangeResult = await client.exchange(code, window.location.origin);
      if ("error" in exchangeResult) {
        console.error(exchangeResult.error);

        alert("Authentication error");
        return;
      }

      const successResult = exchangeResult as any;
      localStorage.setItem("access_token", successResult.accessToken);
      localStorage.setItem("refresh_token", successResult.refreshToken);

      const userProfile = await client.userInfo(exchangeResult.accessToken);
      return {
        name: userProfile.name,
        profile: {
          picture: userProfile.picture,
          status: userProfile.status,
          bio: userProfile.bio,
          location: userProfile.location,
          website: userProfile.website,
          social_media_links: userProfile.social_media_links,
          theme: userProfile.theme,
          avatar: userProfile.avatar,
          interaction_style: userProfile.interaction_style,
        },
      };
    }
  } catch (error) {
    console.error("Error during authentication callback", error);
    alert("An error occurred during authentication. Please try again.");
  }
}
