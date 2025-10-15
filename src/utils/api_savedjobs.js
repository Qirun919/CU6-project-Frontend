import axios from "axios";
import { API_URL } from "./constants";

// save job
export async function savedJobs(jobId, token) {
  const res = await axios.post(
    API_URL + "savedjobs",
    { jobId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// get all saved jobs for the logged-in user
export async function getSavedJobs(token) {
  const res = await axios.get(API_URL + "savedjobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// delete a saved job
export async function deleteSavedJob(id, token) {
  const res = await axios.delete(API_URL + "savedjobs/" + id, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
