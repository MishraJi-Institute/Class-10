/* GURUKUL STUDY LIBRARY — auto-discovers HTML PPTs from GitHub */
(function(){
  const OWNER = 'mishraji-institute';
  const REPO = 'Class-X';
  const BRANCH = 'main';
  const ROOT = 'ppts/';
  const API = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;
  const RAW = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/`;
  const PAGES = `https://${OWNER}.github.io/${REPO}/`;

  const grid = document.getElementById('dynamic-library');
  const filters = document.getElementById('subject-filters');
  const search = document.getElementById('library-search');
  const count = document.getElementById('library-count');
  if(!grid) return;

  const excluded = new Set(['index.html','home.html','presentation.html']);
  let items = [], activeSubject = 'All';

  function pretty(s){
    return s.replace(/\.html?$/i,'').replace(/[-_]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
  }
  function subjectOf(path){
    const parts = path.split('/');
    return parts.length > 2 ? pretty(parts[1]) : 'General';
  }
  function icon(subject){
    const s=subject.toLowerCase();
    if(s.includes('math')) return '∑';
    if(s.includes('computer') || s.includes('cs')) return '⌘';
    if(s.includes('science')) return '⚗';
    if(s.includes('english')) return 'Aa';
    if(s.includes('ai') || s.includes('artificial')) return 'AI';
    if(s.includes('physics')) return 'Φ';
    if(s.includes('chem')) return '⚛';
    return '▦';
  }
  function render(){
    const q=(search?.value||'').trim().toLowerCase();
    const visible=items.filter(x=>(activeSubject==='All'||x.subject===activeSubject)&&(!q||x.title.toLowerCase().includes(q)||x.subject.toLowerCase().includes(q)));
    grid.innerHTML = visible.length ? visible.map((x,i)=>`
      <a class="library-card" href="${PAGES + encodeURI(x.path)}" target="_blank" rel="noopener">
        <div class="library-icon">${icon(x.subject)}</div>
        <div class="library-meta"><span>${x.subject}</span><b>HTML PPT</b></div>
        <h3>${x.title}</h3>
        <p>${x.description || 'Interactive study presentation available in the school study library.'}</p>
        <div class="library-open">Open Presentation <span>↗</span></div>
      </a>`).join('') : `<div class="library-empty">No study material matches your search yet.</div>`;
    if(count) count.textContent=`${visible.length} material${visible.length===1?'':'s'} available`;
    document.dispatchEvent(new CustomEvent('library:rendered'));
  }
  function renderFilters(){
    const subjects=['All',...Array.from(new Set(items.map(x=>x.subject))).sort()];
    filters.innerHTML=subjects.map(s=>`<button class="filter-bar ${s===activeSubject?'active':''}" data-subject="${s}">${s}</button>`).join('');
    filters.querySelectorAll('.filter-bar').forEach(btn=>btn.addEventListener('click',()=>{activeSubject=btn.dataset.subject;renderFilters();render();}));
  }
  function fallback(){
    grid.innerHTML=`<div class="library-empty"><strong>Study library is loading.</strong><br>Upload HTML PPTs inside <code>ppts/Subject/</code> in GitHub and refresh this page.</div>`;
    if(count) count.textContent='Connects automatically to GitHub';
  }
  async function load(){
    try{
      const res=await fetch(API,{headers:{Accept:'application/vnd.github+json'}});
      if(!res.ok) throw new Error('GitHub API '+res.status);
      const data=await res.json();
      items=(data.tree||[]).filter(x=>x.type==='blob' && x.path.startsWith(ROOT) && /\.html?$/i.test(x.path))
        .map(x=>({path:x.path.replace(/^ppts\//,''),subject:subjectOf(x.path),title:pretty(x.path.split('/').pop()),description:''}))
        .filter(x=>!excluded.has(x.path.toLowerCase()))
        .map(x=>({...x,path:ROOT+x.path}));
      // Read small metadata from each PPT in parallel. Failures do not block the library.
      await Promise.all(items.map(async x=>{
        try{
          const r=await fetch(RAW+encodeURI(x.path));
          const html=await r.text();
          const doc=new DOMParser().parseFromString(html,'text/html');
          const meta=doc.querySelector('meta[name="description"]');
          x.title=doc.querySelector('title')?.textContent?.trim()||x.title;
          x.description=meta?.content?.trim()||'';
        }catch(e){}
      }));
      renderFilters();render();
    }catch(e){fallback();}
  }
  search?.addEventListener('input',render);
  load();
})();
