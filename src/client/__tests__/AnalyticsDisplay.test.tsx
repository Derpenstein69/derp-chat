import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsDisplay } from '../components/AnalyticsDisplay';

describe('AnalyticsDisplay component', () => {
  test('renders AnalyticsDisplay component', () => {
    render(<AnalyticsDisplay />);
    expect(screen.getByText('Real-Time Analytics')).toBeInTheDocument();
    expect(screen.getByText('Message Count:')).toBeInTheDocument();
    expect(screen.getByText('Message Frequency:')).toBeInTheDocument();
    expect(screen.getByText('User Activity')).toBeInTheDocument();
    expect(screen.getByText('User Preferences')).toBeInTheDocument();
    expect(screen.getByText('Previous Interactions')).toBeInTheDocument();
  });
});
