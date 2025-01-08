import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackForm from '../components/FeedbackForm';

describe('FeedbackForm component', () => {
  test('renders FeedbackForm component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedbackForm messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Provide detailed feedback...')).toBeInTheDocument();
  });

  test('handles form submission correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FeedbackForm messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText('Provide detailed feedback...');
    fireEvent.change(textarea, { target: { value: 'Great job!' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Great job!'));
  });
});
