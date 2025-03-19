# DNA-Text-Protein Converter

A web application that converts text to DNA sequences, and then to amino acid sequences and 3D protein structures.

## Features

- Convert text to DNA sequences using binary encoding
- Translate DNA to amino acid sequences
- Analyze DNA sequences for synthesis viability
- Generate 3D protein structures from amino acid sequences
- Interactive 3D protein viewer

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Node.js
- **API Integration**: ESM Atlas Protein Folding API
- **Deployment**: Vercel

## Deployment

This application is deployed on Vercel. The deployment integrates the React frontend and Node.js API endpoints as serverless functions.

### Deployment Architecture

- Frontend: Static files served from `/client/build`
- API Endpoints: Serverless functions in `/server/api`
- Configuration: `vercel.json` manages routing and builds

### How to Deploy

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with default settings (Vercel will use the configuration in `vercel.json`)

### Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Start the client:
   ```
   cd client && npm start
   ```
4. Start the server:
   ```
   cd server && node index.js
   ```

## Project Structure

```
dna-futures/
├── client/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js        # Main application component
│   │   └── index.js      # Entry point
│   └── package.json      # Frontend dependencies
├── server/               # Node.js backend
│   ├── api/              # API endpoints (serverless functions)
│   │   ├── encode.js     # Text-to-DNA conversion endpoint
│   │   └── fold.js       # Protein folding endpoint
│   ├── services/         # Business logic
│   │   └── dnaService.js # DNA conversion utilities
│   └── package.json      # Backend dependencies
├── vercel.json           # Vercel deployment configuration
└── README.md             # This file
```

## API Endpoints

- `POST /api/encode` - Convert text to DNA and amino acid sequences
- `POST /api/fold` - Generate 3D protein structure from amino acid sequence

## License

MIT
