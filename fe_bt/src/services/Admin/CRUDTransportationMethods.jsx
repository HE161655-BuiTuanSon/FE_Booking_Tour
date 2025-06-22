import axios from "axios";
export const createMethodTrans = async (methodTransData) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/TransportationMethods",
      methodTransData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateMethodTrans = async (methodTransId, methodTransData) => {
  try {
    const response = await axios.put(
      `http://vivutravel.net/api/TransportationMethods/${methodTransId}`,
      methodTransData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteMethodTrans = async (methodTransId) => {
  try {
    const response = await axios.delete(
      `http://vivutravel.net/api/TransportationMethods/${methodTransId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllMethodTrans = async () => {
  try {
    const response = await axios.get(
      "http://vivutravel.net/api/TransportationMethods"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
