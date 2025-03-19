# DNA-Text-Protein Converter

A web application that converts text to DNA sequences, translates to amino acids, and visualizes the resulting protein structure in 3D.

## Features

- Text to DNA conversion using binary encoding
- DNA to amino acid translation
- Synthesis analysis (GC content, homopolymers, repeats)
- 3D protein structure visualization using ESM Fold API and NGL Viewer
- Download PDB files of generated structures

## Technologies

- **Frontend**: React, Bootstrap, NGL Viewer (molecular visualization)
- **Backend**: Node.js, Express
- **APIs**: ESM Atlas API for protein folding

## Installation

1. Install dependencies:
   ```
   npm run install-all
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How It Works

1. Enter text in the "Convert Text" tab
2. The text is converted to a DNA sequence using binary encoding
3. The DNA sequence is translated to an amino acid sequence
4. The amino acid sequence can be folded into a 3D protein structure using the ESM Atlas API
5. The 3D structure is visualized using NGL Viewer, a powerful molecular visualization library

## Deployment

This application can be easily deployed to platforms like Vercel or Netlify.

## License

MIT
