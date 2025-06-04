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
  // Xây params cơ bản
  const rawParams = {
    page,
    pageSize,
    minPrice: filters.priceMin,
    maxPrice: filters.priceMax,
    destinationId: filters.destination,
    departurePointId: filters.departurePoint,
    categoryId: filters.category,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  // Loại bỏ các field không có giá trị (null, undefined, "")
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
