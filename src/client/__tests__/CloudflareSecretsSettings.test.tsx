import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CloudflareSecretsSettings from '../components/CloudflareSecretsSettings';

describe('CloudflareSecretsSettings component', () => {
  test('renders CloudflareSecretsSettings component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByLabelText('GOOGLE_CLIENT_ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('GOOGLE_CLIENT_SECRET:')).toBeInTheDocument();
    expect(screen.getByLabelText('GITHUB_CLIENT_ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('GITHUB_CLIENT_SECRET:')).toBeInTheDocument();
    expect(screen.getByLabelText('APPLE_CLIENT_ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('APPLE_CLIENT_SECRET:')).toBeInTheDocument();
    expect(screen.getByLabelText('DISCORD_CLIENT_ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('DISCORD_CLIENT_SECRET:')).toBeInTheDocument();
    expect(screen.getByLabelText('JWT_SECRET:')).toBeInTheDocument();
    expect(screen.getByLabelText('HMAC_SECRET_KEY:')).toBeInTheDocument();
    expect(screen.getByLabelText('R2_ACCESS_KEY_ID:')).toBeInTheDocument();
    expect(screen.getByLabelText('R2_SECRET_ACCESS_KEY:')).toBeInTheDocument();
    expect(screen.getByLabelText('R2_BUCKET_NAME:')).toBeInTheDocument();
    expect(screen.getByLabelText('R2_REGION:')).toBeInTheDocument();
    expect(screen.getByLabelText('IMAGE_CLASSIFICATION_WORKER:')).toBeInTheDocument();
    expect(screen.getByLabelText('CLASSIFICATION_METADATA:')).toBeInTheDocument();
    expect(screen.getByLabelText('VECTORIZE_API_KEY:')).toBeInTheDocument();
    expect(screen.getByLabelText('VECTORIZE_ENDPOINT:')).toBeInTheDocument();
  });

  test('handles form submission correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByLabelText('GOOGLE_CLIENT_ID:');
    fireEvent.change(input, { target: { value: 'new-client-id' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('Secrets saved successfully')).toBeInTheDocument();
  });

  test('handles input validation', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByLabelText('GOOGLE_CLIENT_ID:');
    fireEvent.change(input, { target: { value: '' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('GOOGLE_CLIENT_ID is required')).toBeInTheDocument();
  });

  test('provides feedback messages', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByLabelText('GOOGLE_CLIENT_ID:');
    fireEvent.change(input, { target: { value: 'new-client-id' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('Secrets saved successfully')).toBeInTheDocument();
  });

  test('uses masked input fields', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/cloudflare-secrets-settings" element={<CloudflareSecretsSettings />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByLabelText('GOOGLE_CLIENT_ID:').type).toBe('password');
    expect(screen.getByLabelText('GOOGLE_CLIENT_SECRET:').type).toBe('password');
    expect(screen.getByLabelText('GITHUB_CLIENT_ID:').type).toBe('password');
    expect(screen.getByLabelText('GITHUB_CLIENT_SECRET:').type).toBe('password');
    expect(screen.getByLabelText('APPLE_CLIENT_ID:').type).toBe('password');
    expect(screen.getByLabelText('APPLE_CLIENT_SECRET:').type).toBe('password');
    expect(screen.getByLabelText('DISCORD_CLIENT_ID:').type).toBe('password');
    expect(screen.getByLabelText('DISCORD_CLIENT_SECRET:').type).toBe('password');
    expect(screen.getByLabelText('JWT_SECRET:').type).toBe('password');
    expect(screen.getByLabelText('HMAC_SECRET_KEY:').type).toBe('password');
    expect(screen.getByLabelText('R2_ACCESS_KEY_ID:').type).toBe('password');
    expect(screen.getByLabelText('R2_SECRET_ACCESS_KEY:').type).toBe('password');
    expect(screen.getByLabelText('VECTORIZE_API_KEY:').type).toBe('password');
  });
});
