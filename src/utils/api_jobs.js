import axios from "axios";
import { API_URL } from "./constants";

// show all jobs
export async function getJobs(specialisation, page = 1) {
  const response = await axios.get(
    API_URL +
      "jobs?page=" +
      page +
      (specialisation === "all" ? "" : "&specialisation=" + specialisation)
  );
  // e.g. http://localhost:5919/jobs?page=1&specialisation=IT
  return response.data;
}

// show job with id
export async function getJob(id) {
  const response = await axios.get(API_URL + "jobs/" + id);
  return response.data;
}

// create job
export async function addJob(
  title,
  description,
  companyName,
  location,
  salary,
  role,
  specialisation,
  postedBy,
  token
) {
  const response = await axios.post(
    API_URL + "jobs",
    {
      title,
      description,
      companyName,
      location,
      salary,
      role,
      specialisation,
      postedBy,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// update job
export async function updateJob(
  id,
  title,
  description,
  companyName,
  location,
  salary,
  role,
  specialisation,
  postedBy,
  token
) {
  const response = await axios.put(
    API_URL + "jobs/" + id,
    {
      title,
      description,
      companyName,
      location,
      salary,
      role,
      specialisation,
      postedBy,
    },
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  return response.data;
}

// delete job
export async function deleteJob(id, token) {
  const response = await axios.delete(API_URL + "jobs/" + id, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
}
