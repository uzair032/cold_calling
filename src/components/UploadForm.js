import React, { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze-call", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.result);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      <div className="upload-container">
        <h2>📞 Cold Call Analyzer</h2>

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="file-input"
          />
          <button
            type="submit"
            disabled={loading}
            className={`upload-btn ${loading ? "disabled" : ""}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Analyzing...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </form>

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Processing your call...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        )}

        {result && !loading && !error && (
          <div className="result-container">
            <h3>✅ Agent Recommendation:</h3>
            <pre className="result-text">{result}</pre>
          </div>
        )}
      </div>
    </>
  );
};

const cssStyles = `
:root {
  --primary: #007bff;
  --primary-dark: #0056b3;
  --light-bg: #e9f0ff;
  --border: #ccc;
  --error: #dc3545;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

.upload-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.10);
  background: #fff;
}

.upload-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

.file-input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border);
  width: 100%;
  font-size: 1rem;
}

.upload-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  width: 100%;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.upload-btn:hover:not(.disabled) {
  background-color: var(--primary-dark);
}

.upload-btn.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.result-container {
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--light-bg);
  box-shadow: inset 0 0 10px rgba(0, 123, 255, 0.1);
  margin-top: 1rem;
}

.result-text {
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

.error-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
  color: var(--error);
  text-align: center;
}

.loading-container {
  text-align: center;
  margin: 2rem 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  display: inline-block;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  width: 24px;
  height: 24px;
  animation: spin 0.8s linear infinite;
}
`;

export default UploadForm;
