// ============================================================
// QAISS Quantum Proxy — Netlify Serverless Function
// Proxies requests to OriginQ Cloud API (avoids CORS)
// ============================================================

// Node 18+ has global fetch; for Node 16, use dynamic import fallback
const _fetch = typeof globalThis.fetch === 'function' ? globalThis.fetch : (...args) => import('node-fetch').then(m => m.default(...args));

const ORIGINQ_ENDPOINT = process.env.ORIGINQ_ENDPOINT || 'https://qcloud.originqc.com.cn';
const ORIGINQ_API_KEY = process.env.ORIGINQ_API_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({error: 'Method not allowed'}) };
  }

  try {
    const body = JSON.parse(event.body);
    const { circuit, shots, qubits, gates } = body;

    if (!ORIGINQ_API_KEY) {
      // No API key — return simulated result
      return {
        statusCode: 200, headers,
        body: JSON.stringify(simulateQuantumResult(qubits, shots))
      };
    }

    // Build pyqpanda3-compatible circuit description
    const circuitPayload = {
      qMachineType: 'real',
      shots: shots || 1000,
      qubitCount: qubits || 20,
      circuit: buildCircuitString(gates, qubits)
    };

    // Submit to OriginQ Cloud
    const response = await _fetch(`${ORIGINQ_ENDPOINT}/api/taskApi/submitTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ORIGINQ_API_KEY}`
      },
      body: JSON.stringify(circuitPayload)
    });

    if (!response.ok) {
      console.error('OriginQ API error:', response.status);
      return {
        statusCode: 200, headers,
        body: JSON.stringify(simulateQuantumResult(qubits, shots))
      };
    }

    const result = await response.json();

    // Parse OriginQ response into our format
    const parsed = parseOriginQResult(result, qubits, shots);

    return {
      statusCode: 200, headers,
      body: JSON.stringify(parsed)
    };

  } catch (err) {
    console.error('Quantum proxy error:', err);
    const fallback = simulateQuantumResult(20, 1000);
    await logQuantumExecution('qrng', 20, 1000, fallback.entropy, fallback.source, fallback);
    return {
      statusCode: 200, headers,
      body: JSON.stringify(fallback)
    };
  }
};

// Log execution to Supabase
async function logQuantumExecution(circuitType, qubits, shots, entropy, source, results) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return;
  try {
    await _fetch(`${SUPABASE_URL}/rest/v1/quantum_executions`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        circuit_type: circuitType,
        qubits: qubits,
        shots: shots,
        entropy: entropy,
        source: source,
        results: {counts_summary: Object.keys(results.counts || {}).length + ' states'}
      })
    });
  } catch(e) { /* silent */ }
}

function buildCircuitString(gates, qubits) {
  if (!gates || !Array.isArray(gates)) return `QINIT ${qubits || 1}\nCREG ${qubits || 1}\n`;
  let qasm = `QINIT ${qubits}\nCREG ${qubits}\n`;
  gates.forEach(g => {
    if (g.gate === 'H') qasm += `H q[${g.target}]\n`;
    else if (g.gate === 'CNOT') qasm += `CNOT q[${g.control}],q[${g.target}]\n`;
    else if (g.gate === 'RY') qasm += `RY q[${g.target}],(${g.angle})\n`;
    else if (g.gate === 'I') qasm += `I q[${g.target}]\n`;
    else if (g.gate === 'MEASURE') qasm += `MEASURE q[${g.target}],c[${g.target}]\n`;
  });
  return qasm;
}

function parseOriginQResult(result, qubits, shots) {
  const counts = result.result || result.counts || {};
  let entropy = 0;
  const total = shots;

  for (const k in counts) {
    const p = counts[k] / total;
    if (p > 0) entropy -= p * Math.log2(p);
  }

  return {
    counts,
    shots,
    entropy,
    maxEntropy: qubits,
    entropyRatio: entropy / qubits,
    source: 'wukong',
    timestamp: Date.now(),
    taskId: result.taskId || null
  };
}

function simulateQuantumResult(qubits, shots) {
  qubits = qubits || 20;
  shots = shots || 1000;
  const counts = {};

  for (let s = 0; s < shots; s++) {
    let bits = '';
    for (let q = 0; q < qubits; q++) {
      bits += Math.random() > 0.5 ? '1' : '0';
    }
    counts[bits] = (counts[bits] || 0) + 1;
  }

  let entropy = 0;
  for (const k in counts) {
    const p = counts[k] / shots;
    if (p > 0) entropy -= p * Math.log2(p);
  }

  return {
    counts,
    shots,
    entropy,
    maxEntropy: qubits,
    entropyRatio: entropy / qubits,
    source: 'simulation',
    timestamp: Date.now()
  };
}
