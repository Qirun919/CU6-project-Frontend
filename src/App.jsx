import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { CookiesProvider } from "react-cookie";

import AllJobs from "./pages/AllJobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Job from "./pages/Job";
import AddJob from "./pages/AddJob";
import JobLists from "./pages/JobLists";
import EditJob from "./pages/EditJob";
import SpecialisationsPage from "./pages/SpecialisationsPage";
import SavedJobs from "./pages/SavedJobs";
import ManageUsers from "./pages/ManageUsers";
import Contact from "./pages/Contact";
import ContactList from "./pages/ContactList";
import TheContact from "./pages/TheContact";

function App() {
  return (
    <div className="App">
      <CookiesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AllJobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/job/:id/check" element={<Job />} />
            <Route path="/addjob" element={<AddJob />} />
            <Route path="/joblists" element={<JobLists />} />
            <Route path="/jobs/:id/edit" element={<EditJob />} />
            <Route path="specialisation" element={<SpecialisationsPage />} />
            <Route path="/savedjobs" element={<SavedJobs />} />
            <Route path="/contact/:jobId" element={<Contact />} />
            <Route path="manageUsers" element={<ManageUsers />} />
            <Route path="contactlist/:jobId" element={<ContactList />} />
            <Route path="thecontact" element={<TheContact />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CookiesProvider>
    </div>
  );
}

export default App;
