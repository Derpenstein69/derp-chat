import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RatingSystem from '../components/RatingSystem';

jest.mock('partysocket/react', () => ({
  usePartySocket: jest.fn(),
}));

jest.mock('@openauthjs/openauth/client', () => ({
  createClient: jest.fn(() => ({
    exchange: jest.fn(),
    getUserProfile: jest.fn(),
  })),
}));

describe('RatingSystem component', () => {
  test('renders RatingSystem component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RatingSystem />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getAllByText('★').length).toBe(5);
  });

  test('handles rating correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RatingSystem />} />
        </Routes>
      </BrowserRouter>
    );

    const stars = screen.getAllByText('★');
    fireEvent.click(stars[2]);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3'));
  });
});
