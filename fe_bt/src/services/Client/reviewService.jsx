import axios from "axios";
export const getAllConsultation = async () => {
  try {
    const response = await axios.get(
      "https://localhost:44338/api/Consultations"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const createConsultation = async (dataForm) => {
  try {
    const response = await axios.post(
      "https://localhost:44338/api/Consultations",
      dataForm
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
