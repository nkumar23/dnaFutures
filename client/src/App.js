import React, { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import DnaConverter from './components/DnaConverter';
import SequenceDisplay from './components/SequenceDisplay';
import StructureViewer from './components/StructureViewer';
import SynthesisAnalysis from './components/SynthesisAnalysis';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('convert');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [protein, setProtein] = useState(null);

  const handleConvert = async (text) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/encode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to convert text');
      }
      
      setResult(data);
      setActiveTab('dna');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFold = async () => {
    if (!result?.amino_acid_sequence) return;
    
    setLoading(true);
    setError(null);
    setProtein(null); // Clear any existing protein data
    
    try {
      console.log(`Folding amino acid sequence: ${result.amino_acid_sequence}`);
      
      const response = await fetch('/api/fold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amino_acid_sequence: result.amino_acid_sequence,
          job_id: result.job_id
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fold protein');
      }
      
      console.log(`Received PDB data of length: ${data.pdb_content?.length || 0}`);
      
      setProtein(data);
      setActiveTab('structure');
    } catch (err) {
      console.error('Error folding protein:', err);
      setError(`Error folding protein: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">DNA-Text-Protein Converter</h1>
      
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="convert" title="Convert Text">
          <DnaConverter onConvert={handleConvert} loading={loading} />
        </Tab>
        <Tab eventKey="dna" title="DNA Sequence" disabled={!result}>
          <SequenceDisplay 
            title="DNA Sequence" 
            sequence={result?.dna_sequence} 
            length={result?.length}
            type="dna"
          />
        </Tab>
        <Tab eventKey="amino" title="Amino Acid Sequence" disabled={!result}>
          <SequenceDisplay 
            title="Amino Acid Sequence" 
            sequence={result?.amino_acid_sequence} 
            length={result?.amino_acid_sequence?.length}
            type="amino"
            onFold={handleFold}
            loading={loading}
          />
        </Tab>
        <Tab eventKey="analysis" title="Synthesis Analysis" disabled={!result}>
          <SynthesisAnalysis result={result} />
        </Tab>
        <Tab eventKey="structure" title="3D Structure" disabled={!protein}>
          {protein && <StructureViewer protein={protein} />}
        </Tab>
      </Tabs>
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
    </Container>
  );
}

export default App; 