import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams, useNavigate, Link } from "react-router";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Paper,
} from "@mui/material";
import { getJob } from "../utils/api_jobs";
import { savedJobs } from "../utils/api_savedjobs";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

const Job = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const currentuser = cookies.currentuser || {};
  const { token = "", role = "" } = currentuser;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getJob(id);
        setJob(data);
      } catch (error) {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token, navigate]);

  const handleSavedJobs = async () => {
    if (!token) {
      toast.error("Please login first!");
      return;
    }
    setLoading(true);
    try {
      const res = await savedJobs(id, token);
      toast.success(res.message || "Job saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Header current="your job" />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Fetching job details...
          </Typography>
        </Container>
      </>
    );

  if (!job)
    return (
      <>
        <Header current="your job" />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h6">Job not found.</Typography>
        </Container>
      </>
    );


  return (
    <>
      <Header current="your job" />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          {/* Job Header */}
          <Box mb={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {job.title}
            </Typography>
            <Typography variant="h6" color="primary">
              {job.companyName}
            </Typography>
          </Box>

          {/* Job Info */}
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>
              <b>Salary:</b> {job.salary || "Undisclosed"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <b>Location:</b> {job.location}
            </Typography>
            <Typography variant="body1">
              <b>Role:</b> {job.role}
            </Typography>
          </Box>

          {/* Job Description */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Description
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line" }}>
                {job.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
            mt={3}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSavedJobs}
              disabled={loading}
            >
              Save Job
            </Button>

            {role === "employer" && currentuser.name === job.postedBy && (
              <Button
                component={Link}
                to={`/contactlist/${job._id}`}
                variant="contained"
                color="secondary"
              >
                View Contacts
              </Button>
            )}

            <Button
              variant="contained"
              color="success"
              onClick={() => navigate(`/contact/${job._id}`)}
            >
              Contact
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Job;
