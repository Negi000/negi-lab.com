/* wiki-search.js : シンプル軽量全文検索 (日本語:バイグラム+英数字トークン) */
(function(global){
  const Search = {};
  const DEFAULT_FIELDS = [
    {name:'title', weight:5},
    {name:'tags', weight:3},
    {name:'body', weight:1}
  ];
  function normalize(str){
    return (str||'')
      .replace(/[\u3000]/g,' ') // 全角スペース
      .replace(/["'`]/g,'')
      .trim();
  }
  function tokenize(str){
    str = normalize(str).toLowerCase();
    if(!str) return [];
    const tokens = [];
    // 英数字/アンダースコア単語
    str.replace(/([a-z0-9_]{2,})/g,(m)=>{tokens.push(m);});
    // 日本語(ひら/カナ/漢字)部分をバイグラム化
    const jp = str.replace(/[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/gu,' ');
    jp.split(/\s+/).forEach(seg=>{
      if(seg.length===1){ tokens.push(seg); }
      else if(seg.length>1){
        for(let i=0;i<seg.length-1;i++) tokens.push(seg.slice(i,i+2));
      }
    });
    return tokens.filter(Boolean);
  }
  function buildIndex(docs, fields=DEFAULT_FIELDS){
    const inverted = Object.create(null);
    const docMeta = {};
    const N = docs.length;
    docs.forEach((doc,idx)=>{
      const id = doc.id!=null?doc.id:idx;
      docMeta[id] = {url:doc.url||'', title:doc.title||'', body:doc.body||'', tags:doc.tags||[]};
      const seenTokenDocs = {}; // df計算用
      fields.forEach(f=>{
        const value = Array.isArray(doc[f.name]) ? doc[f.name].join(' ') : (doc[f.name]||'');
        const weight = f.weight || 1;
        tokenize(value).forEach(tok=>{
          const bucket = inverted[tok] || (inverted[tok] = {df:0, postings:{}});
          const postings = bucket.postings;
            if(!postings[id]){ postings[id] = 0; }
            postings[id] += weight; // TFに相当
            if(!seenTokenDocs[tok]){ bucket.df++; seenTokenDocs[tok]=true; }
        });
      });
    });
    return {inverted, docMeta, docCount:N};
  }
  function search(index, query, limit=50){
    const qTokens = [...new Set(tokenize(query))];
    if(!qTokens.length) return [];
    const scores = {};
    qTokens.forEach(tok=>{
      const entry = index.inverted[tok];
      if(!entry) return;
      const idf = Math.log(1 + (index.docCount / (1 + entry.df)));
      for(const docId in entry.postings){
        const tf = entry.postings[docId];
        scores[docId] = (scores[docId]||0) + tf * idf;
      }
    });
    return Object.entries(scores)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,limit)
      .map(([docId,score])=>({id:docId,score, ...index.docMeta[docId]}));
  }
  function highlight(text, query){
    if(!text) return '';
    const toks = [...new Set(tokenize(query).filter(t=>t.length>1))];
    let escaped = text.replace(/[&<>]/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[s]));
    toks.forEach(t=>{
      const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'gi');
      escaped = escaped.replace(re, m=>`<mark>${m}</mark>`);
    });
    return escaped;
  }
  // 公開API
  Search.buildIndex = buildIndex;
  Search.search = search;
  Search.highlight = highlight;
  Search.tokenize = tokenize;
  global.WikiSearch = Search;
})(window);
