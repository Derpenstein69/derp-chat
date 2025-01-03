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
   * 
   * @remarks
   * This test verifies that the App component renders without crashing and displays the expected placeholder text.
   * 
   * @example
   * test('renders App component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
   * });
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
   * 
   * @remarks
   * This test verifies that the App component updates the input value correctly when the user types a message.
   * 
   * @example
   * test('handles state changes properly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const input = screen.getByPlaceholderText(/Type a message/i);
   *   fireEvent.change(input, { target: { value: 'Hello' } });
   *   expect(input.value).toBe('Hello');
   * });
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
   * 
   * @remarks
   * This test verifies that the App component calls the send function from usePartySocket when the form is submitted.
   * 
   * @example
   * test('handles form submission', async () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const input = screen.getByPlaceholderText(/Type a message/i);
   *   fireEvent.change(input, { target: { value: 'Hello' } });
   * 
   *   const form = screen.getByRole('form');
   *   fireEvent.submit(form);
   * 
   *   expect(usePartySocket().send).toHaveBeenCalled();
   * });
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
   * 
   * @remarks
   * This test verifies that the FeedbackButtons component renders the thumbs up and thumbs down buttons.
   * 
   * @example
   * test('renders FeedbackButtons component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByText('👍')).toBeInTheDocument();
   *   expect(screen.getByText('👎')).toBeInTheDocument();
   * });
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
   * 
   * @remarks
   * This test verifies that the RatingSystem component renders five star icons.
   * 
   * @example
   * test('renders RatingSystem component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getAllByText('★').length).toBe(5);
   * });
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
   * 
   * @remarks
   * This test verifies that the FeedbackForm component renders the textarea for detailed feedback.
   * 
   * @example
   * test('renders FeedbackForm component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByPlaceholderText('Provide detailed feedback...')).toBeInTheDocument();
   * });
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
   * 
   * @remarks
   * This test verifies that the SurveyLink component renders the survey link text.
   * 
   * @example
   * test('renders SurveyLink component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByText('Take our survey')).toBeInTheDocument();
   * });
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
   * 
   * @remarks
   * This test verifies that the EmbeddedSurvey component renders the iframe for the embedded survey.
   * 
   * @example
   * test('renders EmbeddedSurvey component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByTitle('Embedded Survey')).toBeInTheDocument();
   * });
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

  /**
   * Test to check if the App component handles errors gracefully.
   * 
   * @remarks
   * This test verifies that the App component displays a user-friendly error message when an error occurs.
   * 
   * @example
   * test('handles errors gracefully', () => {
   *   usePartySocket.mockImplementation(() => {
   *     throw new Error('Test error');
   *   });
   * 
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
   * });
   */
  test('handles errors gracefully', () => {
    usePartySocket.mockImplementation(() => {
      throw new Error('Test error');
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Something went wrong. Please try again later.')).toBeInTheDocument();
  });

  /**
   * Test to check if the App component logs errors to an external logging service.
   * 
   * @remarks
   * This test verifies that the App component calls the logErrorToService function when an error occurs.
   * 
   * @example
   * test('logs errors to an external logging service', () => {
   *   const logErrorToService = jest.fn();
   *   usePartySocket.mockImplementation(() => {
   *     throw new Error('Test error');
   *   });
   * 
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   expect(logErrorToService).toHaveBeenCalled();
   * });
   */
  test('logs errors to an external logging service', () => {
    const logErrorToService = jest.fn();
    usePartySocket.mockImplementation(() => {
      throw new Error('Test error');
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    expect(logErrorToService).toHaveBeenCalled();
  });

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
   * Test to check if the FeedbackButtons component handles feedback correctly.
   * 
   * @remarks
   * This test verifies that the FeedbackButtons component calls the handleFeedback function when a feedback button is clicked.
   * 
   * @example
   * test('handles feedback correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const thumbsUpButton = screen.getByText('👍');
   *   fireEvent.click(thumbsUpButton);
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('thumbs-up'));
   * 
   *   const thumbsDownButton = screen.getByText('👎');
   *   fireEvent.click(thumbsDownButton);
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('thumbs-down'));
   * });
   */
  test('handles feedback correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
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

  /**
   * Test to check if the RatingSystem component handles rating correctly.
   * 
   * @remarks
   * This test verifies that the RatingSystem component calls the handleRating function when a star is clicked.
   * 
   * @example
   * test('handles rating correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const stars = screen.getAllByText('★');
   *   fireEvent.click(stars[2]);
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3'));
   * });
   */
  test('handles rating correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const stars = screen.getAllByText('★');
    fireEvent.click(stars[2]);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('3'));
  });

  /**
   * Test to check if the FeedbackForm component handles form submission correctly.
   * 
   * @remarks
   * This test verifies that the FeedbackForm component calls the handleSubmit function when the form is submitted.
   * 
   * @example
   * test('handles form submission correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const textarea = screen.getByPlaceholderText('Provide detailed feedback...');
   *   fireEvent.change(textarea, { target: { value: 'Great job!' } });
   * 
   *   const form = screen.getByRole('form');
   *   fireEvent.submit(form);
   * 
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Great job!'));
   * });
   */
  test('handles form submission correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText('Provide detailed feedback...');
    fireEvent.change(textarea, { target: { value: 'Great job!' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Great job!'));
  });

  /**
   * Test to check if the SurveyLink component handles survey link click correctly.
   * 
   * @remarks
   * This test verifies that the SurveyLink component calls the handleSurveyClick function when the survey link is clicked.
   * 
   * @example
   * test('handles survey link click correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const surveyLink = screen.getByText('Take our survey');
   *   fireEvent.click(surveyLink);
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Survey link clicked'));
   * });
   */
  test('handles survey link click correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const surveyLink = screen.getByText('Take our survey');
    fireEvent.click(surveyLink);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Survey link clicked'));
  });

  /**
   * Test to check if the MessageReactions component handles reactions correctly.
   * 
   * @remarks
   * This test verifies that the MessageReactions component calls the handleReaction function when a reaction button is clicked.
   * 
   * @example
   * test('handles reactions correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const reactionButton = screen.getByText('👍');
   *   fireEvent.click(reactionButton);
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('👍'));
   * });
   */
  test('handles reactions correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const reactionButton = screen.getByText('👍');
    fireEvent.click(reactionButton);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('👍'));
  });

  /**
   * Test to check if the MessageThreads component handles replies correctly.
   * 
   * @remarks
   * This test verifies that the MessageThreads component calls the handleReplySubmit function when a reply is submitted.
   * 
   * @example
   * test('handles replies correctly', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   * 
   *   const replyInput = screen.getByPlaceholderText('Write a reply...');
   *   fireEvent.change(replyInput, { target: { value: 'This is a reply' } });
   * 
   *   const form = screen.getByRole('form');
   *   fireEvent.submit(form);
   * 
   *   expect(console.log).toHaveBeenCalledWith(expect.stringContaining('This is a reply'));
   * });
   */
  test('handles replies correctly', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );

    const replyInput = screen.getByPlaceholderText('Write a reply...');
    fireEvent.change(replyInput, { target: { value: 'This is a reply' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('This is a reply'));
  });

  /**
   * Test to check if the AnalyticsDisplay component renders correctly.
   * 
   * @remarks
   * This test verifies that the AnalyticsDisplay component renders the real-time analytics data.
   * 
   * @example
   * test('renders AnalyticsDisplay component', () => {
   *   render(
   *     <BrowserRouter>
   *       <Routes>
   *         <Route path="/" element={<App />} />
   *       </Routes>
   *     </BrowserRouter>
   *   );
   *   expect(screen.getByText('Real-Time Analytics')).toBeInTheDocument();
   *   expect(screen.getByText('Message Count:')).toBeInTheDocument();
   *   expect(screen.getByText('Message Frequency:')).toBeInTheDocument();
   *   expect(screen.getByText('User Activity')).toBeInTheDocument();
   *   expect(screen.getByText('User Preferences')).toBeInTheDocument();
   *   expect(screen.getByText('Previous Interactions')).toBeInTheDocument();
   * });
   */
  test('renders AnalyticsDisplay component', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    );
    expect(screen.getByText('Real-Time Analytics')).toBeInTheDocument();
    expect(screen.getByText('Message Count:')).toBeInTheDocument();
    expect(screen.getByText('Message Frequency:')).toBeInTheDocument();
    expect(screen.getByText('User Activity')).toBeInTheDocument();
    expect(screen.getByText('User Preferences')).toBeInTheDocument();
    expect(screen.getByText('Previous Interactions')).toBeInTheDocument();
  });
});
