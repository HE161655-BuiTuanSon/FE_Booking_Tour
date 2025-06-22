import axios from "axios";

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(
        "http://vivutravel.net/api/Souvenirs",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
        `http://vivutravel.net/api/Souvenirs/${productId}`,
        productData,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Thêm header
        }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
        `http://vivutravel.net/api/Souvenirs/${productId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllProduct = async (page = 1) => {
  try {
    const response = await axios.get(
        `http://vivutravel.net/api/Souvenirs?page=${page}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};