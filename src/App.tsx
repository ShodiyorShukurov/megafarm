import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import Users from './pages/UsersPage/Users';
import Receipts from './pages/ReceiptsPage/Receipts';
import Bonuses from './pages/BonusesPage/Bonuses';
import Branches from './pages/BranchesPage/Branches';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route element={<PrivateRoute />}>
      <Route path="/users" element={<Users />} />
      <Route path="/receipts" element={<Receipts />} />
      <Route path="/bonuses" element={<Bonuses />} />
      <Route path="/branches" element={<Branches />} />
      </Route>
    </Routes>
  );
};

export default App;
