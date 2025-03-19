import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function DnaConverter({ onConvert, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onConvert(text);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Enter Text to Convert</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
          />
        </Form.Group>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Converting...
            </>
          ) : (
            'Convert to DNA & Protein'
          )}
        </Button>
      </Form>
    </div>
  );
}

export default DnaConverter;