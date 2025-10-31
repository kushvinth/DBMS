import React from 'react'

const tips = [
  { title: 'Improve Communication Skills', text: 'Practice public speaking and group discussions regularly.' },
  { title: 'Gain Internship Experience', text: 'Real-world exposure makes your resume stronger.' },
  { title: 'Work on Projects', text: 'Showcase problem-solving through mini-projects and GitHub contributions.' },
  { title: 'Focus on CGPA', text: 'Maintain consistency in academics for placement eligibility.' },
  { title: 'Engage in Extracurriculars', text: 'Develop leadership and teamwork skills outside academics.' },
]

const TipsInsights: React.FC = () => {
  return (
    <div className="page">
      <h2>Placement Tips & Insights</h2>
      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className="tip-card">
            <h3>{tip.title}</h3>
            <p>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TipsInsights
