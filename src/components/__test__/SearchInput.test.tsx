import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchInput from '../SearchInput';

describe('SearchInput', () => {
  const mockOnSearch = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnSearch.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers(); 
  });

  it('calls onSearch with debounce when typing', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search for a movie/i);

    fireEvent.change(input, { target: { value: 'Batman' } });

    expect(mockOnSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500); 
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Batman');
  });

  it('debounces multiple changes', () => {
    render(<SearchInput onSearch={mockOnSearch} />);
    const input = screen.getByPlaceholderText(/search for a movie/i);

    fireEvent.change(input, { target: { value: 'A' } });
    vi.advanceTimersByTime(300); // belum sampai debounce

    fireEvent.change(input, { target: { value: 'AB' } });
    vi.advanceTimersByTime(300);

    fireEvent.change(input, { target: { value: 'ABC' } });
    vi.advanceTimersByTime(500); // total delay terpenuhi

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('ABC');
  });
});
