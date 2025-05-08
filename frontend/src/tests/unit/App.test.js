import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App Routing', () => {
  test('renders Home page by default', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  test('renders Login page when navigating to /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('renders Buyer Dashboard page at /buyer-dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/buyer-dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/my purchases/i)).toBeInTheDocument();
  });

  test('renders Seller Dashboard page at /seller-dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/seller-dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/orders to ship/i)).toBeInTheDocument();
  });

  test('renders Market page at /market', () => {
    render(
      <MemoryRouter initialEntries={['/market']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/market/i)).toBeInTheDocument();
  });

  test('renders Contact page at /contact', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  test('renders Checkout page at /checkout', () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });

  test('renders 404 page for unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/some-unknown-route']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
