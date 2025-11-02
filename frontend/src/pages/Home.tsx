import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="page">
      <h2 style={{ marginBottom: '16px' }}>Welcome to the College Placement Predictor</h2>
      <p style={{ marginBottom: '32px' }}>
        Enter your academic and personal details to predict your placement outcome
        and explore helpful insights for improving your employability.
      </p>
      <img src="https://cdn.pixabay.com/photo/2016/03/31/19/57/student-1299362_960_720.png" alt="students" style={{ maxWidth: '400px', borderRadius: '12px' }} />
    </div>
  )
}

export default Home
