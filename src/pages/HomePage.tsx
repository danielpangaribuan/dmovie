import { useEffect, useRef, useState } from 'react';
import { getMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../types/movie';
import ListCategory from '../components/ListCategory';
import { AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState('now_playing');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const newMovies = await getMovies(category, page);
        setMovies(prev => [...prev, ...newMovies]);
        if (newMovies.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        setHasMore(false);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (hasMore) {
      fetchMovies();
    }
  }, [page, category]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (target.isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      }
    );
    const current = loader.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore]);

  return (
    <div className={"min-h-screen bg-black text-white"}>
      <div className="container mx-auto py-6">
        <ListCategory category={category} setCategory={setCategory} />

        {error ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <AlertTriangle className="text-yellow-500 w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold">Oops! Something went wrong.</h2>
            <p className="text-gray-400 mt-2">Unable to load movies. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {isLoading && !movies.length
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <MovieCard key={`skeleton-${idx}`} isLoading />
                ))
              : movies.map((movie, idx) => (
                  <MovieCard key={category + '-' + movie.id + '-' + idx} movie={movie} />
                ))}
          </div>
        )}

        <div ref={loader} className="h-10 mt-6" />
      </div>
    </div>
  );
};

export default HomePage;
