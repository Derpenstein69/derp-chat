import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FeedbackButtons } from '../components/FeedbackButtons';

jest.mock('partysocket/react', () => ({
  usePartySocket: jest.fn(),
}));

jest.mock('@openauthjs/openauth/client', () => ({
  createClient: jest.fn(() => ({
    exchange: jest.fn(),
    getUserProfile: jest.fn(),
  })),
}));

describe('FeedbackButtons component', () => {
  test('renders FeedbackButtons component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedbackButtons messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('👎')).toBeInTheDocument();
  });

  test('handles feedback correctly', () => {
    console.log = jest.fn();
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedbackButtons messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );

    const thumbsUpButton = screen.getByText('👍');
    fireEvent.click(thumbsUpButton);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('thumbs-up'));

    const thumbsDownButton = screen.getByText('👎');
    fireEvent.click(thumbsDownButton);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('thumbs-down'));
  });
});
