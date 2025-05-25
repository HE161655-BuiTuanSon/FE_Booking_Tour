import axios from "axios";
export const getFourPosts = async () => {
  try {
    const response = await axios.get(
      "https://localhost:44338/api/Home/lastest-article"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
