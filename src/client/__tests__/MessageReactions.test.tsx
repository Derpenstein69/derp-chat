import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MessageReactions } from '../components/MessageReactions';

jest.mock('partysocket/react', () => ({
  usePartySocket: jest.fn(),
}));

jest.mock('@openauthjs/openauth/client', () => ({
  createClient: jest.fn(() => ({
    exchange: jest.fn(),
    getUserProfile: jest.fn(),
  })),
}));

describe('MessageReactions component', () => {
  test('handles reactions correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MessageReactions messageId="1" />} />
        </Routes>
      </BrowserRouter>
    );

    const reactionButton = screen.getByText('👍');
    fireEvent.click(reactionButton);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('👍'));
  });
});
