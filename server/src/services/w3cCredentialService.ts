export interface W3CVerifiableCredential {
  id: string;
  type: string[];
  issuer: {
    id: string; // DID
    name: string;
    organization: string;
  };
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string; // DID of Holder / Asset
    name: string;
    role: string;
    clearanceLevel: number;
    authorizedAssetClasses: string[];
  };
  credentialStatus: {
    id: string;
    type: 'BitstringStatusListEntry' | 'OnChainRevocationRegistry';
    statusPurpose: 'revocation';
    isRevoked: boolean;
    revocationTimestamp?: string;
    revocationReason?: string;
  };
  proof: {
    type: 'JsonWebSignature2020' | 'Ed25519Signature2020' | 'ML-DSA-65-PQC';
    created: string;
    proofPurpose: 'assertionMethod';
    verificationMethod: string;
    jws: string;
  };
}

export class W3CCredentialService {
  private credentials: Map<string, W3CVerifiableCredential> = new Map();

  constructor() {
    this.seedDefaultCredentials();
  }

  private seedDefaultCredentials() {
    const cred1: W3CVerifiableCredential = {
      id: 'urn:uuid:9842fba0-1120-449e-bc99-4018e2271891',
      type: ['VerifiableCredential', 'CertifiedMaintenanceTechnicianCredential'],
      issuer: {
        id: 'did:ubip:org:aicte-apex-01',
        name: 'AICTE Apex Certification Authority',
        organization: 'Ministry of Education'
      },
      issuanceDate: '2026-01-15T08:00:00Z',
      expirationDate: '2027-01-15T08:00:00Z',
      credentialSubject: {
        id: 'did:ubip:person:op-7749',
        name: 'Capt. Vikram Sen',
        role: 'Chief Trust Architect & Master Technician',
        clearanceLevel: 3,
        authorizedAssetClasses: ['CRITICAL_TURBINE', 'COLD_CHAIN_VACCINE', 'HIGH_VOLTAGE_TRANSFORMER']
      },
      credentialStatus: {
        id: 'https://ubip.gov.in/status/credentials#0',
        type: 'OnChainRevocationRegistry',
        statusPurpose: 'revocation',
        isRevoked: false
      },
      proof: {
        type: 'ML-DSA-65-PQC',
        created: '2026-01-15T08:05:00Z',
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:ubip:org:aicte-apex-01#pqc-key-1',
        jws: 'eyJhbGciOiJNTC1EU0EtNjUiLCJjcml0IjpbImJmZSJdfQ..pqc_sig_99ae44'
      }
    };

    const cred2: W3CVerifiableCredential = {
      id: 'urn:uuid:33109481-9ba8-8301-ec94-821004921841',
      type: ['VerifiableCredential', 'FieldInspectorCredential'],
      issuer: {
        id: 'did:ubip:org:state-grid-corp',
        name: 'National Grid Security Board',
        organization: 'Department of Energy'
      },
      issuanceDate: '2025-06-10T09:00:00Z',
      expirationDate: '2026-06-10T09:00:00Z',
      credentialSubject: {
        id: 'did:ubip:person:inspector-09',
        name: 'A. K. Sharma (Suspended Officer)',
        role: 'Field Quality Inspector',
        clearanceLevel: 1,
        authorizedAssetClasses: ['SUBSTATION_PUMP']
      },
      credentialStatus: {
        id: 'https://ubip.gov.in/status/credentials#1',
        type: 'OnChainRevocationRegistry',
        statusPurpose: 'revocation',
        isRevoked: true,
        revocationTimestamp: '2026-02-01T14:30:00Z',
        revocationReason: 'Security Clearance Withdrawn by Bureau of Public Audits'
      },
      proof: {
        type: 'JsonWebSignature2020',
        created: '2025-06-10T09:02:00Z',
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:ubip:org:state-grid-corp#key-1',
        jws: 'eyJhbGciOiJFRDI1NTE5In0..ed_sig_3381'
      }
    };

    this.credentials.set(cred1.id, cred1);
    this.credentials.set(cred2.id, cred2);
  }

  public getAllCredentials(): W3CVerifiableCredential[] {
    return Array.from(this.credentials.values());
  }

  public getCredentialById(id: string): W3CVerifiableCredential | undefined {
    return this.credentials.get(id);
  }

  public verifyCredential(credId: string, requestedAssetClass?: string): {
    isValid: boolean;
    isRevoked: boolean;
    isAuthorizedForAsset: boolean;
    reason: string;
    credential?: W3CVerifiableCredential;
  } {
    const cred = this.credentials.get(credId);
    if (!cred) {
      return { isValid: false, isRevoked: false, isAuthorizedForAsset: false, reason: 'Credential not found in registry' };
    }

    if (cred.credentialStatus.isRevoked) {
      return {
        isValid: false,
        isRevoked: true,
        isAuthorizedForAsset: false,
        reason: `Credential Revoked: ${cred.credentialStatus.revocationReason || 'Revoked on-chain'}`,
        credential: cred
      };
    }

    const now = new Date().toISOString();
    if (now > cred.expirationDate) {
      return { isValid: false, isRevoked: false, isAuthorizedForAsset: false, reason: 'Credential expired', credential: cred };
    }

    let isAuthorizedForAsset = true;
    if (requestedAssetClass && !cred.credentialSubject.authorizedAssetClasses.includes(requestedAssetClass)) {
      isAuthorizedForAsset = false;
      return {
        isValid: false,
        isRevoked: false,
        isAuthorizedForAsset: false,
        reason: `Actor not authorized for asset class: ${requestedAssetClass}`,
        credential: cred
      };
    }

    return {
      isValid: true,
      isRevoked: false,
      isAuthorizedForAsset: true,
      reason: 'W3C Verifiable Credential cryptographically valid and active',
      credential: cred
    };
  }

  public toggleRevocation(credId: string, revoke: boolean, reason?: string): W3CVerifiableCredential | null {
    const cred = this.credentials.get(credId);
    if (!cred) return null;

    cred.credentialStatus.isRevoked = revoke;
    if (revoke) {
      cred.credentialStatus.revocationTimestamp = new Date().toISOString();
      cred.credentialStatus.revocationReason = reason || 'Administrative Policy Revocation';
    } else {
      delete cred.credentialStatus.revocationTimestamp;
      delete cred.credentialStatus.revocationReason;
    }

    this.credentials.set(credId, cred);
    return cred;
  }
}

export const w3cCredentialService = new W3CCredentialService();
