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
