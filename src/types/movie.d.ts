export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
  crew: {
    id: number;
    name: string;
    job: string;
  }[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
  published_at: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}