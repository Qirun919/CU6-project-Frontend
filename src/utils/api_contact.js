import axios from "axios";
import { API_URL } from "./constants";

// Create new contact
export async function addContact(userId, jobId, message, resume, token) {
  const res = await axios.post(
    API_URL + "contacts",
    { userId, jobId, message, resume },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return res.data;
}

// Get contacts by user
export async function getContactsByUser(userId, token) {
  const res = await axios.get(API_URL + "contacts/user/" + userId, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
}

// Get contacts for a job (employer)
export async function getContactsByJob(jobId, token) {
  const res = await axios.get(API_URL + "contacts/job/" + jobId, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
}

// Update contact status (employer only)
export async function updateContactStatus(id, status, token) {
  const res = await axios.put(
    API_URL + "contacts/" + id,
    { status },
    { headers: { Authorization: "Bearer " + token } }
  );
  return res.data;
}

// Delete a contact
export async function deleteContact(id, token) {
  const res = await axios.delete(API_URL + "contacts/" + id, {
    headers: { Authorization: "Bearer " + token },
  });
  return res.data;
}
