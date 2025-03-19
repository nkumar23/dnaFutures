// Text to binary conversion
function textToBinary(text) {
  let binary = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const bin = charCode.toString(2).padStart(8, '0');
    binary += bin;
  }
  return binary;
}

// Binary to DNA conversion
function binaryToDna(binary) {
  const mapping = { '00': 'A', '01': 'C', '10': 'G', '11': 'T' };
  let dna = '';
  for (let i = 0; i < binary.length; i += 2) {
    const pair = binary.substr(i, 2);
    dna += mapping[pair] || '';
  }
  return dna;
}

// DNA to binary conversion
function dnaToBinary(dna) {
  const mapping = { 'A': '00', 'C': '01', 'G': '10', 'T': '11' };
  let binary = '';
  for (let i = 0; i < dna.length; i++) {
    binary += mapping[dna[i]] || '';
  }
  return binary;
}

// Binary to text conversion
function binaryToText(binary) {
  // Ensure binary length is a multiple of 8
  const padding = binary.length % 8;
  if (padding !== 0) {
    binary += '0'.repeat(8 - padding);
  }
  
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    try {
      text += String.fromCharCode(parseInt(byte, 2));
    } catch (e) {
      // Skip invalid binary
    }
  }
  return text;
}

// Full encoding process
function textToDna(text) {
  const binary = textToBinary(text);
  return binaryToDna(binary);
}

// Full decoding process
function dnaToText(dna) {
  const binary = dnaToBinary(dna);
  return binaryToText(binary);
}

// DNA to amino acids using a simple codon table
function dnaToAminoAcids(dna) {
  // Ensure DNA length is a multiple of 3
  const remainder = dna.length % 3;
  if (remainder !== 0) {
    dna = dna.slice(0, dna.length - remainder);
  }
  
  const codonTable = {
    'ATA': 'I', 'ATC': 'I', 'ATT': 'I', 'ATG': 'M',
    'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
    'AAC': 'N', 'AAT': 'N', 'AAA': 'K', 'AAG': 'K',
    'AGC': 'S', 'AGT': 'S', 'AGA': 'R', 'AGG': 'R',
    'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
    'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
    'CAC': 'H', 'CAT': 'H', 'CAA': 'Q', 'CAG': 'Q',
    'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R',
    'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
    'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
    'GAC': 'D', 'GAT': 'D', 'GAA': 'E', 'GAG': 'E',
    'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G',
    'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
    'TTC': 'F', 'TTT': 'F', 'TTA': 'L', 'TTG': 'L',
    'TAC': 'Y', 'TAT': 'Y', 'TAA': '*', 'TAG': '*',
    'TGC': 'C', 'TGT': 'C', 'TGA': '*', 'TGG': 'W'
  };
  
  let aminoAcids = '';
  for (let i = 0; i < dna.length; i += 3) {
    const codon = dna.substr(i, 3);
    aminoAcids += codonTable[codon] || 'X'; // X for unknown
  }
  
  // Remove stop codons for folding
  return aminoAcids.replace(/\*/g, '');
}

// Other functions like calculateGcContent, findRepeats, etc.
// would be implemented here

// Calculate GC content
function calculateGcContent(dna) {
  if (!dna) return 0;
  const gcCount = (dna.match(/[GC]/g) || []).length;
  return (gcCount / dna.length) * 100;
}

// Find repeats of specified minimum length
function findRepeats(dna, minLength = 20) {
  const repeats = [];
  for (let i = 0; i <= dna.length - minLength; i++) {
    const pattern = dna.substr(i, minLength);
    for (let j = i + 1; j <= dna.length - minLength; j++) {
      if (dna.substr(j, minLength) === pattern) {
        repeats.push({ pattern, positions: [i, j] });
        break; // Only count each pattern once
      }
    }
  }
  return repeats;
}

// Find homopolymers (runs of the same base)
function findHomopolymers(dna, minLength = 5) {
  const homopolymers = [];
  const bases = ['A', 'C', 'G', 'T'];
  
  for (const base of bases) {
    const regex = new RegExp(`${base}{${minLength},}`, 'g');
    let match;
    while ((match = regex.exec(dna)) !== null) {
      homopolymers.push({ sequence: match[0], position: match.index });
    }
  }
  
  return homopolymers;
}

// Calculate GC variation
function calculateGcVariation(dna, windowSize = 50) {
  if (dna.length < windowSize) return 0;
  
  const gcContents = [];
  for (let i = 0; i <= dna.length - windowSize; i++) {
    const window = dna.substr(i, windowSize);
    gcContents.push(calculateGcContent(window));
  }
  
  return Math.max(...gcContents) - Math.min(...gcContents);
}

// Check Twist guidelines
function checkTwistGuidelines(dna) {
  const issues = [];
  
  // Check length
  if (dna.length < 300) {
    issues.push(`Sequence length (${dna.length} bp) is less than the minimum 300 bp required.`);
  }
  
  // Check GC content
  const gcContent = calculateGcContent(dna);
  if (gcContent < 25 || gcContent > 65) {
    issues.push(`GC content (${gcContent.toFixed(1)}%) is outside the recommended range (25-65%).`);
  }
  
  // Check GC variation
  const gcVariation = calculateGcVariation(dna);
  if (gcVariation > 52) {
    issues.push(`GC content variation (${gcVariation.toFixed(1)}%) exceeds the maximum recommended (52%).`);
  }
  
  // Check for repeats
  const repeats = findRepeats(dna);
  if (repeats.length > 0) {
    issues.push(`Found ${repeats.length} repeats of 20+ bp. This may cause synthesis issues.`);
  }
  
  // Check for homopolymers
  const homopolymers = findHomopolymers(dna);
  if (homopolymers.length > 0) {
    issues.push(`Found ${homopolymers.length} homopolymers of 5+ bases. This may cause synthesis issues.`);
    
    // Show examples of the first 3 homopolymers
    homopolymers.slice(0, 3).forEach(homo => {
      issues.push(`  - ${homo.sequence} at position ${homo.position}`);
    });
    
    if (homopolymers.length > 3) {
      issues.push(`  - ... and ${homopolymers.length - 3} more`);
    }
  }
  
  return issues;
}


module.exports = {
  textToBinary,
  binaryToDna,
  dnaToBinary,
  binaryToText,
  textToDna,
  dnaToText,
  dnaToAminoAcids,
  calculateGcContent,
  findRepeats,
  findHomopolymers,
  calculateGcVariation,
  checkTwistGuidelines
};