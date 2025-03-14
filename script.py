import textwrap
import random
import re

def text_to_binary(text):
    """Convert text to binary using ASCII encoding."""
    return ''.join(format(ord(c), '08b') for c in text)

def binary_to_dna(binary):
    """Convert binary string to DNA sequence (A=00, C=01, G=10, T=11)."""
    mapping = {'00': 'A', '01': 'C', '10': 'G', '11': 'T'}
    return ''.join(mapping[binary[i:i+2]] for i in range(0, len(binary), 2))

def dna_to_binary(dna):
    """Convert DNA sequence back to binary string."""
    mapping = {'A': '00', 'C': '01', 'G': '10', 'T': '11'}
    return ''.join(mapping[n] for n in dna)

def binary_to_text(binary):
    """Convert binary string back to text."""
    # Make sure binary length is a multiple of 8
    if len(binary) % 8 != 0:
        padding = 8 - (len(binary) % 8)
        binary += '0' * padding
    
    text = ""
    for i in range(0, len(binary), 8):
        byte = binary[i:i+8]
        try:
            text += chr(int(byte, 2))
        except ValueError:
            # Skip invalid binary sequences
            pass
    return text

def encode_text_to_dna(text):
    """Full encoding process: text -> binary -> DNA."""
    binary = text_to_binary(text)
    return binary_to_dna(binary)

def decode_dna_to_text(dna):
    """Full decoding process: DNA -> binary -> text."""
    binary = dna_to_binary(dna)
    return binary_to_text(binary)

def calculate_required_text_length(min_bp=300):
    """Calculate how many characters of text are needed for a minimum bp length."""
    # Each character requires 8 bits (1 byte)
    # Each 2 bits become 1 DNA base pair
    # So each character becomes 4 base pairs
    min_chars = min_bp // 4
    if min_bp % 4 != 0:
        min_chars += 1  # Round up
    return min_chars

def calculate_gc_content(dna):
    """Calculate the GC content of a DNA sequence."""
    if not dna:
        return 0
    gc_count = dna.count('G') + dna.count('C')
    return (gc_count / len(dna)) * 100

def find_repeats(dna, min_length=20):
    """Find repeats of specified minimum length in DNA sequence."""
    repeats = []
    for i in range(len(dna) - min_length + 1):
        pattern = dna[i:i+min_length]
        # Look for this pattern in the rest of the sequence
        for j in range(i + 1, len(dna) - min_length + 1):
            if dna[j:j+min_length] == pattern:
                repeats.append((pattern, i, j))
    return repeats

def find_homopolymers(dna, min_length=5):
    """Find homopolymers (runs of the same base) in DNA sequence."""
    homopolymers = []
    for base in "ACGT":
        pattern = base * min_length
        for match in re.finditer(f'{base}+', dna):
            if len(match.group()) >= min_length:
                homopolymers.append((match.group(), match.start()))
    return homopolymers

def calculate_gc_variation(dna, window_size=50):
    """Calculate the variation in GC content across the sequence."""
    if len(dna) < window_size:
        return 0
    
    gc_contents = []
    for i in range(len(dna) - window_size + 1):
        window = dna[i:i+window_size]
        gc_contents.append(calculate_gc_content(window))
    
    if not gc_contents:
        return 0
    
    return max(gc_contents) - min(gc_contents)

def check_twist_guidelines(dna):
    """Check if DNA sequence meets Twist Biosciences guidelines."""
    issues = []
    
    # Check length
    if len(dna) < 300:
        issues.append(f"Sequence length ({len(dna)} bp) is less than the minimum 300 bp required.")
    
    # Check GC content
    gc_content = calculate_gc_content(dna)
    if gc_content < 25 or gc_content > 65:
        issues.append(f"GC content ({gc_content:.1f}%) is outside the recommended range (25-65%).")
    
    # Check GC variation
    gc_variation = calculate_gc_variation(dna)
    if gc_variation > 52:
        issues.append(f"GC content variation ({gc_variation:.1f}%) exceeds the maximum recommended (52%).")
    
    # Check for repeats
    repeats = find_repeats(dna, 20)
    if repeats:
        issues.append(f"Found {len(repeats)} repeats of 20+ bp. This may cause synthesis issues.")
    
    # Check for homopolymers
    homopolymers = find_homopolymers(dna, 5)
    if homopolymers:
        issues.append(f"Found {len(homopolymers)} homopolymers of 5+ bases. This may cause synthesis issues.")
        for homo, pos in homopolymers[:3]:  # Show first 3 examples
            issues.append(f"  - {homo} at position {pos}")
        if len(homopolymers) > 3:
            issues.append(f"  - ... and {len(homopolymers) - 3} more")
    
    return issues

# Interactive mode
if __name__ == "__main__":
    print("DNA-Text Converter")
    print("=================")
    print("This tool follows Twist Biosciences synthesis guidelines:")
    print("- Avoid repeats of ≥ 20bp")
    print("- GC content must be between 25% and 65%")
    print("- Avoid extreme differences in GC content (max 52% variation)")
    print("- Minimize homopolymers (runs of the same base)")
    print("- Minimize small repeats throughout the sequence")

    min_bp = 300
    min_chars = calculate_required_text_length(min_bp)
    print(f"\nNote: For sequencing, you need at least {min_bp} base pairs.")
    print(f"This requires approximately {min_chars} characters of text.")

    while True:
        print("\nChoose an operation:")
        print("1. Encode text to DNA")
        print("2. Decode DNA to text")
        print("3. Check DNA sequence against Twist guidelines")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ")
        
        if choice == '1':
            text = input("Enter text to encode: ")
            dna_sequence = encode_text_to_dna(text)
            bp_length = len(dna_sequence)
            
            print(f"\nOriginal Text: {text}")
            print(f"Text Length: {len(text)} characters")
            print(f"Encoded DNA: {dna_sequence}")
            print(f"DNA Length: {bp_length} base pairs")
            
            # Check against Twist guidelines
            issues = check_twist_guidelines(dna_sequence)
            
            if issues:
                print("\nWARNING: This sequence may not be suitable for synthesis:")
                for issue in issues:
                    print(f"- {issue}")
                
                # Provide suggestions
                if bp_length < min_bp:
                    print(f"\nSuggestion: Add approximately {min_chars - len(text)} more characters to reach the minimum length.")
                
                gc_content = calculate_gc_content(dna_sequence)
                if gc_content < 25:
                    print("\nSuggestion: To increase GC content, try adding more text with letters that encode to G or C.")
                    print("Letters that often encode to G or C include: k, l, m, n, o, w, x, y, z")
                elif gc_content > 65:
                    print("\nSuggestion: To decrease GC content, try adding more text with letters that encode to A or T.")
                    print("Letters that often encode to A or T include: a, b, c, d, e, i, j, p, q, r, s, t, u, v")
            else:
                print("\nGood news! This sequence meets all Twist Biosciences synthesis guidelines.")
            
            # Always show GC content
            print(f"\nGC Content: {calculate_gc_content(dna_sequence):.1f}%")
            
        elif choice == '2':
            dna = input("Enter DNA sequence (A, C, G, T only): ")
            dna = dna.upper()  # Convert to uppercase
            
            # Validate DNA sequence
            valid_bases = set("ACGT")
            if not all(base in valid_bases for base in dna):
                print("Invalid DNA sequence. Please use A, C, G, T only.")
                continue
            
            decoded_text = decode_dna_to_text(dna)
            print(f"\nDNA Sequence: {dna}")
            print(f"DNA Length: {len(dna)} base pairs")
            
            if decoded_text:
                print(f"Decoded Text: {decoded_text}")
                print(f"Text Length: {len(decoded_text)} characters")
            else:
                print("Decoded Text: [No readable text found]")
        
        elif choice == '3':
            dna = input("Enter DNA sequence to check (A, C, G, T only): ")
            dna = dna.upper()  # Convert to uppercase
            
            # Validate DNA sequence
            valid_bases = set("ACGT")
            if not all(base in valid_bases for base in dna):
                print("Invalid DNA sequence. Please use A, C, G, T only.")
                continue
            
            print(f"\nAnalyzing DNA sequence ({len(dna)} bp)...")
            
            # Check against Twist guidelines
            issues = check_twist_guidelines(dna)
            
            # Display results
            gc_content = calculate_gc_content(dna)
            gc_variation = calculate_gc_variation(dna)
            
            print(f"\nSequence Length: {len(dna)} bp")
            print(f"GC Content: {gc_content:.1f}%")
            print(f"GC Variation: {gc_variation:.1f}%")
            
            homopolymers = find_homopolymers(dna)
            if homopolymers:
                print(f"Homopolymers: {len(homopolymers)} found")
            else:
                print("Homopolymers: None found")
            
            repeats = find_repeats(dna)
            if repeats:
                print(f"Repeats (20+ bp): {len(repeats)} found")
            else:
                print("Repeats (20+ bp): None found")
            
            if issues:
                print("\nThis sequence may not be suitable for synthesis:")
                for issue in issues:
                    print(f"- {issue}")
            else:
                print("\nGood news! This sequence meets all Twist Biosciences synthesis guidelines.")
            
        elif choice == '4':
            print("Exiting program. Goodbye!")
            break
        
        else:
            print("Invalid choice. Please enter a number between 1 and 4.")
