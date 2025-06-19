import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieCredits, getMovieDetail, getMovieVideos } from '../services/tmdb';
import { Cast, MovieDetail, Video } from '../types/movie';

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const movieData = await getMovieDetail(id);
        setMovie(movieData);
      } catch (err) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const credits = await getMovieCredits(id);
        setCast(credits);
      } catch (err) {
        console.warn('Credits error:', err);
      }

      try {
        const videos = await getMovieVideos(id);
        const trailerVideo = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        setTrailer(trailerVideo || null);
      } catch (err) {
        console.warn('Videos error:', err);
      }

      setError(false);
      setLoading(false);
    };

    fetchData();
  }, [id]);



  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Oops! Something went wrong.</h2>
          <p className="text-gray-400">We couldn’t load the movie details. Please try again later.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <span className="sr-only">Loading...</span>
        <div className="animate-pulse space-y-6">
          <div className="w-full h-[400px] bg-neutral-800 rounded"></div>
          <div className="flex flex-col lg:flex-row gap-10 mt-6">
            <div className="lg:w-1/3">
              <div className="w-full max-w-xs h-[360px] bg-neutral-800 rounded-xl"></div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="h-6 w-1/2 bg-neutral-800 rounded"></div>
              <div className="h-4 w-1/3 bg-neutral-700 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="h-4 bg-neutral-800 rounded"></div>
                <div className="h-4 bg-neutral-800 rounded"></div>
                <div className="h-4 bg-neutral-800 rounded"></div>
              </div>
              <div className="h-48 bg-neutral-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie?.backdrop_path}`
    : '';

  return (
    <div className="min-h-screen bg-black text-white">
      {backdropUrl && (
        <div className="w-full h-[400px] relative">
          <img
            src={backdropUrl}
            alt="Backdrop"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 flex items-end container mx-auto p-6">
            <h1 className="text-4xl md:text-5xl font-bold z-10 drop-shadow-lg">{movie?.title}</h1>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded"
        >
          ← Back
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3 flex justify-center">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
              alt={movie?.title}
              className="w-full max-w-xs rounded-xl shadow-2xl object-cover"
            />
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">{movie?.title}</h2>
              <p className="text-blue-400 italic mb-3">{movie?.tagline}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <p><span className="font-semibold">Release:</span> {movie?.release_date}</p>
                <p><span className="font-semibold">Rating:</span> ⭐ {movie?.vote_average}/10</p>
                <p><span className="font-semibold">Duration:</span> {movie?.runtime} minutes</p>
                <p className="col-span-2 md:col-span-3">
                  <span className="font-semibold">Genres:</span> {movie?.genres.map(g => g.name).join(', ')}
                </p>
              </div>
            </div>

            {trailer && (
              <div>
                <h3 className="text-xl font-semibold mb-2">🎬 Watch Trailer</h3>
                <div className="aspect-video w-full rounded overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-2">📖 Overview</h3>
              <p className="text-gray-200 leading-relaxed">{movie?.overview}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">👥 Top Cast</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {cast.slice(0, 9).map(actor => (
                  <li key={actor.id} className="bg-neutral-800 rounded px-2 py-1">
                    <span className="font-medium text-white">{actor.name}</span> <span className="text-gray-400">as</span> <em>{actor.character}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;