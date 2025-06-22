import axios from "axios";
export const createDesparturePoint = async (desparturePointData) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/DeparturePoints",
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
      `http://vivutravel.net/api/DeparturePoints/${desparturePointId}`,
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
      `http://vivutravel.net/api/DeparturePoints/${desparturePointId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllDeparturePoint = async () => {
  try {
    const response = await axios.get(
      "http://vivutravel.net/api/DeparturePoints"
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
