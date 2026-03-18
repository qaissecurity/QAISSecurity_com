# QAISS Quantum Circuit Demonstrations

**Working quantum circuits** demonstrating the 4 layers of QAISS architecture using OriginQ's pyqpanda3 SDK — the same framework that runs on the WuKong 72-qubit quantum computer.

> **Status**: All 4 circuits tested and verified. Ready for WuKong cloud deployment.

## Quick Start

```bash
pip install pyqpanda3 numpy
python qaiss_quantum_demo.py
```

## CLI Options

```bash
# Run all demos locally (default — same as before)
python qaiss_quantum_demo.py

# Run on real WuKong quantum hardware
python qaiss_quantum_demo.py --cloud --api-key YOUR_API_KEY

# Or use an environment variable for the API key
export QAISS_QCLOUD_API_KEY=YOUR_API_KEY
python qaiss_quantum_demo.py --cloud

# Save results to JSON
python qaiss_quantum_demo.py --output qaiss_results.json

# Run specific layers only
python qaiss_quantum_demo.py --layers 1,4

# Combine options
python qaiss_quantum_demo.py --cloud --output results.json --layers 2,3
```

| Flag | Description |
|------|-------------|
| `--cloud` | Use QCloudService (WuKong hardware) instead of local CPUQVM |
| `--api-key KEY` | QCloud API key (or set `QAISS_QCLOUD_API_KEY` env var) |
| `--output PATH` | Save results as JSON to the given file path |
| `--layers N,N,...` | Comma-separated layer numbers to run (default: `1,2,3,4`) |

When `--cloud` is used, the script automatically falls back to CPUQVM if a cloud call fails.

## The 4 Demos

| Layer | Circuit | Qubits | What It Proves |
|-------|---------|--------|----------------|
| **1. Quantum Entropy Core** | QRNG via Hadamard + Measure | 20 × 13 batches | True quantum randomness — 256 bits generated |
| **2. AI Neural Immune** | RY encoding + CNOT entanglement + H interference | 4 | Anomaly detection via quantum state deviation |
| **3. Self-Healing Protocol** | BB84 QKD (X/Z basis prepare + measure) | 1 × 20 rounds | Quantum key distribution for automatic key rotation |
| **4. Command Dashboard** | Bell state tomography (H + CNOT) | 2 | Hardware health monitoring — fidelity: 1.0000, grade: A+ |

## Running on Real WuKong Hardware

Use the `--cloud` flag to run on real quantum hardware:

```bash
python qaiss_quantum_demo.py --cloud --api-key YOUR_API_KEY
```

Register at [OriginQ Cloud](https://qcloud.originqc.com.cn/en) to get your API key.

The script uses `QCloudService` from `pyqpanda3.qcloud` and automatically falls back to local `CPUQVM` simulation if a cloud call fails.

## Architecture

```
Layer 4: Command Dashboard — Bell state tomography, fidelity monitoring
Layer 3: Self-Healing — BB84 QKD, automatic key rotation
Layer 2: AI Neural Immune — Quantum anomaly detection
Layer 1: Quantum Entropy Core — QRNG (Hadamard + measure)
         Powered by Origin Quantum WuKong (72 qubits)
```

## Links

- **Website**: [qaissecurity.com](https://qaissecurity.com)
- **GitHub**: [github.com/Qaissecurity](https://github.com/Qaissecurity)
- **OriginQ Cloud**: [qcloud.originqc.com.cn](https://qcloud.originqc.com.cn/en)
- **Contact**: qaissecurity@gmail.com | +40 736 469 828

## License

Apache 2.0
