import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { NavbarDefault } from "./components/Navbar";
import { SimpleFooter } from "./components/Footer";
import { Registerpage } from "./pages/RegisterPage";
import Errorpage from "./pages/ErrorPage";
import { ReportIncident } from "./pages/ReportIncident";

import { useState } from "react";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
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

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <>
      <NavbarDefault />
      <Routes>
        <Route path={"/"} element={<Homepage />} />
        <Route path={"/report-incident"} element={<ReportIncident />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/register"} element={<Registerpage />} />
        <Route path={"/*"} element={<Errorpage />} />
        <Route
          path="/dashboard"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Dashboard />
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
                <Team />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/contacts"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Contacts />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/invoices"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Invoices />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/form"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Form />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/bar"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Bar />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/pie"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Pie />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/line"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Line />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/faq"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <FAQ />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/calendar"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Calendar />
              </ThemeProvider>
            </ColorModeContext.Provider>
          }
        />
        <Route
          path="/geography"
          element={
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Geography />
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
                <Incident />
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
                <DetailIncident />
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
                <DetailTeam />
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
                <NewTeam />
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
                <Department />
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
                <NewDepartment />
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
                <DetailDepartment />
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
                <Profiles />
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
                <DetailProfiles />
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
