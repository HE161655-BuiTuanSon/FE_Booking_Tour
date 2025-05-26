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
export const getAllTour = async () => {
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
