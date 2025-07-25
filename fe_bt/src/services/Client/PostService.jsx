import axios from "axios";
export const getFourPosts = async () => {
  try {
    const response = await axios.get(
      "http://vivutravel.net/api/Home/lastest-article"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPosts = async (page, pageSize) => {
  try {
    const response = await axios.get(
      `http://vivutravel.net/api/Articles?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getPostById = async (postId) => {
  try {
    const response = await axios.get(
      `http://vivutravel.net/api/Articles/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
