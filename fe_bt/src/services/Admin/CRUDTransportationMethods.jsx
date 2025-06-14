import axios from "axios";
export const createMethodTrans = async (methodTransData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/TransportationMethods",
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
      `https://localhost:44338/api/TransportationMethods/${methodTransId}`,
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
      `https://localhost:44338/api/TransportationMethods/${methodTransId}`
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
      "https://localhost:44338/api/TransportationMethods"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
