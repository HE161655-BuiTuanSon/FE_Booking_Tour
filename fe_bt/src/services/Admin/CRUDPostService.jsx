import axios from "axios";
export const createPost = async (postData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Articles",
      postData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/Articles/${postId}`,
      postData
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/Articles/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const getAllPost = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Articles?page=${page}&pageSize=${pageSize}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
