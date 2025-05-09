import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import Users from './pages/UsersPage/Users';
import Receipts from './pages/ReceiptsPage/Receipts';
import Bonuses from './pages/BonusesPage/Bonuses';
import Branches from './pages/BranchesPage/Branches';
import Dashborad from './pages/DashboardPage/Dashboard';
import Message from './pages/MessagesPage/Message';
import AdminAdd from './pages/AdminAddPage/AdminAdd';

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
        <Route path="/dashboard" element={<Dashborad />} />
        <Route path="/messages" element={<Message />} />
        {localStorage.getItem('role') === 'superadmin' ? (
          <Route path="/admin-add" element={<AdminAdd />} />
        ) : (
          ''
        )}
      </Route>
    </Routes>
  );
};

export default App;
