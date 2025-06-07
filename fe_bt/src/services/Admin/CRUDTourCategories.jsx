import axios from "axios";
export const createTourCategory = async (tourCategoryData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/TourCategories",
      tourCategoryData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateTourCategory = async (tourCategoryId, tourCategoryData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/TourCategories/${tourCategoryId}`,
      tourCategoryData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteTourCategory = async (tourCategoryId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/TourCategories/${tourCategoryId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllTourCategory = async () => {
  try {
    const response = await axios.get(
      "https://localhost:44338/api/TourCategories"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
