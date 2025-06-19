
interface ListCategoryProps {
    category: string;
    setCategory: (e: string) => void;
}

const ListCategory = ({  category, setCategory}: ListCategoryProps) => {
  const categories = [
    { key: 'now_playing', label: 'Now Playing' },
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'upcoming', label: 'Upcoming' },
  ];
  
  return (
    <div className="flex gap-2 w-fit">
      {categories.map(cat => (
        <button
          key={cat.key}
          onClick={() => setCategory(cat.key)}
          className={`w-fit px-4 py-2 border-b ${category === cat.key ? 'border-blue-500' : 'bg-transparent text-gray-500 cursor-pointer border-transparent hover:border-blue-500 hover:text-white transition-all duration-300 ease-in-out delay-50'}`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default ListCategory;