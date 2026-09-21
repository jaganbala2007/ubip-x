import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ActiveView,
  ConsensusType,
  SectorType,
  ValidatorNode,
  SetuBlock,
  SetuTransaction,
  LandRecord,
  AgriBatch,
  HealthRecord,
  AcademicCredential,
  ProcurementTender,
  ThreatEvent,
  NetworkMetrics
} from '../types';

// Initial India National Validator Nodes
export const INITIAL_NODES: ValidatorNode[] = [
  {
    id: 'NODE-DELHI-NIC-01',
    name: 'National Informatics Centre (NIC Apex)',
    city: 'New Delhi',
    state: 'Delhi NCR',
    organization: 'Ministry of Electronics & IT (MeitY)',
    lat: 28.6139,
    lng: 77.2090,
    coords3D: [0.1, 1.8, 1.2],
    role: 'Master Validator',
    status: 'ACTIVE',
    hardware: 'Intel Xeon Platinum + HSM Level 4',
    enclaveType: 'Intel SGX Secure Enclave v2',
    uptime: '99.998%',
    latencyMs: 14,
    blocksValidated: 421890,
    currentVote: 'COMMIT',
    lastBlockHash: '0x8f3c71a9e201b46a'
  },
  {
    id: 'NODE-BLR-CDAC-02',
    name: 'C-DAC Supercomputing High-Throughput Node',
    city: 'Bengaluru',
    state: 'Karnataka',
    organization: 'Centre for Development of Advanced Computing',
    lat: 12.9716,
    lng: 77.5946,
    coords3D: [0.05, -1.2, 1.5],
    role: 'Regional Node',
    status: 'ACTIVE',
    hardware: 'PARAM Utkarsh DLT Co-Processor',
    enclaveType: 'ARM TrustZone Hardware Enclave',
    uptime: '99.995%',
    latencyMs: 18,
    blocksValidated: 388120,
    currentVote: 'COMMIT',
    lastBlockHash: '0x3a99e120f8c2918b'
  },
  {
    id: 'NODE-MUM-NPCI-03',
    name: 'NPCI / RBI Settlement Bridge Node',
    city: 'Mumbai',
    state: 'Maharashtra',
    organization: 'National Payments Corporation of India',
    lat: 19.0760,
    lng: 72.8777,
    coords3D: [-0.8, -0.4, 1.3],
    role: 'Master Validator',
    status: 'ACTIVE',
    hardware: 'IBM LinuxONE HSM Fortress',
    enclaveType: 'FIPS 140-3 Level 4 Cryptographic Module',
    uptime: '99.999%',
    latencyMs: 11,
    blocksValidated: 442100,
    currentVote: 'COMMIT',
    lastBlockHash: '0x7e02a4b8991c002f'
  },
  {
    id: 'NODE-HYD-IIIT-04',
    name: 'IIIT Hyderabad T-Block Innovation Node',
    city: 'Hyderabad',
    state: 'Telangana',
    organization: 'Telangana Emerging Technologies Wing',
    lat: 17.3850,
    lng: 78.4867,
    coords3D: [0.15, -0.7, 1.4],
    role: 'Regional Node',
    status: 'ACTIVE',
    hardware: 'AMD EPYC 9654 + Hardware ZKP Accelerator',
    enclaveType: 'AMD SEV-SNP Confidential Computing',
    uptime: '99.991%',
    latencyMs: 16,
    blocksValidated: 312450,
    currentVote: 'COMMIT',
    lastBlockHash: '0x12dc55a01bc8947e'
  },
  {
    id: 'NODE-KOL-CSIR-05',
    name: 'CSIR Eastern Regional Trust Grid',
    city: 'Kolkata',
    state: 'West Bengal',
    organization: 'CSIR National Informatics Grid',
    lat: 22.5726,
    lng: 88.3639,
    coords3D: [1.4, 0.4, 0.8],
    role: 'Regional Node',
    status: 'ACTIVE',
    hardware: 'Fujitsu Primergy Dual-Socket HSM',
    enclaveType: 'Intel SGX Enclave',
    uptime: '99.989%',
    latencyMs: 22,
    blocksValidated: 290110,
    currentVote: 'COMMIT',
    lastBlockHash: '0x498ab11c34ef9901'
  },
  {
    id: 'NODE-MAA-IITM-06',
    name: 'IIT Madras Deep-Tech Research Node',
    city: 'Chennai',
    state: 'Tamil Nadu',
    organization: 'IIT Madras Pravartak Technologies',
    lat: 13.0827,
    lng: 80.2707,
    coords3D: [0.35, -1.3, 1.4],
    role: 'State Gateway',
    status: 'ACTIVE',
    hardware: 'Shakti RISC-V Custom Cryptographic SoC',
    enclaveType: 'Indigenous Silicon Hardware Root-of-Trust',
    uptime: '99.994%',
    latencyMs: 19,
    blocksValidated: 301400,
    currentVote: 'COMMIT',
    lastBlockHash: '0x9923ef104ac77189'
  },
  {
    id: 'NODE-AMD-SDC-07',
    name: 'Gujarat State Data Centre (GSDC)',
    city: 'Ahmedabad',
    state: 'Gujarat',
    organization: 'Department of Science & Tech, Gujarat',
    lat: 23.0225,
    lng: 72.5714,
    coords3D: [-0.9, 0.5, 1.2],
    role: 'State Gateway',
    status: 'ACTIVE',
    hardware: 'Cisco UCS B-Series Unified Blade',
    enclaveType: 'TPM 2.0 Hardware Attestation',
    uptime: '99.992%',
    latencyMs: 20,
    blocksValidated: 275800,
    currentVote: 'COMMIT',
    lastBlockHash: '0x62bb381a99f01e23'
  },
  {
    id: 'NODE-GAU-NERG-08',
    name: 'North-East Regional Gateway Node',
    city: 'Guwahati',
    state: 'Assam',
    organization: 'North Eastern Council (NEC)',
    lat: 26.1445,
    lng: 91.7362,
    coords3D: [1.8, 1.1, 0.5],
    role: 'Regional Node',
    status: 'ACTIVE',
    hardware: 'Ruggedized Edge Server + Satellite Link',
    enclaveType: 'Hardware Root-of-Trust with Zero-Packet Loss',
    uptime: '99.985%',
    latencyMs: 31,
    blocksValidated: 219400,
    currentVote: 'COMMIT',
    lastBlockHash: '0x15f8992c01ba4721'
  },
  {
    id: 'NODE-IXC-AGRI-09',
    name: 'Northern Agri-Ledger & MSP Registry Node',
    city: 'Chandigarh',
    state: 'Punjab / Haryana',
    organization: 'Department of Agriculture & Farmers Welfare',
    lat: 30.7333,
    lng: 76.7794,
    coords3D: [0.1, 2.3, 1.1],
    role: 'State Gateway',
    status: 'ACTIVE',
    hardware: 'HPE ProLiant Gen11 HSM Dedicated Cluster',
    enclaveType: 'Intel SGX Enclave v2',
    uptime: '99.996%',
    latencyMs: 15,
    blocksValidated: 341200,
    currentVote: 'COMMIT',
    lastBlockHash: '0x5501ba4e99c1234a'
  },
  {
    id: 'NODE-BHO-BHU-10',
    name: 'Central Bhu-Aadhaar Land Registry Node',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    organization: 'Revenue Department & Survey of India',
    lat: 23.2599,
    lng: 77.4126,
    coords3D: [0.0, 0.6, 1.3],
    role: 'Security Enclave',
    status: 'ACTIVE',
    hardware: 'Dell PowerEdge R760 Confidential Node',
    enclaveType: 'Secure Boot & Geofenced Hardware Lock',
    uptime: '99.993%',
    latencyMs: 17,
    blocksValidated: 365900,
    currentVote: 'COMMIT',
    lastBlockHash: '0xbb891a20fe443201'
  }
];

// Initial Land Records
export const INITIAL_LAND_RECORDS: LandRecord[] = [
  {
    ulpin: 'UP-VAR-221005-9841',
    khasraNo: '482/1A',
    village: 'Shivpur Rural',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    areaAcres: 3.45,
    currentOwnerName: 'Ramprasad Shrivastava',
    ownerAadhaarHash: '0x71a9...88e4 (Verified)',
    deedRegistrationDate: '2024-11-14',
    encumbranceStatus: 'CLEAR',
    gisBoundary: 'POLY(((82.97 25.32, 82.98 25.32, 82.98 25.31, 82.97 25.31, 82.97 25.32)))',
    lastVerifiedBlock: 1489220,
    ownershipHistory: [
      {
        from: 'Kailashnath Shrivastava (Inheritance)',
        to: 'Ramprasad Shrivastava',
        date: '2024-11-14',
        deedHash: '0x9482fba01948ef11488c9a12bc994018e2271891',
        txHash: '0x77ab12049e91ac4481029411bc44882194',
        registrarName: 'Sub-Registrar Office Varanasi-II'
      },
      {
        from: 'State Land Grant 1982',
        to: 'Kailashnath Shrivastava',
        date: '1982-04-10',
        deedHash: '0x110294819ba88301ec94821004921841bc994012',
        txHash: '0x33449182bc994018274198200194810294',
        registrarName: 'Varanasi Land Settlement Board'
      }
    ]
  },
  {
    ulpin: 'MH-NAG-440022-3108',
    khasraNo: '119/B',
    village: 'Hingna Industrial Belt',
    district: 'Nagpur',
    state: 'Maharashtra',
    areaAcres: 8.20,
    currentOwnerName: 'Vidarbha Agro Logistics Pvt Ltd',
    ownerAadhaarHash: '0x99bc...4410 (Corporate DIN Verified)',
    deedRegistrationDate: '2025-02-18',
    encumbranceStatus: 'CLEAR',
    gisBoundary: 'POLY(((78.98 21.08, 79.01 21.08, 79.01 21.06, 78.98 21.06, 78.98 21.08)))',
    lastVerifiedBlock: 1489235,
    ownershipHistory: [
      {
        from: 'Nagpur Industrial Development Board',
        to: 'Vidarbha Agro Logistics Pvt Ltd',
        date: '2025-02-18',
        deedHash: '0x7e29910ba482019488bc11029481029481029481',
        txHash: '0x8899104471a9bc994018274198200194810294',
        registrarName: 'Sub-Registrar Hingna, Nagpur'
      }
    ]
  },
  {
    ulpin: 'KA-BLR-560064-1092',
    khasraNo: '77/3C',
    village: 'Yelahanka North',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    areaAcres: 1.15,
    currentOwnerName: 'Ananya Deshmukh',
    ownerAadhaarHash: '0x33ef...9182 (Verified)',
    deedRegistrationDate: '2025-08-05',
    encumbranceStatus: 'MORTGAGED',
    gisBoundary: 'POLY(((77.58 13.11, 77.59 13.11, 77.59 13.10, 77.58 13.10, 77.58 13.11)))',
    lastVerifiedBlock: 1489238,
    ownershipHistory: [
      {
        from: 'Karnataka Housing Board Auction',
        to: 'Ananya Deshmukh',
        date: '2025-08-05',
        deedHash: '0x44882194810294810294819ba88301ec94821004',
        txHash: '0x99104471a9bc99401827419820019481029488',
        registrarName: 'Sub-Registrar Yelahanka'
      }
    ]
  }
];

// Initial Agri Supply Chain Batches
export const INITIAL_AGRI_BATCHES: AgriBatch[] = [
  {
    batchId: 'AGRI-PUN-2026-B884',
    commodity: 'Premium 1121 Organic Basmati Rice',
    variety: 'Export Grade GI-Tagged Basmati',
    quantityQuintals: 240,
    farmerName: 'Gurpreet Singh Dhillon',
    farmerAadhaarHash: '0x88e1...33a2',
    farmLocation: 'Moga Block-3, Punjab',
    harvestDate: '2026-02-10',
    mspRatePerQuintalINR: 4850,
    totalMspPayableINR: 1164000,
    currentStage: 'MSP_SETTLED',
    paymentStatus: 'MSP_DISBURSED_DIRECT_UPI',
    iotTelemetry: {
      soilMoisturePct: 22.4,
      coldStorageTempC: 18.2,
      relativeHumidityPct: 54.0,
      rfidTagUid: 'E280-1160-2000-779A'
    },
    checkpoints: [
      {
        stage: 'Farm Gate Harvest & IoT Bagging',
        location: 'Moga Farm Cluster #4, Punjab',
        timestamp: '2026-02-10 08:30 IST',
        verifiedBy: 'Punjab Agri Extension Officer',
        txHash: '0x8f2c...991a',
        sensorReading: 'Soil NPK: 140:40:50 | Moisture: 22%'
      },
      {
        stage: 'FPO Cold Chain Storage',
        location: 'Malwa FPO Silos, Bathinda',
        timestamp: '2026-02-12 14:15 IST',
        verifiedBy: 'Automated IoT Gateway #14',
        txHash: '0x441a...77bc',
        sensorReading: 'Storage Temp: 18.2°C | Humidity: 54%'
      },
      {
        stage: 'e-NAM Mandi Quality Inspection',
        location: 'Khanna Grain Market, Ludhiana',
        timestamp: '2026-02-14 11:00 IST',
        verifiedBy: 'e-NAM Certified Assayer',
        txHash: '0x99dc...118e',
        sensorReading: 'Moisture QC: 12.1% (Grade-A Pass)'
      },
      {
        stage: 'Automated MSP Smart Contract Payment',
        location: 'Setu DLT Escrow Engine ➔ Farmer UPI',
        timestamp: '2026-02-14 11:02 IST',
        verifiedBy: 'Setu Settlement Smart Contract',
        txHash: '0x33ee...8841',
        sensorReading: '₹11,64,000 Settled via NPCI Bridge in 420ms'
      }
    ]
  },
  {
    batchId: 'AGRI-MAH-2026-M412',
    commodity: 'Ratnagiri GI Alphonso Mangoes',
    variety: 'Hapus Super-A (Pre-Export Batch)',
    quantityQuintals: 85,
    farmerName: 'Sanjay Tukaram Patil',
    farmerAadhaarHash: '0x44d2...7719',
    farmLocation: 'Devgad, Ratnagiri, Maharashtra',
    harvestDate: '2026-02-18',
    mspRatePerQuintalINR: 9200,
    totalMspPayableINR: 782000,
    currentStage: 'FPO_COLD_STORAGE',
    paymentStatus: 'ESCROW_LOCKED',
    iotTelemetry: {
      soilMoisturePct: 18.8,
      coldStorageTempC: 12.5,
      relativeHumidityPct: 82.1,
      rfidTagUid: 'E280-9940-3000-881B'
    },
    checkpoints: [
      {
        stage: 'Farm Gate Harvest & Traceability Tagging',
        location: 'Devgad Orchard #12',
        timestamp: '2026-02-18 07:00 IST',
        verifiedBy: 'Konkan Mango Growers Cooperative',
        txHash: '0x77ee...4419',
        sensorReading: 'Brix Sugar Index: 18.5 | RFID Tag Attached'
      },
      {
        stage: 'Cold Storage Transit Monitoring',
        location: 'APEDA Cold Chain Hub, Navi Mumbai',
        timestamp: '2026-02-19 16:45 IST',
        verifiedBy: 'Reefer Truck GPS & Temp Logger',
        txHash: '0x12bb...88ff',
        sensorReading: 'Temp: 12.5°C (Maintained within ±0.5°C)'
      }
    ]
  }
];

// Initial Health Records
export const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    abhaId: '91-4829-1092-3381',
    patientName: 'Devika Rajesh Sharma',
    age: 38,
    bloodGroup: 'B+ Positive',
    recordsCount: 14,
    consentPolicies: [
      {
        hospitalName: 'All India Institute of Medical Sciences (AIIMS Delhi)',
        doctorName: 'Dr. Anita Mukhopadhyay (Cardiology)',
        department: 'Cardiology & Diagnostics',
        accessType: 'FULL_DIAGNOSTICS',
        expiryDate: '2026-12-31',
        status: 'ACTIVE_CONSENT'
      },
      {
        hospitalName: 'Apollo Specialty Hospitals, Hyderabad',
        doctorName: 'Dr. K. S. Rao (Endocrinology)',
        department: 'General Medicine',
        accessType: 'PRESCRIPTIONS_ONLY',
        expiryDate: '2026-06-30',
        status: 'ACTIVE_CONSENT'
      },
      {
        hospitalName: 'Max Super Speciality Hospital, Saket',
        doctorName: 'Dr. V. Malhotra',
        department: 'Radiology',
        accessType: 'SUMMARY_ONLY',
        expiryDate: '2025-12-31',
        status: 'REVOKED'
      }
    ],
    accessLogs: [
      {
        timestamp: '2026-02-17 11:20 IST',
        hospital: 'AIIMS New Delhi',
        reason: 'OPD Consultation & Echocardiogram review',
        actor: 'Dr. Anita Mukhopadhyay (DID: did:setu:dr:aiims-094)',
        txHash: '0x99ae...4410',
        accessType: 'CONSENT_GRANTED'
      },
      {
        timestamp: '2026-01-05 03:14 IST',
        hospital: 'Fortis Emergency Trauma Centre, Gurugram',
        reason: 'Emergency Highway Accident - Break-Glass Trauma Override',
        actor: 'Chief Trauma Officer (DID: did:setu:trauma:fortis-01)',
        txHash: '0x3344...88ee',
        accessType: 'EMERGENCY_BREAK_GLASS'
      }
    ]
  }
];

// Initial Academic Credentials
export const INITIAL_ACADEMIC_CREDENTIALS: AcademicCredential[] = [
  {
    certificateId: 'IITB-CSE-2025-99201',
    abcId: 'ABC-2021-9948201',
    studentName: 'Aarav Harshvardhan Nair',
    institution: 'Indian Institute of Technology Bombay (IIT-B)',
    degreeName: 'Bachelor of Technology (B.Tech)',
    major: 'Computer Science & Engineering',
    yearOfGraduation: 2025,
    cgpa: 9.64,
    division: 'First Class with Distinction',
    digitalSignatureSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    issuerPublicKey: '0x04e198b2c488910488ae441094819ba88301ec94821004921841bc9940182741',
    verificationStatus: 'GENUINE_AICTE_VERIFIED',
    mintedBlock: 1478120
  },
  {
    certificateId: 'NITT-ECE-2024-44182',
    abcId: 'ABC-2020-3310948',
    studentName: 'Priya Meenakshi Sundaram',
    institution: 'National Institute of Technology Tiruchirappalli (NITT)',
    degreeName: 'Master of Technology (M.Tech)',
    major: 'VLSI & Embedded Systems',
    yearOfGraduation: 2024,
    cgpa: 9.42,
    division: 'First Class with Honors',
    digitalSignatureSha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    issuerPublicKey: '0x0499104471a9bc99401827419820019481029488301ec94821004921841bc994',
    verificationStatus: 'GENUINE_AICTE_VERIFIED',
    mintedBlock: 1461900
  },
  {
    certificateId: 'FAKE-DEG-2023-SUSPECT',
    abcId: 'ABC-UNREGISTERED-99',
    studentName: 'Vikrant M. (Suspect Record)',
    institution: 'Unaccredited Diploma Mill',
    degreeName: 'Forged MBA in International Trade',
    major: 'Finance & Strategy',
    yearOfGraduation: 2023,
    cgpa: 9.90,
    division: 'First Class (Forged)',
    digitalSignatureSha256: '0000000000000000000000000000000000000000000000000000000000000000',
    issuerPublicKey: '0xINVALID_PUBLIC_KEY_NOT_IN_AICTE_REGISTRY',
    verificationStatus: 'TAMPERED_HASH_MISMATCH',
    mintedBlock: 0
  }
];

// Initial Public Procurement Tenders
export const INITIAL_PROCUREMENT_TENDERS: ProcurementTender[] = [
  {
    tenderId: 'NHAI-2026-EXPWY-4401',
    gemReferenceNo: 'GEM/2026/B/894102',
    title: 'Smart Solar Highway Corridor Electrification (Varanasi-Kolkata)',
    department: 'National Highways Authority of India (NHAI)',
    estimatedBudgetINR: 420000000, // ₹42 Cr
    stage: 'ZKP_SEALED',
    bidsCount: 6,
    bids: [
      {
        bidderIdHash: '0x71a9...88e4',
        bidderNameEncrypted: 'Bidder Alpha [ZKP Sealed Envelope]',
        sealedBidHash: '0x44882194810294810294819ba88301ec94821004921841bc9940182741982001',
        bidAmountINR: 389000000,
        zkpProofValid: true,
        submissionTime: '2026-02-18 14:30 IST',
        isLowestVerifiedBid: true,
        tamperDetected: false
      },
      {
        bidderIdHash: '0x99dc...118e',
        bidderNameEncrypted: 'Bidder Beta [ZKP Sealed Envelope]',
        sealedBidHash: '0x7e29910ba482019488bc110294810294810294810294819ba88301ec94821004',
        bidAmountINR: 405000000,
        zkpProofValid: true,
        submissionTime: '2026-02-18 16:10 IST',
        isLowestVerifiedBid: false,
        tamperDetected: false
      },
      {
        bidderIdHash: '0x3344...88ee',
        bidderNameEncrypted: 'Bidder Gamma [ZKP Sealed Envelope]',
        sealedBidHash: '0x110294819ba88301ec94821004921841bc9940120194810294810294819ba883',
        bidAmountINR: 418000000,
        zkpProofValid: true,
        submissionTime: '2026-02-18 17:45 IST',
        isLowestVerifiedBid: false,
        tamperDetected: false
      }
    ],
    transparencyScore: 99.8,
    auditTxHash: '0x99401827419820019481029488301ec94821004921841bc994'
  }
];

interface SetuContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  consensusType: ConsensusType;
  setConsensusType: (type: ConsensusType) => void;
  activeSector: SectorType;
  setActiveSector: (sector: SectorType) => void;
  nodes: ValidatorNode[];
  selectedNode: ValidatorNode | null;
  setSelectedNode: (node: ValidatorNode | null) => void;
  metrics: NetworkMetrics;
  recentBlocks: SetuBlock[];
  recentTxs: SetuTransaction[];
  landRecords: LandRecord[];
  agriBatches: AgriBatch[];
  healthRecords: HealthRecord[];
  academicCredentials: AcademicCredential[];
  procurementTenders: ProcurementTender[];
  threatEvents: ThreatEvent[];
  activeThreat: ThreatEvent | null;
  isSimulatingThreat: boolean;
  triggerThreatSimulation: (type: ThreatEvent['type']) => Promise<void>;
  simulateIllegalDeedMutation: (ulpin: string) => void;
  simulateMspPaymentRelease: (batchId: string) => void;
  toggleHealthConsent: (abhaId: string, hospitalName: string) => void;
  verifyDegreeSearch: (query: string) => AcademicCredential | null;
  isWalletOpen: boolean;
  setIsWalletOpen: (open: boolean) => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}

const SetuContext = createContext<SetuContextType | undefined>(undefined);

export const SetuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('hero');
  const [consensusType, setConsensusType] = useState<ConsensusType>('IBFT2');
  const [activeSector, setActiveSector] = useState<SectorType>('land');
  const [nodes, setNodes] = useState<ValidatorNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<ValidatorNode | null>(INITIAL_NODES[0]);
  const [landRecords, setLandRecords] = useState<LandRecord[]>(INITIAL_LAND_RECORDS);
  const [agriBatches, setAgriBatches] = useState<AgriBatch[]>(INITIAL_AGRI_BATCHES);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [academicCredentials, setAcademicCredentials] = useState<AcademicCredential[]>(INITIAL_ACADEMIC_CREDENTIALS);
  const [procurementTenders, setProcurementTenders] = useState<ProcurementTender[]>(INITIAL_PROCUREMENT_TENDERS);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Network Metrics
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    blocksMined: 1489240,
    activeNodes: 10,
    tps: 2480,
    totalValueSecuredINR: 184200000000, // ₹18,420 Cr
    fraudPreventedINR: 23400000000,     // ₹2,340 Cr
    recordsVerified: 1248900,
    consensusLatencyMs: 420,
    gasPriceGwei: 0.001
  });

  // Recent Blocks & Txs
  const [recentBlocks, setRecentBlocks] = useState<SetuBlock[]>([]);
  const [recentTxs, setRecentTxs] = useState<SetuTransaction[]>([]);

  // Threat Simulation
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([
    {
      id: 'THREAT-2026-091',
      type: 'SQL_DEED_TAMPER',
      title: 'Direct Database Injection Attempt on Land Parcel (ULPIN UP-VAR-9841)',
      sectorTarget: 'Land Records & Property Registry',
      severity: 'CRITICAL',
      status: 'BLOCKED_IMMUTABLE',
      timestamp: 'Just now',
      attackerVector: 'Direct rogue DBA SQL UPDATE command attempting to overwrite title holder',
      systemResponse: 'On-chain SHA-256 state root mismatch detected in 12ms. Byzantine quorum rejected mutation and quarantined transaction.',
      cryptographicProof: 'Expected Hash: 0x9482fba01... | Malicious Hash: 0xdeadbeef1... | Signature: SetuPoA-Consensus-Rejected',
      affectedHash: '0x9482fba01948ef11488c9a12bc994018e2271891'
    }
  ]);
  const [activeThreat, setActiveThreat] = useState<ThreatEvent | null>(null);
  const [isSimulatingThreat, setIsSimulatingThreat] = useState<boolean>(false);

  // Interval simulator for live network heartbeats
  useEffect(() => {
    // Generate initial recent blocks deterministically
    const initialBlocks: SetuBlock[] = Array.from({ length: 6 }).map((_, i) => {
      const blockNum = 1489240 - i;
      const node = INITIAL_NODES[i % INITIAL_NODES.length];
      const blockHex = (0x8f3c71a9 + blockNum).toString(16);
      const prevHex = (0x8f3c71a9 + blockNum - 1).toString(16);
      return {
        blockNumber: blockNum,
        blockHash: `0x${blockHex}e201b46a`,
        prevBlockHash: `0x${prevHex}e201b46a`,
        timestamp: new Date(Date.now() - i * 3200).toLocaleTimeString(),
        validatorCity: node.city,
        validatorName: node.name,
        txCount: 32 + (i * 3) % 15,
        merkleRoot: `0x9482fba01948ef${i}`,
        transactions: []
      };
    });
    setRecentBlocks(initialBlocks);

    const initialTxs: SetuTransaction[] = [
      {
        txHash: '0x91fa4810294819ba88301ec94821004921841bc9',
        blockNumber: 1489240,
        sector: 'land',
        action: 'Bhu-Aadhaar ULPIN Title Attestation',
        fromEntity: 'Sub-Registrar Office Varanasi-II',
        toEntity: 'Ramprasad Shrivastava',
        timestamp: '1s ago',
        gasUsed: 21400,
        status: 'FINALIZED',
        details: { ulpin: 'UP-VAR-221005-9841', status: 'Deed Verified' },
        impactValueINR: 4500000
      },
      {
        txHash: '0x44882194810294810294819ba88301ec94821004',
        blockNumber: 1489239,
        sector: 'agri',
        action: 'e-NAM Automated MSP Escrow Payment',
        fromEntity: 'e-NAM Settlement Escrow',
        toEntity: 'Gurpreet Singh Dhillon (Farmer)',
        timestamp: '4s ago',
        gasUsed: 38200,
        status: 'FINALIZED',
        details: { batchId: 'AGRI-PUN-2026-B884', mspDisbursed: '₹11,64,000' },
        impactValueINR: 1164000
      },
      {
        txHash: '0x7e29910ba482019488bc11029481029481029481',
        blockNumber: 1489238,
        sector: 'education',
        action: 'Degree Credential Verification (ABC-ID)',
        fromEntity: 'IIT Bombay Academic Registry',
        toEntity: 'Aarav H. Nair',
        timestamp: '7s ago',
        gasUsed: 19500,
        status: 'VERIFIED',
        details: { degree: 'B.Tech CSE', rollNo: 'IITB-CSE-2025-99201' }
      },
      {
        txHash: '0x33ee88419ba88301ec94821004921841bc994018',
        blockNumber: 1489237,
        sector: 'health',
        action: 'ABHA Granular Patient Consent Attestation',
        fromEntity: 'Devika Rajesh Sharma (ABHA Owner)',
        toEntity: 'AIIMS New Delhi',
        timestamp: '10s ago',
        gasUsed: 24000,
        status: 'FINALIZED',
        details: { abhaId: '91-4829-1092-3381', access: 'FULL_DIAGNOSTICS' }
      }
    ];
    setRecentTxs(initialTxs);

    let tick = 0;
    // Live Deterministic Interval Heartbeat
    const interval = setInterval(() => {
      tick++;
      setMetrics(prev => ({
        ...prev,
        blocksMined: prev.blocksMined + 1,
        tps: 2480 + (tick % 5) * 20,
        consensusLatencyMs: 420 + (tick % 3) * 5,
        recordsVerified: prev.recordsVerified + 2
      }));

      // Append new block deterministically
      const nodeIndex = tick % INITIAL_NODES.length;
      const node = INITIAL_NODES[nodeIndex];
      setRecentBlocks(prev => {
        const nextBlockNumber = prev[0] ? prev[0].blockNumber + 1 : 1489241;
        const nextHex = (0x8f3c71a9 + nextBlockNumber).toString(16);
        return [
          {
            blockNumber: nextBlockNumber,
            blockHash: `0x${nextHex}e201b46a`,
            prevBlockHash: prev[0] ? prev[0].blockHash : '0x8f3c71a9e201b46a',
            timestamp: new Date().toLocaleTimeString(),
            validatorCity: node.city,
            validatorName: node.name,
            txCount: 35 + (tick % 10),
            merkleRoot: `0x9482fba01948ef${tick}`,
            transactions: []
          },
          ...prev.slice(0, 9)
        ];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Action: Trigger Threat Simulation
  const triggerThreatSimulation = async (type: ThreatEvent['type']) => {
    setIsSimulatingThreat(true);

    const threatTemplates: Record<ThreatEvent['type'], ThreatEvent> = {
      SQL_DEED_TAMPER: {
        id: `THREAT-${Date.now().toString().slice(-4)}`,
        type: 'SQL_DEED_TAMPER',
        title: 'Centralized Database Land Deed Mutation Attempt',
        sectorTarget: 'Land Records & Property Registry (Bhu-Aadhaar)',
        severity: 'CRITICAL',
        status: 'ATTEMPTED',
        timestamp: new Date().toLocaleTimeString(),
        attackerVector: 'Malicious insider modified MySQL record in local land revenue database to alter ownership to fraudulent entity.',
        systemResponse: 'Setu Chain state verification detected Merkle root disparity. Transaction quarantined in 12ms. Alert dispatched to land owner.',
        cryptographicProof: 'Genesis Hash Mismatch | Expected: 0x9482fba01... | Tampered: 0xbadc0de99... | Smart Contract: AssetRegistry.sol Lock Triggered',
        affectedHash: '0x9482fba01948ef11488c9a12bc994018e2271891'
      },
      SYBIL_ROGUE_NODE: {
        id: `THREAT-${Date.now().toString().slice(-4)}`,
        type: 'SYBIL_ROGUE_NODE',
        title: 'Rogue Validator Node Injection Attack',
        sectorTarget: 'National Consensus Layer',
        severity: 'HIGH',
        status: 'ATTEMPTED',
        timestamp: new Date().toLocaleTimeString(),
        attackerVector: 'Attacker spun up 15 rogue cloud instances attempting to broadcast forged voting blocks into the IBFT 2.0 network.',
        systemResponse: 'NIC / CDAC Master Enclaves verified hardware SGX attestation tokens. Non-attested nodes instantly blacklisted.',
        cryptographicProof: 'Missing Intel SGX Quote v2 | Hardware Root of Trust Failed | 0/10 Authorized Validators Voted',
        affectedHash: '0xsybil00194819ba88301ec94821004921841bc'
      },
      SIGNATURE_REPLAY: {
        id: `THREAT-${Date.now().toString().slice(-4)}`,
        type: 'SIGNATURE_REPLAY',
        title: 'Academic Credential Replay & Interception Attack',
        sectorTarget: 'Academic Credentials (ABC-ID)',
        severity: 'HIGH',
        status: 'ATTEMPTED',
        timestamp: new Date().toLocaleTimeString(),
        attackerVector: 'Intercepted genuine IIT Bombay degree signature and attempted to bind it to an unauthorized student identity.',
        systemResponse: 'Setu Chain verified on-chain nonces & student ABC-ID binding. Cryptographic signature check failed with zero false positives.',
        cryptographicProof: 'Signature Nonce Expired | Public Key mismatch: IIT-B Registrar Key != Submitted Hash',
        affectedHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1'
      },
      FIFTY_ONE_COLLUSION: {
        id: `THREAT-${Date.now().toString().slice(-4)}`,
        type: 'FIFTY_ONE_COLLUSION',
        title: 'Byzantine Fault Tolerance & Collusion Attack',
        sectorTarget: 'Public Procurement & Tender Ledger',
        severity: 'CRITICAL',
        status: 'ATTEMPTED',
        timestamp: new Date().toLocaleTimeString(),
        attackerVector: 'Cartel attempted to compromise 3 out of 10 nodes to prematurely reveal sealed zero-knowledge bids in ₹42 Cr highway tender.',
        systemResponse: 'IBFT 2.0 requires 2F+1 (>67%) consensus threshold. 7 honest sovereign nodes maintained ledger state. Bid seals remained cryptographic.',
        cryptographicProof: 'Consensus Threshold (7/10 Validated) > Quorum Limit | ZKP Pederson Commitment Unbroken',
        affectedHash: '0x44882194810294810294819ba88301ec94821004'
      }
    };

    const newThreat = threatTemplates[type];
    setActiveThreat(newThreat);

    // Step-by-step resolution simulation
    setTimeout(() => {
      setActiveThreat(prev => prev ? { ...prev, status: 'DETECTED_12MS' } : null);
    }, 1000);

    setTimeout(() => {
      setActiveThreat(prev => prev ? { ...prev, status: 'ISOLATED_QUORUM' } : null);
    }, 2200);

    setTimeout(() => {
      setActiveThreat(prev => {
        if (!prev) return null;
        const resolved: ThreatEvent = { ...prev, status: 'BLOCKED_IMMUTABLE' };
        setThreatEvents(all => [resolved, ...all.slice(0, 7)]);
        return resolved;
      });
      setIsSimulatingThreat(false);
    }, 3500);
  };

  // Action: Simulate Illegal Deed Mutation
  const simulateIllegalDeedMutation = (ulpin: string) => {
    setLandRecords(prev =>
      prev.map(record =>
        record.ulpin === ulpin
          ? { ...record, encumbranceStatus: 'LOCKED_FRAUD_ALERT' }
          : record
      )
    );
    triggerThreatSimulation('SQL_DEED_TAMPER');
  };

  // Action: Simulate MSP Payment Release
  const simulateMspPaymentRelease = (batchId: string) => {
    setAgriBatches(prev =>
      prev.map(batch =>
        batch.batchId === batchId
          ? {
              ...batch,
              currentStage: 'MSP_SETTLED',
              paymentStatus: 'MSP_DISBURSED_DIRECT_UPI',
              checkpoints: [
                ...batch.checkpoints,
                {
                  stage: 'Instant MSP Settlement via NPCI Bridge',
                  location: 'Direct to Farmer Bank Account',
                  timestamp: new Date().toLocaleTimeString() + ' IST',
                  verifiedBy: 'Setu MSP Smart Contract (Escrow Auto-Disburse)',
                  txHash: `0x44882194810294810294819ba88301ec94821004`,
                  sensorReading: `₹${batch.totalMspPayableINR.toLocaleString('en-IN')} Transferred in 380ms`
                }
              ]
            }
          : batch
      )
    );
  };

  // Action: Toggle Health Consent
  const toggleHealthConsent = (abhaId: string, hospitalName: string) => {
    setHealthRecords(prev =>
      prev.map(record =>
        record.abhaId === abhaId
          ? {
              ...record,
              consentPolicies: record.consentPolicies.map(policy =>
                policy.hospitalName === hospitalName
                  ? {
                      ...policy,
                      status: policy.status === 'ACTIVE_CONSENT' ? 'REVOKED' : 'ACTIVE_CONSENT'
                    }
                  : policy
              )
            }
          : record
      )
    );
  };

  // Action: Verify Degree Search
  const verifyDegreeSearch = (query: string): AcademicCredential | null => {
    const q = query.trim().toLowerCase();
    return (
      academicCredentials.find(
        c =>
          c.certificateId.toLowerCase().includes(q) ||
          c.abcId.toLowerCase().includes(q) ||
          c.studentName.toLowerCase().includes(q)
      ) || null
    );
  };

  return (
    <SetuContext.Provider
      value={{
        activeView,
        setActiveView,
        consensusType,
        setConsensusType,
        activeSector,
        setActiveSector,
        nodes,
        selectedNode,
        setSelectedNode,
        metrics,
        recentBlocks,
        recentTxs,
        landRecords,
        agriBatches,
        healthRecords,
        academicCredentials,
        procurementTenders,
        threatEvents,
        activeThreat,
        isSimulatingThreat,
        triggerThreatSimulation,
        simulateIllegalDeedMutation,
        simulateMspPaymentRelease,
        toggleHealthConsent,
        verifyDegreeSearch,
        isWalletOpen,
        setIsWalletOpen,
        currentSlide,
        setCurrentSlide
      }}
    >
      {children}
    </SetuContext.Provider>
  );
};

export const useSetu = () => {
  const context = useContext(SetuContext);
  if (!context) {
    throw new Error('useSetu must be used within a SetuProvider');
  }
  return context;
};
