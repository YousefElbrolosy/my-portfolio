<template>
  <div id="feynman-console">

    <!-- bolts -->
    <img class="bolt-corner" src="/icons/console/bolt-up-left.svg" alt="" style="top:8px;left:8px;">
    <img class="bolt-corner" src="/icons/console/bolt-up-right.svg" alt="" style="top:8px;right:8px;">
    <img class="bolt-corner" src="/icons/console/bolt-down-left.svg" alt="" style="bottom:8px;left:8px;">
    <img class="bolt-corner" src="/icons/console/bolt-down-right.svg" alt="" style="bottom:8px;right:8px;">

    <!-- Diagram Screen -->
    <div id="diagram-screen">
      <canvas ref="diagramCanvas" :width="canvasW" :height="canvasH"></canvas>
      <div id="diagram-label" class="font-fira_retina">{{ currentLabel }}</div>
    </div>

    <!-- Right Panel -->
    <div id="feynman-menu">

      <!-- Header row: title + help toggle -->
      <div id="panel-header">
        <div class="font-fira_retina panel-title">
          <p>// feynman diagram</p>
          <p>// click to build</p>
        </div>
        <button id="help-toggle" @click="showHelp = !showHelp" :class="{ active: showHelp }">?</button>
      </div>

      <!-- Help panel (toggles in place) -->
      <div id="help-panel" v-if="showHelp">
        <p class="help-heading">Møller Scattering</p>
        <p>Two electrons exchange a virtual photon, mediating their electromagnetic repulsion. This is the lowest-order QED diagram for <em>e⁻e⁻ → e⁻e⁻</em>.</p>
        <p>Each step adds a Feynman rule term to the scattering amplitude <strong>M</strong>.</p>
        <div class="help-legend">
          <div class="legend-row"><span class="leg-fermion"></span><span>Fermion line</span></div>
          <div class="legend-row"><span class="leg-photon"></span><span>Virtual photon</span></div>
          <div class="legend-row"><span class="leg-dot"></span><span>Vertex (−ieγᵘ)</span></div>
        </div>
      </div>

      <!-- Equation box -->
      <div id="equation-panel" v-if="!showHelp">
        <p class="eq-section-label">// amplitude terms</p>
        <div id="equation-box" ref="equationBox">
          <div
            v-for="(eq, i) in visibleEquations"
            :key="i"
            class="eq-row"
            :class="{ 'eq-new': eq.isNew }"
          >
            <span class="eq-label">{{ eq.label }}</span>
            <span class="eq-math" v-html="eq.rendered"></span>
          </div>
          <div v-if="visibleEquations.length > 0 && step >= steps.length" id="total-line">
            <span class="eq-label">M =</span>
            <span class="eq-math eq-total" v-html="totalRendered"></span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div id="feynman-actions">
        <button
          v-if="step < steps.length"
          id="next-button"
          class="font-fira_retina"
          @click="nextStep"
        >
          {{ step === 0 ? 'start-diagram' : 'add-' + steps[step].shortName }}
        </button>
        <button
          v-if="step >= steps.length && !restarting"
          id="next-button"
          class="font-fira_retina"
          @click="restart"
          style="background-color:#43D9AD;color:#010C15;"
        >
          restart
        </button>
        <NuxtLink id="skip-btn" to="/about-me" class="font-fira_retina">
          skip
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvasW: 240,
      canvasH: 320,
      step: 0,
      restarting: false,
      showHelp: false,
      currentLabel: 'e\u207B e\u207B \u2192 e\u207B e\u207B',

      steps: [
        { shortName: 'incoming-e1', label: 'incoming e\u207B (1)', draw: 'incomingE1',
          equation: { label: '\u016B(p\u2081)', latex: '\\bar{u}(p_1)' } },
        { shortName: 'incoming-e2', label: 'incoming e\u207B (2)', draw: 'incomingE2',
          equation: { label: '\u016B(p\u2082)', latex: '\\bar{u}(p_2)' } },
        { shortName: 'vertex-1',    label: 'vertex 1: \u2212ie\u03B3\u1D58', draw: 'vertex1',
          equation: { label: '\xD7 vertex\u2081', latex: '(-ie\\gamma^\\mu)' } },
        { shortName: 'photon',      label: 'propagator: \u2212ig\u03BC\u03BD/q\u00B2', draw: 'photon',
          equation: { label: '\xD7 prop.', latex: '\\dfrac{-ig_{\\mu\\nu}}{q^2}' } },
        { shortName: 'vertex-2',    label: 'vertex 2: \u2212ie\u03B3\u1D5B', draw: 'vertex2',
          equation: { label: '\xD7 vertex\u2082', latex: '(-ie\\gamma^\\nu)' } },
        { shortName: 'outgoing-e1', label: 'outgoing e\u207B (1)', draw: 'outgoingE1',
          equation: { label: '\xD7 u(p\u2083)', latex: 'u(p_3)' } },
        { shortName: 'outgoing-e2', label: 'outgoing e\u207B (2)', draw: 'outgoingE2',
          equation: { label: '\xD7 u(p\u2084)', latex: 'u(p_4)' } },
      ],

      totalLatex: '-e^2 \\,\\frac{[\\bar{u}(p_3)\\,\\gamma^\\mu\\, u(p_1)]\\,g_{\\mu\\nu}\\,[\\bar{u}(p_4)\\,\\gamma^\\nu\\, u(p_2)]}{q^2}',
      totalRendered: '',
      visibleEquations: [],
      drawn: [],
    };
  },

  mounted() {
    this.renderCanvas();
    this.loadKatex();
  },

  methods: {
    async loadKatex() {
      if (window.katex) return;
      // Load KaTeX CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
      document.head.appendChild(link);
      // Load KaTeX JS (wait for it)
      await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
      // Pre-render total equation now that KaTeX is ready
      this.totalRendered = this.tex(this.totalLatex, true);
    },

    tex(latex, display = false) {
      if (!window.katex) return `<code>${latex}</code>`;
      return window.katex.renderToString(latex, {
        throwOnError: false,
        displayMode: display,
        output: 'html',
      });
    },

    nextStep() {
      if (this.step >= this.steps.length) return;
      const s = this.steps[this.step];
      this.drawn.push(s.draw);
      this.currentLabel = s.label;

      const eq = {
        label: s.equation.label,
        rendered: this.tex(s.equation.latex),
        isNew: true,
      };
      this.visibleEquations.push(eq);
      setTimeout(() => { eq.isNew = false; }, 600);

      // Render total if KaTeX is ready but totalRendered is still empty
      if (!this.totalRendered && window.katex) {
        this.totalRendered = this.tex(this.totalLatex, true);
      }

      this.step++;
      this.renderCanvas();

      if (this.step >= this.steps.length) {
        this.currentLabel = 'diagram complete \u2713';
      }
    },

    restart() {
      this.step = 0;
      this.drawn = [];
      this.visibleEquations = [];
      this.currentLabel = 'e\u207B e\u207B \u2192 e\u207B e\u207B';
      this.restarting = false;
      this.showHelp = false;
      this.renderCanvas();
    },

    renderCanvas() {
      const canvas = this.$refs.diagramCanvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const W = this.canvasW, H = this.canvasH;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(1,22,39,0.84)';
      ctx.fillRect(0, 0, W, H);

      // Grid dots
      ctx.fillStyle = 'rgba(67,217,173,0.08)';
      for (let x = 12; x < W; x += 20)
        for (let y = 12; y < H; y += 20) {
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
        }

      const GREEN = '#43D9AD', DIM = 'rgba(67,217,173,0.3)';
      const v1 = { x: W/2, y: H*0.38 }, v2 = { x: W/2, y: H*0.62 };
      const in1 = { x: 30, y: H*0.18 }, in2 = { x: 30, y: H*0.82 };
      const out1 = { x: W-30, y: H*0.18 }, out2 = { x: W-30, y: H*0.82 };
      const d = this.drawn;

      const fermion = (from, to, lbl, side='top') => {
        ctx.strokeStyle = GREEN; ctx.lineWidth = 2;
        ctx.shadowColor = GREEN; ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
        ctx.shadowBlur = 0;
        const mx=(from.x+to.x)/2, my=(from.y+to.y)/2;
        const a = Math.atan2(to.y-from.y, to.x-from.x), as=7;
        ctx.fillStyle = GREEN; ctx.beginPath();
        ctx.moveTo(mx+Math.cos(a)*as, my+Math.sin(a)*as);
        ctx.lineTo(mx+Math.cos(a+2.4)*as, my+Math.sin(a+2.4)*as);
        ctx.lineTo(mx+Math.cos(a-2.4)*as, my+Math.sin(a-2.4)*as);
        ctx.closePath(); ctx.fill();
        if (lbl) {
          ctx.fillStyle = GREEN; ctx.font = '11px monospace';
          ctx.fillText(lbl, mx+(side==='top'?-8:8), my+(side==='top'?-8:14));
        }
      };

      const photon = (from, to) => {
        ctx.strokeStyle = '#FEA55F'; ctx.lineWidth = 2;
        ctx.shadowColor = '#FEA55F'; ctx.shadowBlur = 8;
        ctx.beginPath();
        const dx=to.x-from.x, dy=to.y-from.y, len=Math.sqrt(dx*dx+dy*dy);
        for (let i=0; i<=80; i++) {
          const t=i/80, bx=from.x+dx*t, by=from.y+dy*t;
          const wave = Math.sin(t*Math.PI*14)*6;
          if (i===0) ctx.moveTo(bx+(-dy/len)*wave, by+(dx/len)*wave);
          else ctx.lineTo(bx+(-dy/len)*wave, by+(dx/len)*wave);
        }
        ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = '#FEA55F'; ctx.font = '11px monospace';
        ctx.fillText('\u03B3 (q)', W/2+10, (v1.y+v2.y)/2+4);
      };

      const vertex = (pt) => {
        ctx.shadowColor = GREEN; ctx.shadowBlur = 14;
        ctx.fillStyle = GREEN; ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
      };

      const dim = (from, to) => {
        ctx.strokeStyle = DIM; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
        ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y); ctx.stroke();
        ctx.setLineDash([]);
      };

      if (!d.includes('incomingE1')) dim(in1, v1);
      if (!d.includes('incomingE2')) dim(in2, v2);
      if (!d.includes('photon') && !d.includes('vertex1') && !d.includes('vertex2')) dim(v1, v2);
      if (!d.includes('outgoingE1')) dim(v1, out1);
      if (!d.includes('outgoingE2')) dim(v2, out2);

      if (d.includes('incomingE1')) fermion(in1, v1, 'p\u2081', 'top');
      if (d.includes('incomingE2')) fermion(in2, v2, 'p\u2082', 'bottom');
      if (d.includes('vertex1'))    vertex(v1);
      if (d.includes('photon'))     photon(v1, v2);
      if (d.includes('vertex2'))    vertex(v2);
      if (d.includes('outgoingE1')) fermion(v1, out1, 'p\u2083', 'top');
      if (d.includes('outgoingE2')) fermion(v2, out2, 'p\u2084', 'bottom');

      ctx.font = '10px monospace';
      if (d.includes('incomingE1') || d.includes('incomingE2')) {
        ctx.fillStyle = 'rgba(67,217,173,0.6)';
        ctx.fillText('e\u207B', 14, H*0.18+4); ctx.fillText('e\u207B', 14, H*0.82+4);
      }
      if (d.includes('outgoingE1') || d.includes('outgoingE2')) {
        ctx.fillStyle = 'rgba(67,217,173,0.6)';
        ctx.fillText('e\u207B', W-26, H*0.18+4); ctx.fillText('e\u207B', W-26, H*0.82+4);
      }
    },
  },
};
</script>

<style>
#feynman-console {
  width: 530px;
  height: 475px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, rgba(35,123,109,1), rgba(67,217,173,0.13));
  border-radius: 10px;
  padding: 30px;
  position: relative;
  box-sizing: border-box;
}

.bolt-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/* Diagram */
#diagram-screen {
  width: 240px;
  height: 410px;
  border-radius: 10px;
  background-color: rgba(1,22,39,0.84);
  box-shadow: inset 0 0 10px #00000071;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

#diagram-screen canvas {
  width: 100%;
  height: 100%;
}

#diagram-label {
  position: absolute;
  bottom: 8px;
  left: 0; right: 0;
  text-align: center;
  font-size: 10px;
  color: rgba(67,217,173,0.7);
  pointer-events: none;
}

/* Right panel */
#feynman-menu {
  height: 410px;
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Header: title + ? button side by side */
#panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
}

.panel-title p {
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  color: rgba(255,255,255,0.9);
  line-height: 1.5;
}

#help-toggle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid rgba(67,217,173,0.4);
  background: transparent;
  color: rgba(67,217,173,0.6);
  font-family: 'Fira Code', monospace;
  font-size: 11px;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

#help-toggle:hover,
#help-toggle.active {
  border-color: #43D9AD;
  color: #43D9AD;
  background: rgba(67,217,173,0.1);
}

/* Help panel — inline, not floating */
#help-panel {
  background: rgba(1,18,33,0.6);
  border: 1px solid rgba(67,217,173,0.2);
  border-radius: 8px;
  padding: 10px 12px;
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  line-height: 1.55;
  color: #607B96;
  flex: 1;
  overflow-y: auto;
}

.help-heading {
  color: #E5E9F0;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 6px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(67,217,173,0.2);
}

#help-panel p {
  margin-bottom: 7px;
}

#help-panel strong { color: #E5E9F0; }
#help-panel em     { color: #43D9AD; font-style: normal; }

.help-legend {
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px solid rgba(67,217,173,0.15);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #85a5c4;
}

.leg-fermion {
  display: inline-block;
  width: 22px; height: 2px;
  background: #43D9AD;
  box-shadow: 0 0 4px rgba(67,217,173,0.5);
  flex-shrink: 0;
}

.leg-photon {
  display: inline-block;
  width: 22px; height: 2px;
  background: repeating-linear-gradient(90deg,#FEA55F 0,#FEA55F 3px,transparent 3px,transparent 5px);
  flex-shrink: 0;
}

.leg-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #43D9AD;
  box-shadow: 0 0 5px rgba(67,217,173,0.6);
  flex-shrink: 0;
}

/* Equation panel */
#equation-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.eq-section-label {
  font-family: 'Fira Code', monospace;
  font-size: 10px;
  color: rgba(67,217,173,0.55);
  margin-bottom: 5px;
}

#equation-box {
  background: rgba(1,20,35,0.5);
  border: 1px solid rgba(67,217,173,0.15);
  border-radius: 8px;
  padding: 8px 10px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(67,217,173,0.25) transparent;
}

#equation-box::-webkit-scrollbar { width: 4px; display: block; }
#equation-box::-webkit-scrollbar-track { background: transparent; }
#equation-box::-webkit-scrollbar-thumb { background: rgba(67,217,173,0.25); border-radius: 2px; }

.eq-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 5px;
  opacity: 0;
  transform: translateX(-6px);
  animation: slideInEq 0.45s ease forwards;
}

@keyframes slideInEq {
  to { opacity: 1; transform: translateX(0); }
}

.eq-label {
  font-family: 'Fira Code', monospace;
  font-size: 9px;
  color: rgba(67,217,173,0.55);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 52px;
}

.eq-math {
  color: #E5E9F0;
  font-size: 12px;
}

/* KaTeX overrides for dark theme */
.eq-math .katex { color: #E5E9F0; font-size: 12px !important; }

#total-line {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(67,217,173,0.3);
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: slideInEq 0.6s ease forwards;
  opacity: 0;
}

#total-line .eq-label { font-size: 10px; color: rgba(67,217,173,0.7); }

.eq-total .katex { font-size: 11px !important; }
.eq-total .katex-display { margin: 4px 0 !important; }

/* Action buttons */
#feynman-actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 6px;
  margin-top: auto;
}

#next-button {
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid black;
  background-color: #FEA55F;
  color: black;
  cursor: pointer;
  font-size: 0.7rem;
  transition: background-color 0.15s;
  text-align: center;
}

#next-button:hover { background-color: rgb(255,178,119); }

#skip-btn {
  font-size: 12px;
  color: white;
  padding: 6px 14px;
  border: 1.5px solid rgba(255,255,255,0.6);
  border-radius: 7px;
  text-align: center;
  text-decoration: none;
}

#skip-btn:hover { background: rgba(255,255,255,0.1); }

/* Responsive */
@media (min-width: 1024px) and (max-width: 1536px) {
  #feynman-console { width: 420px; height: 380px; padding: 22px; }
  #diagram-screen  { width: 190px; height: 330px; }
  #feynman-menu    { height: 330px; width: 170px; }
  .panel-title p   { font-size: 10px; }
  #next-button     { font-size: 0.65rem; padding: 5px 10px; }
  #skip-btn        { font-size: 11px; padding: 5px 10px; }
}
</style>
