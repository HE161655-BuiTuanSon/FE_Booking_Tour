import axios from "axios";

export const createTour = async (formData) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Tour",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log("Data sent:", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating tour:", error.response?.data);
    throw error.response?.data || error;
  }
};

export const updateTour = async (tourId, formData) => {
  try {
    const response = await axios.put(
      `https://localhost:44338/api/Tour/${tourId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tour:", error.response?.data);
    throw error.response?.data || error;
  }
};

export const deleteTour = async (tourId) => {
  try {
    const response = await axios.delete(
      `https://localhost:44338/api/Tour/${tourId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting tour:", error.response?.data);
    throw error.response?.data || error;
  }
};

export const getAllTour = async (page, pageSize) => {
  try {
    const response = await axios.get(
      `https://localhost:44338/api/Tour?page=${page}&pageSize=${pageSize}&sortBy=departure`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tours:", error.response?.data);
    throw error.response?.data || error;
  }
};
