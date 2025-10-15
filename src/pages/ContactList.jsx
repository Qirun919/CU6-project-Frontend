import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container, Typography, Paper, Box, Button, Chip } from "@mui/material";
import { useCookies } from "react-cookie";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import { getContactsByJob, updateContactStatus } from "../utils/api_contact";
import { useNavigate } from "react-router";

const ContactList = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "" } = currentuser;
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await getContactsByJob(jobId, token);
        setContacts(res);
      } catch (error) {
        console.error("❌ Failed to load contacts:", error);
      }
    };
    fetchContacts();
  }, [jobId, token, role]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateContactStatus(id, newStatus, token);
      Swal.fire("Status Updated!", "", "success");
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error(" Failed to update status:", error);
      Swal.fire("Error updating status!", "", "error");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error(" Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="contactList" />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Contact Messages
        </Typography>

        {contacts.length === 0 ? (
          <Typography color="text.secondary">No contacts yet</Typography>
        ) : (
          contacts.map((contact) => (
            <Paper
              key={contact._id}
              sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: 2 }}
            >
              <Typography variant="h6">
                {contact.user?.name || "Unknown User"}
              </Typography>
              <Typography color="text.secondary">
                Job: {contact.job?.title || "Untitled"}
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

              <Box
                sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center" }}
              >
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

                {/* Dropdown for changing status */}
                <select
                  value={contact.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(contact._id, e.target.value)
                  }
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </Box>
            </Paper>
          ))
        )}
      </Container>
    </>
  );
};

export default ContactList;
