# InvestIQ: AI-Driven Portfolio Monitoring & Prescriptive Analytics

A full-stack, multi-agent, real-time **financial portfolio tracker** powered by **Python, FastAPI**, **Gemini API**, **Alpha Vantage**, **yfinance**, and a modern **React + Tailwind frontend**. Designed to simulate, monitor, and give prescriptive advice for investment portfolios using causal inference and Monte Carlo simulations.  


## Features

- 🔍 **Natural Language Portfolio Queries** via Gemini API
- 💹 **Real-time Financial Data** from Alpha Vantage and yfinance
- 🧠 **Prescriptive AI Engine** with DoWhy + Monte Carlo simulation 
- 📊 **Interactive Portfolio Dashboard** (TailwindCSS + Recharts)
- 🔄 **Live Updates** via WebSocket integration
- 🗣️ **Human-readable Explanations** powered by LLM


## Tech Stack 

 Layer             : Technology                       
___________________________________________________
 Backend API       : Python, FastAPI, WebSockets      
 Stock Data        : Alpha Vantage API, yfinance      
 LLM Integration   : Google Gemini / PaLM API         
 AI Inference      : DoWhy, NumPy (Monte Carlo)       
 Frontend UI       : React, TailwindCSS, Recharts     
 Real-Time Updates : WebSocket (FastAPI ↔ React)      


## System Architecture

User (Browser)
  ↕ WebSocket / HTTP
React Frontend (portfolio input + scenario sliders)
  ↕ HTTP JSON
FastAPI Backend
  ↕ Async calls
Agentic Pipeline:
  • Gemini LLM → parse query + generate summary
  • Alpha Vantage / yfinance → portfolio prices & trends
  • Monte Carlo Simulation → project portfolio performance
  • Gemini LLM → recommendations & explanations


## Core Capabilities

- **Input**: Queries on financial data
- **Scenario Tuning**: Adjust investment horizon, volatility, crash likelihood
- **Simulation**: Monte Carlo analysis of future portfolio value
- **Output**: Text and charts showing potential gains/losses and AI-driven insights


## Resources

- **LLM Agent**: Google Gemini (via Gemini/PaLM API)
- **Finance Data**: Alpha Vantage, yfinance
- **Simulation**: NumPy Monte Carlo
- **UI/UX**: TailwindCSS + Recharts


## 📄 License

MIT License. Free to use, modify, and distribute.