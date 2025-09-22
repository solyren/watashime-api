export interface HomeAnime {
  title: string;
  coverImage: string;
  slug: string;
  lastEpisode: number | null;
}

export interface HomeResponse {
  data: HomeAnime[];
  currentPage: number;
  hasNextPage: boolean;
}
