import "./App.css";
import TopNavbar from "./components/topNavbar";
import { Route, Routes } from "react-router-dom";
import ReactionTimePage from "./components/pages/reactionTimerPage";
import VideoRecorderPage from "./components/pages/videoRecorderPage";
import GithubProfilePage from "./components/pages/githubProfilePage";

function App() {
  return (
    <>
      <TopNavbar />
      <Routes>
        <Route path="/" element={<ReactionTimePage />} />
        <Route path="/video" element={<VideoRecorderPage />} />
        <Route path="/profile" element={<GithubProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
