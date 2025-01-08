import React, { useState } from "react";

export function CloudflareSecretsSettings(): JSX.Element {
  const [secrets, setSecrets] = useState<{
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    APPLE_CLIENT_ID: string;
    APPLE_CLIENT_SECRET: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    JWT_SECRET: string;
    HMAC_SECRET_KEY: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
    R2_REGION: string;
    IMAGE_CLASSIFICATION_WORKER: string;
    CLASSIFICATION_METADATA: string;
    VECTORIZE_API_KEY: string;
    VECTORIZE_ENDPOINT: string;
  }>({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GITHUB_CLIENT_ID: "",
    GITHUB_CLIENT_SECRET: "",
    APPLE_CLIENT_ID: "",
    APPLE_CLIENT_SECRET: "",
    DISCORD_CLIENT_ID: "",
    DISCORD_CLIENT_SECRET: "",
    JWT_SECRET: "",
    HMAC_SECRET_KEY: "",
    R2_ACCESS_KEY_ID: "",
    R2_SECRET_ACCESS_KEY: "",
    R2_BUCKET_NAME: "",
    R2_REGION: "",
    IMAGE_CLASSIFICATION_WORKER: "",
    CLASSIFICATION_METADATA: "",
    VECTORIZE_API_KEY: "",
    VECTORIZE_ENDPOINT: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecrets((prevSecrets) => ({
      ...prevSecrets,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/save-secrets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secrets),
      });

      if (!response.ok) {
        throw new Error("Failed to save secrets");
      }

      alert("Secrets saved successfully");
    } catch (error) {
      console.error("Error saving secrets", error);
      alert("An error occurred while saving the secrets. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cloudflare Secrets Settings</h3>
      <label>
        GOOGLE_CLIENT_ID:
        <input
          type="password"
          name="GOOGLE_CLIENT_ID"
          value={secrets.GOOGLE_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GOOGLE_CLIENT_SECRET:
        <input
          type="password"
          name="GOOGLE_CLIENT_SECRET"
          value={secrets.GOOGLE_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GITHUB_CLIENT_ID:
        <input
          type="password"
          name="GITHUB_CLIENT_ID"
          value={secrets.GITHUB_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GITHUB_CLIENT_SECRET:
        <input
          type="password"
          name="GITHUB_CLIENT_SECRET"
          value={secrets.GITHUB_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        APPLE_CLIENT_ID:
        <input
          type="password"
          name="APPLE_CLIENT_ID"
          value={secrets.APPLE_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        APPLE_CLIENT_SECRET:
        <input
          type="password"
          name="APPLE_CLIENT_SECRET"
          value={secrets.APPLE_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        DISCORD_CLIENT_ID:
        <input
          type="password"
          name="DISCORD_CLIENT_ID"
          value={secrets.DISCORD_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        DISCORD_CLIENT_SECRET:
        <input
          type="password"
          name="DISCORD_CLIENT_SECRET"
          value={secrets.DISCORD_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        JWT_SECRET:
        <input
          type="password"
          name="JWT_SECRET"
          value={secrets.JWT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        HMAC_SECRET_KEY:
        <input
          type="password"
          name="HMAC_SECRET_KEY"
          value={secrets.HMAC_SECRET_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_ACCESS_KEY_ID:
        <input
          type="password"
          name="R2_ACCESS_KEY_ID"
          value={secrets.R2_ACCESS_KEY_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_SECRET_ACCESS_KEY:
        <input
          type="password"
          name="R2_SECRET_ACCESS_KEY"
          value={secrets.R2_SECRET_ACCESS_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_BUCKET_NAME:
        <input
          type="text"
          name="R2_BUCKET_NAME"
          value={secrets.R2_BUCKET_NAME}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_REGION:
        <input
          type="text"
          name="R2_REGION"
          value={secrets.R2_REGION}
          onChange={handleInputChange}
        />
      </label>
      <label>
        IMAGE_CLASSIFICATION_WORKER:
        <input
          type="text"
          name="IMAGE_CLASSIFICATION_WORKER"
          value={secrets.IMAGE_CLASSIFICATION_WORKER}
          onChange={handleInputChange}
        />
      </label>
      <label>
        CLASSIFICATION_METADATA:
        <input
          type="text"
          name="CLASSIFICATION_METADATA"
          value={secrets.CLASSIFICATION_METADATA}
          onChange={handleInputChange}
        />
      </label>
      <label>
        VECTORIZE_API_KEY:
        <input
          type="password"
          name="VECTORIZE_API_KEY"
          value={secrets.VECTORIZE_API_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        VECTORIZE_ENDPOINT:
        <input
          type="text"
          name="VECTORIZE_ENDPOINT"
          value={secrets.VECTORIZE_ENDPOINT}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
