import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrecisionToolbar } from './PrecisionToolbar';
import { INITIAL_CLIPPING_STATE } from '@/utils/clippingPlanes';

describe('PrecisionToolbar', () => {
  it('renders mode toggle buttons', () => {
    render(
      <PrecisionToolbar
        toolMode="none"
        onSetToolMode={vi.fn()}
        distances={[]}
        angles={[]}
        onClearMeasurements={vi.fn()}
        clippingState={INITIAL_CLIPPING_STATE}
        onClippingChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Distance/i)).toBeInTheDocument();
    expect(screen.getByText(/Angle/i)).toBeInTheDocument();
    expect(screen.getByText(/Sectioning/i)).toBeInTheDocument();
  });

  it('triggers onSetToolMode when mode buttons are clicked', () => {
    const handleSetToolMode = vi.fn();
    render(
      <PrecisionToolbar
        toolMode="none"
        onSetToolMode={handleSetToolMode}
        distances={[]}
        angles={[]}
        onClearMeasurements={vi.fn()}
        clippingState={INITIAL_CLIPPING_STATE}
        onClippingChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Distance/i));
    expect(handleSetToolMode).toHaveBeenCalledWith('distance');
  });

  it('opens dynamic sectioning panel when sectioning button is clicked', () => {
    render(
      <PrecisionToolbar
        toolMode="none"
        onSetToolMode={vi.fn()}
        distances={[]}
        angles={[]}
        onClearMeasurements={vi.fn()}
        clippingState={INITIAL_CLIPPING_STATE}
        onClippingChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText(/Sectioning/i));
    expect(screen.getByText(/Dynamic Sectioning/i)).toBeInTheDocument();
    expect(screen.getByText(/x-Axis/i)).toBeInTheDocument();
  });
});
