import axios from "axios";
import { API_URL } from "./constants";

// Get all specialisations
export const getSpecialisations = async () => {
  const response = await axios.get(API_URL + "specialisations");
  return response.data;
};

// Add new specialisation
export const addSpecialisation = async (label, token) => {
  const response = await axios.post(
    API_URL + "specialisations",
    { label },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
};

// Update specialisation
export const updateSpecialisation = async (id, label, token) => {
  const response = await axios.put(
    API_URL + "specialisations/" + id,
    { label },
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  return response.data;
};

// Delete specialisation
export const deleteSpecialisation = async (id, token) => {
  const response = await axios.delete(API_URL + "specialisations/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return response.data;
};
