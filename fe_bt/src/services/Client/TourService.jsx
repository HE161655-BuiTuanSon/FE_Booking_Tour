import axios from "axios";
export const getTenTour = async () => {
  try {
    const response = await axios.get(
      "https://localhost:44338/api/Home/latest-tour"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllTour = async (page, pageSize, filters) => {
  const params = {
    page,
    pageSize,
    name: filters.name,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    destination: filters.destination,
    departurePoint: filters.departurePoint,
  };
  try {
    const response = await axios.get(`https://localhost:44338/api/Tour`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const filterTour = async (minPrice, maxPrice, startDate, endDate) => {
  try {
    const response = await axios.get(
      "https://localhost:44338/api/Tour?page=1&pageSize=10"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getTourById = async (tourId) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Tour/${tourId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getCategoryTour = async () => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/TourFilter/categories`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getDestinationTour = async () => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/TourFilter/destinations`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getDeparturepointTour = async () => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/TourFilter/departurepoints`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
