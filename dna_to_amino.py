from Bio.Seq import Seq

# DNA sequence
dna_sequence = "CATCCGACCGCACGCCAGAACGAGCTGCAGAACGGACTCCCGTCCGACCGTGCTATAGTA"

# Convert DNA to mRNA (transcription)
mrna_sequence = Seq(dna_sequence).transcribe()

# Translate mRNA to amino acids (translation)
amino_acid_sequence = mrna_sequence.translate()

# Output results
print("mRNA Sequence:", mrna_sequence)
print("Amino Acid Sequence:", amino_acid_sequence)