import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import './App.css'
import Home from './pages/Home';
import Signup from './pages/loginSignup/Signup';
import Login from './pages/loginSignup/Login';
import Menu from './pages/menu/Menu';
import Contact from './pages/Contact';
import Admin from './pages/admin/Admin';
import Cart from './pages/cart/Cart';
import Order from './pages/orders/Order';
import Orders from './pages/orders/Orders';
import NewUserSignup from './pages/loginSignup/NewUserSignUp';
function App() {
  const [count, setCount] = useState(0)

  return (
    <GoogleOAuthProvider clientId="1020928591827-6t6ttnsfitqqetu47lq9ek841i3kgcsn.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/menu" element={<Menu/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order/:userId" element={<Order />} />
        <Route path="/orders" element={<Orders/>} />
        <Route path="/newUserSignup" element={<NewUserSignup/>} />

      </Routes>
    </Router>
     </GoogleOAuthProvider>
  )
}

export default App
