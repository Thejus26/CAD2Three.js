import { render, screen } from '@testing-library/react';
import { ViewportCanvas } from './ViewportCanvas';

describe('ViewportCanvas Component', () => {
  it('renders viewport container correctly', () => {
    render(<ViewportCanvas />);
    expect(screen.getByTestId('viewport-container')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ISO' })).toBeInTheDocument();
  });
});
