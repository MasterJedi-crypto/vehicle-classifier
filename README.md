# Vehicle Classifier

An AI-powered vehicle classification prototype developed for Mission Ready's Level 5 Advanced Full-Stack Developer programme.

The application allows a user to upload a vehicle image and uses a custom-trained Azure AI model to classify the vehicle as a **Sedan, SUV or Truck/Ute**, returning the predicted class and confidence score.

## The Problem

The original prototype used Azure Computer Vision to analyse uploaded vehicle images.

Testing showed that the general-purpose model could identify that an image contained a **car**, but it did not provide the level of vehicle classification needed for the project.

I used that result to redesign the solution using **Azure Custom Vision**, creating and training a model specifically for the vehicle categories required by the prototype.

## My Solution

I developed a full-stack prototype consisting of:

- A React and Vite frontend for image upload and results
- A Node.js and Express backend
- Azure Custom Vision integration
- Custom vehicle classes for Sedan, SUV and Truck/Ute
- Prediction confidence/probability display
- Manual Make, Model and Year fields
- Manual override functionality when AI classification needs correction
- Image upload handling with Multer
- Environment variables for API configuration

## Technology

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express
- Multer
- CORS
- dotenv
- REST API

### AI

- Microsoft Azure Custom Vision
- Custom image classification model
- Azure Prediction API

## How It Works

1. The user uploads an image of a vehicle.
2. The frontend sends the image to the Node/Express API.
3. The backend sends the image to the published Azure Custom Vision model.
4. The model evaluates the image against the trained vehicle classes.
5. The API returns the predicted vehicle type and probability.
6. The result is displayed to the user.
7. Vehicle details can be manually adjusted if required.

## What I Learned

One of the most important parts of this project was discovering that the first technical solution was not suitable for the actual requirement.

Rather than treating the generic **"car"** result from Azure Computer Vision as sufficient, I tested another approach and moved to a purpose-trained Custom Vision model.

This project gave me practical experience with:

- Integrating an external AI service into a full-stack application
- Building API routes between a frontend and backend
- Handling image uploads
- Working with prediction responses and confidence scores
- Training and publishing a custom classification model
- Debugging API and environment configuration
- Iterating on a solution when the original approach did not meet the requirement

## Installation

Clone the repository:

```bash
git clone https://github.com/MasterJedi-crypto/vehicle-classifier.git
cd vehicle-classifier
```

Install dependencies:

```bash
npm install
```

The frontend and backend may require their dependencies to be installed separately depending on the project structure.

## Environment Variables

Azure credentials are not included in this repository.

Create the required environment file locally and configure your Azure Custom Vision prediction credentials before running the backend.

**Never commit API keys or secrets to GitHub.**

## Project Context

This was an **individual Mission Ready project** completed as part of the Level 5 Advanced Full-Stack Developer programme.

The project demonstrates full-stack development, REST API integration and the process of adapting an AI solution after testing showed that the original approach did not provide sufficiently specific results.