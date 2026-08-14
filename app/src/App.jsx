import { useState } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(event) {
    const file = event.target.files[0]

    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
      setError('')
    }
  }

  async function analyzeVehicle() {
    if (!image) {
      setError('Please choose a vehicle image first.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Image analysis failed.')
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const description =
    result?.description?.captions?.[0]?.text || 'No description returned.'

  const confidence = result?.description?.captions?.[0]?.confidence

  const tags =
    result?.tags?.slice(0, 6).map((tag) => tag.name).join(', ') ||
    'No tags returned.'

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>Turners</h1>
          <span>Car Insurance</span>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <p className="eyebrow">AI Vehicle Recognition Prototype</p>
          <h2>Identify your vehicle from a photo</h2>
          <p>
            Upload an image of a vehicle and use Azure Computer Vision to
            analyse what appears in the image.
          </p>
        </section>

        <section className="recognition-card">
          <div className="upload-area">
            <h3>Upload vehicle image</h3>
            <p>Select a clear photo showing the vehicle.</p>

            <label className="upload-button">
              Choose image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {image && <p className="filename">{image.name}</p>}

            <button
              className="analyze-button"
              onClick={analyzeVehicle}
              disabled={!image || loading}
            >
              {loading ? 'Analysing...' : 'Analyse Vehicle'}
            </button>
          </div>

          <div className="preview-area">
            {preview ? (
              <img src={preview} alt="Vehicle preview" />
            ) : (
              <div className="placeholder">
                <span>Vehicle preview</span>
              </div>
            )}
          </div>
        </section>

        <section className="result-card">
          <h3>AI Recognition Result</h3>

          {error && <p className="error">{error}</p>}

          {!result && !error && (
            <p>Upload a vehicle image and select Analyse Vehicle.</p>
          )}

          {result && (
            <div className="result-content">
              <p>
                <strong>Description:</strong> {description}
              </p>

              {confidence !== undefined && (
                <p>
                  <strong>Confidence:</strong>{' '}
                  {(confidence * 100).toFixed(1)}%
                </p>
              )}

              <p>
                <strong>Tags:</strong> {tags}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App