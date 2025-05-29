import axios from "axios";

export const getAllProduct = async (page, pageSize) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Souvenirs?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Souvenirs/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
