const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXByZXNhIjoiQVJNSUpPUyBUT1JSRVMgU0FOVElBR08gQUxFWEFOREVSIiwiaWQiOjI4NCwiaWF0IjoxNzk1NjE2OTE2LCJleHAiOjIxMTA5NzY5MTZ9.sKfvkMbqLTGmd-Zl58qm1TqxrxRzTcyxtSRZtMke76o";
const BASE = "https://apicedula.datecu.link/consulta-cedula/consulta/";

export const config = { path: "/api/cedula" };

const cabeceras = {
  "content-type": "application/json",
  "access-control-allow-origin": "*",
  "cache-control": "no-store"
};

export default async (req) => {
  const c = (new URL(req.url).searchParams.get("c") || "").trim();

  if(!/^\d{10}$/.test(c)){
    return new Response(JSON.stringify({ ok:false, error:"cedula_invalida" }), { status:400, headers:cabeceras });
  }

  try{
    const r = await fetch(BASE + c, { headers:{ Authorization: "Bearer " + TOKEN } });
    const crudo = await r.text();
    let j = null;
    try{ j = JSON.parse(crudo); }catch(e){}

    if(!r.ok || !j || !j.nombres){
      return new Response(JSON.stringify({ ok:false, status:r.status, crudo:crudo.slice(0,300) }), { status:200, headers:cabeceras });
    }
    return new Response(JSON.stringify({ ok:true, nombres:j.nombres }), { status:200, headers:cabeceras });
  }catch(e){
    return new Response(JSON.stringify({ ok:false, error:"fetch" }), { status:200, headers:cabeceras });
  }
};