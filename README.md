# BMI Calculator with History Log

A clean, medical-styled BMI (Body Mass Index) calculator built in React. Calculates Body Mass Index from user height and weight, provides clinical category ratings, and maintains a persistent history log in `localStorage`.

## Features

- **Height & Weight Calculation**: Quick input validation for height (cm) and weight (kg).
- **Body Mass Index Formula**: Standard medical formula calculation $BMI = weight / (height/100)^2$.
- **Category Classification**: Color-coded results for:
  - Underweight (< 18.5)
  - Normal weight (18.5 - 24.9)
  - Overweight (25 - 29.9)
  - Obese (≥ 30)
- **Local Storage History**: Saves past calculations with date, height, weight, BMI, and category.
- **Log Management**: Remove specific logs or clear all entries.
- **Clean Medical Aesthetic**: Soft teal & emerald theme with crisp metrics layout.

## Tech Stack

- **React** (Vite)
- **CSS3** (Medical theme styling, flex layout)

## Setup

1. Copy `App.jsx` and `App.css` into your Vite React project.
2. Run `npm run dev` to view.
