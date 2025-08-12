from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agents.stock_fetcher import fetch_combined_stock_data
from agents.symbol_search import search_symbol
import re
import yfinance as yf

app = FastAPI()

# Allow CORS so frontend can call backend API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "InvestIQ backend is running!"}

# Fetch stock data by symbol
@app.get("/stock/{symbol}")
async def get_stock(symbol: str):
    data = fetch_combined_stock_data(symbol.upper())
    if not data:
        raise HTTPException(status_code=404, detail="Stock data not found")
    return data

# Search for company symbol based on keyword
@app.get("/search/{keyword}")
async def search(keyword: str):
    results = search_symbol(keyword)
    if not results:
        raise HTTPException(status_code=404, detail="No matches found")
    return results

# Route to handle natural language queries and execute actions
@app.post("/ai/execute-action")
async def execute_action(query: dict):
    action_status = "Unable to parse query."
    
    try:
        # Extract the query from the request body
        nl_query = query.get("query", "").lower()
        
        # Regex to detect buy/sell commands with price conditions (simplified)
        buy_condition = re.search(r"buy (\w+) if price goes below (\d+(\.\d+)?)", nl_query)
        sell_condition = re.search(r"sell (\w+) if price goes above (\d+(\.\d+)?)", nl_query)

        if buy_condition:
            symbol = buy_condition.group(1).upper()
            price_threshold = float(buy_condition.group(2))
            action_status = await handle_buy_action(symbol, price_threshold)

        elif sell_condition:
            symbol = sell_condition.group(1).upper()
            price_threshold = float(sell_condition.group(2))
            action_status = await handle_sell_action(symbol, price_threshold)
        
        else:
            action_status = "Invalid query format. Please use 'Buy {symbol} if price goes below {price}' or 'Sell {symbol} if price goes above {price}'."
    
    except Exception as e:
        action_status = f"Error processing the query: {str(e)}"

    return {"message": action_status}

# Handle Buy action
async def handle_buy_action(symbol: str, price_threshold: float):
    # Fetch current stock price
    stock = yf.Ticker(symbol)
    try:
        current_price = stock.history(period="1d")["Close"].iloc[-1]
    except Exception as e:
        return f"Error fetching stock data for {symbol}: {str(e)}"

    # Compare price with threshold
    if current_price < price_threshold:
        return f"Action: Buying {symbol} at ${current_price}. Condition met!"
    else:
        return f"Action: Price of {symbol} is ${current_price}. Buy condition not met."

# Handle Sell action
async def handle_sell_action(symbol: str, price_threshold: float):
    # Fetch current stock price
    stock = yf.Ticker(symbol)
    try:
        current_price = stock.history(period="1d")["Close"].iloc[-1]
    except Exception as e:
        return f"Error fetching stock data for {symbol}: {str(e)}"

    # Compare price with threshold
    if current_price > price_threshold:
        return f"Action: Selling {symbol} at ${current_price}. Condition met!"
    else:
        return f"Action: Price of {symbol} is ${current_price}. Sell condition not met."
