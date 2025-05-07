import React from 'react';
import { render, screen } from '@testing-library/react';
import StandardProductGrid from './StandardProductGrid';

test('renders product grid with products', () => {
  const products = [
    { _id: '1', name: 'Irish Mug', price: 12.5, category: 'Home Decor', tags: ['mug', 'ceramic'] }
  ];
  render(<StandardProductGrid products={products} />);
  expect(screen.getByText(/Irish Mug/i)).toBeInTheDocument();
});
