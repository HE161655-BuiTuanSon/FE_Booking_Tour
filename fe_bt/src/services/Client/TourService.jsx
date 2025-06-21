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
export const getAllTour = async (page, pageSize, filters = {}) => {
  const rawParams = {
    page,
    pageSize,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    destinationId: filters.destinationId,
    departurePointId: filters.departurePointId,
    categoryId: filters.categoryId,
    startDate: filters.startDate,
    endDate: filters.endDate,
    sortBy: filters.sortBy,
  };
  const params = Object.fromEntries(
    Object.entries(rawParams).filter(
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  );

  try {
    const response = await axios.get(`https://localhost:44338/api/Tour`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
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

export const getTourBooked = async (userId) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Bookings/booking-history/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
