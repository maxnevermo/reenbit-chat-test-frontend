import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ChatsPage from "./pages/Chats/Chats";
import LoginPage from "./pages/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
