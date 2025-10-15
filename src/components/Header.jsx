import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import AppBar from "@mui/material/AppBar";

const Header = (props) => {
  const navigate = useNavigate();
  const { current, title = "Welcome to DreamJob" } = props;
  const [cookies, , removeCookie] = useCookies(["currentuser"]);
  const { currentuser } = cookies;

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "orange",
        color: "white",
        p: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // space between left, center, right
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "700",
            cursor: "pointer",
            flex: 1,
            textAlign: "left",
          }}
          onClick={() => navigate("/")}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 2,
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
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            flex: 1,
            gap: "10px",
          }}
        >
          {currentuser ? (
            <Button
              color="error"
              variant="outlined"
              onClick={() => {
                // remove cookies
                removeCookie("currentuser");
                // redirect to home page
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
      </Box>
    </AppBar>
  );
};

export default Header;
