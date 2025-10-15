import { Link } from "react-router";
import { Button } from "@mui/material";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { deleteJob } from "../utils/api_jobs";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { API_URL } from "../utils/constants"; // make sure this exists

const JobLists = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "", name: userName = "" } = currentuser;
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Fetch jobs for this employer
  useEffect(() => {
    if (role === "employer" ) {
      fetch(`${API_URL}jobs/employer/${userName}`)
        .then((res) => res.json())
        .then((data) => setJobs(data))
        .catch((error) => console.error(error));
    }
  }, [role, userName]);

  // Delete job
  const handleJobDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this job?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteJob(id, token);
        setJobs(jobs.filter((job) => job._id !== id));
        toast.success("Job has been deleted");
      }
    });
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="joblists" />
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Your Jobs
          </Typography>
        </Box>

        {/* Job Cards */}
        <Box>
          {jobs.map((job) => (
            <Card key={job._id} sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ minHeight: "64px" }}>
                  {job.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {job.companyName} — {job.location}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                  }}
                >
                  <Chip label={"$" + job.salary} color="success" />
                  <Chip
                    label={
                      job.specialisation
                        ? job.specialisation.label
                        : "Unspecified"
                    }
                    color="primary"
                  />
                </Box>
              </CardContent>

              <CardActions
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 3,
                  pb: 3,
                }}
              >
                <Button
                  component={Link}
                  to={`/job/${job._id}/check`}
                  variant="contained"
                  color="primary"
                >
                  View Details
                </Button>
                <Button
                  component={Link}
                  to={`/jobs/${job._id}/edit`}
                  variant="contained"
                  color="info"
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleJobDelete(job._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))}

          {jobs.length === 0 && (
            <Typography variant="h5" align="center" py={3}>
              No jobs found.
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default JobLists;
