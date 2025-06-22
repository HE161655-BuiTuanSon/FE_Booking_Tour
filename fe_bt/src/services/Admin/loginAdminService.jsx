import axios from "axios";

export const loginAdmin = async (email, password) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/Auth/admin-login",
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
