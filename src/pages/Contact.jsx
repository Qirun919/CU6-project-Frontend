import { useState } from "react";
import Header from "../components/Header";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { addContact } from "../utils/api_contact";

const Contact = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", _id: userId } = currentuser;

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [resume, setResume] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addContact(userId, jobId, message, resume, token);
      Swal.fire("Application sent!", "", "success");
      navigate("/savedjobs");
    } catch (error) {
      console.error("❌ Failed to send contact:", error);
      Swal.fire("Something went wrong!", "", "error");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("⚠️ Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="contact" />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contact Employer
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Resume Link or Summary"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Message to Employer"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ borderRadius: 2 }}
                onClick={handleSubmit}
              >
                Submit Application
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Contact;
