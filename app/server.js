import express from 'express'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = 3001

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
)

const upload = multer({
  storage: multer.memoryStorage(),
})

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image was uploaded.',
      })
    }

    const azureUrl = process.env.CUSTOM_VISION_ENDPOINT
    const predictionKey = process.env.CUSTOM_VISION_PREDICTION_KEY

    if (!azureUrl || !predictionKey) {
      return res.status(500).json({
        error: 'Azure Custom Vision configuration is missing.',
      })
    }

    const azureResponse = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Prediction-Key': predictionKey,
        'Content-Type': 'application/octet-stream',
      },
      body: req.file.buffer,
    })

    const responseText = await azureResponse.text()

    let data

    try {
      data = JSON.parse(responseText)
    } catch {
      data = { message: responseText }
    }

    if (!azureResponse.ok) {
      console.error('Azure error:', data)

      return res.status(azureResponse.status).json({
        error: 'Azure could not analyse the image.',
        details: data,
      })
    }

    if (!Array.isArray(data.predictions) || data.predictions.length === 0) {
      return res.status(502).json({
        error: 'Azure returned no vehicle predictions.',
      })
    }

    const topPrediction = data.predictions.reduce((best, current) =>
      current.probability > best.probability ? current : best,
    )

    return res.json({
      vehicleType: topPrediction.tagName,
      confidence: topPrediction.probability,
    })
  } catch (error) {
    console.error('Analysis error:', error)

    return res.status(500).json({
      error: 'Something went wrong while analysing the image.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Azure Vision backend running on http://localhost:${PORT}`)
})