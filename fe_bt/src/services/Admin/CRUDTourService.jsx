import axios from "axios";
export const createTour = async (tourData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Tour",
      tourData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateTour = async (tourId, tourData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/Tour/${tourId}`,
      tourData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteTour = async (tourId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/Tour/${tourId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllTour = async (page, pageSize) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Tour?page=${page}&pageSize=${pageSize}&sortBy=departure`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
