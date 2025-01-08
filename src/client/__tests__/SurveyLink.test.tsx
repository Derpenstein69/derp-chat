import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SurveyLink from '../components/SurveyLink';

describe('SurveyLink component', () => {
  test('renders SurveyLink component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SurveyLink />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText('Take our survey')).toBeInTheDocument();
  });

  test('handles survey link click correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SurveyLink />} />
        </Routes>
      </BrowserRouter>
    );

    const surveyLink = screen.getByText('Take our survey');
    fireEvent.click(surveyLink);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Survey link clicked'));
  });
});
