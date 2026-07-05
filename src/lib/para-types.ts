export interface ParaMovie {
  id: number
  title: string
  slug: string
  link: string
  poster: string
  synopsis: string
  director: string
  cast: string
  year: string
  country: string
  quality: string
  categories: string[]
  date: string
}

export interface ParaMovieDetail extends ParaMovie {
  content: string
}
