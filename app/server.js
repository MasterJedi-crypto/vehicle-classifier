import express from 'express'
import multer from 'multer'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express()
app.use(cors({
  origin: 'http://localhost:5173',
}))
const upload = multer({ storage: multer.memoryStorage() })

const PORT = 3001

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image was uploaded.' })
    }

    const endpoint = process.env.AZURE_VISION_ENDPOINT
    const key = process.env.AZURE_VISION_KEY

    if (!endpoint || !key) {
      return res.status(500).json({
        error: 'Azure Vision credentials are missing.',
      })
    }

    const cleanEndpoint = endpoint.replace(/\/$/, '')

    const azureUrl =
      `${cleanEndpoint}/vision/v3.2/analyze` +
      '?visualFeatures=Description,Tags,Objects,Categories'

    const azureResponse = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/octet-stream',
      },
      body: req.file.buffer,
    })

    const data = await azureResponse.json()

    if (!azureResponse.ok) {
      console.error('Azure error:', data)

      return res.status(azureResponse.status).json({
        error: 'Azure could not analyse the image.',
        details: data,
      })
    }

    res.json(data)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'Something went wrong while analysing the image.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Azure Vision backend running on http://localhost:${PORT}`)
})