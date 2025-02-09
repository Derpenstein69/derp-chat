import React, { useState } from "react";
import * as z from "zod";

// Define a schema for input validation using Zod
const secretsSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required"),
  GITHUB_CLIENT_SECRET: z.string().min(1, "GITHUB_CLIENT_SECRET is required"),
  APPLE_CLIENT_ID: z.string().min(1, "APPLE_CLIENT_ID is required"),
  APPLE_CLIENT_SECRET: z.string().min(1, "APPLE_CLIENT_SECRET is required"),
  DISCORD_CLIENT_ID: z.string().min(1, "DISCORD_CLIENT_ID is required"),
  DISCORD_CLIENT_SECRET: z.string().min(1, "DISCORD_CLIENT_SECRET is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  HMAC_SECRET_KEY: z.string().min(1, "HMAC_SECRET_KEY is required"),
  R2_ACCESS_KEY_ID: z.string().min(1, "R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: z.string().min(1, "R2_SECRET_ACCESS_KEY is required"),
  R2_BUCKET_NAME: z.string().min(1, "R2_BUCKET_NAME is required"),
  R2_REGION: z.string().min(1, "R2_REGION is required"),
  IMAGE_CLASSIFICATION_WORKER: z.string().min(1, "IMAGE_CLASSIFICATION_WORKER is required"),
  CLASSIFICATION_METADATA: z.string().min(1, "CLASSIFICATION_METADATA is required"),
  VECTORIZE_API_KEY: z.string().min(1, "VECTORIZE_API_KEY is required"),
  VECTORIZE_ENDPOINT: z.string().min(1, "VECTORIZE_ENDPOINT is required"),
  AI_MODEL_ENDPOINT: z.string().min(1, "AI_MODEL_ENDPOINT is required"),
  AI_MODEL_API_KEY: z.string().min(1, "AI_MODEL_API_KEY is required"),
});

/**
 * CloudflareSecretsSettings component to manage and save Cloudflare secrets.
 * 
 * @returns {JSX.Element} The rendered Cloudflare secrets settings component.
 * 
 * @example
 * <CloudflareSecretsSettings />
 */
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
    AI_MODEL_ENDPOINT: string;
    AI_MODEL_API_KEY: string;
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
    AI_MODEL_ENDPOINT: "",
    AI_MODEL_API_KEY: "",
  });

  /**
   * Handles input change events for the secrets form.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecrets((prevSecrets) => ({
      ...prevSecrets,
      [name]: value,
    }));
  };

  /**
   * Handles form submission for saving secrets.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input data
    const validationResult = secretsSchema.safeParse(secrets);
    if (!validationResult.success) {
      alert(validationResult.error.errors[0].message);
      return;
    }

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
      <label>
        AI_MODEL_ENDPOINT:
        <input
          type="text"
          name="AI_MODEL_ENDPOINT"
          value={secrets.AI_MODEL_ENDPOINT}
          onChange={handleInputChange}
        />
      </label>
      <label>
        AI_MODEL_API_KEY:
        <input
          type="password"
          name="AI_MODEL_API_KEY"
          value={secrets.AI_MODEL_API_KEY}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
