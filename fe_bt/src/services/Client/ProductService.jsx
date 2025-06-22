import axios from "axios";

export const getAllProduct = async (page, pageSize, sortBy) => {
  try {
    const response = await axios.get(
      `http://vivutravel.net/api/Souvenirs?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`
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
      `http://vivutravel.net/api/Souvenirs/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
