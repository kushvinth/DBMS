import React, { useState } from 'react'

const PredictionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    IQ: '',
    Prev_Sem_Result: '',
    CGPA: '',
    Academic_Performance: '',
    Internship_Experience: '',
    Extra_Curricular_Score: '',
    Communication_Skills: '',
    Projects_Completed: '',
  })

  const [result, setResult] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dummy prediction for now
    const prediction = Math.random() > 0.5 ? 'Placed 🎉' : 'Not Placed 😔'
    setResult(prediction)
  }

  return (
    <div className="page">
      <h2>Placement Prediction Form</h2>
      <form onSubmit={handleSubmit} className="form">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label>{key.replace(/_/g, ' ')}:</label>
            {key === 'Internship_Experience' ? (
              <select name={key} value={(formData as any)[key]} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            ) : (
              <input
                type="number"
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button type="submit">Predict</button>
      </form>

      {result && <h3 className="result">Prediction Result: {result}</h3>}
    </div>
  )
}

export default PredictionForm
