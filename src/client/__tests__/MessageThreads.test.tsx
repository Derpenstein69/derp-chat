import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MessageThreads } from '../components/MessageThreads';

describe('MessageThreads component', () => {
  test('renders MessageThreads component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MessageThreads messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
  });

  test('handles replies correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MessageThreads messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );

    const replyInput = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(replyInput, { target: { value: 'This is a reply' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(screen.getByText('This is a reply')).toBeInTheDocument();
  });
});
