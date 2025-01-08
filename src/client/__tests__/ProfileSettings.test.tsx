import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfileSettings from '../components/ProfileSettings';

/**
 * Test suite for the ProfileSettings component.
 * This file contains unit tests for the ProfileSettings component.
 */
describe('ProfileSettings component', () => {
  /**
   * Test to check if the ProfileSettings component renders correctly.
   * 
   * @remarks
   * This test verifies that the ProfileSettings component renders the profile settings form.
   * 
   * @example
   * test('renders ProfileSettings component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/profile-settings" element={<ProfileSettings />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByLabelText('Profile Picture URL:')).toBeInTheDocument();
   *   expect(screen.getByLabelText('Status:')).toBeInTheDocument();
   *   expect(screen.getByLabelText('Bio:')).toBeInTheDocument();
   *   expect(screen.getByLabelText('Location:')).toBeInTheDocument();
   *   expect(screen.getByLabelText('Website:')).toBeInTheDocument();
   *   expect(screen.getByLabelText('Social Media Links:')).toBeInTheDocument();
   * });
   */
  test('renders ProfileSettings component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile-settings" element={<ProfileSettings />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByLabelText('Profile Picture URL:')).toBeInTheDocument();
    expect(screen.getByLabelText('Status:')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio:')).toBeInTheDocument();
    expect(screen.getByLabelText('Location:')).toBeInTheDocument();
    expect(screen.getByLabelText('Website:')).toBeInTheDocument();
    expect(screen.getByLabelText('Social Media Links:')).toBeInTheDocument();
  });

  /**
   * Test to check if the ProfileSettings component validates profile settings.
   * 
   * @remarks
   * This test verifies that the ProfileSettings component validates the profile settings form and displays error messages for invalid fields.
   * 
   * @example
   * test('validates profile settings', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/profile-settings" element={<ProfileSettings />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const input = screen.getByLabelText('Profile Picture URL:');
   *   fireEvent.change(input, { target: { value: '' } });
   * 
   *   const form = screen.getByRole('form');
   *   fireEvent.submit(form);
   * 
   *   expect(screen.getByText('Profile Picture URL is required')).toBeInTheDocument();
   * });
   */
  test('validates profile settings', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/profile-settings" element={<ProfileSettings />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByLabelText('Profile Picture URL:');
    fireEvent.change(input, { target: { value: '' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('Profile Picture URL is required')).toBeInTheDocument();
  });
});
