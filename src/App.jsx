import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";

function App() {
  const [currentView, setCurrentView] = useState("landing"); // "landing" | "dashboard"

  if (currentView === "landing") {
    return (
      <LandingPage
        onExplore={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      initialTab="overview"
      onNavigateHome={() => setCurrentView("landing")}
    />
  );
}

export default App;
