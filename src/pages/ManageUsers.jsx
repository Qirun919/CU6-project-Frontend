import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
} from "@mui/material";
import Header from "../components/Header";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getAllUsers, updateUserRole, deleteUser } from "../utils/api_users";

const ManageUsers = () => {
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "" } = currentuser;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!token) {
      toast.error("⚠️ Please log in first!");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (role !== "admin") {
      toast.error("Access denied — Admins only.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        toast.error("Failed to load users.");
      }
    };

    fetchUsers();
  }, [token, role]);

  // 🔄 Change user role
  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "user" ? "employer" : "user";

    Swal.fire({
      title: `Change role to "${newRole}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateUserRole(id, newRole, token);
          const updatedUsers = await getAllUsers(token);
          setUsers(updatedUsers);
          toast.success("User role updated successfully!");
        } catch (error) {
          console.error("❌ Failed to update user role:", error);
          toast.error("Failed to update user role.");
        }
      }
    });
  };

  

  //  Delete user
  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id, token);
          const updatedUsers = await getAllUsers(token);
          setUsers(updatedUsers);
          toast.success("User deleted successfully!");
        } catch (error) {
          console.error("❌ Failed to delete user:", error);
          toast.error("Failed to delete user.");
        }
      }
    });
  };

  return (
    <>
      <Header current="manageUsers" />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Manage Users
        </Typography>

        {users.length === 0 ? (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No users found 😴
          </Typography>
        ) : (
          users.map((user) => (
            <Card key={user._id} sx={{ mb: 2, p: 2, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography color="text.secondary">{user.email}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={user.role}
                    color={user.role === "admin" ? "secondary" : "primary"}
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>
              </CardContent>

              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="contained"
                  color="info"
                  disabled={user.role === "admin"} // don’t change admin
                  onClick={() => handleRoleChange(user._id, user.role)}
                >
                  Change Role
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  disabled={user.role === "admin"} // don’t delete admin
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </Container>
    </>
  );
};

export default ManageUsers;
