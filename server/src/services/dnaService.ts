import crypto from 'crypto';

export interface DNAArchivalResult {
  originalText: string;
  originalBytesCount: number;
  originalSha256: string;
  binaryString: string;
  dnaSequence: string; // A, C, G, T string
  nucleotideCount: number;
  gcContentPercentage: number;
  densityBytesPerGramSimulated: string;
  reconstructedText: string;
  reconstructedSha256: string;
  integrityVerified: boolean;
}

export class DNAService {
  // Binary to Base mapping: 00 -> A, 01 -> C, 10 -> G, 11 -> T
  private map2BitToBase: Record<string, string> = {
    '00': 'A',
    '01': 'C',
    '10': 'G',
    '11': 'T'
  };

  private mapBaseTo2Bit: Record<string, string> = {
    'A': '00',
    'C': '01',
    'G': '10',
    'T': '11'
  };

  /**
   * Encodes text / provenance hash into synthetic DNA nucleotide sequence (A/C/G/T) and verifies reconstructed integrity
   */
  public encodeToDNA(inputRecord: string = 'UBIP-X GENESIS PROVENANCE ASSET-001 BLOCK#104820'): DNAArchivalResult {
    const origBytes = Buffer.from(inputRecord, 'utf-8');
    const origHash = crypto.createHash('sha256').update(origBytes).digest('hex');

    // Convert bytes to binary string
    let binaryStr = '';
    for (let i = 0; i < origBytes.length; i++) {
      binaryStr += origBytes[i].toString(2).padStart(8, '0');
    }

    // Convert 2-bit chunks to DNA nucleotides
    let dnaSequence = '';
    for (let i = 0; i < binaryStr.length; i += 2) {
      const chunk = binaryStr.substring(i, i + 2);
      dnaSequence += this.map2BitToBase[chunk] || 'A';
    }

    // Count GC content
    let gcCount = 0;
    for (const char of dnaSequence) {
      if (char === 'G' || char === 'C') gcCount++;
    }
    const gcPercentage = Number(((gcCount / dnaSequence.length) * 100).toFixed(1));

    // Decode back to binary
    let decodedBinary = '';
    for (const base of dnaSequence) {
      decodedBinary += this.mapBaseTo2Bit[base] || '00';
    }

    // Decode binary to bytes
    const decodedBytes: number[] = [];
    for (let i = 0; i < decodedBinary.length; i += 8) {
      const byteStr = decodedBinary.substring(i, i + 8);
      decodedBytes.push(parseInt(byteStr, 2));
    }
    const reconstructedBuffer = Buffer.from(decodedBytes);
    const reconstructedText = reconstructedBuffer.toString('utf-8');
    const reconstructedHash = crypto.createHash('sha256').update(reconstructedBuffer).digest('hex');

    return {
      originalText: inputRecord,
      originalBytesCount: origBytes.length,
      originalSha256: origHash,
      binaryString: binaryStr.substring(0, 64) + '...',
      dnaSequence,
      nucleotideCount: dnaSequence.length,
      gcContentPercentage: gcPercentage,
      densityBytesPerGramSimulated: '215 Petabytes / gram DNA',
      reconstructedText,
      reconstructedSha256: reconstructedHash,
      integrityVerified: origHash === reconstructedHash
    };
  }
}

export const dnaService = new DNAService();
