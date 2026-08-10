import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('renders application heading and worker status', () => {
    render(<App />);
    expect(screen.getByText(/CAD2Three.js Core Viewer/i)).toBeInTheDocument();
    expect(screen.getByText(/Worker:/i)).toBeInTheDocument();
  });
});
