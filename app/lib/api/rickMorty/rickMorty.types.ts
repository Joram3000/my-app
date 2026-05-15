export type CharacterStatus = "Alive" | "Dead" | "unknown";
export type CharacterGender = "Female" | "Male" | "Genderless" | "unknown";

export type Character = {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  image: string;
  type: string;
  gender: CharacterGender;
  // origin: [Object]; // name and link
  // location: [Object]; name and link
  // episode: Array; // aray of urls
  url: string;
  created: string;
};

export type PaginatedResponse<T> = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
};
