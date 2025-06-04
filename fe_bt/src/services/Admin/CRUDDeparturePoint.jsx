import axios from "axios";
export const createDesparturePoint = async (desparturePointData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/DeparturePoints",
      desparturePointData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateDesparturePoint = async (
  desparturePointId,
  desparturePointData
) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/DeparturePoints/${desparturePointId}`,
      desparturePointData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteDesparturePoint = async (desparturePointId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/DeparturePoints/${desparturePointId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
