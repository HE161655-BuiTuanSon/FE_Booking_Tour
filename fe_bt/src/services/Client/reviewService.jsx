import axios from "axios";
export const getAllConsultation = async () => {
  try {
    const response = await axios.get("http://vivutravel.net/api/Consultations");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createConsultation = async (dataForm) => {
  try {
    const response = await axios.post(
      "http://vivutravel.net/api/Consultations",
      dataForm
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
