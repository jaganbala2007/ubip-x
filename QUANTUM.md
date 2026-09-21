# UBIP-X Quantum Computing Research Lab
> **SIH 2026 Problem Statement PS ID: 26211**

---

## 1. Scope & Transparency Notice

> [!NOTE]
> All quantum circuit calculations in this module are executed via **Deterministic Software Simulation**. They represent theoretical circuit models and quantum threat assessments without falsely claiming physical quantum hardware.

---

## 2. Simulated Quantum Circuits

1. **Bell State Entanglement $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$**:
   - 2-Qubit circuit applying Hadamard gate $H(q_0)$ followed by controlled-NOT $CNOT(q_0, q_1)$.
   - Demonstrates maximally entangled state vectors with equal 50% probability amplitudes.
2. **Grover's Quadratic Key Search Oracle**:
   - 3-Qubit circuit performing phase inversion on target key state $|101\rangle$ followed by amplitude amplification diffusion.
   - Demonstrates quadratic entropy reduction $O(\sqrt{N})$ against symmetric 128-bit keys, reinforcing UBIP-X's adoption of SHA-256 and SHAKE-256.
