import axios from 'axios';
import { Movie, MovieDetail, Cast, MovieListResponse, Video, VideoResponse, CreditsResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getMovies = async (category: string, page = 1): Promise<Movie[]> => {
  const res = await tmdb.get<MovieListResponse>(`/movie/${category}`, {
    params: { page },
  });
  return res.data.results;
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  const res = await tmdb.get<MovieListResponse>('/search/movie', {
    params: { query, page },
  });
  return res.data.results;
};

export const getMovieDetail = async (id: string): Promise<MovieDetail> => {
  const res = await tmdb.get<MovieDetail>(`/movie/${id}`);
  return res.data;
};

export const getMovieCredits = async (id: string): Promise<Cast[]> => {
  const res = await tmdb.get<CreditsResponse>(`/movie/${id}/credits`);
  return res.data.cast.slice(0, 5);
};

export const getMovieVideos = async (id: string): Promise<Video[]> => {
  const res = await tmdb.get<VideoResponse>(`/movie/${id}/videos`);
  return res.data.results;
};
