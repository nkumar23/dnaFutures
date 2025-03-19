import React from 'react';

function FallbackViewer({ protein }) {
  if (!protein || !protein.pdb_content) {
    return (
      <div className="alert alert-warning">
        No protein structure data available.
      </div>
    );
  }
  
  // Get the first few lines of the PDB file for display
  const pdbPreview = protein.pdb_content
    .split('\n')
    .slice(0, 20)
    .join('\n');
  
  return (
    <div>
      <h3>Protein Structure Data</h3>
      <div className="alert alert-info">
        The 3D viewer couldn't be loaded, but you can download the PDB file and open it in your preferred molecular viewer.
      </div>
      
      <div className="card mb-3">
        <div className="card-header">
          <h5 className="mb-0">PDB Data Preview</h5>
        </div>
        <div className="card-body">
          <pre style={{ maxHeight: '300px', overflow: 'auto' }}>
            {pdbPreview}
            {'\n...'}
          </pre>
        </div>
      </div>
      
      <button 
        className="btn btn-primary"
        onClick={() => {
          // Download PDB
          const blob = new Blob([protein.pdb_content], { type: 'chemical/x-pdb' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `protein_${protein.job_id || 'structure'}.pdb`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
      >
        Download PDB File
      </button>
      
      <div className="mt-3">
        <h5>External Viewers</h5>
        <p>You can use these online viewers to visualize your protein:</p>
        <ul>
          <li>
            <a 
              href="https://www.rcsb.org/3d-view" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              RCSB PDB Viewer
            </a> (Upload your PDB file after downloading)
          </li>
          <li>
            <a 
              href="https://molview.org" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              MolView
            </a> (Upload your PDB file after downloading)
          </li>
          <li>
            <a 
              href="https://3dmol.csb.pitt.edu/viewer.html" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              3DMol Viewer
            </a> (Upload your PDB file after downloading)
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FallbackViewer; 