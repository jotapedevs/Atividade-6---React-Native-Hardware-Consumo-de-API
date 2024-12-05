import axios from 'axios';

const DOG_API_URL = 'https://api.thedogapi.com/v1';
const HERE_PLACES_API_URL = 'https://discover.search.hereapi.com/v1/discover';
const DOG_API_KEY = 'live_WohsMLTF9hoAAnpPPrJhgAS6DzMCEPoBWvCJubsyKKt9sitkXIvIVJJfvcawCYvl';
const HERE_API_KEY = 'n0h69XAV_cBvZMofM7MfFk4WSAEFFLX38I5E5jYpSDw'; // Substitua pela sua chave do HERE

export interface Dog {
  id: string;
  url: string;
  breeds: {
    id: string;
    name: string;
    temperament: string;
    origin: string;
    life_span: string;
    wikipedia_url: string;
  }[];
}

export interface PetShop {
  name: string;
  address: string;
  distance: number;
}

export const dogApi = axios.create({
  baseURL: DOG_API_URL,
  headers: {
    'x-api-key': DOG_API_KEY,
  },
});

export const fetchDogs = async (): Promise<Dog[]> => {
  const response = await dogApi.get<Dog[]>('/images/search', {
    params: { limit: 10, has_breeds: true },
  });
  return response.data;
};

export const fetchPetShops = async (
  latitude: number,
  longitude: number
): Promise<PetShop[]> => {
  const response = await axios.get(HERE_PLACES_API_URL, {
    params: {
      at: `${latitude},${longitude}`,
      q: 'pet shop',
      limit: 10,
      apiKey: HERE_API_KEY,
    },
  });

  return response.data.items.map((place: any) => ({
    name: place.title,
    address: place.address.label,
    distance: place.distance,
  }));
};