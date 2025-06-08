# INWI Automated Testing Platform

A modern, fully functional web application for automating tests and generating reports for OCS/PCRF systems in a cloud environment. The platform adheres to INWI's branding guidelines and includes specific features outlined in the project description.

## Features

### Dashboard
- Overview of key metrics (Total Tests Run, Pass Rate, Last Test Run)
- Recent Run Tests table
- Quick Actions for creating tests, running test suites, and generating reports

### Test Cases
- Dynamic form generation based on selected test type
- Support for multiple test types:
  - SubDeactivation
  - CreateSubscriber
  - SubActivation
  - ChangeSubInfo
  - ChangeCL
  - ChangeSub
  - ChangeMP
  - Starcode
  - Recharge

### Test Suites
- Monitor currently running tests with progress indicators
- Schedule and manage test executions

### Reports
- View and download generated test reports

## Setup Instructions

1. Clone or download this repository
2. Open the `index.html` file in a web browser

## Technologies Used

- HTML5
- CSS3 (with responsive design)
- JavaScript (vanilla)

## Branding

The application follows INWI's branding guidelines:
- Primary color: #6C2391
- Gradient styling for buttons and interactive elements
- INWI logo integration

## Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop
- Tablet
- Mobile devices

## Project Structure

```
├── assets/
│   └── inwi-logo.svg
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── index.html
└── README.md
```

## Browser Compatibility

The application is compatible with modern browsers including:
- Chrome
- Firefox
- Safari
- Edge