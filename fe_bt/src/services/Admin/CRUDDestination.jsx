import axios from "axios";
export const createDestination = async (destinationData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Destinations",
      destinationData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateDestination = async (destinationId, destinationData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/Destinations/${destinationId}`,
      destinationData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteDestination = async (destinationId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/Destinations/${destinationId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
