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
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { addJob } from "../utils/api_jobs";
import { getSpecialisations } from "../utils/api_specialisations";

const AddJob = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  // form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [role, setRole] = useState(""); // Full-Time, Part-Time, Internship
  const [specialisation, setSpecialisation] = useState("");
  const [specialisations, setSpecialisations] = useState([]);
  const [loading, setLoading] = useState(false);

  // load specialisations
  useEffect(() => {
    getSpecialisations().then((data) => setSpecialisations(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !companyName ||
      !location ||
      !salary ||
      !role ||
      !specialisation
    ) {
      toast.error(" Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      await addJob(
        title,
        description,
        companyName,
        location,
        salary,
        role,
        specialisation,
        currentuser.name,
        token
      );

      toast.success("Job added successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="addjob" />
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" mb={3}>
          Add New Job
        </Typography>

        <Box mb={2}>
          <TextField
            label="Job Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 30 }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Company Name"
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Salary "
            fullWidth
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            inputProps={{ maxLength: 20 }}
          />
        </Box>

        {/* Role Dropdown */}
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

        {/* Specialisation Dropdown */}
        <Box mb={2}>
          <FormControl fullWidth>
            <InputLabel id="job-category-label">Specialisation</InputLabel>
            <Select
              labelId="job-category-label"
              value={specialisation}
              label="Specialisation"
              onChange={(e) => setSpecialisation(e.target.value)}
            >
              {specialisations.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.label}
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
            inputProps={{ maxLength: 50 }}
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
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default AddJob;
