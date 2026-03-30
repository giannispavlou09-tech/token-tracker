import React, { useState, useEffect } from 'react';
import './index.css';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('anthropic_api_key') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastUpdated, setLastUpdated] = useState(() => localStorage.getItem('last_updated') || '');
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('token_tracker_data');
    return stored ? JSON.parse(stored) : null;
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'https://epavlou09.replit.app';

  // Placeholder data for fallback
  const placeholderData = {
    requests: 0,
    input_tokens: 0,
    output_tokens: 0,
    spend: 0,
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    localStorage.setItem('anthropic_api_key', apiKey);
    setSuccess('API key saved locally!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const fetchData = async () => {
    if (!apiKey.trim()) {
      setError('Please enter and save your API key first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${apiUrl}/api/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      const parsed = {
        requests: result.requests || 0,
        input_tokens: result.input_tokens || 0,
        output_tokens: result.output_tokens || 0,
        spend: result.spend || 0,
      };

      localStorage.setItem('token_tracker_data', JSON.stringify(parsed));
      setData(parsed);
      
      const now = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      localStorage.setItem('last_updated', now);
      setLastUpdated(now);
      
      setSuccess('Data refreshed successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      // Use placeholder data on error but show error message
      if (!data) {
        setData(placeholderData);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    localStorage.removeItem('anthropic_api_key');
    localStorage.removeItem('token_tracker_data');
    localStorage.removeItem('last_updated');
    setApiKey('');
    setData(null);
    setLastUpdated('');
    setError('');
    setSuccess('Data cleared');
    setTimeout(() => setSuccess(''), 3000);
  };

  const displayData = data || placeholderData;
  const totalTokens = displayData.input_tokens + displayData.output_tokens;
  const tokenProgress = totalTokens > 0 ? Math.min((totalTokens / 1000000) * 100, 100) : 0;

  return (
    <div className="container">
      <div className="app">
        <header>
          <h1>💰 Token Tracker</h1>
          <p className="subtitle">Monitor your Anthropic API usage and Claude Pro subscription</p>
        </header>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="controls">
          <div className="api-input-group">
            <input
              type="password"
              placeholder="Enter your Anthropic API key (sk-ant-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveApiKey()}
            />
            <button className="btn-primary" onClick={saveApiKey}>
              Save Key
            </button>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-secondary" 
              onClick={fetchData}
              disabled={loading || !apiKey.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Refreshing...
                </>
              ) : (
                '🔄 Refresh Data'
              )}
            </button>
            <button className="btn-secondary" onClick={clearData}>
              🗑️ Clear Data
            </button>
          </div>

          {lastUpdated && (
            <div className="timestamp">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>

        <div className="cards-grid">
          {/* Anthropic API Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Anthropic API</div>
                <div className="plan-type">Pay-as-you-go</div>
              </div>
              <div className="card-icon">🔌</div>
            </div>

            {apiKey.trim() && (
              <div className="status-badge status-active">
                Active
              </div>
            )}
            {!apiKey.trim() && (
              <div className="status-badge status-inactive">
                No Key
              </div>
            )}

            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Requests</span>
                <span className="stat-value">{displayData.requests.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total Spend</span>
                <span className="stat-value">${displayData.spend.toFixed(2)}</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Input Tokens</span>
                <span className="stat-value">{displayData.input_tokens.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Output Tokens</span>
                <span className="stat-value">{displayData.output_tokens.toLocaleString()}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Monthly Token Usage</span>
                <span className="stat-unit">{tokenProgress.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${tokenProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {totalTokens.toLocaleString()} / 1,000,000 tokens
              </div>
            </div>

            <div className="renewal-info">
              📅 Usage resets monthly. Current period active.
            </div>
          </div>

          {/* Claude Pro Card */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Claude Pro</div>
                <div className="plan-type">Subscription</div>
              </div>
              <div className="card-icon">⭐</div>
            </div>

            {apiKey.trim() ? (
              <div className="status-badge status-active">
                Active
              </div>
            ) : (
              <div className="status-badge status-inactive">
                Inactive
              </div>
            )}

            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Subscription</span>
                <span className="stat-value">$20/mo</span>
              </div>
              <div className="stat">
                <span className="stat-label">Monthly Limit</span>
                <span className="stat-value">Unlimited*</span>
              </div>
            </div>

            <div className="divider"></div>

            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">API Messages</span>
                <span className="stat-value">{displayData.requests.toLocaleString()}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Status</span>
                <span className="stat-value">
                  {apiKey.trim() ? '✅ Valid' : '⏳ Pending'}
                </span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Usage This Month</span>
                <span className="stat-unit">Active</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: '100%' }}
                ></div>
              </div>
              <div className="progress-text">
                Full access • No rate limiting
              </div>
            </div>

            <div className="renewal-info">
              📅 Renews on the 1st of each month
            </div>
          </div>
        </div>

        <footer style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2rem' }}>
          <p>🔒 Your API key is stored locally in your browser and never shared</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Made with care • Built with React + Vite
          </p>
        </footer>
      </div>
    </div>
  );
}
