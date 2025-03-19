import React, { useEffect, useRef } from 'react';

function StructureViewer({ protein }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    // Only create once and when we have the DOM element
    if (!containerRef.current || !protein?.pdb_content || loaded.current) return;

    try {
      // Ensure 3Dmol is available
      if (!window.$3Dmol) {
        console.error("3Dmol.js library not found");
        return;
      }

      console.log("Initializing 3Dmol viewer with PDB data of length:", protein.pdb_content.length);
      
      // Create the viewer
      const viewer = window.$3Dmol.createViewer(
        containerRef.current,
        { backgroundColor: 'white' }
      );
      
      if (!viewer) {
        console.error("Failed to create 3Dmol viewer");
        return;
      }
      
      viewerRef.current = viewer;
      
      // Add the molecule from PDB data
      viewer.addModel(protein.pdb_content, "pdb");
      
      // Set the style to cartoon representation
      viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
      
      // Zoom to fit the molecule
      viewer.zoomTo();
      
      // Render the scene
      viewer.render();
      
      loaded.current = true;
      console.log("3Dmol viewer initialized successfully");
    } catch (err) {
      console.error("Error initializing 3Dmol viewer:", err);
    }
    
    // Clean up on unmount
    return () => {
      if (viewerRef.current) {
        try {
          console.log("Cleaning up 3Dmol viewer");
          viewerRef.current = null;
        } catch (err) {
          console.error("Error cleaning up 3Dmol viewer:", err);
        }
      }
      loaded.current = false;
    };
  }, [protein]);

  return (
    <div>
      <h3>Protein 3D Structure</h3>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '500px',
          position: 'relative',
          border: '1px solid #ddd',
          borderRadius: '5px',
          marginBottom: '20px',
          backgroundColor: '#f8f9fa'
        }}
      />
      
      {protein && (
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
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
          
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              if (viewerRef.current) {
                // Rotate the view to get a different perspective
                viewerRef.current.rotate(45, 'y');
                viewerRef.current.render();
              }
            }}
          >
            Rotate View
          </button>
          
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              if (viewerRef.current) {
                // Change the style to show different representation
                viewerRef.current.setStyle({}, {stick: {}});
                viewerRef.current.render();
              }
            }}
          >
            Stick View
          </button>
          
          <button
            className="btn btn-outline-secondary ms-2"
            onClick={() => {
              if (viewerRef.current) {
                // Reset to cartoon view
                viewerRef.current.setStyle({}, {cartoon: {color: 'spectrum'}});
                viewerRef.current.render();
              }
            }}
          >
            Cartoon View
          </button>
        </div>
      )}
    </div>
  );
}

export default StructureViewer; 