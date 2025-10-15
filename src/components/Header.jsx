import { useState } from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

const Header = (props) => {
  const navigate = useNavigate();
  const { current, title = "Welcome to DreamJob" } = props;
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  // for small screen menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "orange", color: "white", p: 1 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side title */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "700", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {title}
        </Typography>

        {/* Desktop buttons */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "10px",
          }}
        >
          {currentuser?.role === "user" && (
            <>
              <Button
                component={Link}
                to="/"
                variant={current === "home" ? "contained" : "outlined"}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/savedjobs"
                variant={current === "savedjobs" ? "contained" : "outlined"}
              >
                Saved Jobs
              </Button>
              <Button
                component={Link}
                to="/thecontact"
                variant={current === "thecontact" ? "contained" : "outlined"}
              >
                The Contact
              </Button>
            </>
          )}

          {currentuser?.role === "employer" && (
            <>
              <Button
                component={Link}
                to="/"
                variant={current === "home" ? "contained" : "outlined"}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/addjob"
                variant={current === "addjob" ? "contained" : "outlined"}
              >
                Add Job
              </Button>
              <Button
                component={Link}
                to="/savedjobs"
                variant={current === "savedjobs" ? "contained" : "outlined"}
              >
                Saved Jobs
              </Button>
              <Button
                component={Link}
                to="/joblists"
                variant={current === "joblists" ? "contained" : "outlined"}
              >
                Job Lists
              </Button>
            </>
          )}

          {currentuser?.role === "admin" && (
            <>
              <Button
                component={Link}
                to="/"
                variant={current === "home" ? "contained" : "outlined"}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/specialisation"
                variant={
                  current === "specialisation" ? "contained" : "outlined"
                }
              >
                Specialisation
              </Button>
              <Button
                component={Link}
                to="/savedjobs"
                variant={current === "savedjobs" ? "contained" : "outlined"}
              >
                Saved Jobs
              </Button>
              <Button
                component={Link}
                to="/manageUsers"
                variant={current === "manageUsers" ? "contained" : "outlined"}
              >
                Manage Users
              </Button>
            </>
          )}

          {currentuser ? (
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                removeCookie("currentuser");
                navigate("/");
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant={current === "login" ? "contained" : "outlined"}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant={current === "signup" ? "contained" : "outlined"}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile menu icon */}
        <IconButton
          color="inherit"
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {currentuser?.role === "user" && (
            <>
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem
                component={Link}
                to="/savedjobs"
                onClick={handleMenuClose}
              >
                Saved Jobs
              </MenuItem>
              <MenuItem
                component={Link}
                to="/thecontact"
                onClick={handleMenuClose}
              >
                The Contact
              </MenuItem>
            </>
          )}

          {currentuser?.role === "employer" && (
            <>
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/addjob" onClick={handleMenuClose}>
                Add Job
              </MenuItem>
              <MenuItem
                component={Link}
                to="/savedjobs"
                onClick={handleMenuClose}
              >
                Saved Jobs
              </MenuItem>
              <MenuItem
                component={Link}
                to="/joblists"
                onClick={handleMenuClose}
              >
                Job Lists
              </MenuItem>
            </>
          )}

          {currentuser?.role === "admin" && (
            <>
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem
                component={Link}
                to="/specialisation"
                onClick={handleMenuClose}
              >
                Specialisation
              </MenuItem>
              <MenuItem
                component={Link}
                to="/savedjobs"
                onClick={handleMenuClose}
              >
                Saved Jobs
              </MenuItem>
              <MenuItem
                component={Link}
                to="/manageUsers"
                onClick={handleMenuClose}
              >
                Manage Users
              </MenuItem>
            </>
          )}

          {currentuser ? (
            <MenuItem
              onClick={() => {
                removeCookie("currentuser");
                navigate("/");
                handleMenuClose();
              }}
            >
              Logout
            </MenuItem>
          ) : (
            <>
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                Login
              </MenuItem>
              <MenuItem component={Link} to="/signup" onClick={handleMenuClose}>
                Sign Up
              </MenuItem>
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
