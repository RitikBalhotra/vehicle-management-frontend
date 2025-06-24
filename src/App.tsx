import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Features/Login'
// import PrivateRoute from './Routes/PrivateRoutes'
import Dashboard from './Dashboard/Dashboard'
import Layout from './Components/core/Layout'
import MyProfile from './Features/MyProfile'
import PageNotFound from './PageNotFound'
import ResetPassword from './Features/ResetPassword'
import ChangePassword from './Features/ChangePassword'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/" element={<Layout />}>
        <Route path="myprofile" element={<MyProfile />} />
        <Route path='changepassword' element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>

  )
}

export default App
