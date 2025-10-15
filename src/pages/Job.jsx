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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJob(id);
        setJob(data);
      } catch (error) {
        toast.error("❌ Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSavedJobs = async () => {
    if (!token) {
      toast.error("⚠️ Please login first!");
      return;
    }
    try {
      const res = await savedJobs(id, token);
      toast.success(res.message || "💾 Job saved!");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to save job");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("⚠️ Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!job) return <Typography align="center">Job not found</Typography>;

  return (
    <>
      <Header current="your job" />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        {/* Job Header */}
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {job.title}
          </Typography>
          <Typography variant="h6" color="primary">
            {job.companyName}
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

        {/* Job Info */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              💰 <b>Salary:</b> {job.salary || "Undisclosed"}
            </Typography>
            <Typography variant="body1" gutterBottom>
              📍 <b>Location:</b> {job.location}
            </Typography>
            <Typography variant="body1">
              💼 <b>Role:</b> {job.role}
            </Typography>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box
          display="flex"
          justifyContent="space-between"
          gap={2}
          flexWrap="wrap"
        >
          <Button variant="outlined" color="primary" onClick={handleSavedJobs}>
            💾 Save Job
          </Button>

          {role === "employer" && currentuser.name === job.postedBy && (
            <Button
              component={Link}
              to={`/contactlist/${job._id}`}
              variant="contained"
              color="secondary"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              View Contacts
            </Button>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={() => navigate(`/contact/${job._id}`)}
          >
            📞 Contact
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Job;
