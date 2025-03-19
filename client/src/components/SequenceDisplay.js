import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function SequenceDisplay({ title, sequence, length, type, onFold, loading }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sequence).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!sequence) {
    return <div>No sequence available</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{title}</h3>
        <div>
          <Button
            variant="outline-primary"
            onClick={copyToClipboard}
            className="me-2"
          >
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          
          {type === 'amino' && onFold && (
            <Button
              variant="primary"
              onClick={onFold}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Folding...
                </>
              ) : (
                'Fold Protein with ESM Fold'
              )}
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-3 border rounded bg-light mb-3" style={{ overflowX: 'auto' }}>
        <pre style={{ margin: 0 }}>{sequence}</pre>
      </div>
      
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Sequence Length</h5>
          <p className="card-text">{length} {type === 'dna' ? 'base pairs' : 'amino acids'}</p>
        </div>
      </div>
    </div>
  );
}

export default SequenceDisplay;