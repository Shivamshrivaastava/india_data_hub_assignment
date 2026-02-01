import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Catalogue from './pages/Catalogue';

function PrivateRoute({ children }) {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/catalogue"
          element={
            <PrivateRoute>
              <Catalogue />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
