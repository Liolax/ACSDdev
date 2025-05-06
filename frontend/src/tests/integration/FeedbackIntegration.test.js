import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackPopup from '../../components/ui/FeedbackPopup';

describe('FeedbackPopup Integration', () => {
  const mockOnSubmit = jest.fn();
  const mockClose = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockClose.mockClear();
  });

  test('renders feedback form fields', () => {
    render(
      <FeedbackPopup
        orderId="order123"
        userId="user123"
        closePopup={mockClose}
        onSubmitFeedback={mockOnSubmit}
      />
    );
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rating/i)).toBeInTheDocument();
  });

  test('shows validation error if required fields are empty', () => {
    render(
      <FeedbackPopup
        orderId="order123"
        userId="user123"
        closePopup={mockClose}
        onSubmitFeedback={mockOnSubmit}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/title and comments are required/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('submits feedback with valid data', () => {
    render(
      <FeedbackPopup
        orderId="order123"
        userId="user123"
        closePopup={mockClose}
        onSubmitFeedback={mockOnSubmit}
      />
    );
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Great product' } });
    fireEvent.change(screen.getByLabelText(/comments/i), { target: { value: 'Loved it!' } });
    fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        order: "order123",
        buyer: "user123",
        rating: 5,
        title: "Great product",
        comments: "Loved it!",
      })
    );
  });
});
