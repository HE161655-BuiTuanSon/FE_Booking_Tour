import axios from "axios";
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Souvenirs",
      productData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/Souvenirs/${productId}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/Souvenirs/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
