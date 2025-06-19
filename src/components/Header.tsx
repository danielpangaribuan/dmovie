import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { searchMovies } from "../services/tmdb";
import { Movie } from "../types/movie";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

const Header = () => {
    const [query, setQuery] = useState<string>('');
    const [resSearch, setResSearch] = useState<Movie[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetch = async () => {
          if (query.length) {
            setLoading(true);
            try {
              const newMovies = await searchMovies(query, 1);
              setResSearch(newMovies);
            } finally {
              setLoading(false);
            }
          } else {
            setResSearch([]);
          }
        };
      
        const debounce = setTimeout(fetch, 500); // debounce 500ms
        return () => clearTimeout(debounce);
      }, [query]);
      


    return (
        <div className="bg-gradient-to-r from-blue-900/40 via-blue-600/40 to-blue-900/40 p-4 flex items-center">
            <div className="container mx-auto flex justify-between gap-x-8">
                <Link to={"/"} className="cursor-pointer inline-block bg-black/30 py-2 px-4 rounded-lg font-medium text-white">
                    DMovie
                </Link>
                <div 
                    className="w-[50%] relative"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    tabIndex={0} 
                >
                    <SearchInput onSearch={(query) => setQuery(query)}/>
                    {
                        loading ? (
                            <div className="mt-2 absolute bg-gray-100 w-full rounded-md z-10 p-4">
                              <div className="flex items-center space-x-4 animate-pulse">
                                <div className="w-16 h-20 bg-gray-300 rounded" />
                                <div className="flex-1 space-y-2 py-1">
                                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                              </div>
                            </div>
                        ) : isFocused && resSearch.length ? (
                            <div className="mt-2 absolute bg-gray-100 w-full rounded-md z-10 divide-gray-400 divide-y max-h-[600px] overflow-auto">
                                {
                                    resSearch.map((movie) => (
                                        <div className="flex p-2 gap-x-2">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-16 h-20 object-cover"
                                                onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/image-coming-soon.webp';
                                                }}
                                            />
                                            <div>
                                                <div className="font-semibold text-xl">{movie.title}</div>
                                                <div className="">{movie.release_date ? new Date(movie.release_date).getFullYear() : ''}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ) : !loading && isFocused && !resSearch.length && query.length ? (
                            <div className="mt-2 absolute bg-gray-100 w-full rounded-md z-10">
                                <div className="flex justify-center items-center p-4 gap-x-2">
                                    <SearchX className="w-8 h-8" /> 
                                    <div className="text-xl">Sorry, we couldn’t find what you’re looking for.</div>
                                </div>
                            </div>
                        ) : <></>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header;