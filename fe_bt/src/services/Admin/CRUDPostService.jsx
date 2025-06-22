import axios from "axios";

const API_BASE_URL = "https://localhost:44338/api/Articles";

// Helper function to add authorization headers if needed
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Adjust based on your auth setup
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET: Fetch all posts with pagination
export const getAllPost = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}?page=${page}&pageSize=${pageSize}`,
      { headers: getAuthHeaders() }
    );
    return response.data.data; // Backend wraps data in a "data" field
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error.response?.data?.message || "Failed to fetch posts";
  }
};

// GET: Fetch a single post by ID (optional, if needed for editing)
export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch post ${postId}:`, error);
    throw error.response?.data?.message || "Failed to fetch post";
  }
};

// POST: Create a new post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(API_BASE_URL, postData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error.response?.data?.message || "Failed to create post";
  }
};

// PUT: Update an existing post
export const updatePost = async (postId, postData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${postId}`, postData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to update post ${postId}:`, error);
    throw error.response?.data?.message || "Failed to update post";
  }
};

// DELETE: Delete a post
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${postId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete post ${postId}:`, error);
    throw error.response?.data?.message || "Failed to delete post";
  }
};
