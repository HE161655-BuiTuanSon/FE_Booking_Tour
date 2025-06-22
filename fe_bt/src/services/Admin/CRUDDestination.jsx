import axios from "axios";
export const createDestination = async (destinationData) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/Destinations",
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
      `http://vivutravel.net/api/Destinations/${destinationId}`,
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
      `http://vivutravel.net/api/Destinations/${destinationId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllDestination = async () => {
  try {
    const response = await axios.get(
      "http://vivutravel.net/api/Destinations"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
