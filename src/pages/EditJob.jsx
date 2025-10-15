import { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate, useParams, Link } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { getJob, updateJob } from "../utils/api_jobs";
import { getSpecialisations } from "../utils/api_specialisations";

const EditJob = () => {
  const { id } = useParams(); // retrieve the id from the url
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState("");
  const [specialisation, setSpecialisation] = useState("");
  const [specialisations, setSpecialisations] = useState([]);
  const [postedBy, setPostedBy] = useState("");
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  // load the job data from the backend API, and assign it the state
  useEffect(() => {
    getJob(id)
      .then((jobData) => {
        // check if jobData is empty or not
        if (jobData) {
          //update the state with jobData
          setTitle(jobData ? jobData.title : "");
          setDescription(jobData ? jobData.description : "");
          setCompanyName(jobData ? jobData.companyName : "");
          setLocation(jobData ? jobData.location : "");
          setSalary(jobData ? jobData.salary : 0);
          setRole(jobData ? jobData.role : "");
          setSpecialisation(
            jobData?.specialisation?._id || jobData?.specialisation || ""
          );
          setPostedBy(jobData ? jobData.postedBy : "");
        } else {
          // if not available, set error message
          setError("Job not found");
        }
      })
      .catch((error) => {
        // catch the API error
        setError("Job not found");
      });
  }, [id]);

  // Fetch categories (specialisations) on mount
  useEffect(() => {
    getSpecialisations().then((data) => setSpecialisations(data));
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error("⚠️ Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    // 1. check for error
    if (
      !title ||
      !description ||
      !companyName ||
      !location ||
      !salary ||
      !role ||
      !specialisation ||
      !postedBy
    ) {
      toast.error("Please fill up the required fields");
    }

    try {
      // 2. trigger the API to create new product
      await updateJob(
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
      );

      // 3. if successful, redirect user back to home page and show success message
      toast.success("job has been update");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header current="EditJob" />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={3}>
          Edit Job
        </Typography>

        <Box mb={2}>
          <TextField
            label="postedBy"
            fullWidth
            disabled
            value={postedBy}
            onChange={(e) => setPostedBy(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Job Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Company Name"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Salary"
            fullWidth
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="job-role-label">Role</InputLabel>
            <Select
              labelId="job-role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="Full-Time">Full-Time</MenuItem>
              <MenuItem value="Part-Time">Part-Time</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="job-specialisation-label">
              specialisation
            </InputLabel>
            <Select
              labelId="job-specialisation-label"
              value={specialisation}
              onChange={(e) => setSpecialisation(e.target.value)}
            >
              {specialisations.map((spec) => (
                <MenuItem key={spec._id} value={spec._id}>
                  {spec.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box mb={4}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "updatting..." : "Update"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EditJob;
