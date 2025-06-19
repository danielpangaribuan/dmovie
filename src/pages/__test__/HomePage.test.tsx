import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import HomePage from '../HomePage';
import * as tmdbService from '../../services/tmdb';
import '@testing-library/jest-dom';

declare const global: any;

global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

vi.mock('../../services/tmdb', async () => {
  const actual = await vi.importActual<typeof tmdbService>('../../services/tmdb');
  return {
    ...actual,
    getMovies: vi.fn(),
  };
});

const mockMovies = [
  {
    id: 1,
    title: 'Mock Movie',
    release_date: '2024-01-01',
    poster_path: '/poster.jpg',
    vote_average: 7.5,
  },
];

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', async () => {
    (tmdbService.getMovies as vi.Mock).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findAllByTestId('movie-skeleton')).toHaveLength(8);
  });

  it('renders movies from API', async () => {
    (tmdbService.getMovies as vi.Mock).mockResolvedValueOnce(mockMovies);

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Mock Movie')).toBeInTheDocument();
  });

  it('displays error message when API fails', async () => {
    (tmdbService.getMovies as vi.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Oops! Something went wrong/i)).toBeInTheDocument();
  });
});
