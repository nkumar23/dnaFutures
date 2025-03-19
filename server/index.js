const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { 
  textToDna, 
  dnaToAminoAcids, 
  calculateGcContent, 
  findRepeats, 
  findHomopolymers, 
  calculateGcVariation, 
  checkTwistGuidelines 
} = require('./services/dnaService');

const app = express();
app.use(cors());
app.use(express.json());

// Convert text to DNA and amino acids
app.post('/api/encode', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }
    
    // Convert text to DNA
    const dnaSequence = textToDna(text);
    
    // Calculate statistics
    const gcContent = calculateGcContent(dnaSequence);
    const repeats = findRepeats(dnaSequence);
    const homopolymers = findHomopolymers(dnaSequence);
    const issues = checkTwistGuidelines(dnaSequence);
    
    // Translate DNA to amino acids
    const aminoAcidSequence = dnaToAminoAcids(dnaSequence);
    
    return res.json({
      text,
      dna_sequence: dnaSequence,
      amino_acid_sequence: aminoAcidSequence,
      length: dnaSequence.length,
      gc_content: gcContent,
      gc_variation: calculateGcVariation(dnaSequence),
      homopolymers_count: homopolymers.length,
      repeats_count: repeats.length,
      issues,
      job_id: uuidv4()
    });
  } catch (error) {
    console.error('Error encoding text:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Fold protein using ESM Atlas API
app.post('/api/fold', async (req, res) => {
  try {
    const { amino_acid_sequence, job_id } = req.body;
    
    if (!amino_acid_sequence) {
      return res.status(400).json({ error: 'No amino acid sequence provided' });
    }
    
    console.log(`Folding sequence of length ${amino_acid_sequence.length}: ${amino_acid_sequence}`);
    
    // Call the ESM Atlas API
    const response = await axios.post(
      'https://api.esmatlas.com/foldSequence/v1/pdb/',
      amino_acid_sequence,
      { 
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'text'
      }
    );
    
    // Validate the response
    if (!response.data || typeof response.data !== 'string' || response.data.trim() === '') {
      throw new Error('Invalid PDB response from ESM Atlas API');
    }
    
    // Check if it's a valid PDB format (should start with HEADER, ATOM, etc.)
    if (!response.data.includes('ATOM') && !response.data.includes('HEADER')) {
      throw new Error('Response does not appear to be in valid PDB format');
    }
    
    console.log(`Received PDB data of length: ${response.data.length}`);
    
    // Return the PDB content directly in the response
    return res.json({
      job_id: job_id || uuidv4(),
      status: 'completed',
      pdb_content: response.data
    });
  } catch (error) {
    console.error('Error folding protein:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});