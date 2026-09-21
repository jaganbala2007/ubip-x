import crypto from 'crypto';
import { db } from '../database.js';
import { BlockchainBlock, BlockchainTransaction, PhysicalTelemetryEvent } from '../types.js';

export class BlockchainService {
  /**
   * Commits a verified physical telemetry event to the on-chain provenance ledger
   */
  public recordProvenance(event: PhysicalTelemetryEvent): { tx: BlockchainTransaction; block: BlockchainBlock } {
    const prevBlock = db.blocks[db.blocks.length - 1];
    const newBlockNumber = prevBlock ? prevBlock.block_number + 1 : 104821;
    const prevBlockHash = prevBlock ? prevBlock.block_hash : '0x0000000000000000000000000000000000000000000000000000000000000000';

    const txHash = '0x' + crypto.createHash('sha256').update(event.event_id + event.canonical_hash + Date.now()).digest('hex');
    const validatorAddress = '0x892...FF1';

    const tx: BlockchainTransaction = {
      tx_hash: txHash,
      block_number: newBlockNumber,
      contract_address: '0xProvenanceRegistry000000000000000000000002',
      method_called: `recordProvenance("${event.event_id}", "${event.asset_id}", ${event.canonical_hash.substring(0, 10)}...)`,
      from: validatorAddress,
      to: '0xProvenanceRegistry000000000000000000000002',
      asset_id: event.asset_id,
      event_id: event.event_id,
      canonical_hash: event.canonical_hash,
      previous_hash: event.prev_event_hash,
      timestamp: new Date().toISOString(),
      status: event.is_tampered ? 'HOLD_TRIGGERED' : 'SUCCESS',
      gas_used: 64200
    };

    const blockHash = '0x' + crypto.createHash('sha256').update(newBlockNumber + prevBlockHash + txHash).digest('hex');

    const block: BlockchainBlock = {
      block_number: newBlockNumber,
      block_hash: blockHash,
      prev_block_hash: prevBlockHash,
      timestamp: new Date().toISOString(),
      transactions: [tx],
      validator: validatorAddress
    };

    db.blocks.push(block);
    db.transactions.unshift(tx);

    // Keep memory bounded to latest 100 blocks
    if (db.blocks.length > 100) db.blocks.shift();
    if (db.transactions.length > 200) db.transactions.pop();

    // Disburse UBIP Validator Rewards if verified
    if (!event.is_tampered && event.trust_state === 'VERIFIED') {
      this.rewardValidator(validatorAddress, 15, event.event_id);
    }

    return { tx, block };
  }

  /**
   * Distribute ERC-20 UBIP reward tokens to the validating consensus node
   */
  public rewardValidator(validatorAddress: string, amount: number, eventId: string) {
    let balance = db.tokenBalances.get(validatorAddress);
    if (!balance) {
      balance = {
        address: validatorAddress,
        owner_name: 'AICTE Consensus Validator',
        role: 'Validator Node',
        balance: 0,
        reward_history: []
      };
      db.tokenBalances.set(validatorAddress, balance);
    }

    balance.balance += amount;
    balance.reward_history.unshift({
      event_id: eventId,
      amount,
      timestamp: new Date().toISOString(),
      reason: 'Physical Telemetry Provenance Consensus Reward'
    });

    if (balance.reward_history.length > 50) balance.reward_history.pop();
  }

  /**
   * Trigger on-chain emergency hold for an asset
   */
  public toggleHoldOnChain(assetId: string, isHeld: boolean, reason: string): BlockchainTransaction {
    const asset = db.assets.get(assetId);
    if (asset) {
      asset.is_held = isHeld;
      asset.state = isHeld ? 'ON_HOLD' : 'ACTIVE';
      if (isHeld) asset.trust_state = 'BLOCKED';
    }

    // Freeze associated NFT
    for (const nft of db.nfts.values()) {
      if (nft.asset_id === assetId) {
        nft.is_held = isHeld;
      }
    }

    const prevBlock = db.blocks[db.blocks.length - 1];
    const newBlockNumber = prevBlock ? prevBlock.block_number + 1 : 104822;
    const txHash = '0x' + crypto.createHash('sha256').update(`HOLD_${assetId}_${isHeld}_${Date.now()}`).digest('hex');

    const tx: BlockchainTransaction = {
      tx_hash: txHash,
      block_number: newBlockNumber,
      contract_address: '0xAssetRegistry0000000000000000000000001',
      method_called: `toggleHold("${assetId}", ${isHeld}, "${reason}")`,
      from: '0x892...FF1',
      to: '0xAssetRegistry0000000000000000000000001',
      asset_id: assetId,
      timestamp: new Date().toISOString(),
      status: isHeld ? 'HOLD_TRIGGERED' : 'SUCCESS',
      gas_used: 52100
    };

    db.transactions.unshift(tx);
    return tx;
  }
}

export const blockchainService = new BlockchainService();
