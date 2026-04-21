'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { useInView } from 'motion/react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLORS = ['#FF6B35','#7B2D8E','#1A936F','#C5283D','#3498db','#9b59b6','#27ae60','#f39c12','#004E89','#E9724C'];

const ALL_NODES = [
  { uuid:'n1',  name:'Policy Makers',   labels:['PolicyMaker','Entity']          },
  { uuid:'n2',  name:'AI Ethics',       labels:['Entity']                         },
  { uuid:'n3',  name:'Security Agency', labels:['SecurityAgency','Entity']        },
  { uuid:'n4',  name:'Government',      labels:['Entity']                         },
  { uuid:'n5',  name:'Patients',        labels:['Patient','Entity']               },
  { uuid:'n6',  name:'Doctors',         labels:['Doctor','Entity']                },
  { uuid:'n7',  name:'Financial Inst.', labels:['Entity']                         },
  { uuid:'n8',  name:'Banks',           labels:['Bank','Entity']                  },
  { uuid:'n9',  name:'AI Model',        labels:['Entity']                         },
  { uuid:'n10', name:'Hospital Admin',  labels:['HospitalAdministrator','Entity'] },
  { uuid:'n11', name:'Finance',         labels:['Entity']                         },
  { uuid:'n12', name:'Retail Investor', labels:['RetailInvestor','Entity']        },
  { uuid:'n13', name:'Total AI',        labels:['Entity']                         },
  { uuid:'n14', name:'Misdiagnosis',    labels:['Entity']                         },
];

const ALL_EDGES = [
  { uuid:'e1',  s:'n1',  t:'n2',  name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e2',  s:'n2',  t:'n3',  name:'AFFECTED_BY_CHANGE'     },
  { uuid:'e3',  s:'n2',  t:'n4',  name:'AFFECTED_BY_DOMAIN'     },
  { uuid:'e4',  s:'n2',  t:'n1',  name:'INTERACTS_WITH'         },
  { uuid:'e5',  s:'n4',  t:'n5',  name:'OCCURS_IN_SYSTEM_OF'    },
  { uuid:'e6',  s:'n3',  t:'n13', name:'OCCURS_IN_SYSTEM_OF'    },
  { uuid:'e7',  s:'n10', t:'n5',  name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e8',  s:'n5',  t:'n6',  name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e9',  s:'n7',  t:'n9',  name:'POSSESSES_CONSTRAINT'   },
  { uuid:'e10', s:'n9',  t:'n8',  name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e11', s:'n9',  t:'n11', name:'DERIVES_ON'             },
  { uuid:'e12', s:'n9',  t:'n10', name:'DERIVES_ON'             },
  { uuid:'e13', s:'n8',  t:'n12', name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e14', s:'n13', t:'n4',  name:'OCCURS_IN_SYSTEM_OF'    },
  { uuid:'e15', s:'n13', t:'n14', name:'POSSESSES_CONSTRAINT'   },
  { uuid:'e16', s:'n1',  t:'n14', name:'CAUSED_BY'              },
  { uuid:'e17', s:'n7',  t:'n8',  name:'PARTICIPATES_IN_DOMAIN' },
  { uuid:'e18', s:'n6',  t:'n9',  name:'CONSULTS_WITH'          },
  { uuid:'e19', s:'n4',  t:'n7',  name:'REGULATES'              },
  { uuid:'e20', s:'n11', t:'n12', name:'INFLUENCES'             },
];

const typeColorMap: Record<string, string> = {};
let _ci = 0;
ALL_NODES.forEach(n => {
  const t = n.labels.find(l => l !== 'Entity') || 'Entity';
  if (!typeColorMap[t]) typeColorMap[t] = COLORS[_ci++ % COLORS.length];
});
const getColor = (type: string) => typeColorMap[type] ?? '#999';
const getType  = (labels: string[]) => labels.find(l => l !== 'Entity') || 'Entity';

// Build curvature-aware edge objects from raw string-ID edges
function buildEdgeObjects(rawEdges: typeof ALL_EDGES) {
  const pairCount: Record<string,number> = {};
  rawEdges.forEach(e => {
    if (e.s === e.t) return;
    const k = [e.s,e.t].sort().join('_');
    pairCount[k] = (pairCount[k]||0)+1;
  });
  const pairIdx: Record<string,number> = {};
  return rawEdges
    .filter(e => e.s !== e.t)
    .map(e => {
      const k = [e.s,e.t].sort().join('_');
      const total = pairCount[k];
      const idx = pairIdx[k]||0; pairIdx[k] = idx+1;
      let curvature = 0;
      if (total > 1) {
        const range = Math.min(1.2, 0.6+total*0.15);
        curvature = ((idx/(total-1))-0.5)*range*2;
        if (e.s>e.t) curvature = -curvature;
      }
      return { source:e.s, target:e.t, name:e.name, curvature, pairTotal:total };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export const NeuralNetwork: React.FC<{ className?: string }> = ({ className }) => {
  const svgRef      = useRef<SVGSVGElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const simRef      = useRef<d3.Simulation<any,any> | null>(null);
  const linkGroupRef= useRef<d3.Selection<SVGGElement,unknown,null,undefined>|null>(null);
  const nodeGroupRef= useRef<d3.Selection<SVGGElement,unknown,null,undefined>|null>(null);

  // Live data arrays — D3 simulation mutates node objects in-place (adds x,y,vx,vy)
  const d3NodesRef   = useRef<any[]>([]);
  const rawEdgesRef  = useRef<(typeof ALL_EDGES[0])[]>([]);
  const nodeIdxRef   = useRef(0);

  const [showEdgeLabels, setShowEdgeLabels] = useState(true);
  const showLabelsRef = useRef(true);

  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const isInView = useInView(wrapRef, { margin:'400px' });
  const inViewRef = useRef(isInView);
  inViewRef.current = isInView;

  // ── Path math ──────────────────────────────────────────────────────────────
  const getLinkPath = (d: any) => {
    const sx=d.source.x||0, sy=d.source.y||0, tx=d.target.x||0, ty=d.target.y||0;
    if (d.curvature === 0) return `M${sx},${sy} L${tx},${ty}`;
    const dx=tx-sx, dy=ty-sy, dist=Math.sqrt(dx*dx+dy*dy)||1;
    const base=Math.max(35,dist*(0.25+(d.pairTotal||1)*0.05));
    const cx=(sx+tx)/2+(-dy/dist)*d.curvature*base;
    const cy=(sy+ty)/2+( dx/dist)*d.curvature*base;
    return `M${sx},${sy} Q${cx},${cy} ${tx},${ty}`;
  };

  const getLinkMid = (d: any) => {
    const sx=d.source.x||0, sy=d.source.y||0, tx=d.target.x||0, ty=d.target.y||0;
    if (d.curvature===0) return {x:(sx+tx)/2, y:(sy+ty)/2};
    const dx=tx-sx, dy=ty-sy, dist=Math.sqrt(dx*dx+dy*dy)||1;
    const base=Math.max(35,dist*(0.25+(d.pairTotal||1)*0.05));
    const cxP=(sx+tx)/2+(-dy/dist)*d.curvature*base;
    const cyP=(sy+ty)/2+( dx/dist)*d.curvature*base;
    return {x:0.25*sx+0.5*cxP+0.25*tx, y:0.25*sy+0.5*cyP+0.25*ty};
  };

  // ── Incremental DOM update — NEVER wipes the SVG ──────────────────────────
  const updateDOM = useCallback(() => {
    const lg = linkGroupRef.current;
    const ng = nodeGroupRef.current;
    if (!lg || !ng) return;

    const edgeObjects = buildEdgeObjects(rawEdgesRef.current);

    // ── Links ──────────────────────────────────────────────────────────────
    const paths = lg.selectAll<SVGPathElement,any>('path.edge')
      .data(edgeObjects, (d:any) => `${d.source}-${d.target}-${d.name}`);

    paths.enter().append('path')
      .attr('class','edge')
      .attr('stroke','#C0C0C0').attr('stroke-width',1.5)
      .attr('fill','none').attr('marker-end','url(#arrow-nn)')
      .style('opacity',0)
      .call(s => s.transition().duration(400).style('opacity',1));

    paths.exit().transition().duration(300).style('opacity',0).remove();

    // Label backgrounds
    const bgs = lg.selectAll<SVGRectElement,any>('rect.edge-bg')
      .data(edgeObjects, (d:any) => `bg-${d.source}-${d.target}-${d.name}`);

    bgs.enter().append('rect')
      .attr('class','edge-bg')
      .attr('fill','rgba(255,255,255,0.95)').attr('rx',3).attr('ry',3)
      .style('pointer-events','none')
      .style('display', showLabelsRef.current ? 'block':'none')
      .style('opacity',0)
      .call(s => s.transition().duration(400).style('opacity',1));

    bgs.exit().remove();

    // Label text
    const labels = lg.selectAll<SVGTextElement,any>('text.edge-label')
      .data(edgeObjects, (d:any) => `lbl-${d.source}-${d.target}-${d.name}`);

    labels.enter().append('text')
      .attr('class','edge-label')
      .text((d:any) => d.name)
      .attr('font-size','9px').attr('fill','#666')
      .attr('text-anchor','middle').attr('dominant-baseline','middle')
      .style('font-family','system-ui,sans-serif').style('pointer-events','none')
      .style('display', showLabelsRef.current ? 'block':'none')
      .style('opacity',0)
      .call(s => s.transition().duration(400).style('opacity',1));

    labels.exit().remove();

    // ── Nodes ──────────────────────────────────────────────────────────────
    const circles = ng.selectAll<SVGCircleElement,any>('circle.node')
      .data(d3NodesRef.current, (d:any) => d.id);

    circles.enter().append('circle')
      .attr('class','node')
      .attr('r', 0)
      .attr('fill', (d:any) => getColor(d.type))
      .attr('stroke','#fff').attr('stroke-width',2.5)
      .style('cursor','pointer')
      .call(s => s.transition().duration(350).attr('r',10))
      .call(d3.drag<SVGCircleElement,any>()
        .on('start',(ev,d)=>{ d.fx=d.x; d.fy=d.y; d._sx=ev.x; d._sy=ev.y; d._drag=false; })
        .on('drag', (ev,d)=>{
          if (!d._drag && Math.hypot(ev.x-d._sx,ev.y-d._sy)>3) {
            d._drag=true; simRef.current?.alphaTarget(0.3).restart();
          }
          if (d._drag) { d.fx=ev.x; d.fy=ev.y; }
        })
        .on('end', (_,d)=>{ if(d._drag) simRef.current?.alphaTarget(0); d.fx=null; d.fy=null; d._drag=false; })
      )
      .on('mouseenter', ev=>d3.select(ev.currentTarget).attr('stroke','#333').attr('stroke-width',3))
      .on('mouseleave', ev=>d3.select(ev.currentTarget).attr('stroke','#fff').attr('stroke-width',2.5));

    circles.exit().transition().duration(300).attr('r',0).remove();

    // Node labels
    const nlabels = ng.selectAll<SVGTextElement,any>('text.node-label')
      .data(d3NodesRef.current, (d:any) => d.id);

    nlabels.enter().append('text')
      .attr('class','node-label')
      .text((d:any) => d.name.length>9 ? d.name.substring(0,9)+'…' : d.name)
      .attr('font-size','11px').attr('fill','#333').attr('font-weight','500')
      .attr('dx',14).attr('dy',4)
      .style('pointer-events','none').style('font-family','system-ui,sans-serif')
      .style('opacity',0)
      .call(s => s.transition().duration(400).style('opacity',1));

    nlabels.exit().remove();

    // ── Feed updated data into simulation (no SVG wipe!) ───────────────────
    const sim = simRef.current;
    if (!sim) return;

    sim.nodes(d3NodesRef.current);
    (sim.force('link') as d3.ForceLink<any,any>).links(edgeObjects);
    sim.alpha(0.5).restart();

    // Update tick to use current selections
    sim.on('tick', () => {
      lg.selectAll<SVGPathElement,any>('path.edge').attr('d', getLinkPath);

      lg.selectAll<SVGTextElement,any>('text.edge-label').each(function(d) {
        const m = getLinkMid(d);
        d3.select(this).attr('x',m.x).attr('y',m.y);
      });

      lg.selectAll<SVGRectElement,any>('rect.edge-bg').each(function(d,i) {
        const m = getLinkMid(d);
        const lblNodes = lg.selectAll<SVGTextElement,any>('text.edge-label').nodes();
        const el = lblNodes[i] as SVGTextElement|undefined;
        if (!el) return;
        try {
          const bb = el.getBBox();
          d3.select(this)
            .attr('x',m.x-bb.width/2-4).attr('y',m.y-bb.height/2-2)
            .attr('width',bb.width+8).attr('height',bb.height+4);
        } catch {}
      });

      ng.selectAll<SVGCircleElement,any>('circle.node').attr('cx',(d:any)=>d.x).attr('cy',(d:any)=>d.y);
      ng.selectAll<SVGTextElement,any>('text.node-label').attr('x',(d:any)=>d.x).attr('y',(d:any)=>d.y);
    });
  }, []);

  // ── Step: add 2 nodes + all newly eligible edges, then cycle forever ─────────
  const step = useCallback(() => {
    if (!inViewRef.current) return;

    const idx = nodeIdxRef.current;
    const W = wrapRef.current?.clientWidth || 800;
    const H = wrapRef.current?.clientHeight || 600;

    // ── PHASE 1: Build phase — add nodes until pool exhausted ─────────────
    if (idx < ALL_NODES.length) {
      // Add up to 2 new nodes per tick
      let added = 0;
      while (added < 2 && nodeIdxRef.current < ALL_NODES.length) {
        const n = ALL_NODES[nodeIdxRef.current];
        d3NodesRef.current.push({
          id:   n.uuid,
          name: n.name,
          type: getType(n.labels),
          x: W/2 + (Math.random()-0.5)*80,
          y: H/2 + (Math.random()-0.5)*80,
        });
        nodeIdxRef.current++;
        added++;
      }

      // Add all edges whose endpoints now exist
      const nodeSet = new Set(d3NodesRef.current.map((n:any)=>n.id));
      const activeUuids = new Set(rawEdgesRef.current.map(e=>e.uuid));
      ALL_EDGES.forEach(e => {
        if (!activeUuids.has(e.uuid) && nodeSet.has(e.s) && nodeSet.has(e.t)) {
          rawEdgesRef.current.push(e);
        }
      });

      updateDOM();
      return;
    }

    // ── PHASE 2: Cycle phase — swap edges & nudge nodes forever ───────────
    // 1. Remove 1–2 random edges from the active pool
    const removeCount = Math.floor(Math.random() * 2) + 1;
    const removedEdges: (typeof ALL_EDGES[0])[] = [];
    for (let i = 0; i < removeCount && rawEdgesRef.current.length > 6; i++) {
      const removeIdx = Math.floor(Math.random() * rawEdgesRef.current.length);
      removedEdges.push(...rawEdgesRef.current.splice(removeIdx, 1));
    }

    // 2. Add 1–2 different edges from the full pool (rotate through them)
    const activeUuids = new Set(rawEdgesRef.current.map(e=>e.uuid));
    const candidates = ALL_EDGES.filter(e => !activeUuids.has(e.uuid));
    const addCount = Math.min(candidates.length, removeCount + 1);
    for (let i = 0; i < addCount; i++) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      if (pick && !rawEdgesRef.current.find(e=>e.uuid===pick.uuid)) {
        rawEdgesRef.current.push(pick);
        candidates.splice(candidates.indexOf(pick), 1);
      }
    }

    // 3. Nudge 1 random node slightly to trigger physics re-settlement
    const target = d3NodesRef.current[Math.floor(Math.random() * d3NodesRef.current.length)];
    if (target) {
      target.x += (Math.random()-0.5)*60;
      target.y += (Math.random()-0.5)*60;
      target.vx = (Math.random()-0.5)*4;
      target.vy = (Math.random()-0.5)*4;
    }

    // 4. Re-render incrementally + reheat simulation
    updateDOM();
  }, [updateDOM]);

  // Toggle labels without re-render
  const toggleLabels = useCallback(() => {
    setShowEdgeLabels(v => {
      const next = !v;
      showLabelsRef.current = next;
      const lg = linkGroupRef.current;
      if (lg) {
        lg.selectAll('text.edge-label').style('display', next?'block':'none');
        lg.selectAll('rect.edge-bg').style('display',  next?'block':'none');
      }
      return next;
    });
  }, []);

  // ── Mount: build SVG scaffold ONCE ─────────────────────────────────────────
  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap  = wrapRef.current;
    if (!svgEl || !wrap) return;

    const W = wrap.clientWidth;
    const H = wrap.clientHeight;

    const svg = d3.select(svgEl).attr('width',W).attr('height',H).attr('viewBox',`0 0 ${W} ${H}`);
    svg.selectAll('*').remove();

    // Arrowhead — created once, never recreated
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id','arrow-nn').attr('viewBox','0 -5 10 10')
      .attr('refX',18).attr('refY',0)
      .attr('markerWidth',6).attr('markerHeight',6).attr('orient','auto')
      .append('path').attr('d','M0,-5L10,0L0,5').attr('fill','#C0C0C0');

    const g = svg.append('g');
    linkGroupRef.current = g.append('g').attr('class','links') as any;
    nodeGroupRef.current = g.append('g').attr('class','nodes') as any;

    svg.call(
      d3.zoom<SVGSVGElement,unknown>()
        .extent([[0,0],[W,H]]).scaleExtent([0.1,4])
        .on('zoom', ev => g.attr('transform', ev.transform))
    );

    // Simulation — persists for the lifetime of the component
    const simulation = d3.forceSimulation([])
      .force('link',    d3.forceLink([]).id((d:any)=>d.id).distance(155))
      .force('charge',  d3.forceManyBody().strength(-380))
      .force('center',  d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(52))
      .force('x',       d3.forceX(W/2).strength(0.04))
      .force('y',       d3.forceY(H/2).strength(0.04))
      .alphaDecay(0.025);   // slightly slower decay = longer natural motion

    simRef.current = simulation;

    // Seed with first 8 nodes (medium quantity from the start)
    const SEED_COUNT = 8;
    ALL_NODES.slice(0, SEED_COUNT).forEach(n => {
      d3NodesRef.current.push({
        id:   n.uuid, name: n.name, type: getType(n.labels),
        x: W/2+(Math.random()-0.5)*200,
        y: H/2+(Math.random()-0.5)*200,
      });
    });
    nodeIdxRef.current = SEED_COUNT;

    const seedSet = new Set(d3NodesRef.current.map((n:any)=>n.id));
    ALL_EDGES.forEach(e => {
      if (seedSet.has(e.s) && seedSet.has(e.t)) rawEdgesRef.current.push(e);
    });

    updateDOM();

    // Interval: 2 new nodes every 1.2s
    timerRef.current = setInterval(step, 1200);

    const onResize = () => {
      const nW = wrap.clientWidth, nH = wrap.clientHeight;
      svg.attr('width',nW).attr('height',nH).attr('viewBox',`0 0 ${nW} ${nH}`);
      simulation
        .force('center', d3.forceCenter(nW/2,nH/2))
        .force('x', d3.forceX(nW/2).strength(0.04))
        .force('y', d3.forceY(nH/2).strength(0.04))
        .alpha(0.3).restart();
    };
    window.addEventListener('resize', onResize);

    return () => {
      simulation.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [updateDOM, step]);

  // Pause/resume when scrolled off-screen
  useEffect(() => {
    if (isInView) {
      simRef.current?.alpha(0.2).restart();
      if (!timerRef.current) timerRef.current = setInterval(step, 1200);
    } else {
      simRef.current?.stop();
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
  }, [isInView, step]);

  const legendItems = Object.entries(typeColorMap).map(([name,color])=>({name,color}));

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position:'relative', overflow:'hidden',
        background:'#FAFAFA',
        backgroundImage:'radial-gradient(#D0D0D0 1.5px, transparent 1.5px)',
        backgroundSize:'24px 24px',
      }}
    >
      <svg ref={svgRef} style={{width:'100%',height:'100%'}} />

      {/* Legend — bottom-left */}
      <div style={{
        position:'absolute',bottom:14,left:14,zIndex:10,
        background:'rgba(255,255,255,0.96)',borderRadius:8,padding:'8px 14px',
        boxShadow:'0 1px 6px rgba(0,0,0,0.10)',fontSize:11,
        fontFamily:'system-ui,sans-serif',border:'1px solid #e5e7eb',
      }}>
        <div style={{fontWeight:700,marginBottom:6,color:'#374151',textTransform:'uppercase',letterSpacing:'0.05em',fontSize:10}}>
          Entity Types
        </div>
        {legendItems.map(({name,color})=>(
          <div key={name} style={{display:'flex',alignItems:'center',gap:6,marginBottom:3}}>
            <span style={{width:10,height:10,borderRadius:'50%',background:color,display:'inline-block',flexShrink:0}}/>
            <span style={{color:'#4b5563'}}>{name}</span>
          </div>
        ))}
      </div>

      {/* Edge Labels toggle — top-right */}
      <div
        style={{
          position:'absolute',top:14,right:14,zIndex:10,
          display:'flex',alignItems:'center',gap:8,
          background:'rgba(255,255,255,0.96)',borderRadius:8,padding:'6px 12px',
          boxShadow:'0 1px 6px rgba(0,0,0,0.10)',border:'1px solid #e5e7eb',
          fontFamily:'system-ui,sans-serif',fontSize:12,color:'#374151',
          cursor:'pointer',userSelect:'none',
        }}
        onClick={toggleLabels}
      >
        <div style={{width:36,height:20,borderRadius:10,background:showEdgeLabels?'#3b82f6':'#d1d5db',position:'relative',transition:'background 0.2s'}}>
          <div style={{width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:2,left:showEdgeLabels?18:2,transition:'left 0.2s',boxShadow:'0 1px 3px rgba(0,0,0,0.2)'}}/>
        </div>
        <span>Show Edge Labels</span>
      </div>
    </div>
  );
};
