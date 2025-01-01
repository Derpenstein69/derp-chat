import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { usePartySocket } from 'partysocket/react';
import App from '../index';

jest.mock('partysocket/react', () => ({
  usePartySocket: jest.fn(),
}));

jest.mock('@openauthjs/openauth/client', () => ({
  createClient: jest.fn(() => ({
    exchange: jest.fn(),
    getUserProfile: jest.fn(),
  })),
}));

/**
 * Test suite for the App component.
 * This file contains unit tests for the App component and its child components.
 */
describe('App component', () => {
  beforeEach(() => {
    usePartySocket.mockReturnValue({
      send: jest.fn(),
    });
  });

  /**
   * Test to check if the App component renders correctly.
   */
  test('renders App component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
  });

  /**
   * Test to check if the App component handles state changes properly.
   */
  test('handles state changes properly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
  });

  /**
   * Test to check if the App component handles form submission.
   */
  test('handles form submission', async () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Type a message/i);
    fireEvent.change(input, { target: { value: 'Hello' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(usePartySocket().send).toHaveBeenCalled();
  });

  /**
   * Test to check if the FeedbackButtons component renders correctly.
   */
  test('renders FeedbackButtons component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('👎')).toBeInTheDocument();
  });

  /**
   * Test to check if the RatingSystem component renders correctly.
   */
  test('renders RatingSystem component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getAllByText('★').length).toBe(5);
  });

  /**
   * Test to check if the FeedbackForm component renders correctly.
   */
  test('renders FeedbackForm component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Provide detailed feedback...')).toBeInTheDocument();
  });

  /**
   * Test to check if the SurveyLink component renders correctly.
   */
  test('renders SurveyLink component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText('Take our survey')).toBeInTheDocument();
  });

  /**
   * Test to check if the EmbeddedSurvey component renders correctly.
   */
  test('renders EmbeddedSurvey component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByTitle('Embedded Survey')).toBeInTheDocument();
  });
});
