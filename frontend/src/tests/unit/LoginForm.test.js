import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/Login';
import { MemoryRouter } from 'react-router-dom';

describe('Login Form', () => {
  test('renders login form fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows validation error if fields are empty', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/email and password are required/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  test('submits form with valid data', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // You can mock and assert navigation or API call here if needed
  });
});
