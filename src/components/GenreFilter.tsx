'use client'

interface GenreFilterProps {
  genres: string[]
  selectedGenres: string[]
  onToggle: (genre: string) => void
}

export default function GenreFilter({ genres, selectedGenres, onToggle }: GenreFilterProps) {
  if (genres.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre)
        return (
          <button
            key={genre}
            onClick={() => onToggle(genre)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {genre}
          </button>
        )
      })}
    </div>
  )
}
