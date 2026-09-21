import { db } from '../database.js';
import { SectorConfiguration } from '../types.js';

export class SectorService {
  private sectors: Map<string, SectorConfiguration> = new Map();

  constructor() {
    this.registerDefaultSectors();
  }

  private registerDefaultSectors() {
    const list: SectorConfiguration[] = [
      {
        id: 'supply_chain',
        name: 'Supply Chain & Manufacturing',
        tagline: 'High-Value Aerospace Rotor Blade Provenance & Anti-Counterfeiting',
        icon: 'PackageCheck',
        primary_asset_type: 'Turbine Rotor Blade #A9 (Inconel 718 Alloy)',
        allowed_roles: ['Manufacturer', 'QualityInspector', 'FreightForwarder', 'Auditor'],
        telemetry_thresholds: {
          max_temperature: 65.0,
          max_vibration: 1.20,
          max_gas_ppm: 350
        },
        sample_workflow_policy: 'Rule UBIP-SC-01: Temperature > 65°C during precision transit automatically voids thermal warranty and triggers smart contract hold.',
        sample_scenario: 'RFID scan at assembly line -> Vibration telemetry check -> Provenance block minted -> ERC-721 passport transfer.',
        smart_contract_rule: 'AssetRegistry.requireRole(VALIDATOR_ROLE); UBIPAssetNFT.mintPassport()'
      },
      {
        id: 'healthcare',
        name: 'Healthcare & Pharma Cold-Chain',
        tagline: 'mRNA Vaccine & Cryogenic Biologics Real-Time Quality Ledger',
        icon: 'HeartPulse',
        primary_asset_type: 'Cryogenic mRNA Vaccine Shipper (-80°C Dry Ice)',
        allowed_roles: ['PharmaManufacturer', 'HospitalPharmacist', 'FDAAuditor', 'Courier'],
        telemetry_thresholds: {
          max_temperature: -60.0,
          max_vibration: 0.40,
          max_gas_ppm: 100
        },
        sample_workflow_policy: 'Rule UBIP-HC-04: If dry-ice temperature rises above -60°C for > 3 minutes, batch is marked compromised and locked on-chain.',
        sample_scenario: 'Cold shipper arrives at hospital -> ESP32 sends thermal log -> AI verifies uninterrupted cold chain -> Batch release approved.',
        smart_contract_rule: 'MaintenanceWorkflow.triggerEmergencyHold(orderId, "COLD_CHAIN_SPOILAGE")'
      },
      {
        id: 'education',
        name: 'Education & Academic Credentials',
        tagline: 'Tamper-Evident Degree Provenance & Physical Degree NFC Verification',
        icon: 'GraduationCap',
        primary_asset_type: 'Physical Smart-Degree Certificate with Encrypted NFC Chip',
        allowed_roles: ['UniversityRegistrar', 'StudentHolder', 'EmployerVerifier', 'Accreditor'],
        telemetry_thresholds: {
          max_temperature: 45.0,
          max_vibration: 5.0,
          max_gas_ppm: 200
        },
        sample_workflow_policy: 'Rule UBIP-EDU-02: Employer verifies graduate degree NFC tag -> ZKP proof confirms GPA >= 3.5 without revealing full transcript.',
        sample_scenario: 'NFC chip tap -> ZKP verifier confirms accredited degree hash matches registrar signature.',
        smart_contract_rule: 'AccessControl.requireRole(REGISTRAR_ROLE); ProvenanceRegistry.recordProvenance()'
      },
      {
        id: 'manufacturing',
        name: 'Industrial Manufacturing & Heavy Robotics',
        tagline: 'Automated Factory Robotics Health & Predictive Maintenance Ledger',
        icon: 'Cog',
        primary_asset_type: '6-Axis Robotic Welding Arm #R7 (Hydraulic Drive)',
        allowed_roles: ['PlantSupervisor', 'RoboticsTech', 'OEMValidator'],
        telemetry_thresholds: {
          max_temperature: 75.0,
          max_vibration: 2.50,
          max_gas_ppm: 400
        },
        sample_workflow_policy: 'Rule UBIP-MFG-09: Hydraulic vibration harmonic exceeding 2.5G triggers automated predictive maintenance request.',
        sample_scenario: 'Harmonic vibration surge -> SNN spike train detected -> Maintenance order automatically submitted to smart contract.',
        smart_contract_rule: 'MaintenanceWorkflow.requestMaintenance()'
      },
      {
        id: 'government',
        name: 'Government & Public Infrastructure',
        tagline: 'Transparent Municipal Asset Lifecycle & Public Procurement Audit',
        icon: 'Landmark',
        primary_asset_type: 'Municipal Water Pumping Station IoT Telemetry Unit',
        allowed_roles: ['PublicWorksOfficer', 'StateAuditor', 'CitizenObserver'],
        telemetry_thresholds: {
          max_temperature: 55.0,
          max_vibration: 1.80,
          max_gas_ppm: 600
        },
        sample_workflow_policy: 'Rule UBIP-GOV-03: All municipal flow sensor telemetry must be publicly auditable on the blockchain explorer.',
        sample_scenario: 'Water quality & pressure telemetry signed at pumping station -> Provenance hash committed -> Public explorer updated.',
        smart_contract_rule: 'ProvenanceRegistry.recordProvenance()'
      },
      {
        id: 'agriculture',
        name: 'Agriculture & Food Traceability',
        tagline: 'Farm-to-Fork Organic Produce & Soil Moisture Sensor Trust Network',
        icon: 'Sprout',
        primary_asset_type: 'Organic Alphonso Mango Export Crate with Smart BLE Tag',
        allowed_roles: ['FarmCooperative', 'OrganicCertifier', 'PortInspector', 'Supermarket'],
        telemetry_thresholds: {
          max_temperature: 28.0,
          max_vibration: 1.00,
          max_gas_ppm: 300
        },
        sample_workflow_policy: 'Rule UBIP-AGR-01: Fruit crate humidity & ethylene gas monitored to ensure zero chemical artificial ripening.',
        sample_scenario: 'Sensor logs zero ethylene -> Organic certification passport verified -> Export clearance unlocked.',
        smart_contract_rule: 'UBIPAssetNFT.mintPassport()'
      },
      {
        id: 'defense',
        name: 'Defense & Strategic Infrastructure',
        tagline: 'Authorized Multi-Party Spare Parts Integrity & Tamper-Proof Audit',
        icon: 'ShieldCheck',
        primary_asset_type: 'Avionics Inertial Navigation System Unit (ITAR Safe Demo)',
        allowed_roles: ['DepotCommander', 'AuthorizedTechnician', 'SecurityOfficer'],
        telemetry_thresholds: {
          max_temperature: 60.0,
          max_vibration: 1.50,
          max_gas_ppm: 250
        },
        sample_workflow_policy: 'Rule UBIP-DEF-07: Spare part replacement requires ZKP clearance verification and post-quantum ML-DSA signed genesis hash.',
        sample_scenario: 'Technician presents DID credential -> ZKP verifies Tier-3 clearance -> Post-quantum signature recorded on ledger.',
        smart_contract_rule: 'AccessControl.requireRole(ADMIN_ROLE); UBIPAssetNFT.setHoldStatus()'
      },
      {
        id: 'energy',
        name: 'Energy & Smart Grid',
        tagline: 'High-Voltage Transformer Substation Health & Renewable Credit Audit',
        icon: 'Zap',
        primary_asset_type: 'Grid Step-Up Power Transformer #T12 (400kV / 315MVA)',
        allowed_roles: ['GridOperator', 'MaintenanceEngineer', 'RegulatoryInspector'],
        telemetry_thresholds: {
          max_temperature: 70.0,
          max_vibration: 1.50,
          max_gas_ppm: 300
        },
        sample_workflow_policy: 'Rule UBIP-ENG-05: Dissolved hydrogen gas in transformer oil > 300 PPM triggers immediate grid load shedding alert.',
        sample_scenario: 'Gas sensor detects arcing byproduct -> AI Trust score drops to CAUTION -> Alert dispatched to operator console.',
        smart_contract_rule: 'AssetRegistry.updateAssetState()'
      },
      {
        id: 'logistics',
        name: 'Logistics & Intermodal Freight',
        tagline: 'High-Security Shipping Container Tamper & Geo-Fenced Transit Ledger',
        icon: 'Truck',
        primary_asset_type: 'Intermodal Smart ISO Container #C849 (Satellite Uplink)',
        allowed_roles: ['ShippingLine', 'CustomsAuthority', 'PortOperator', 'InsuranceAuditor'],
        telemetry_thresholds: {
          max_temperature: 50.0,
          max_vibration: 2.00,
          max_gas_ppm: 350
        },
        sample_workflow_policy: 'Rule UBIP-LOG-11: Container seal door contact break outside authorized geofence triggers instant tamper event on-chain.',
        sample_scenario: 'Door opened at sea -> Satellite store-and-forward queue logs tamper event -> Synced upon cellular port arrival.',
        smart_contract_rule: 'ProvenanceRegistry.recordProvenance()'
      }
    ];

    for (const sec of list) {
      this.sectors.set(sec.id, sec);
    }
  }

  public getAllSectors(): SectorConfiguration[] {
    return Array.from(this.sectors.values());
  }

  public getSector(id: string): SectorConfiguration | undefined {
    return this.sectors.get(id);
  }

  public setActiveSector(id: string): SectorConfiguration {
    const sec = this.sectors.get(id);
    if (!sec) throw new Error(`Sector '${id}' not found`);
    db.activeSector = id;
    return sec;
  }
}

export const sectorService = new SectorService();
