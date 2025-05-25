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
