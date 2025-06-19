import { Link } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface Props {
  movie?: Movie;
  isLoading?: boolean;
}

const MovieCard = ({ movie, isLoading }: Props) => {
  if (isLoading || !movie) {
    return (
      <div data-testid="movie-skeleton" className="rounded overflow-hidden shadow-lg bg-neutral-900 animate-pulse">
        <span className="sr-only">Loading...</span>
        <div className="w-full h-[300px] bg-gray-700" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-600 rounded w-3/4" />
          <div className="h-3 bg-gray-600 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <Link to={`/movie/${movie.id}`} className="block group relative">
      <div className="rounded overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 bg-neutral-900 relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-80 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/image-coming-soon.webp';
          }}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-sm font-medium bg-black/70 px-4 py-2 rounded shadow">Click Detail</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white p-4">
          <div className='flex gap-x-2 items-center'>
            <h2 className="text-lg font-semibold mb-1 line-clamp-1">{movie.title}</h2>
          </div>
          <div className="text-sm font-medium">{new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average.toFixed(1)} / 10</div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;