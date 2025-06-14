import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Features/Login'
// import PrivateRoute from './Routes/PrivateRoutes'
import Dashboard from './Dashboard/Dashboard'
import Layout from './Components/core/Layout'
import MyProfile from './Components/UI/MyProfile'
// import AddVehicle from './Vehicle/AddVehicle'
import Vehicles from './Vehicle/Vehicles'
import Managers from './Manager/Managers'
import Drivers from './Driver/Drivers'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route path="myprofile" element={<MyProfile />} />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<Dashboard/>} />
        <Route path="admin/vehicles" element={<Vehicles />} />
        <Route path="admin/managers" element={<Managers />} />
        <Route path="admin/drivers" element={<Drivers />} />

        {/* Manager Routes */}
        <Route path="manager/dashboard" element={<Dashboard />} />
        <Route path="manager/vehicles" element={<Vehicles />} />
        {/* <Route path="manager/drivers" element={<Drivers />} /> */}

        {/* Driver Routes */}
        <Route path="driver/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>

  )
}

export default App
