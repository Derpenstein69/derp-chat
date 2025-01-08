import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EmbeddedSurvey } from '../components/EmbeddedSurvey';

describe('EmbeddedSurvey component', () => {
  test('renders EmbeddedSurvey component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmbeddedSurvey />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByTitle('Embedded Survey')).toBeInTheDocument();
  });
});
