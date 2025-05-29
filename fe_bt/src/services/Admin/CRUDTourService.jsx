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
  }
};
