import { useState, useEffect } from "react";
import Header from "../components/Header";
import Container from "@mui/material/Container";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  InputLabel,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Edit, Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import { toast } from "sonner";
import { useCookies } from "react-cookie";
import {
  getSpecialisations,
  addSpecialisation,
  updateSpecialisation,
  deleteSpecialisation,
} from "../utils/api_specialisations";

const SpecialisationsPage = () => {
  const [specialisations, setSpecialisations] = useState([]);
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedSpecID, setSelectedSpecID] = useState("");
  const [selectedSpecLabel, setSelectedSpecLabel] = useState("");

  const [cookies] = useCookies(["currentuser"]);
  const currentuser = cookies.currentuser || {};
  const { token = "", role = "" } = currentuser;

  useEffect(() => {
    fetchSpecialisations();
  }, []);

  const fetchSpecialisations = async () => {
    try {
      const data = await getSpecialisations();
      setSpecialisations(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch specialisations");
    }
  };

  const handleAddNew = async () => {
    if (!label) {
      toast.error("Please fill up the label");
      return;
    }
    try {
      await addSpecialisation(label, token);
      const newSpecialisations = await getSpecialisations();
      setSpecialisations(newSpecialisations);
      setLabel("");
      toast.success("New specialisation has been added");
    } catch (err) {
      toast.error(err.message || "Failed to add specialisation");
    }
  };

  const handleUpdate = async () => {
    if (!selectedSpecLabel) {
      toast.error("Label cannot be empty");
      return;
    }
    try {
      await updateSpecialisation(selectedSpecID, selectedSpecLabel, token);
      const newSpecialisations = await getSpecialisations();
      setSpecialisations(newSpecialisations);
      setOpen(false);
      toast.success("Specialisation has been updated");
    } catch (err) {
      toast.error(err.message || "Failed to update specialisation");
    }
  };

  const handleDelete = async (spec) => {
    Swal.fire({
      title: "Are you sure you want to delete this specialisation?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSpecialisation(spec._id, token);
          const newSpecialisations = await getSpecialisations();
          setSpecialisations(newSpecialisations);
          toast.success("Specialisation has been deleted");
        } catch (err) {
          toast.error(err.message || "Failed to delete specialisation");
        }
      }
    });
  };

  useEffect(() => {
    if (!token) {
      toast.error("⚠️ Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <>
      <Header current="specialisation" />
      <Container maxWidth="lg">
        <Typography variant="h4">Manage Specialisations</Typography>

        {/* Add new */}
        <Paper elevation={3} sx={{ p: "20px", mt: "20px" }}>
          <InputLabel>Add New Specialisation</InputLabel>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              mt: "5px",
            }}
          >
            <TextField
              fullWidth
              label="Specialisation"
              variant="outlined"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <Button color="primary" variant="contained" onClick={handleAddNew}>
              Add
            </Button>
          </Box>
        </Paper>

        {/* Existing list */}
        <Paper elevation={3} sx={{ p: "20px", mt: "20px" }}>
          <InputLabel>
            Existing Specialisations ({specialisations.length})
          </InputLabel>
          <List sx={{ width: "100%" }}>
            {specialisations.map((spec) => (
              <ListItem
                key={spec._id}
                disableGutters
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", gap: "10px" }}>
                    <IconButton
                      onClick={() => {
                        setOpen(true);
                        setSelectedSpecID(spec._id);
                        setSelectedSpecLabel(spec.label);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(spec)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={spec.label} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Edit modal */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <TextField
              fullWidth
              label="Specialisation"
              variant="outlined"
              value={selectedSpecLabel}
              onChange={(e) => setSelectedSpecLabel(e.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                pt: 2,
              }}
            >
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default SpecialisationsPage;
