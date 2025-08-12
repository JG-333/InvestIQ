import React, { useEffect, useState, useRef } from "react";
import "./App.css";

const features = [
  {
    icon: "🔍",
    color: "#2563eb",
    title: "Natural Language Portfolio Queries",
    desc: "Ask questions about your portfolio using Gemini API."
  },
  {
    icon: "💹",
    color: "#059669",
    title: "Real-time Financial Data",
    desc: "Get live data from Alpha Vantage and yfinance."
  },
  {
    icon: "🧠",
    color: "#f59e42",
    title: "Prescriptive AI Engine",
    desc: "DoWhy + Monte Carlo simulation for smarter advice."
  },
  {
    icon: "📊",
    color: "#a21caf",
    title: "Interactive Portfolio Dashboard",
    desc: "Visualize your investments with Recharts."
  },
  {
    icon: "🔄",
    color: "#0ea5e9",
    title: "Live Updates",
    desc: "Stay in sync with WebSocket-powered real-time data."
  },
  {
    icon: "🗣️",
    color: "#e11d48",
    title: "Human-readable Explanations",
    desc: "LLM-powered, easy-to-understand insights."
  },
];

function App() {
  const [symbol, setSymbol] = useState("AAPL");
  const [searchQuery, setSearchQuery] = useState(""); // For search input
  const [actionQuery, setActionQuery] = useState(""); // For AI-driven action query
  const [suggestions, setSuggestions] = useState([]); // Search results list
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState(null); // To display action result
  const [messages, setMessages] = useState([
    { sender: "system", text: "Welcome to InvestIQ! Ask your portfolio questions below." }
  ]);
  const chatEndRef = useRef(null);

  // Fetch stock data when symbol changes
  useEffect(() => {
    async function fetchStock() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://127.0.0.1:8000/stock/${symbol}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setStockData(data);
      } catch (err) {
        setStockData(null);
        setError(err.message);
      }
      setLoading(false);
    }
    if (symbol) fetchStock();
  }, [symbol]);

  // Fetch suggestions when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    async function searchCompany() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/search/${searchQuery}`);
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const data = await res.json();
        // Map to "SYMBOL - Company Name"
        setSuggestions(data.map(match => `${match["1. symbol"]} - ${match["2. name"]}`));
      } catch {
        setSuggestions([]);
      }
    }

    searchCompany();
  }, [searchQuery]);

  // Handle AI-driven action query submission
  const handleQuerySubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/ai/execute-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: actionQuery }),
      });
      const data = await response.json();
      setActionStatus(data.message); // Display the result of the action
    } catch (error) {
      setActionStatus("Error executing action: " + error.message);
    }
  };

  // Handle chat send
  const handleSend = async (e) => {
    e.preventDefault();
    if (actionQuery.trim() === "") return;

    // Add the query to the chat
    setMessages((msgs) => [...msgs, { sender: "user", text: actionQuery }]);
    setActionQuery("");

    try {
      const response = await fetch("http://127.0.0.1:8000/ai/execute-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: actionQuery }),
      });
      const data = await response.json();
      setMessages((msgs) => [...msgs, { sender: "system", text: data.message }]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { sender: "system", text: "Error: " + error.message }]);
    }
  };

  // When user selects a suggestion, update symbol and clear suggestions & searchQuery
  function handleSuggestionClick(suggestion) {
    const selectedSymbol = suggestion.split(" - ")[0]; // extract symbol
    setSymbol(selectedSymbol);
    setSearchQuery("");
    setSuggestions([]);
  }

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="app-container" style={{ fontFamily: "Arial, sans-serif", padding: "2rem", backgroundColor: "#f9fafb" }}>
      <header>
        <h1 style={{ textAlign: "center", color: "#1f2937" }}>
          InvestIQ: AI-Driven Portfolio Monitoring &amp; Prescriptive Analytics
        </h1>

        {/* Search Bar */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            className="search-box"
            placeholder="Search Stocks or Features"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "1rem",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)"
            }}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list" style={{ listStyle: "none", padding: "0", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}>
              {suggestions.map((suggestion, idx) => (
                <li key={idx} onClick={() => handleSuggestionClick(suggestion)} style={{ padding: "0.8rem", cursor: "pointer" }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Features Section */}
        <section className="features-section" style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
          <h2 style={{ textAlign: "center", width: "100%", color: "#4b5563", marginBottom: "1rem" }}>Features</h2>
          {features.map((f, i) => (
            <div key={i} className="feature" style={{ display: "flex", padding: "1rem", borderRadius: "8px", border: `1px solid ${f.color}`, width: "200px", textAlign: "center", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}>
              <span style={{ fontSize: "2rem", marginRight: "1rem" }}>{f.icon}</span>
              <div>
                <h3 style={{ color: f.color, fontSize: "1.1rem" }}>{f.title}</h3>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </header>

      <main>
        <div className="chat-container" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", marginTop: "2rem" }}>
          <div className="chatbox" style={{ width: "80%", maxWidth: "600px", padding: "1rem", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", marginBottom: "1rem", maxHeight: "400px", overflowY: "scroll" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.sender === "user" ? "chat-user" : "chat-system"} style={{ marginBottom: "1rem", color: msg.sender === "user" ? "#2563eb" : "#4b5563" }}>
                <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <form onSubmit={handleSend} style={{ display: "flex", gap: "0.5rem", width: "80%", maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={actionQuery}
              onChange={(e) => setActionQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "0.7rem 1.1rem",
                borderRadius: "2rem",
                border: "1px solid #cbd5e1",
                fontSize: "1.08rem",
                outline: "none",
                background: "#fff",
                boxShadow: "0 1px 4px rgba(30,41,59,0.04)",
                transition: "border 0.2s",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "2rem",
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1.08rem",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(30,41,59,0.08)",
                transition: "background 0.2s",
              }}
            >
              Send
            </button>
          </form>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f3f4f6", marginTop: "2rem" }}>
        &copy; {new Date().getFullYear()} InvestIQ. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
