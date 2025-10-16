import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useCookies } from "react-cookie";
import { getSavedJobs, deleteSavedJob } from "../utils/api_savedjobs";
import Swal from "sweetalert2";
import { toast } from "sonner";

const SavedJobs = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    if (!token) {
      Swal.fire("Please log in first!", "", "warning");
      return;
    }

    getSavedJobs(token)
      .then((res) => {
        // ⚡ FIX: res is already the array from your API
        setSavedJobs(res || []);
      })
      .catch((error) => {
        console.error("Failed to fetch saved jobs:", error);
        setSavedJobs([]);
      });
  }, [token]);

  const handleJobDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to remove this saved job?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSavedJob(id, token);
          const updated = await getSavedJobs(token);
          setSavedJobs(updated || []);
          toast.success("Saved job removed");
        } catch (error) {
          console.error(" Failed to delete saved job:", error);
          toast.error("Failed to delete job");
        }
      }
    });
  };

  return (
    <>
      <Header current="savedjobs" />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Saved Jobs
        </Typography>

        {savedJobs.length === 0 ? (
          <Typography color="text.secondary">No saved jobs yet </Typography>
        ) : (
          savedJobs.map((item) => (
            <Paper
              key={item._id}
              sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: 2 }}
            >
              <Typography variant="h6">
                {item.job?.title || "Untitled"}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {item.job?.companyName || "Unknown Company"} —{" "}
                {item.job?.location || "Unspecified"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {item.job?.description || "No description available."}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="outlined"
                  href={`/job/${item.job._id}/check`}
                  sx={{ borderRadius: 2 }}
                >
                  View Job
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleJobDelete(item._id)}
                  sx={{ borderRadius: 2 }}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </>
  );
};

export default SavedJobs;
