import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SearchInput = ({ onSearch }: { onSearch: (e: string) => void}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="flex justify-end w-full">
      <div className="transition-all duration-300 ease-in-out w-[250px] focus-within:w-full bg-black/40 rounded-lg shadow-2xl flex items-center px-4">
        <Search className="text-white w-5 h-5 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full p-2 bg-transparent text-white placeholder-gray-400 border-none focus:outline-none"
        />
      </div>
    </div>
  )
}

export default SearchInput;