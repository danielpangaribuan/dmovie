import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import DetailPage from '../DetailPage';
import * as tmdb from '../../services/tmdb';

const mockMovie = {
  backdrop_path: '/mock-backdrop.jpg',
  poster_path: '/mock-poster.jpg',
  genres: [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Thriller' },
  ],
  id: 1,
  overview: 'A thrilling journey.',
  release_date: '2025-01-01',
  runtime: 120,
  tagline: 'Edge of your seat!',
  title: 'Mock Movie',
  vote_average: 8.5,
};

const mockCredits = [
  { id: 1, name: 'Actor One', character: 'Hero' },
  { id: 2, name: 'Actor Two', character: 'Villain' },
];

const mockVideos = [
  { id: '1', key: 'abc123', site: 'YouTube', type: 'Trailer', name: 'Official Trailer' },
];

vi.mock('../../services/tmdb', async () => {
  const actual = await vi.importActual<typeof tmdb>('../../services/tmdb');
  return {
    ...actual,
    getMovieDetail: vi.fn(),
    getMovieCredits: vi.fn(),
    getMovieVideos: vi.fn(),
  };
});

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', async () => {
    (tmdb.getMovieDetail as any).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders error UI if movie detail fetch fails', async () => {
    (tmdb.getMovieDetail as any).mockRejectedValueOnce(new Error('API failed'));

    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/oops! something went wrong/i)).toBeInTheDocument();
    });
  });

  it('renders movie details correctly', async () => {
    (tmdb.getMovieDetail as any).mockResolvedValueOnce(mockMovie);
    (tmdb.getMovieCredits as any).mockResolvedValueOnce(mockCredits);
    (tmdb.getMovieVideos as any).mockResolvedValueOnce(mockVideos);

    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Mock Movie')).toHaveLength(2);
      expect(screen.getByText(/edge of your seat/i)).toBeInTheDocument();
      expect(screen.getByText(/release/i)).toBeInTheDocument();
      expect(screen.getByText('Actor One')).toBeInTheDocument();
    });

    expect(screen.getByTitle(/movie trailer/i)).toBeInTheDocument();
  });
});