import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container, Typography, Paper, Box, Chip } from "@mui/material";
import { useCookies } from "react-cookie";
import { getContactsByUser } from "../utils/api_contact";
import { useNavigate } from "react-router";

const TheContact = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", _id: userId = "" } = currentuser;

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchContacts = async () => {
      try {
        const res = await getContactsByUser(userId, token);
        setContacts(res);
      } catch (error) {
        console.error("Failed to load your contacts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [token, userId]);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="thecontact" />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Contact Submissions
        </Typography>

        {loading ? (
          <Typography align="center">Loading...</Typography>
        ) : contacts.length === 0 ? (
          <Typography align="center">No contact submissions yet </Typography>
        ) : (
          contacts.map((contact) => (
            <Paper
              key={contact._id}
              sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: 2 }}
            >
              <Typography variant="h6">
                Job: {contact.job.title || "The Company got delete bruh"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                {contact.message}
              </Typography>
              <Typography variant="body2" color="primary">
                Resume:{" "}
                <a
                  href={contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.resume}
                </a>
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={contact.status || "Pending"}
                  color={
                    contact.status === "Accepted"
                      ? "success"
                      : contact.status === "Rejected"
                      ? "error"
                      : "warning"
                  }
                />
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </>
  );
};

export default TheContact;
