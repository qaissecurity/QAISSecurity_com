# QAISS — Quantum AI Immune Security System

> The first security system that doesn't just defend — it **evolves**.

A self-evolving digital immune system fusing quantum computing and AI, built on Origin Quantum's WuKong 72-qubit processor and the Origin Pilot OS.

**Version:** 2.0  
**Last Updated:** 2026-03-16

## Live Demo

**Website**: [qaissecurity.com](https://qaissecurity.com)

## What is QAISS?

QAISS is a 4-layer quantum security architecture:

| Layer | Function | Technology |
|-------|----------|------------|
| **Quantum Entropy Core** | True random number generation from quantum physics | WuKong 72-qubit, Hadamard + Measure |
| **AI Neural Immune** | Anomaly detection that learns what "normal" looks like | Quantum autoencoders, QGAN |
| **Self-Healing Protocol** | Automatic threat isolation and key rotation | BB84 QKD, ML-KEM, ML-DSA |
| **Command Dashboard** | Real-time visibility into system health | Bell state tomography, fidelity monitoring |

## Website Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage — 25+ sections, WebGL hero, 3D Explorer, Security Logs |
| `demo.html` | Live quantum circuit demos (pyqpanda3) |
| `technology.html` | Deep-dive into the 4-layer architecture |
| `resources.html` | Research articles, blog posts, whitepapers |
| `about.html` | Mission, vision, and architecture overview |
| `contact.html` | Contact form with EmailJS/Web3Forms integration |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of service |
| `blog.html` | 9 research articles with category filtering |
| `use-cases.html` | 15 industry use cases with quantum risk matrix |
| `faq.html` | Frequently asked questions |
| `404.html` | Custom error page with site navigation |

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, ES6 JavaScript
- **3D Engine:** Three.js r128 (Quantum Atom Explorer v2.0)
- **Quantum SDK:** pyqpanda3 (OriginQ)
- **PQC Standards:** NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA)
- **Fonts:** Outfit + JetBrains Mono (Google Fonts)
- **APIs:** EmailJS, Web3Forms, Google Analytics, Mailchimp, Crisp, reCAPTCHA
- **Hosting:** Netlify (static deployment)

## Features

- **3D Quantum Atom Explorer** — Interactive Three.js visualization with 4 electron orbits, pulsing nucleus, 3000 background stars, drag/zoom/touch controls
- **Interactive Security Logs Panel** — Real-time quantum security event monitoring with search, filters, and expandable details
- **Image Trail Gallery** — 7 quantum hardware photos with mouse-follow effect
- **25+ Homepage Sections** — Bento grid, entropy visualization, timeline, testimonials, newsletter
- **Responsive Design** — Mobile-first with hamburger navigation
- **PWA Support** — Web manifest for installable app experience
- **SEO Optimized** — Meta tags, Open Graph, Twitter Cards, JSON-LD, sitemap

## Quantum Demos

4 working quantum circuits in `quantum-demo/`:

1. **Quantum Random Number Generator** — Hadamard + Measure on 72 qubits
2. **AI Anomaly Detector** — Quantum autoencoder for pattern recognition
3. **BB84 Key Distribution** — Quantum key exchange simulation
4. **Bell State Fidelity** — Entanglement quality measurement

## Deployment

### Netlify (Recommended)
1. Unzip `QAISS-Deploy-Ready.zip`
2. Drag folder to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Set custom domain: `qaissecurity.com`

### GitHub
```bash
git init
git add .
git commit -m "QAISS v2.0 — Complete quantum security platform"
git remote add origin https://github.com/Qaissecurity/qaissecurity.github.io.git
git push -u origin main
```

## API Configuration

All services are opt-in. Edit `js/config.js` to add your API keys. See `API-SETUP-GUIDE.md` for detailed instructions.

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| Google Analytics (GA4) | Traffic analytics | Unlimited |
| EmailJS | Contact form emails | 200/month |
| Web3Forms | Contact form backup | 250/month |
| Mailchimp | Newsletter signup | 500 contacts |
| reCAPTCHA v3 | Spam protection | Unlimited |
| Crisp | Live chat widget | 1 seat |

## Contact

- **Email:** contact@qaissecurity.com
- **Phone/WhatsApp:** +40 736 469 828
- **GitHub:** [github.com/Qaissecurity](https://github.com/Qaissecurity)
- **Twitter:** [@Qaissecurity](https://x.com/Qaissecurity)
- **OriginQ:** qcloud@originqc.com

## License

MIT License — See [LICENSE](LICENSE) for details.

---

*Built with quantum intention. Defended by evolution.*
