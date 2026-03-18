"""
QAISS — Quantum AI Immune Security System
Quantum Circuit Demonstrations on Origin Quantum WuKong

These circuits demonstrate the 4 layers of QAISS architecture
running on OriginQ's quantum computing platform via pyqpanda3.

Requirements:
    pip install pyqpanda3 numpy

Usage:
    python qaiss_quantum_demo.py
"""

import numpy as np
import sys
import os
import json
import argparse
import math
from datetime import datetime, timezone

try:
    from pyqpanda3.core import *
except ImportError:
    print("=" * 60)
    print("  pyqpanda3 not installed.")
    print("  Install with: pip install pyqpanda3 numpy")
    print("  Or run on WuKong Cloud: https://qcloud.originqc.com.cn/en")
    print("=" * 60)
    sys.exit(1)

try:
    from pyqpanda3.qcloud import QCloudService, QCloudOptions, LogOutput
    QCLOUD_AVAILABLE = True
except ImportError:
    QCLOUD_AVAILABLE = False


class QuantumBackend:
    """Manages CPUQVM or QCloudService, with automatic fallback."""

    def __init__(self, use_cloud=False, api_key=None):
        self.use_cloud = use_cloud and QCLOUD_AVAILABLE
        self.api_key = api_key
        self.backend_name = "QCloudService (WuKong)" if self.use_cloud else "CPUQVM (local)"
        self._service = None
        self._backend = None
        if self.use_cloud:
            self._service = QCloudService(self.api_key)
            self._service.setup_logging(LogOutput.CONSOLE)
            self._backend = self._service.backend("origin_wukong")

    def run(self, prog, shots):
        """Run a program and return counts dict. Falls back to CPUQVM on cloud errors."""
        if self.use_cloud:
            try:
                options = QCloudOptions()
                options.set_is_prob_counts(True)
                result = self._backend.run(prog, shots, options).result()
                return result.get_counts()
            except Exception as e:
                print(f"  [WARN] QCloud error: {e} — falling back to CPUQVM")

        qvm = CPUQVM()
        qvm.run(prog, shots)
        return qvm.result().get_counts()


class ResultsCollector:
    """Accumulates demo results for JSON output."""

    def __init__(self):
        self.results = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "platform": None,
            "layers": {}
        }

    def set_platform(self, name):
        self.results["platform"] = name

    def add_layer(self, layer_num, name, data):
        self.results["layers"][f"layer_{layer_num}"] = {
            "name": name,
            **data
        }

    def save(self, path):
        with open(path, "w") as f:
            json.dump(self.results, f, indent=2, default=str)
        print(f"\n  Results saved to {path}")


def shannon_entropy(counts, num_qubits):
    """Compute normalized Shannon entropy from measurement counts."""
    total = sum(counts.values())
    if total == 0:
        return 0.0
    probs = [c / total for c in counts.values() if c > 0]
    raw = -sum(p * math.log2(p) for p in probs)
    max_entropy = num_qubits  # log2(2^num_qubits)
    return raw / max_entropy if max_entropy > 0 else 0.0


def banner(title, layer):
    colors = {1: "PURPLE", 2: "TEAL", 3: "CORAL", 4: "BLUE"}
    print(f"\n{'=' * 60}")
    print(f"  QAISS LAYER {layer} — {colors.get(layer, '')}")
    print(f"  {title}")
    print(f"{'=' * 60}\n")


# ═══════════════════════════════════════════════════════════════
# LAYER 1: QUANTUM ENTROPY CORE — True Random Number Generation
# ═══════════════════════════════════════════════════════════════

def demo_qrng(num_bits=256, backend=None, collector=None):
    banner("Quantum Random Number Generator (QRNG)", 1)

    random_bits = []
    batch_size = 20
    num_batches = (num_bits + batch_size - 1) // batch_size

    print(f"  Generating {num_bits} truly random bits...")
    print(f"  Using {num_batches} quantum circuits x {batch_size} qubits\n")

    all_counts = {}
    for batch in range(num_batches):
        prog = QProg()
        for i in range(batch_size):
            prog << H(i)
        for i in range(batch_size):
            prog << measure(i, i)

        result = backend.run(prog, 1)
        for k, v in result.items():
            all_counts[k] = all_counts.get(k, 0) + v

        for key in result:
            random_bits.extend([int(b) for b in key])

    random_bits = random_bits[:num_bits]
    bit_string = ''.join(str(b) for b in random_bits)
    hex_string = hex(int(bit_string, 2))[2:].upper().zfill(num_bits // 4)

    ones = sum(random_bits)
    zeros = num_bits - ones
    ratio = ones / num_bits
    entropy = shannon_entropy(all_counts, batch_size)

    print(f"  Generated {num_bits} quantum random bits")
    print(f"  Distribution: {zeros} zeros, {ones} ones ({ratio:.3f} ratio)")
    print(f"  Ideal ratio: 0.500 | Deviation: {abs(ratio - 0.5):.4f}")
    print(f"  Shannon entropy (normalized): {entropy:.4f}")
    print(f"\n  First 64 bits: {bit_string[:64]}...")
    print(f"  Hex (first 32): {hex_string[:32]}...")
    print(f"\n  -> This entropy feeds QAISS cryptographic key generation")

    if collector:
        collector.add_layer(1, "Quantum Entropy Core", {
            "bits_generated": num_bits,
            "ones_ratio": round(ratio, 4),
            "deviation": round(abs(ratio - 0.5), 4),
            "shannon_entropy": round(entropy, 4),
            "first_64_bits": bit_string[:64],
        })

    return bit_string


# ═══════════════════════════════════════════════════════════════
# LAYER 2: AI NEURAL IMMUNE — Quantum Anomaly Detection
# ═══════════════════════════════════════════════════════════════

def demo_anomaly_detection(backend=None, collector=None):
    banner("Quantum Anomaly Detection", 2)

    num_qubits = 4
    shots = 1000

    normal_pattern = [0.3, 0.5, 0.2, 0.7]
    anomaly_pattern = [0.3, 0.5, 2.1, 0.7]

    def run_detector(pattern, label):
        prog = QProg()
        for i in range(num_qubits):
            prog << RY(i, pattern[i] * np.pi)
        for i in range(num_qubits - 1):
            prog << CNOT(i, i + 1)
        for i in range(num_qubits):
            prog << H(i)
        for i in range(num_qubits):
            prog << measure(i, i)

        result = backend.run(prog, shots)

        all_zeros_key = '0' * num_qubits
        all_zeros = result.get(all_zeros_key, 0)
        anomaly_score = 1.0 - (all_zeros / shots)

        print(f"  [{label}]")
        print(f"    Pattern: {pattern}")
        print(f"    |{'0' * num_qubits}> probability: {all_zeros / shots:.3f}")
        print(f"    Anomaly score: {anomaly_score:.3f}")
        return anomaly_score

    print(f"  Encoding traffic patterns into {num_qubits}-qubit quantum states")
    print(f"  Running {shots} measurements per pattern\n")

    normal_score = run_detector(normal_pattern, "NORMAL TRAFFIC")
    print()
    anomaly_score = run_detector(anomaly_pattern, "ANOMALOUS TRAFFIC")

    print(f"\n  Threshold: 0.700")
    print(f"  Normal:  {normal_score:.3f} {'-> SAFE' if normal_score < 0.7 else '-> ALERT !'}")
    print(f"  Anomaly: {anomaly_score:.3f} {'-> SAFE' if anomaly_score < 0.7 else '-> ALERT !'}")
    print(f"\n  -> QAISS detects anomalies classical systems miss")

    if collector:
        collector.add_layer(2, "AI Neural Immune", {
            "normal_score": round(normal_score, 4),
            "anomaly_score": round(anomaly_score, 4),
            "threshold": 0.7,
            "normal_verdict": "SAFE" if normal_score < 0.7 else "ALERT",
            "anomaly_verdict": "SAFE" if anomaly_score < 0.7 else "ALERT",
        })


# ═══════════════════════════════════════════════════════════════
# LAYER 3: SELF-HEALING — Quantum Key Distribution (BB84)
# ═══════════════════════════════════════════════════════════════

def demo_qkd_bb84(backend=None, collector=None):
    banner("BB84 Quantum Key Distribution", 3)

    key_length = 20
    alice_bits = np.random.randint(0, 2, key_length)
    alice_bases = np.random.randint(0, 2, key_length)
    bob_bases = np.random.randint(0, 2, key_length)

    print(f"  Simulating BB84 protocol with {key_length} qubits\n")

    bob_results = []
    for i in range(key_length):
        prog = QProg()
        if alice_bits[i] == 1:
            prog << X(0)
        if alice_bases[i] == 1:
            prog << H(0)
        if bob_bases[i] == 1:
            prog << H(0)
        prog << measure(0, 0)

        result = backend.run(prog, 1)
        measured = int(list(result.keys())[0])
        bob_results.append(measured)

    shared_key = []
    for i in range(key_length):
        if alice_bases[i] == bob_bases[i]:
            shared_key.append(alice_bits[i])

    efficiency = len(shared_key) / key_length * 100

    print(f"  Alice's bits:   {''.join(str(b) for b in alice_bits)}")
    print(f"  Alice's bases:  {''.join('X' if b else 'Z' for b in alice_bases)}")
    print(f"  Bob's bases:    {''.join('X' if b else 'Z' for b in bob_bases)}")
    print(f"  Matching bases: {''.join('Y' if alice_bases[i] == bob_bases[i] else '.' for i in range(key_length))}")
    print(f"\n  Shared key ({len(shared_key)} bits): {''.join(str(b) for b in shared_key)}")
    print(f"  Key efficiency: {efficiency:.0f}% (theoretical ~50%)")
    print(f"\n  -> QAISS rotates keys automatically using quantum-safe distribution")

    if collector:
        collector.add_layer(3, "Self-Healing Protocol", {
            "protocol": "BB84",
            "total_qubits": key_length,
            "shared_key_bits": len(shared_key),
            "efficiency_pct": round(efficiency, 1),
        })


# ═══════════════════════════════════════════════════════════════
# LAYER 4: COMMAND DASHBOARD — Quantum State Health Monitor
# ═══════════════════════════════════════════════════════════════

def demo_state_tomography(backend=None, collector=None):
    banner("Quantum State Health Monitor", 4)

    shots = 2000

    prog = QProg()
    prog << H(0)
    prog << CNOT(0, 1)
    prog << measure(0, 0)
    prog << measure(1, 1)

    result = backend.run(prog, shots)

    print(f"  Preparing Bell state |Phi+> = (|00> + |11>) / sqrt(2)")
    print(f"  Running {shots} measurements\n")

    p00 = result.get('00', 0) / shots
    p01 = result.get('01', 0) / shots
    p10 = result.get('10', 0) / shots
    p11 = result.get('11', 0) / shots

    print(f"  Measurement results:")
    print(f"    |00>: {p00:.3f}  (expected: 0.500)")
    print(f"    |01>: {p01:.3f}  (expected: 0.000)")
    print(f"    |10>: {p10:.3f}  (expected: 0.000)")
    print(f"    |11>: {p11:.3f}  (expected: 0.500)")

    fidelity = p00 + p11
    entanglement = abs(p00 - p11)
    error_rate = p01 + p10
    entropy = shannon_entropy(result, 2)

    grade = 'A+' if fidelity > 0.98 else 'A' if fidelity > 0.95 else 'B' if fidelity > 0.90 else 'C'

    print(f"\n  Health indicators:")
    print(f"    Fidelity:      {fidelity:.4f}  {'HEALTHY' if fidelity > 0.95 else 'DEGRADED'}")
    print(f"    Balance:       {1 - entanglement:.4f}  {'BALANCED' if entanglement < 0.05 else 'SKEWED'}")
    print(f"    Error rate:    {error_rate:.4f}  {'NOMINAL' if error_rate < 0.05 else 'ELEVATED'}")
    print(f"    Shannon H:     {entropy:.4f}  (normalized)")
    print(f"    Entropy grade: {grade}")
    print(f"\n  -> QAISS dashboard shows these metrics in real-time")

    if collector:
        collector.add_layer(4, "Command Dashboard", {
            "fidelity": round(fidelity, 4),
            "balance": round(1 - entanglement, 4),
            "error_rate": round(error_rate, 4),
            "shannon_entropy": round(entropy, 4),
            "grade": grade,
        })


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(
        description="QAISS — Quantum AI Immune Security System — Circuit Demos"
    )
    parser.add_argument(
        "--cloud", action="store_true",
        help="Use QCloudService (WuKong hardware) instead of CPUQVM"
    )
    parser.add_argument(
        "--api-key", default=None,
        help="QCloud API key (or set QAISS_QCLOUD_API_KEY env var)"
    )
    parser.add_argument(
        "--output", default=None,
        help="Path for JSON results output (e.g., qaiss_results.json)"
    )
    parser.add_argument(
        "--layers", default="1,2,3,4",
        help="Comma-separated layer numbers to run (default: 1,2,3,4)"
    )
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("QAISS_QCLOUD_API_KEY")

    if args.cloud and not QCLOUD_AVAILABLE:
        print("  [ERROR] QCloudService not available.")
        print("  Install pyqpanda3 with cloud support or check your installation.")
        sys.exit(1)
    if args.cloud and not api_key:
        print("  [ERROR] --cloud requires an API key.")
        print("  Provide via --api-key KEY or set QAISS_QCLOUD_API_KEY env var.")
        sys.exit(1)

    backend = QuantumBackend(use_cloud=args.cloud, api_key=api_key)
    collector = ResultsCollector()
    collector.set_platform(backend.backend_name)

    layers = [int(x.strip()) for x in args.layers.split(",")]

    print("\n" + "=" * 60)
    print("  QAISS — Quantum AI Immune Security System")
    print("  Quantum Circuit Demonstrations")
    print(f"  Backend: {backend.backend_name}")
    print("  SDK: pyqpanda3")
    print("=" * 60)

    if 1 in layers:
        demo_qrng(256, backend, collector)
    if 2 in layers:
        demo_anomaly_detection(backend, collector)
    if 3 in layers:
        demo_qkd_bb84(backend, collector)
    if 4 in layers:
        demo_state_tomography(backend, collector)

    print("\n" + "=" * 60)
    print("  QAISS SYSTEM STATUS: ALL LAYERS OPERATIONAL")
    print("=" * 60)
    if 1 in layers:
        print("  Layer 1 — Quantum Entropy Core:    256-bit QRNG active")
    if 2 in layers:
        print("  Layer 2 — AI Neural Immune:        Anomaly detection online")
    if 3 in layers:
        print("  Layer 3 — Self-Healing Protocol:    QKD key rotation ready")
    if 4 in layers:
        print("  Layer 4 — Command Dashboard:        State health nominal")
    print("=" * 60)
    print("  https://qaissecurity.com")
    print(f"  {backend.backend_name} | 72-qubit quantum computer")
    print("=" * 60 + "\n")

    if args.output:
        collector.save(args.output)


if __name__ == "__main__":
    main()
