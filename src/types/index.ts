export interface DiscoverSearch {
  tracks: Track[];
}

interface Track {
  album: Album;
}

export interface AlbumSearch {
  albums: Items;
}

interface Items {
  items: Album[];
}

export interface Collection {
  id: string;
  collectionName: string;
  createdAt: string;
  albums: AlbumInDb[];
}

interface AlbumInDb {
  albumId: string;
}

export interface Album {
  name: string;
  id: string;
  images: Array<Image>;
  artists: Array<Artist>;
  release_date: string;
  uri: string;
}

interface Image {
  url: string;
}

interface Artist {
  name: string;
}

//Infinite Scroll Component Props
interface ISCommonProps {
  queryName: string;
  passModalInfo: (album: Album) => void;
}

export interface ISSearchProps extends ISCommonProps {
  SCROLL_TYPE: "search";
  searchParam: string | undefined;
}

export interface ISDiscoverProps extends ISCommonProps {
  SCROLL_TYPE: "discover";
  seedsAsString: string;
  targetPopularity: number;
}

export enum LoadingStates {
  idle = "idle",
  loading = "loading",
  finished = "finished",
}
