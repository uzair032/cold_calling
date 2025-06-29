import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("https://muzair-010--cold-call-backend.hf.space/analyze-call", {
        method: "POST",
        body: formData,
      });
      // const res = await fetch('http://127.0.0.1:8000/analyze-call', {
      //   method: 'POST',
      //   body: formData
      // });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>📞 Cold Call Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {loading && <p>Analyzing...</p>}
      {result && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
