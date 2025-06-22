import axios from "axios";

export const register = async (fullName, email, password, phone, address) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/Auth/register",
      {
        fullName: fullName,
        email: email,
        password: password,
        phone: phone,
        address: address,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
