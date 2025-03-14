from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sys
import os
import json
import tempfile
import subprocess
import time
import uuid
from Bio.Seq import Seq
import requests

# Import functions from your existing script
from script import (
    text_to_binary, 
    binary_to_dna, 
    dna_to_binary, 
    binary_to_text,
    encode_text_to_dna,
    decode_dna_to_text,
    calculate_gc_content,
    find_repeats,
    find_homopolymers,
    calculate_gc_variation,
    check_twist_guidelines
)

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/encode', methods=['POST'])
def encode():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Encode text to DNA
    dna_sequence = encode_text_to_dna(text)
    
    # Check DNA against Twist guidelines
    issues = check_twist_guidelines(dna_sequence)
    
    # Translate DNA to amino acids
    # Make sure length is divisible by 3
    dna_for_translation = dna_sequence
    remainder = len(dna_for_translation) % 3
    if remainder != 0:
        dna_for_translation = dna_for_translation[:-remainder]
    
    amino_acid_sequence = ""
    if dna_for_translation:
        seq_obj = Seq(dna_for_translation)
        amino_acid_sequence = str(seq_obj.translate())
        # Remove stop codons for folding
        amino_acid_sequence = amino_acid_sequence.replace("*", "")
    
    # Calculate statistics
    gc_content = calculate_gc_content(dna_sequence)
    gc_variation = calculate_gc_variation(dna_sequence)
    homopolymers = find_homopolymers(dna_sequence)
    repeats = find_repeats(dna_sequence)
    
    return jsonify({
        'text': text,
        'dna_sequence': dna_sequence,
        'amino_acid_sequence': amino_acid_sequence,
        'length': len(dna_sequence),
        'gc_content': gc_content,
        'gc_variation': gc_variation,
        'homopolymers_count': len(homopolymers),
        'repeats_count': len(repeats),
        'issues': issues,
        'job_id': str(uuid.uuid4())  # Generate a unique ID for this job
    })

@app.route('/api/fold', methods=['POST'])
def fold_protein():
    data = request.json
    amino_acid_sequence = data.get('amino_acid_sequence', '')
    job_id = data.get('job_id', str(uuid.uuid4()))
    
    if not amino_acid_sequence:
        return jsonify({'error': 'No amino acid sequence provided'}), 400
    
    # Create a directory to store results
    os.makedirs('static/results', exist_ok=True)
    
    try:
        # Call the ESM Atlas API
        response = requests.post(
            "https://api.esmatlas.com/foldSequence/v1/pdb/",
            data=amino_acid_sequence
        )
        
        if response.status_code == 200:
            # Save the PDB file
            pdb_content = response.text
            pdb_path = f'static/results/{job_id}.pdb'
            
            with open(pdb_path, 'w') as f:
                f.write(pdb_content)
            
            # Store job info
            job_info = {
                'job_id': job_id,
                'status': 'completed',
                'result_path': pdb_path
            }
            
            os.makedirs('jobs', exist_ok=True)
            with open(f'jobs/{job_id}.json', 'w') as f:
                json.dump(job_info, f)
                
            return jsonify({
                'job_id': job_id,
                'status': 'completed',
                'pdb_url': f'/static/results/{job_id}.pdb'
            })
        else:
            return jsonify({
                'job_id': job_id,
                'status': 'error',
                'message': f'API returned status code {response.status_code}: {response.text}'
            }), 500
    
    except Exception as e:
        return jsonify({
            'job_id': job_id,
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/fold/status/<job_id>', methods=['GET'])
def fold_status(job_id):
    # In a real implementation, you would check the status of the ESM Fold job
    # For demonstration, we'll simulate a completed job
    
    # Simulate some processing time
    time.sleep(1)
    
    return jsonify({
        'job_id': job_id,
        'status': 'completed',
        'pdb_url': f'/static/results/{job_id}.pdb'  # This would be a URL to the PDB file
    })

@app.route('/api/check-pdb/<job_id>', methods=['GET'])
def check_pdb(job_id):
    """Check if a PDB file exists and is accessible."""
    pdb_path = f'static/results/{job_id}.pdb'
    
    if os.path.exists(pdb_path):
        with open(pdb_path, 'r') as f:
            first_line = f.readline().strip()
        
        return jsonify({
            'exists': True,
            'size': os.path.getsize(pdb_path),
            'first_line': first_line
        })
    else:
        return jsonify({
            'exists': False,
            'message': 'PDB file not found'
        }), 404

@app.route('/api/pdb/<job_id>', methods=['GET'])
def get_pdb(job_id):
    """Serve a PDB file with the correct MIME type."""
    pdb_path = f'static/results/{job_id}.pdb'
    
    if os.path.exists(pdb_path):
        with open(pdb_path, 'r') as f:
            pdb_content = f.read()
        
        response = app.response_class(
            response=pdb_content,
            status=200,
            mimetype='chemical/x-pdb'
        )
        return response
    else:
        return jsonify({
            'error': 'PDB file not found'
        }), 404

if __name__ == '__main__':
    # Create results directory if it doesn't exist
    os.makedirs('static/results', exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=8080)  # Changed port to 8080 