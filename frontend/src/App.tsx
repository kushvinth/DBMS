import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PredictionForm from './pages/PredictionForm'
import TipsInsights from './pages/TipsInsights'
import Navbar from './components/Navbar'

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictionForm />} />
        <Route path="/tips" element={<TipsInsights />} />
      </Routes>
    </Router>
  )
}

export default App
