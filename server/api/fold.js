const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};