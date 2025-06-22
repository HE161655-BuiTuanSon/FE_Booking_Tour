import axios from "axios";
export const createTourCategory = async (tourCategoryData) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/TourCategories",
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
      `http://vivutravel.net/api/TourCategories/${tourCategoryId}`,
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
      `http://vivutravel.net/api/TourCategories/${tourCategoryId}`
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
      "http://vivutravel.net/api/TourCategories"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
