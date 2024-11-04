import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { NavbarDefault } from "./components/Navbar";
import { SimpleFooter } from "./components/Footer";
import { Registerpage } from "./pages/RegisterPage";
import Errorpage from "./pages/ErrorPage";
import { ReportIncident } from "./pages/ReportIncident";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Incident from "./scenes/incident/Incident";
import DetailIncident from "./scenes/incident/DetailIncident";
import DetailTeam from "./scenes/team/DetailTeam";
import NewTeam from "./scenes/team/NewTeam";
import DetailDepartment from "./scenes/department/DetailDepartment";
import NewDepartment from "./scenes/department/NewDepartment";
import Department from "./scenes/department/Department";
import Profiles from "./scenes/profiles/Profiles";
import DetailProfiles from "./scenes/profiles/DetailProfiles";
import WorkFlow from "./scenes/workflow";
import DetailWorkflow from "./scenes/workflow/DetailWorkflow";
import PrivateRoute from "./components/PrivateRoute";
import Permission from "./scenes/permission/Permission";
import MyIncidentPage from "./pages/MyIncidentPage";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <>
      <NavbarDefault />
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/report-incident"} element={<ReportIncident />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/register"} element={<Registerpage />} />
        <Route path={"/my-incident"} element={<MyIncidentPage />} />
        <Route path={"/*"} element={<Errorpage />} />
        <Route
          path="/dashboard"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/team"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Team />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/workflow"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <WorkFlow />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/workflow/:id"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <DetailWorkflow />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />

        <Route
          path="/incident"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Incident />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/incidents/:id"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <DetailIncident />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/teams/:id"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <DetailTeam />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/teams/new"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <NewTeam />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/departments"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Department />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/deaprtments/new"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <NewDepartment />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/departments/:id"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <DetailDepartment />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/profiles"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Profiles />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/profiles/:id"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <DetailProfiles />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/permission"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <PrivateRoute>
                  <Permission />
                </PrivateRoute>
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
      </Routes>

      <SimpleFooter />
    </>
  );
}

export default App;
