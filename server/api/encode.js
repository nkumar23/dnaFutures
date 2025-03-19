const { textToDna, dnaToAminoAcids, calculateGcContent, findRepeats, findHomopolymers, calculateGcVariation, checkTwistGuidelines } = require('../services/dnaService');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
};