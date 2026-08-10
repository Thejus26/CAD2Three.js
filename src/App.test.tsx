import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders application heading and worker status', () => {
    render(<App />);
    expect(screen.getByText(/CAD2Three.js - Environment Foundation/i)).toBeInTheDocument();
    expect(screen.getByText(/Worker status:/i)).toBeInTheDocument();
  });
});
