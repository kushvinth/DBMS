import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <h1>🎓 Placement Predictor</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/predict">Predict</Link>
        <Link to="/tips">Tips & Insights</Link>
      </div>
    </nav>
  )
}

export default Navbar
