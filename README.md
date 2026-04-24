# TA08_Energetic_Calculator

oussama [itb] boukhali ouadad
13:56 (fa 5 hores)
per a mi

# 🌱 Energy Efficiency Calculator for High Schools

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

> A client-side, interactive simulation engine designed to help educational institutions project their energy transition, reduce operational costs, and lower their carbon footprint.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Core Features](#-core-features)
3. [Under the Hood: Mathematical Models](#-under-the-hood-mathematical-models)
4. [Application Architecture](#-application-architecture)
5. [Installation & Usage](#-installation--usage)
6. [Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

Educational centers face a significant challenge: reducing their environmental impact while managing tight budgets. This project is a **Real-Time Data Visualizer & Simulator** that allows high school administrators to build a customized sustainability action plan.

By adjusting variables across four key sectors (Water, Electricity, Supplies, and Cleaning), the application calculates the center's financial inertia and projects the savings and CO2 reduction over a 3-year timeline (2025–2028).

---

## ✨ Core Features

* **Interactive Simulation Engine:** 20 granular sliders representing specific green measures (e.g., timed faucets, solar panels, LED switching).
* **Real-Time Data Visualization:** Dynamic, multi-axis timeline charts powered by Chart.js, comparing the "Inertia Scenario" (doing nothing) vs. the "Optimized Scenario".
* **Custom Baseline Input:** Users can input their actual monthly bills to generate highly accurate, personalized projections.
* **Economic & Ecological Metrics:** Calculates total euros saved against inflation and total kilograms of CO2 avoided annually.
* **Zero Backend Dependency:** 100% client-side processing for maximum privacy and lightning-fast recalculations.

---

## 🧠 Under the Hood: Mathematical Models

To ensure the simulation is realistic and academically rigorous, the JavaScript engine applies several business and mathematical rules:

### 1. Weighted Impact Distribution
Not all sustainability measures are created equal. The system uses specific weight arrays. For instance, in the Water sector, repairing leaks has a higher priority and impact weight (12%) than running awareness campaigns (3%). The total sector savings is the sum of the slider percentage multiplied by its specific weight.

### 2. 3-Year Implementation Progressivity (Escalation)
Measures take time to deploy. The simulation does not apply 100% of the savings on day one. It uses a progressive scaling factor:
* **Year 1 (2026):** 33.3% of target savings applied.
* **Year 2 (2027):** 66.6% of target savings applied.
* **Year 3 (2028):** 100% of target savings applied.

### 3. Economic Inflation (CPI)
To accurately calculate financial savings, the engine factors in an annual Consumer Price Index (CPI) of 3% (`ipcAnual = 1.03`). This demonstrates that *not* investing in efficiency actually costs more over time due to inflation.

### 4. Seasonal Variation Coefficients
School consumption is not flat. The algorithm applies monthly multipliers to simulate real-world behavior (e.g., electricity drops to 10% in August during summer break, while heating/lighting spikes by 20% in January).

### 5. Carbon Footprint Conversion
The ecological impact applies a standard energy-to-carbon conversion metric, mapping saved kWh directly to kilograms of CO2 avoided (Conversion factor: `0.25 Kg CO2 per kWh`).

---

## 🏗 Application Architecture

The project follows a modular, separation-of-concerns approach within a Vanilla web stack:

* `calculadora.html`: The **View**. Semantic HTML5 structure with accessible forms, range inputs (sliders), and data-presentation tables.
* `calculadora.css`: The **Design System**. Uses CSS Variables (Custom Properties) for consistent theming, Flexbox/Grid for responsive layouts, and ensures a mobile-first user experience.
* `script.js`: The **Controller & Model**. Handles DOM manipulation, event listeners, mathematical crunching, and instances the Chart.js canvas object.

---

## 🚀 Installation & Usage

Because this is a static client-side application, deployment and local testing are incredibly simple.
