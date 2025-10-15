import { Link } from "react-router";
import { Button } from "@mui/material";
import Header from "../components/Header";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import { useState, useEffect } from "react";
import { getJobs } from "../utils/api_jobs";
import { toast } from "sonner";
import { getSpecialisations } from "../utils/api_specialisations";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const Jobs = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "" } = currentuser;
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [specialisation, setSpecialisation] = useState("all");
  const [specialisations, setSpecialisations] = useState([]);
  const navigate = useNavigate();

  // Fetch jobs
  useEffect(() => {
    getJobs(specialisation, page).then((data) => {
      setJobs(data);
    });
  }, [specialisation, page]);

  // Fetch specialisations
  useEffect(() => {
    getSpecialisations().then((data) => setSpecialisations(data));
  }, []);

  // if user don't have login it will be error("please login first to use ")
  useEffect(() => {
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="home" />
      <Container
        sx={{
          p: 1,
        }}
      >
        {/* Top Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Jobs
          </Typography>
        </Box>

        {/* Filter */}
        <Box sx={{ paddingBottom: "10px" }}>
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel
              id="filter-specialisation-label"
              sx={{ backgroundColor: "white", paddingRight: "5px" }}
            >
              Filter By Specialisation
            </InputLabel>
            <Select
              labelId="filter-specialisation-label"
              id="filter-specialisation"
              value={specialisation}
              label="Specialisation"
              onChange={(event) => {
                setSpecialisation(event.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {specialisations.map((spec) => (
                <MenuItem key={spec._id} value={spec._id}>
                  {spec.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Job Cards */}
        <Container container spacing={4} sx={{ m: 3 }}>
          {jobs.map((job) => (
            <Card key={job._id}>
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

              <CardActions sx={{ display: "block", px: 3, pb: 3 }}>
                <Button
                  component={Link}
                  to={`/job/${job._id}/check`}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </Container>

        {/* No Jobs */}
        {jobs.length === 0 && (
          <Typography variant="h5" align="center" py={3}>
            No jobs found.
          </Typography>
        )}

        {/* Pagination */}
        <Box
          sx={{
            pt: 2,
            pb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page: {page}</span>
          <Button
            variant="contained"
            disabled={jobs.length === 0}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Jobs;
