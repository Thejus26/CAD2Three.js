import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from './Dropzone';

describe('Dropzone Component', () => {
  it('renders dropzone instructions', () => {
    render(<Dropzone onFileLoaded={vi.fn()} onError={vi.fn()} />);
    expect(screen.getByText(/Drop CAD model here/i)).toBeInTheDocument();
    expect(screen.getByText(/Supports .STL, .OBJ files/i)).toBeInTheDocument();
  });

  it('rejects unsupported file formats', () => {
    const handleError = vi.fn();
    const handleLoaded = vi.fn();

    render(<Dropzone onFileLoaded={handleLoaded} onError={handleError} />);
    const fileInput = screen.getByTestId('file-input');

    const invalidFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(handleError).toHaveBeenCalledWith(expect.stringContaining('Unsupported file type'));
    expect(handleLoaded).not.toHaveBeenCalled();
  });

  it('accepts valid .stl files', () => {
    const handleError = vi.fn();
    const handleLoaded = vi.fn();

    render(<Dropzone onFileLoaded={handleLoaded} onError={handleError} />);
    const fileInput = screen.getByTestId('file-input');

    const validFile = new File(['dummy content'], 'part.stl', { type: 'model/stl' });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    expect(handleError).not.toHaveBeenCalled();
    expect(handleLoaded).toHaveBeenCalledWith(validFile);
  });
});
