import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Auth/user-login",
      {
        email: email,
        password: password,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
