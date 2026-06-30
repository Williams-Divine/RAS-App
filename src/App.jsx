import { useState, useEffect, useRef } from "react";
import {
  Home, User, Bell, AlertTriangle, Shield, MapPin, Navigation,
  Phone, Check, X, Mic, MicOff, Clock, ArrowLeft, Map, Activity,
  Eye, EyeOff, MessageSquare, Users, HelpCircle, FileText,
  AlertCircle, CheckCircle, Flag, ChevronRight, Globe, Smartphone,
  Volume2, Heart, ChevronDown, Moon, Sun, Megaphone, PhoneCall, Radio
} from "lucide-react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;width:100%;overflow-x:hidden;}
  #root{width:100%;overflow-x:hidden;}
  button,input,textarea,select{font-family:inherit;-webkit-appearance:none;max-width:100%;}
  input:focus,textarea:focus{outline:none}
  ::-webkit-scrollbar{display:none}
  img,svg{max-width:100%;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes alertIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
  @keyframes dot{0%,60%,100%{opacity:.2;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}
  @keyframes glow{0%,100%{box-shadow:0 0 14px rgba(181,44,31,.3)}50%{box-shadow:0 0 30px rgba(181,44,31,.65)}}
  @keyframes bannerPulse{0%,100%{opacity:1}50%{opacity:.88}}
  @keyframes depPulse{0%,100%{opacity:.9}50%{opacity:.4}}
`;

const LIGHT = {
  bg:"#F7FAFD", bgCard:"#FFFFFF", bgMuted:"#EEF3F8", bgInput:"#FFFFFF",
  primary:"#1A5E8C", primaryL:"#E3EFF8", primaryBtn:"#1A5E8C", primaryBtnTx:"#FFFFFF",
  safe:"#1B7240", safeBg:"rgba(27,114,64,0.09)",
  warn:"#A36C00", warnBg:"rgba(163,108,0,0.09)",
  danger:"#B52C1F", dangerBg:"rgba(181,44,31,0.09)",
  dep:"#6D28D9", depBg:"rgba(109,40,217,0.07)",
  sos:"#B52C1F",
  bdr:"#DDE6EF", bdrMid:"#BCCEDD",
  tx:"#1A2630", txs:"#5C6D7A", txm:"#9AAAB8",
  isDark:false,
};
const DARK = {
  bg:"#0A0A0A", bgCard:"#141414", bgMuted:"#1C1C1C", bgInput:"#1A1A1A",
  primary:"#2A8CC0", primaryL:"rgba(42,140,192,0.1)", primaryBtn:"#2A8CC0", primaryBtnTx:"#FFFFFF",
  safe:"#22C55E", safeBg:"rgba(34,197,94,0.1)",
  warn:"#F59E0B", warnBg:"rgba(245,158,11,0.1)",
  danger:"#EF4444", dangerBg:"rgba(239,68,68,0.12)",
  dep:"#A78BFA", depBg:"rgba(167,139,250,0.08)",
  sos:"#EF4444",
  bdr:"rgba(255,255,255,0.07)", bdrMid:"rgba(255,255,255,0.13)",
  tx:"#FFFFFF", txs:"#999999", txm:"#555555",
  isDark:true,
};

const LANGS = [
  {id:"en",flag:"EN",name:"English"},{id:"ha",flag:"HA",name:"Hausa"},
  {id:"yo",flag:"YO",name:"Yoruba"},{id:"ig",flag:"IG",name:"Igbo"},
  {id:"pcm",flag:"PC",name:"Pidgin"},{id:"ff",flag:"FF",name:"Fulfulde"},
];
const DISABILITIES = [
  {id:"none",     Icon:CheckCircle,   en:"No accessibility needs",   feat:"Standard RAS all features available."},
  {id:"deaf",     Icon:Volume2,       en:"Deaf or Hard of Hearing",  feat:"Full-screen visual alerts + coded vibration patterns replace all audio."},
  {id:"blind",    Icon:EyeOff,        en:"Blind or Low Vision",      feat:"Voice-first mode every alert is read aloud. Voice-triggered SOS."},
  {id:"speech",   Icon:MessageSquare, en:"Speech Impaired",          feat:"Icon-only reporting no typing or voice. Pre-written SOS messages."},
  {id:"mobility", Icon:Activity,      en:"Mobility Impaired",        feat:"Nearest safe zone on SOS. Responders flagged: Cannot move quickly."},
  {id:"cognitive",Icon:HelpCircle,    en:"Cognitive Disability",     feat:"Simple Mode: just 3 large buttons nothing else on screen."},
  {id:"basic",    Icon:Smartphone,    en:"Basic Phone Only",         feat:"SMS + USSD fallback. All alerts and SOS work without internet."},
];
const INCIDENTS = [
  {id:"bandit",    Icon:AlertTriangle, en:"Bandit / Armed Attack",  ha:"Hari Makami"},
  {id:"roadblock", Icon:Flag,          en:"Roadblock",               ha:"Shingen Hanya"},
  {id:"shooting",  Icon:AlertCircle,   en:"Shooting",                ha:"Harbe"},
  {id:"kidnap",    Icon:AlertCircle,   en:"Kidnapping",              ha:"Sace Mutum"},
  {id:"suspicious",Icon:Eye,           en:"Suspicious Activity",     ha:"Zargi"},
  {id:"medical",   Icon:Heart,         en:"Medical Emergency",       ha:"Gaggawar Lafiya"},
];
const SOS_OPTS = [
  {id:"attack",  Icon:AlertTriangle, en:"Under Attack",       ha:"Ana harba ni"},
  {id:"kidnap",  Icon:AlertCircle,   en:"Being Kidnapped",    ha:"Ana sace ni"},
  {id:"medical", Icon:Heart,         en:"Medical Emergency",  ha:"Bukata lafiya"},
  {id:"other",   Icon:Flag,          en:"Other Emergency",    ha:"Wani hali"},
];
const MAP_NODES = [
  {id:"shiroro",  name:"Shiroro",   x:208,y:105,s:"danger", r:7,notes:"Active bandit cells. 7 reports this week. Avoid all non-essential travel."},
  {id:"rafi",     name:"Rafi",      x:88, y:118,s:"danger", r:5,notes:"Armed attacks on farmers. Avoid Rafi road entirely."},
  {id:"munya",    name:"Munya",     x:298,y:90, s:"danger", r:4,notes:"Border insecurity. 4 community reports."},
  {id:"mashegu",  name:"Mashegu",   x:72, y:205,s:"danger", r:3,notes:"Bandit activity near Mashegu town."},
  {id:"kontagora",name:"Kontagora", x:122,y:232,s:"caution",r:2,notes:"Market area caution. Travel daylight only."},
  {id:"mariga",   name:"Mariga",    x:175,y:188,s:"caution",r:2,notes:"Single roadblock. Travel in convoy."},
  {id:"rijau",    name:"Rijau",     x:52, y:275,s:"caution",r:1,notes:"Unverified report. Exercise caution."},
  {id:"minna",    name:"Minna",     x:262,y:308,s:"safe",   r:1,notes:"State capital. Generally safe. 1 minor unverified report."},
  {id:"lavun",    name:"Lavun",     x:172,y:335,s:"safe",   r:0,notes:"No recent reports. Normal conditions."},
  {id:"bida",     name:"Bida",      x:215,y:388,s:"safe",   r:0,notes:"Clear. Normal activity."},
  {id:"suleja",   name:"Suleja",    x:338,y:328,s:"safe",   r:0,notes:"Bordering FCT. No current reports."},
];
const ANNOUNCEMENTS = [
  {id:"an1",sev:"danger",Icon:AlertTriangle,
   title:"Curfew in Effect Shiroro LGA",phase:"ending",
   body:"A dawn-to-dusk curfew is imposed in Shiroro LGA by Niger State Government. All residents must be indoors between 7pm and 6am.",
   by:"Niger State Government",at:"Today, 10:42am",
   endsAt:new Date(Date.now()+(9*3600000)).toISOString()},
  {id:"an2",sev:"caution",Icon:Megaphone,
   title:"Security Advisory Kontagora Road",phase:null,
   body:"NSCDC advises all road users on the Kontagora Minna route to travel in groups before 8am. Armed patrols deployed.",
   by:"NSCDC Niger State",at:"Today, 8:00am",endsAt:null},
  {id:"an3",sev:"safe",Icon:CheckCircle,
   title:"Minna Bida Route Cleared",phase:null,
   body:"Yesterday roadblock has been cleared by security forces. Normal travel conditions restored.",
   by:"Nigeria Police Force",at:"Yesterday",endsAt:null},
];
const SAFE_ZONES = [
  {name:"Kontagora Police Station",   Icon:Shield,  dist:"0.8km",phone:"+234 803 000 0011"},
  {name:"General Hospital Kontagora", Icon:Heart,   dist:"1.2km",phone:"+234 811 000 0022"},
  {name:"Central Mosque, Kontagora",  Icon:MapPin,  dist:"0.3km",phone:""},
  {name:"Town Hall, Kontagora",       Icon:Flag,    dist:"0.6km",phone:"+234 703 000 0033"},
];
const PHONEBOOK = [
  {name:"Amina Bello",     phone:"+234 803 456 7890"},
  {name:"Bello Ibrahim",   phone:"+234 806 234 5678"},
  {name:"Fatima Mohammed", phone:"+234 705 890 1234"},
  {name:"Kabiru Musa",     phone:"+234 802 123 4567"},
  {name:"Samuel Danjuma",  phone:"+234 803 567 8901"},
];
const TOUR = [
  {Icon:MapPin,  t:"Your location is critical",         b:"The moment you send SOS, your location is the first thing sent. Set it now not when you are in danger.",               tip:"5 seconds now could save your life."},
  {Icon:Shield,  t:"SOS works even offline",             b:"No data? RAS sends your SOS via SMS automatically. Just press the button once we handle the rest.",                    tip:"Works on any phone, any network."},
  {Icon:FileText,t:"Your report protects others",        b:"Reporting what you see routes the next person away from danger. 3 taps. Always anonymous.",                            tip:"You are always anonymous."},
  {Icon:Users,   t:"Save contacts before you need them", b:"Add emergency contacts now. Primary contacts receive your SOS first. Secondary contacts are alerted after 5 minutes.", tip:"Add them now, not when you need them."},
];
const genRef = () => "RAS-" + Math.random().toString(36).slice(2,8).toUpperCase();

function NigerMap({selected, onSelect, journey, SEV, depMarker}) {
  const roads = [
    [262,308,122,232],[262,308,338,328],[262,308,215,388],[262,308,172,335],
    [122,232,88,118],[122,232,72,205],[262,308,208,105],[262,308,298,90],
  ];
  return (
    <svg viewBox="0 0 380 430" style={{width:"100%",display:"block",borderRadius:12}}>
      <rect width="380" height="430" fill="#0D1017"/>
      {Array.from({length:8},(_,i)=><line key={"v"+i} x1={i*54} y1="0" x2={i*54} y2="430" stroke="rgba(255,255,255,.022)" strokeWidth="1"/>)}
      {Array.from({length:9},(_,i)=><line key={"h"+i} x1="0" y1={i*54} x2="380" y2={i*54} stroke="rgba(255,255,255,.022)" strokeWidth="1"/>)}
      <polygon points="38,70 105,25 205,12 330,45 368,135 352,265 318,355 268,408 178,415 95,388 38,318 18,190"
        fill="rgba(255,255,255,0.018)" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5"/>
      <path d="M 345,155 C 310,195 280,255 252,295 C 224,335 190,368 148,400" fill="none" stroke="#0A2A50" strokeWidth="9"/>
      <path d="M 345,155 C 310,195 280,255 252,295 C 224,335 190,368 148,400" fill="none" stroke="#0D3566" strokeWidth="5"/>
      {roads.map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="4,3"/>
      ))}
      {journey && <line x1={262} y1={308} x2={journey.x} y2={journey.y} stroke="#2A8CC0" strokeWidth="2.5" strokeDasharray="6,3"/>}
      {MAP_NODES.map(n=>{
        const clr = n.s==="safe"?"#22C55E":n.s==="caution"?"#F59E0B":"#EF4444";
        const isSel = selected?.id===n.id;
        return (
          <g key={n.id} onClick={()=>onSelect(isSel?null:n)} style={{cursor:"pointer"}}>
            {n.s==="danger"&&<circle cx={n.x} cy={n.y} r={18} fill={clr} opacity="0.09" style={{animation:"pulse 2s infinite"}}/>}
            {isSel&&<circle cx={n.x} cy={n.y} r={15} fill="none" stroke={clr} strokeWidth="2"/>}
            <circle cx={n.x} cy={n.y} r={n.r>0?10:7} fill={clr} opacity="0.9"/>
            {n.r>0&&<text x={n.x} y={n.y+4} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700">{n.r}</text>}
            <text x={n.x} y={n.y+21} textAnchor="middle" fill="rgba(255,255,255,.6)" fontSize="8.5">{n.name}</text>
          </g>
        );
      })}
      {depMarker&&(
        <g>
          <circle cx={depMarker.x} cy={depMarker.y} r={20} fill="#7C3AED" opacity="0.14" style={{animation:"depPulse 2s infinite"}}/>
          <circle cx={depMarker.x} cy={depMarker.y} r={11} fill="#7C3AED" opacity="0.9"/>
          <text x={depMarker.x} y={depMarker.y+4} textAnchor="middle" fill="#FFF" fontSize="9" fontWeight="700">{depMarker.initials}</text>
          <text x={depMarker.x} y={depMarker.y+24} textAnchor="middle" fill="rgba(167,139,250,.8)" fontSize="8">{depMarker.label}</text>
        </g>
      )}
      <rect x="10" y="402" width="200" height="20" rx="4" fill="rgba(0,0,0,.5)"/>
      {[["#22C55E","Safe"],["#F59E0B","Caution"],["#EF4444","High Risk"]].map(([c,l],i)=>(
        <g key={l} transform={"translate("+(16+i*66)+",407)"}>
          <circle cx="5" cy="5" r="4" fill={c}/>
          <text x="13" y="9" fill="rgba(255,255,255,.5)" fontSize="8">{l}</text>
        </g>
      ))}
    </svg>
  );
}

function LocateMap({zone}) {
  return (
    <svg viewBox="0 0 340 200" style={{width:"100%",display:"block"}}>
      <rect width="340" height="200" fill="#0F1824"/>
      {[60,120,180,240,300].map(x=><line key={"v"+x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,.03)" strokeWidth="1"/>)}
      {[50,100,150].map(y=><line key={"h"+y} x1="0" y1={y} x2="340" y2={y} stroke="rgba(255,255,255,.03)" strokeWidth="1"/>)}
      <line x1="170" y1="0" x2="170" y2="200" stroke="rgba(255,255,255,.08)" strokeWidth="14"/>
      <line x1="0" y1="118" x2="340" y2="118" stroke="rgba(255,255,255,.08)" strokeWidth="14"/>
      <line x1="170" y1="0" x2="170" y2="200" stroke="rgba(255,255,255,.03)" strokeWidth="2" strokeDasharray="12,8"/>
      <path d="M 170 155 L 170 118 L 252 118" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="7,4" strokeLinecap="round"/>
      <rect x="182" y="93" width="60" height="18" rx="5" fill="rgba(34,197,94,0.18)"/>
      <text x="212" y="106" textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="700">{zone.dist} away</text>
      <circle cx="170" cy="155" r="10" fill="#2A8CC0" opacity="0.9"/>
      <circle cx="170" cy="155" r="5" fill="#FFF"/>
      <text x="170" y="174" textAnchor="middle" fill="rgba(255,255,255,.5)" fontSize="8.5">You</text>
      <circle cx="252" cy="118" r="17" fill="rgba(34,197,94,0.13)"/>
      <circle cx="252" cy="118" r="10" fill="#22C55E" opacity="0.9"/>
      <text x="252" y="122" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="700">+</text>
      <text x="252" y="141" textAnchor="middle" fill="rgba(255,255,255,.55)" fontSize="8">{zone.name.split(",")[0].slice(0,16)}</text>
    </svg>
  );
}

export default function RAS() {
  const [isDark, setIsDark] = useState(false);
  const C = isDark ? DARK : LIGHT;
  const SEV = {
    safe:   {c:C.safe,   bg:C.safeBg,   label:"CLEAR",    dot:"#22C55E"},
    caution:{c:C.warn,   bg:C.warnBg,   label:"CAUTION",  dot:"#F59E0B"},
    danger: {c:C.danger, bg:C.dangerBg, label:"HIGH RISK", dot:"#EF4444"},
  };
  const SBadge=({s})=>(<span style={{fontSize:10,fontWeight:700,color:SEV[s].c,background:SEV[s].bg,padding:"3px 10px",borderRadius:20,letterSpacing:.5,flexShrink:0}}>{SEV[s].label}</span>);
  const Inp=(ex={})=>({width:"100%",padding:"13px 16px",borderRadius:12,border:"1.5px solid "+C.bdr,fontSize:15,color:C.tx,background:C.bgInput,outline:"none",...ex});
  const PBtn=(ex={})=>({background:C.primaryBtn,color:C.primaryBtnTx,border:"none",borderRadius:14,padding:"14px 20px",fontSize:15,fontWeight:600,cursor:"pointer",width:"100%",...ex});
  const GBtn=(clr,ex={})=>({background:"transparent",color:clr||C.tx,border:"1.5px solid "+(clr||C.bdrMid),borderRadius:14,padding:"13px 20px",fontSize:15,fontWeight:500,cursor:"pointer",width:"100%",...ex});
  const Card=(ex={})=>({background:C.bgCard,borderRadius:16,border:"1px solid "+C.bdr,padding:"18px",...ex});
  const Pill=(active=false)=>({display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:100,background:active?C.primaryL:C.bgCard,border:"1px solid "+(active?C.primary:C.bdr),color:active?C.primary:C.tx,fontSize:13,fontWeight:500,cursor:"pointer"});
  const page={padding:"0 20px 110px",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp .22s ease"};

  const [screen,setS]=useState("splash");
  const [lang,setLang]=useState("en");
  const [profile,setProfile]=useState(null);
  const [loc,setLoc]=useState("");
  const [locLoad,setLocLoad]=useState(false);
  const [disab,setDisab]=useState([]);
  const [contacts,setContacts]=useState([]);
  const [reports,setReports]=useState([]);
  const [simple,setSimple]=useState(false);
  const [ob,setOb]=useState({step:0,tour:0,data:{name:"",phone:""},disab:[]});
  const [rtOpen,setRtOpen]=useState(false);
  const [rtFrom,setRtFrom]=useState("");
  const [rtTo,setRtTo]=useState("");
  const [mapSel,setMapSel]=useState(null);
  const [journey,setJourney]=useState(null);
  const [jSetup,setJSetup]=useState(null);
  const [jElapsed,setJElapsed]=useState(0);
  const [jOverdue,setJOverdue]=useState(false);
  const [rpType,setRpType]=useState(null);
  const [rpLoc,setRpLoc]=useState("");
  const [rpNote,setRpNote]=useState("");
  const [rpAudio,setRpAudio]=useState(null);
  const [rpRef,setRpRef]=useState("");
  const [isRec,setIsRec]=useState(false);
  const [recSec,setRecSec]=useState(0);
  const [sosType,setSosType]=useState(null);
  const [sosStep,setSosStep]=useState(0);
  const [sosTimer,setSosTimer]=useState(8);
  const [sosRef,setSosRef]=useState("");
  const [newCon,setNewCon]=useState({name:"",phone:"",type:"primary"});
  const [profEdit,setProfEdit]=useState(null);
  const [conReqs,setConReqs]=useState([
    {id:"r1",name:"Hauwa Yakubu",phone:"+234 803 456 7890",ago:"2h ago"},
    {id:"r2",name:"Musa Abdullahi",phone:"+234 812 234 5678",ago:"Yesterday"},
  ]);
  const [showAlert,setShowAlert]=useState(false);
  const [showZones,setShowZones]=useState(false);
  const [showCall,setShowCall]=useState(false);
  const [showReceive,setShowRcv]=useState(false);
  const [showPhBook,setShowPB]=useState(false);
  const [showDisFeat,setShowDF]=useState(null);
  const [showSimEx,setShowSimEx]=useState(false);
  const [showAllAnn,setShowAllAnn]=useState(false);
  const [showLocMap,setShowLocMap]=useState(null);
  const [monitorDep,setMonitorDep]=useState(null);
  const [addingFor,setAddingFor]=useState(null); // 'primary' | 'secondary' | null
  const [cd,setCd]=useState(null);

  const sosTimRef=useRef(null);
  const mrRef=useRef(null);
  const chunksRef=useRef([]);
  const recTimRef=useRef(null);
  const jTimRef=useRef(null);
  const cdRef=useRef(null);

  const save=(k,v)=>{try{window.storage.set(k,JSON.stringify(v));}catch{}};

  useEffect(()=>{
    (async()=>{
      const ld=async k=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null;}catch{return null;}};
      const [p,d,c,r,s,l,lo,dk]=await Promise.all([ld("ras_profile"),ld("ras_disab"),ld("ras_contacts"),ld("ras_reports"),ld("ras_simple"),ld("ras_lang"),ld("ras_loc"),ld("ras_dark")]);
      let hasP=false;
      if(p){setProfile(p);hasP=true;}if(d)setDisab(d);if(c)setContacts(c);
      if(r)setReports(r);if(s!=null)setSimple(s);if(l)setLang(l);
      if(lo)setLoc(lo);if(dk!=null)setIsDark(dk);
      setTimeout(()=>setS(hasP?"home":"onboard"),2400);
    })();
  },[]);

  useEffect(()=>{
    const an=ANNOUNCEMENTS.find(a=>a.endsAt);
    if(!an)return;
    const tick=()=>{const d=Math.max(0,new Date(an.endsAt)-Date.now());const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);setCd(String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0"));};
    tick();cdRef.current=setInterval(tick,1000);return()=>clearInterval(cdRef.current);
  },[]);

  useEffect(()=>{
    if(!journey?.active){clearInterval(jTimRef.current);return;}
    jTimRef.current=setInterval(()=>{setJElapsed(p=>{const n=p+1;if(n>0&&n%(30*60)===0)setJOverdue(true);return n;});},1000);
    return()=>clearInterval(jTimRef.current);
  },[journey?.active]);

  const go=s=>setS(s);
  const greeting=()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening";};
  const toggleTheme=()=>{const n=!isDark;setIsDark(n);save("ras_dark",n);};

  const useGPS=()=>{
    const l="Government Road, Bosso";
    setLoc(l);
    save("ras_loc",l);
    setLocLoad(true);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        ()=>setLocLoad(false),
        ()=>setLocLoad(false),
        {timeout:4000}
      );
    }else{setLocLoad(false);}
  };

  const finishOnboard=()=>{
    const p={name:ob.data.name.trim()||"User",phone:ob.data.phone.trim()};
    const sm=ob.disab.includes("cognitive");
    setProfile(p);setDisab(ob.disab);setSimple(sm);
    save("ras_profile",p);save("ras_disab",ob.disab);save("ras_simple",sm);save("ras_lang",lang);
    go("home");
  };
  const initSOS=()=>{
    setSosType(null);setSosStep(0);setSosTimer(8);setSosRef(genRef());go("sos");
    let n=8;sosTimRef.current=setInterval(()=>{n--;setSosTimer(n);if(n<=0){clearInterval(sosTimRef.current);fireSOS("other");}},1000);
  };
  const fireSOS=t=>{clearInterval(sosTimRef.current);setSosType(t);setSosStep(1);setTimeout(()=>setSosStep(2),2000);};
  const startJourney=node=>{setJourney({active:true,dest:node,startTime:Date.now()});setJElapsed(0);setJOverdue(false);setJSetup(null);go("home");};
  const endJourney=()=>{clearInterval(jTimRef.current);setJourney(null);setJElapsed(0);setJOverdue(false);};
  const fmtJTime=sec=>Math.floor(sec/60)+"m "+sec%60+"s";

  const startRec=async()=>{
    try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});const mr=new MediaRecorder(stream);mrRef.current=mr;chunksRef.current=[];mr.ondataavailable=e=>chunksRef.current.push(e.data);mr.onstop=()=>{const blob=new Blob(chunksRef.current,{type:"audio/webm"});setRpAudio(URL.createObjectURL(blob));stream.getTracks().forEach(t=>t.stop());clearInterval(recTimRef.current);setRecSec(0);};mr.start();setIsRec(true);setRecSec(0);recTimRef.current=setInterval(()=>setRecSec(p=>p+1),1000);}catch{alert("Mic access needed.");}
  };
  const stopRec=()=>{if(mrRef.current&&isRec){mrRef.current.stop();setIsRec(false);}};

  const submitReport=()=>{
    const ref=genRef();const inc=INCIDENTS.find(i=>i.id===rpType);
    const rep={id:ref,ref,type:rpType,label:lang==="ha"?inc?.ha:inc?.en,area:rpLoc||loc||"Current Location",note:rpNote,hasAudio:!!rpAudio,status:"submitted",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};
    const upd=[rep,...reports];setReports(upd);save("ras_reports",upd);
    setRpRef(ref);setRpType(null);setRpNote("");setRpAudio(null);go("report-done");
  };

  const addContact=()=>{
    if(!newCon.name||!newCon.phone)return;
    const n=[...contacts,{...newCon,id:genRef()}];
    setContacts(n);save("ras_contacts",n);
    setNewCon({name:"",phone:"",type:"primary"});
  };

  const acceptReq=id=>{
    const req=conReqs.find(r=>r.id===id);
    if(req){const n=[...contacts,{...req,type:"dependency"}];setContacts(n);save("ras_contacts",n);}
    setConReqs(p=>p.filter(r=>r.id!==id));
  };

  const primaryContacts=contacts.filter(c=>c.type==="primary"||(!c.type&&!c.carer!==false)||(!c.type&&c.carer));
  const secondaryContacts=contacts.filter(c=>c.type==="secondary");
  const dependencies=contacts.filter(c=>c.type==="dependency");

  const showNav=!["splash","onboard","sos"].includes(screen)&&!!profile;

  // MODALS
  if(showAlert) return (
    <div style={{position:"fixed",inset:0,background:isDark?"#0F0503":"#1A0503",zIndex:999,display:"flex",flexDirection:"column",padding:"32px 20px 28px",fontFamily:"DM Sans,system-ui,sans-serif",animation:"alertIn .3s ease"}}>
      <style>{G}</style>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,textAlign:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(239,68,68,0.15)",display:"flex",alignItems:"center",justifyContent:"center",animation:"glow 2s infinite"}}><AlertTriangle size={32} color="#EF4444"/></div>
        <span style={{fontSize:10,fontWeight:700,color:"#EF4444",letterSpacing:1.5}}>DO NOT TRAVEL</span>
        <h1 style={{color:"#FFF",fontSize:28,fontWeight:800}}>BANDIT ACTIVITY</h1>
        <p style={{color:"rgba(255,255,255,.45)",fontSize:14}}>Near Kontagora Market</p>
        <p style={{color:"rgba(255,255,255,.55)",fontSize:13,lineHeight:1.7,maxWidth:300}}>Armed bandits sighted near Kontagora central market. Stay indoors. Security forces notified.</p>
        <div style={{background:"rgba(255,255,255,.05)",borderRadius:14,padding:"14px 20px",width:"100%",border:"1px solid rgba(255,255,255,.07)"}}>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:10,fontWeight:700,letterSpacing:1,marginBottom:8}}>VIBRATION PATTERN</p>
          <p style={{color:"#FFF",fontSize:22,letterSpacing:8,fontWeight:700}}>3 Long Pulses</p>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:11,marginTop:4}}>= Danger Nearby</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
          {[{Icon:Home,l:"Stay Indoors",a:null},{Icon:MapPin,l:"Nearest Safe Zone",a:()=>{setShowAlert(false);setShowZones(true);}},{Icon:Phone,l:"Contact Emergency Contact",a:()=>{setShowAlert(false);setShowCall(true);}}].map(it=>(
            <button key={it.l} onClick={it.a||undefined} style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",color:"#FFF",fontSize:14,fontWeight:500,width:"100%"}}>
              <it.Icon size={18}/>{it.l}
            </button>
          ))}
        </div>
      </div>
      <button onClick={()=>setShowAlert(false)} style={{...PBtn({marginTop:16,background:"#22C55E"})}}>I am Safe Dismiss</button>
    </div>
  );

  if(showZones) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"flex-end",fontFamily:"DM Sans,system-ui,sans-serif"}} onClick={()=>setShowZones(false)}>
      <style>{G}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:"20px 20px 44px",width:"100%",animation:"slideUp .25s ease",color:C.tx}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.bdrMid,margin:"0 auto 20px"}}/>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Nearest Safe Zones</h3>
        <p style={{fontSize:12,color:C.txs,marginBottom:18}}>Tap Locate to see the route to each zone.</p>
        {SAFE_ZONES.map(z=>(
          <div key={z.name} style={{...Card({marginBottom:10,display:"flex",gap:12,alignItems:"center"})}}>
            <div style={{width:40,height:40,borderRadius:10,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><z.Icon size={18} color={C.safe}/></div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:600,color:C.tx}}>{z.name}</p>
              <p style={{fontSize:11,color:C.txs}}>{z.dist}</p>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {z.phone&&(
                <button title={"Call "+z.name} style={{width:36,height:36,borderRadius:"50%",background:C.safeBg,border:"1px solid "+C.safe,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
                  <PhoneCall size={15} color={C.safe}/>
                </button>
              )}
              <button onClick={()=>{setShowZones(false);setShowLocMap(z);}} style={{background:C.primary,border:"none",color:"#FFF",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
                <MapPin size={12}/>Locate
              </button>
            </div>
          </div>
        ))}
        <button onClick={()=>setShowZones(false)} style={GBtn(C.txs,{marginTop:8})}>Close</button>
      </div>
    </div>
  );

  if(showLocMap) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:92,display:"flex",alignItems:"flex-end",fontFamily:"DM Sans,system-ui,sans-serif"}} onClick={()=>setShowLocMap(null)}>
      <style>{G}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:"20px 20px 44px",width:"100%",animation:"slideUp .25s ease",color:C.tx}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.bdrMid,margin:"0 auto 20px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{width:40,height:40,borderRadius:12,background:C.safeBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><showLocMap.Icon size={18} color={C.safe}/></div>
          <div>
            <p style={{fontSize:15,fontWeight:700,color:C.tx}}>{showLocMap.name}</p>
            <p style={{fontSize:12,color:C.txs}}>{showLocMap.dist} from your location</p>
          </div>
        </div>
        <div style={{borderRadius:14,overflow:"hidden",border:"1px solid "+C.bdr,marginBottom:16}}>
          <LocateMap zone={showLocMap}/>
        </div>
        <p style={{fontSize:12,color:C.txs,textAlign:"center",marginBottom:18}}>Head to this location. Show this screen to anyone nearby for help navigating.</p>
        <div style={{display:"flex",gap:10}}>
          {showLocMap.phone&&(
            <button style={{...PBtn({flex:1,background:C.safe,display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"13px 16px"})}}>
              <PhoneCall size={16}/>Call
            </button>
          )}
          <button onClick={()=>setShowLocMap(null)} style={{...GBtn(C.txs,{flex:1,width:"auto"})}}>Close</button>
        </div>
      </div>
    </div>
  );

  if(showCall) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"flex-end",fontFamily:"DM Sans,system-ui,sans-serif"}} onClick={()=>setShowCall(false)}>
      <style>{G}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:"20px 20px 44px",width:"100%",animation:"slideUp .25s ease",color:C.tx}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.bdrMid,margin:"0 auto 20px"}}/>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:18}}>Emergency Contacts</h3>
        {contacts.length===0&&<p style={{color:C.txs,textAlign:"center",padding:"20px 0",fontSize:14}}>No contacts saved yet.</p>}
        {primaryContacts.length>0&&(
          <>
            <p style={{fontSize:10,fontWeight:700,color:C.danger,letterSpacing:.8,marginBottom:10}}>PRIMARY NOTIFIED IMMEDIATELY</p>
            {primaryContacts.map((c,i)=>(
              <div key={i} style={{...Card({marginBottom:8,display:"flex",gap:12,alignItems:"center"})}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:C.danger+"12",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,color:C.danger}}>{c.name[0]}</div>
                <div style={{flex:1}}><p style={{fontSize:14,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:12,color:C.txs}}>{c.phone}</p></div>
                <button style={{width:36,height:36,borderRadius:"50%",background:C.safeBg,border:"1px solid "+C.safe,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><PhoneCall size={15} color={C.safe}/></button>
              </div>
            ))}
          </>
        )}
        {secondaryContacts.length>0&&(
          <>
            <p style={{fontSize:10,fontWeight:700,color:C.txm,letterSpacing:.8,marginTop:14,marginBottom:10}}>SECONDARY ESCALATED AFTER 5 MIN</p>
            {secondaryContacts.map((c,i)=>(
              <div key={i} style={{...Card({marginBottom:8,display:"flex",gap:12,alignItems:"center"})}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,color:C.txs}}>{c.name[0]}</div>
                <div style={{flex:1}}><p style={{fontSize:14,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:12,color:C.txs}}>{c.phone}</p></div>
                <button style={{width:36,height:36,borderRadius:"50%",background:C.bgMuted,border:"1px solid "+C.bdr,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><PhoneCall size={15} color={C.txs}/></button>
              </div>
            ))}
          </>
        )}
        <button onClick={()=>setShowCall(false)} style={GBtn(C.txs,{marginTop:10})}>Close</button>
      </div>
    </div>
  );

  if(showReceive) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:95,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"DM Sans,system-ui,sans-serif"}}>
      <style>{G}</style>
      <div style={{background:C.bgCard,borderRadius:20,padding:"24px 20px",maxWidth:360,width:"100%",animation:"alertIn .3s ease",border:"1px solid "+C.danger,color:C.tx}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:60,height:60,borderRadius:"50%",background:C.dangerBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",animation:"glow 2s infinite"}}><AlertCircle size={28} color={C.danger}/></div>
          <p style={{fontSize:11,fontWeight:700,color:C.danger,letterSpacing:1.5,marginBottom:4}}>INCOMING SOS</p>
          <h3 style={{fontSize:20,fontWeight:700}}>Someone needs you</h3>
        </div>
        <div style={{background:C.dangerBg,borderRadius:14,padding:"14px",marginBottom:20}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.txs,fontSize:16}}>M</div>
            <div><p style={{fontSize:14,fontWeight:700,color:C.tx}}>Musa Abdullahi</p><p style={{fontSize:12,color:C.txs}}>+234 812 234 5678</p></div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:12,fontWeight:600,color:C.danger,background:C.danger+"15",padding:"4px 10px",borderRadius:10}}>Under Attack</span>
            <span style={{fontSize:12,color:C.txs,background:C.bgMuted,padding:"4px 10px",borderRadius:10}}>Near Kontagora</span>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button style={PBtn({background:C.safe})}>Call Musa Now</button>
          <button style={PBtn({background:C.danger})}>Alert Police on His Behalf</button>
          <button onClick={()=>setShowRcv(false)} style={GBtn()}>Acknowledge</button>
        </div>
      </div>
    </div>
  );

  if(showPhBook) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"flex-end",fontFamily:"DM Sans,system-ui,sans-serif"}} onClick={()=>setShowPB(false)}>
      <style>{G}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:"20px 20px 44px",width:"100%",maxHeight:"70vh",overflowY:"auto",animation:"slideUp .25s ease",color:C.tx}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.bdrMid,margin:"0 auto 20px"}}/>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:16}}>Select from Contacts</h3>
        {PHONEBOOK.map(c=>(
          <button key={c.name} onClick={()=>{setNewCon(p=>({...p,name:c.name,phone:c.phone}));setShowPB(false);}}
            style={{...Card({marginBottom:8,display:"flex",gap:12,alignItems:"center",cursor:"pointer",textAlign:"left",border:"none",width:"100%"})}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:C.txs}}>{c.name[0]}</div>
            <div><p style={{fontSize:14,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:12,color:C.txs}}>{c.phone}</p></div>
          </button>
        ))}
      </div>
    </div>
  );

  if(showDisFeat){
    const d=DISABILITIES.find(x=>x.id===showDisFeat);
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"DM Sans,system-ui,sans-serif"}}>
        <style>{G}</style>
        <div style={{background:C.bgCard,borderRadius:20,padding:"28px 20px",maxWidth:340,width:"100%",animation:"alertIn .3s ease",color:C.tx}}>
          <div style={{width:56,height:56,borderRadius:16,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><d.Icon size={24} color={C.primary}/></div>
          <h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>{d.en}</h3>
          <div style={{background:C.primaryL,border:"1px solid "+C.primary+"22",borderRadius:12,padding:"14px",marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:700,color:C.primary,marginBottom:6}}>WHAT CHANGES FOR YOU</p>
            <p style={{fontSize:14,color:C.tx,lineHeight:1.7}}>{d.feat}</p>
          </div>
          <button onClick={()=>setShowDF(null)} style={PBtn()}>Got it</button>
        </div>
      </div>
    );
  }

  if(showSimEx) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"DM Sans,system-ui,sans-serif"}}>
      <style>{G}</style>
      <div style={{background:C.bgCard,borderRadius:20,padding:"28px 20px",maxWidth:340,width:"100%",animation:"alertIn .3s ease",color:C.tx}}>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>Simple Mode</h3>
        <p style={{fontSize:13,color:C.txs,lineHeight:1.6,marginBottom:20}}>Removes everything except 3 large buttons. Ideal in a crisis or for users who prefer fewer options.</p>
        <div style={{border:"1px solid "+C.bdr,borderRadius:14,padding:14,marginBottom:20,background:C.bgMuted}}>
          {[{Icon:Map,l:"CHECK SAFETY"},{Icon:AlertCircle,l:"I NEED HELP"},{Icon:FileText,l:"REPORT INCIDENT"}].map(b=>(
            <div key={b.l} style={{...Card({marginBottom:8,display:"flex",alignItems:"center",gap:12,padding:"14px"})}}>
              <b.Icon size={20} color={C.txs}/><span style={{fontSize:14,fontWeight:600,color:C.tx}}>{b.l}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>{setShowSimEx(false);setSimple(true);save("ras_simple",true);}} style={PBtn({flex:1})}>Enable</button>
          <button onClick={()=>setShowSimEx(false)} style={{...GBtn(C.txs,{flex:1,width:"auto"})}}>Not now</button>
        </div>
      </div>
    </div>
  );

  if(showAllAnn) return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:90,display:"flex",alignItems:"flex-end",fontFamily:"DM Sans,system-ui,sans-serif"}} onClick={()=>setShowAllAnn(false)}>
      <style>{G}</style>
      <div onClick={e=>e.stopPropagation()} style={{background:C.bgCard,borderRadius:"20px 20px 0 0",padding:"20px 20px 44px",width:"100%",maxHeight:"85vh",overflowY:"auto",animation:"slideUp .25s ease",color:C.tx}}>
        <div style={{width:40,height:4,borderRadius:2,background:C.bdrMid,margin:"0 auto 20px"}}/>
        <h3 style={{fontSize:18,fontWeight:700,marginBottom:16}}>All Announcements</h3>
        {ANNOUNCEMENTS.map(an=>(
          <div key={an.id} style={{...Card({marginBottom:12,border:"1px solid "+SEV[an.sev].c+"22"})}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><SBadge s={an.sev}/><span style={{fontSize:11,color:C.txm}}>{an.at}</span></div>
            <h4 style={{fontSize:14,fontWeight:700,color:C.tx,marginBottom:6}}>{an.title}</h4>
            {an.endsAt&&cd&&(<div style={{background:C.dangerBg,borderRadius:10,padding:"10px 14px",marginBottom:10}}><p style={{fontSize:10,color:C.danger,fontWeight:700}}>CURFEW {an.phase==="ending"?"ENDS IN":"STARTS IN"}</p><p style={{fontSize:24,fontWeight:800,color:C.danger,fontVariantNumeric:"tabular-nums"}}>{cd}</p></div>)}
            <p style={{fontSize:13,color:C.txs,lineHeight:1.7}}>{an.body}</p>
            <p style={{fontSize:11,color:C.txm,marginTop:8}}>{an.by}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const InlineForm=({type})=>(
    <div style={{...Card({border:"1px solid "+C.primary+"33",background:C.primaryL,padding:"12px 14px",marginTop:8})}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input style={Inp({flex:1,padding:"10px 12px",fontSize:13})} value={newCon.name} onChange={e=>setNewCon(p=>({...p,name:e.target.value,type}))} placeholder="Full name"/>
        <button onClick={()=>setShowPB(true)} style={{background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:10,padding:"0 12px",cursor:"pointer",color:C.txs,flexShrink:0}}><Smartphone size={15}/></button>
      </div>
      <input style={Inp({marginBottom:10,padding:"10px 12px",fontSize:13})} type="tel" value={newCon.phone} onChange={e=>setNewCon(p=>({...p,phone:e.target.value,type}))} placeholder="+234 803 000 0000"/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{addContact();setAddingFor(null);}} disabled={!newCon.name||!newCon.phone} style={{...PBtn({flex:1,padding:"10px",fontSize:13,background:newCon.name&&newCon.phone?C.primaryBtn:"#ccc",color:newCon.name&&newCon.phone?"#FFF":"#888"})}}>Save</button>
        <button onClick={()=>{setAddingFor(null);setNewCon({name:"",phone:"",type:"primary"});}} style={{...GBtn(C.txs,{flex:"0 0 auto",width:"auto",padding:"10px 16px",fontSize:13})}}>Cancel</button>
      </div>
    </div>
  );

  const render=()=>{switch(screen){

  case "splash": return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(160deg,"+C.primary+"18,"+C.bg+")",gap:20,padding:32}}>
      <div style={{width:80,height:80,borderRadius:24,background:C.bgCard,border:"1px solid "+C.bdrMid,display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={36} color={C.primary}/></div>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:36,fontWeight:800,color:C.tx,letterSpacing:"-.5px"}}>RAS</h1>
        <p style={{color:C.txs,fontSize:14,marginTop:4}}>Rapid Alert System</p>
      </div>
      <div style={{display:"flex",gap:6,marginTop:16}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.primary,opacity:.4,animation:"dot 1.2s "+(i*.2)+"s infinite"}}/>)}
      </div>
    </div>
  );

  case "onboard": return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"28px 20px",color:C.tx}}>
      <style>{G}</style>
      <div style={{display:"flex",gap:5,marginBottom:32}}>
        {["Language","Your Info","Tour","Location","Accessibility"].map((_,i)=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=ob.step?C.primary:C.bdr,transition:"background .3s"}}/>
        ))}
      </div>
      {ob.step===0&&(<div style={{animation:"fadeUp .22s ease",display:"flex",flexDirection:"column",gap:20}}>
        <h2 style={{fontSize:26,fontWeight:800,color:C.tx,marginBottom:4}}>Choose language</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {LANGS.map(l=>(<button key={l.id} onClick={()=>setLang(l.id)} style={{padding:"16px 14px",borderRadius:14,border:"2px solid "+(lang===l.id?C.primary:C.bdr),background:lang===l.id?C.primaryL:C.bgCard,cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:11,fontWeight:800,color:lang===l.id?C.primary:C.txm,letterSpacing:.5,minWidth:24}}>{l.flag}</span>
            <span style={{fontSize:14,fontWeight:500,color:lang===l.id?C.primary:C.tx}}>{l.name}</span>
            {lang===l.id&&<Check size={14} color={C.primary} style={{marginLeft:"auto"}}/>}
          </button>))}
        </div>
        <button onClick={()=>setOb(p=>({...p,step:1}))} style={PBtn()}>Continue</button>
      </div>)}
      {ob.step===1&&(<div style={{animation:"fadeUp .22s ease",display:"flex",flexDirection:"column",gap:20}}>
        <h2 style={{fontSize:26,fontWeight:800,color:C.tx,marginBottom:4}}>Your details</h2>
        <p style={{fontSize:14,color:C.txs}}>Stored only on your device. Never shared.</p>
        <div><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:8}}>YOUR NAME</p><input style={Inp()} value={ob.data.name} onChange={e=>setOb(p=>({...p,data:{...p.data,name:e.target.value}}))} placeholder="e.g. Amina Bello"/></div>
        <div><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:8}}>PHONE NUMBER</p><input style={Inp()} type="tel" value={ob.data.phone} onChange={e=>setOb(p=>({...p,data:{...p.data,phone:e.target.value}}))} placeholder="+234 803 000 0000"/><p style={{fontSize:12,color:C.txs,marginTop:6}}>Used for SMS alerts and SOS when offline.</p></div>
        <button onClick={()=>setOb(p=>({...p,step:2}))} disabled={!ob.data.phone} style={PBtn({background:ob.data.phone?C.primaryBtn:"#ccc",color:ob.data.phone?C.primaryBtnTx:"#888"})}>Continue</button>
        <button onClick={()=>setOb(p=>({...p,step:0}))} style={{background:"none",border:"none",color:C.txs,cursor:"pointer",fontSize:13,textAlign:"center"}}>Back</button>
      </div>)}
      {ob.step===2&&(<div style={{animation:"fadeUp .22s ease",display:"flex",flexDirection:"column",gap:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8}}>{ob.tour+1} OF {TOUR.length}</p>
          <button onClick={()=>setOb(p=>({...p,step:3}))} style={{background:"none",border:"none",color:C.txs,fontSize:13,cursor:"pointer"}}>Skip</button>
        </div>
        <div style={{...Card({padding:"28px 20px",minHeight:260,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14,textAlign:"center"})}}>
          {(()=>{const Ic=TOUR[ob.tour].Icon;return(<div style={{width:60,height:60,borderRadius:18,background:C.primaryL,border:"1px solid "+C.primary+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic size={28} color={C.primary}/></div>);})()}
          <h3 style={{fontSize:18,fontWeight:700,color:C.tx,lineHeight:1.2}}>{TOUR[ob.tour].t}</h3>
          <p style={{fontSize:14,color:C.txs,lineHeight:1.7}}>{TOUR[ob.tour].b}</p>
          <div style={{background:C.bgMuted,borderRadius:10,padding:"8px 14px"}}><p style={{fontSize:12,fontWeight:600,color:C.txs}}>{TOUR[ob.tour].tip}</p></div>
        </div>
        <div style={{display:"flex",gap:5,justifyContent:"center"}}>
          {TOUR.map((_,i)=><div key={i} onClick={()=>setOb(p=>({...p,tour:i}))} style={{width:i===ob.tour?24:8,height:8,borderRadius:4,background:i===ob.tour?C.primary:C.bdrMid,cursor:"pointer",transition:"all .2s"}}/>)}
        </div>
        {ob.tour<TOUR.length-1?<button onClick={()=>setOb(p=>({...p,tour:p.tour+1}))} style={PBtn()}>Next</button>:<button onClick={()=>setOb(p=>({...p,step:3}))} style={PBtn()}>Got it</button>}
      </div>)}
      {ob.step===3&&(<div style={{animation:"fadeUp .22s ease",display:"flex",flexDirection:"column",gap:20}}>
        <div style={{width:56,height:56,borderRadius:16,background:C.primaryL,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6}}><MapPin size={28} color={C.primary}/></div>
        <h2 style={{fontSize:26,fontWeight:800,color:C.tx,marginBottom:4}}>Set your location</h2>
        <p style={{fontSize:14,color:C.txs,lineHeight:1.6}}>This is the first thing sent in an SOS. Set it now, not when you are in danger.</p>
        <div style={{...Card({border:"1px solid "+C.primary+"22",background:C.primaryL,padding:"12px 14px"})}}><p style={{fontSize:12,color:C.primary}}>Your location is attached to every SOS you send.</p></div>
        <div><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:8}}>CITY, LGA OR AREA</p><input style={Inp()} value={loc} onChange={e=>{setLoc(e.target.value);save("ras_loc",e.target.value);}} placeholder="e.g. Government Road, Bosso"/></div>
        <button onClick={useGPS} disabled={locLoad} style={{background:"none",border:"1.5px solid "+C.primary,borderRadius:14,padding:"13px 20px",color:C.primary,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <MapPin size={16}/>{locLoad?"Detecting your location...":"Use my current location"}
        </button>
        <button onClick={()=>setOb(p=>({...p,step:4}))} style={PBtn({background:loc?C.primaryBtn:"#ccc",color:loc?C.primaryBtnTx:"#888"})}>Continue</button>
        <button onClick={()=>setOb(p=>({...p,step:4}))} style={{background:"none",border:"none",color:C.txm,fontSize:13,cursor:"pointer",textAlign:"center",padding:8}}>Skip for now</button>
      </div>)}
      {ob.step===4&&(<div style={{animation:"fadeUp .22s ease",display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
          <div><h2 style={{fontSize:22,fontWeight:800,color:C.tx,marginBottom:4}}>Any accessibility needs?</h2><p style={{fontSize:14,color:C.txs}}>Tap the arrow to see what changes.</p></div>
          <span style={{background:C.bgMuted,color:C.txs,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:20,marginLeft:8,whiteSpace:"nowrap"}}>OPTIONAL</span>
        </div>
        {DISABILITIES.map(d=>{const sel=ob.disab.includes(d.id);return(
          <div key={d.id} style={{display:"flex",gap:0}}>
            <button onClick={()=>{if(d.id==="none"){setOb(p=>({...p,disab:[]}));}else{setOb(p=>({...p,disab:p.disab.includes(d.id)?p.disab.filter(x=>x!==d.id):[...p.disab.filter(x=>x!=="none"),d.id]}));}}}
              style={{flex:1,display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:"12px 0 0 12px",border:"1.5px solid "+(sel?C.primary:C.bdr),borderRight:"none",background:sel?C.primaryL:C.bgCard,cursor:"pointer",textAlign:"left"}}>
              <d.Icon size={18} color={sel?C.primary:C.txs}/>
              <span style={{flex:1,fontSize:14,fontWeight:sel?600:400,color:sel?C.primary:C.tx}}>{d.en}</span>
              <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid "+(sel?C.primary:C.bdrMid),background:sel?C.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={11} color="#FFF"/>}</div>
            </button>
            <button onClick={()=>setShowDF(d.id)} style={{padding:"13px 12px",borderRadius:"0 12px 12px 0",border:"1.5px solid "+(sel?C.primary:C.bdr),borderLeft:"none",background:sel?C.primaryL:C.bgCard,cursor:"pointer",color:C.txs}}><ChevronRight size={16}/></button>
          </div>
        );})}
        <button onClick={finishOnboard} style={PBtn({marginTop:4})}>Finish Setup</button>
        <button onClick={finishOnboard} style={{background:"none",border:"none",color:C.txm,fontSize:13,cursor:"pointer",textAlign:"center",padding:8}}>Skip</button>
      </div>)}
    </div>
  );

  case "home": if(simple) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"DM Sans,system-ui,sans-serif",color:C.tx}}>
      <style>{G}</style>

      {/* Header */}
      <div style={{padding:"24px 24px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{fontSize:12,color:C.txs}}>{greeting()}</p>
          <p style={{fontSize:17,fontWeight:700,color:C.tx}}>{profile?.name}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={toggleTheme} style={{background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            {isDark?<Sun size={15} color={C.txs}/>:<Moon size={15} color={C.txs}/>}
          </button>
          <button onClick={()=>setShowAlert(true)} style={{background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative"}}>
            <Bell size={15} color={C.warn}/>
            <span style={{position:"absolute",top:6,right:6,width:6,height:6,borderRadius:"50%",background:C.warn}}/>
          </button>
        </div>
      </div>

      {/* 3 big action cards */}
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:12,padding:"0 24px 16px"}}>
        {[
          {Icon:Map,        label:"Check Safety",    sub:"View threat map & route",  a:()=>go("route"),   bg:C.primaryL,   border:C.primary+"33", ic:C.primary},
          {Icon:AlertCircle,label:"I Need Help",      sub:"Send SOS immediately",     a:initSOS,           bg:C.dangerBg,   border:C.danger+"33",  ic:C.danger},
          {Icon:FileText,   label:"Report Incident",  sub:"Anonymous, 3 taps",        a:()=>go("report"),  bg:C.safeBg,     border:C.safe+"33",    ic:C.safe},
        ].map(b=>(
          <button key={b.label} onClick={b.a}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,
              background:b.bg,border:"1.5px solid "+b.border,borderRadius:20,cursor:"pointer",padding:"24px 16px",
              transition:"opacity .15s"}}>
            <div style={{width:60,height:60,borderRadius:18,background:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
              <b.Icon size={28} color={b.ic}/>
            </div>
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:17,fontWeight:800,color:b.ic,letterSpacing:-.2}}>{b.label}</p>
              <p style={{fontSize:12,color:C.txs,marginTop:3}}>{b.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Switch to full view */}
      <div style={{padding:"0 24px 32px"}}>
        <button onClick={()=>setSimple(false)}
          style={{width:"100%",background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:14,padding:"13px",fontSize:13,color:C.txs,cursor:"pointer",fontWeight:500}}>
          Switch to full view
        </button>
      </div>
    </div>
  );
  return (
    <div style={{...page,paddingTop:0,color:C.tx}}>
      <style>{G}</style>

      {/* TOP BAR with compact location chip */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"22px 0 8px"}}>
        <div>
          <p style={{fontSize:12,color:C.txs,marginBottom:2}}>{greeting()}</p>
          <h2 style={{fontSize:22,fontWeight:800,color:C.tx,lineHeight:1}}>{profile?.name}</h2>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={toggleTheme} style={{background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            {isDark?<Sun size={16} color={C.txs}/>:<Moon size={16} color={C.txs}/>}
          </button>
          <button onClick={()=>setShowAlert(true)} style={{background:C.bgCard,border:"1px solid "+C.bdr,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",flexShrink:0}}>
            <Bell size={16} color={C.warn}/>
            <span style={{position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:C.warn,border:"1.5px solid "+C.bg}}/>
          </button>
        </div>
      </div>

      {/* JOURNEY ACTIVE */}
      {journey?.active&&(
        <div style={{...Card({border:"1.5px solid "+(jOverdue?C.danger:C.primary),background:jOverdue?C.dangerBg:C.primaryL})}}>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14}}>
            <Navigation size={18} color={jOverdue?C.danger:C.primary}/>
            <div style={{flex:1}}>
              <p style={{fontSize:11,fontWeight:700,color:jOverdue?C.danger:C.primary}}>JOURNEY ACTIVE{jOverdue?" CHECK-IN OVERDUE":""}</p>
              <p style={{fontSize:13,color:C.tx,marginTop:2}}>En route to {journey.dest.name} {fmtJTime(jElapsed)}</p>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setJOverdue(false);setJElapsed(0);}} style={PBtn({flex:1,padding:"10px",fontSize:13})}>Check In</button>
            <button onClick={endJourney} style={{...GBtn(C.txs,{flex:"0 0 auto",width:"auto",padding:"10px 16px",fontSize:13})}}>End</button>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT BANNER — compact single row */}
      {ANNOUNCEMENTS.filter(a=>a.sev==="danger").slice(0,1).map(an=>(
        <button key={an.id} onClick={()=>setShowAllAnn(true)} style={{background:"transparent",border:"none",padding:0,cursor:"pointer",textAlign:"left",width:"100%"}}>
          <div style={{background:C.dangerBg,border:"1px solid "+C.danger+"30",borderLeft:"4px solid "+C.danger,borderRadius:12,padding:"10px 12px",display:"flex",gap:10,alignItems:"center",animation:"bannerPulse 4s infinite"}}>
            <AlertTriangle size={16} color={C.danger} style={{flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:12,fontWeight:700,color:C.danger,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{an.title}</p>
              {cd&&<p style={{fontSize:11,color:C.tx,marginTop:1}}>Curfew ends in <span style={{fontWeight:700,color:C.danger,fontVariantNumeric:"tabular-nums"}}>{cd}</span></p>}
            </div>
            <ChevronRight size={14} color={C.danger} style={{flexShrink:0}}/>
          </div>
        </button>
      ))}

      {/* AREA STATUS — compact single row */}
      <div style={{...Card({padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"})}}>
        <div style={{display:"flex",gap:8,alignItems:"center",minWidth:0}}>
          <MapPin size={13} color={C.txs} style={{flexShrink:0}}/>
          <div style={{minWidth:0}}>
            <p style={{fontSize:13,fontWeight:600,color:C.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{loc||"Set your location"}</p>
            <p style={{fontSize:11,color:C.warn}}>3 active reports nearby</p>
          </div>
        </div>
        <SBadge s="caution"/>
      </div>

      {/* QUICK PILLS — 4 only */}
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {[
          {Icon:Map,        l:"Check Route",   a:()=>go("route")},
          {Icon:Navigation, l:"Start Journey", a:()=>go("journey-setup")},
          {Icon:FileText,   l:"Report",        a:()=>go("report")},
          {Icon:Users,      l:"Contacts",      a:()=>go("contacts")},
        ].map(p=>(<button key={p.l} onClick={p.a} style={Pill()}><p.Icon size={13}/>{p.l}</button>))}
      </div>

      {/* ADD EMERGENCY CONTACT NUDGE — subtle amber when no primary contacts */}
      {primaryContacts.length===0&&(
        <button onClick={()=>go("contacts")} style={{background:C.warnBg,border:"1.5px dashed "+C.warn+"70",borderRadius:16,padding:"14px 16px",display:"flex",gap:12,alignItems:"center",cursor:"pointer",textAlign:"left",width:"100%"}}>
          <div style={{width:40,height:40,borderRadius:12,background:C.warn+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Users size={18} color={C.warn}/></div>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:600,color:C.warn}}>Add a primary emergency contact</p>
            <p style={{fontSize:12,color:C.txs,marginTop:2}}>Required for SOS to reach someone you trust.</p>
          </div>
          <ChevronRight size={15} color={C.warn+"80"}/>
        </button>
      )}

      {/* RECENT ALERTS */}
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8}}>RECENT ALERTS</p>
          <button onClick={()=>go("alerts")} style={{background:"none",border:"none",color:C.txs,fontSize:12,cursor:"pointer"}}>See all</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {[{s:"danger",l:"Bandit activity near Kontagora",ago:"2h"},{s:"caution",l:"Roadblock Bida road",ago:"4h"},{s:"safe",l:"Minna Suleja now clear",ago:"Yest."}].map((a,i)=>(
            <button key={i} onClick={()=>setShowAlert(true)} style={{...Card({display:"flex",gap:12,alignItems:"center",cursor:"pointer",padding:"12px 14px",border:"none",textAlign:"left",width:"100%"})}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:SEV[a.s].c,flexShrink:0}}/>
              <p style={{flex:1,fontSize:13,color:C.tx}}>{a.l}</p>
              <span style={{fontSize:11,color:C.txm}}>{a.ago}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SIMULATE RECEIVE */}
      <button onClick={()=>setShowRcv(true)} style={{...Card({display:"flex",gap:12,alignItems:"center",cursor:"pointer",textAlign:"left",width:"100%",border:"none",background:C.warnBg,padding:"12px 16px"})}}>
        <Bell size={18} color={C.warn}/>
        <div style={{flex:1}}>
          <p style={{fontSize:13,fontWeight:600,color:C.warn}}>Simulate: Receive an SOS</p>
          <p style={{fontSize:11,color:C.txs}}>Experience being someone emergency contact.</p>
        </div>
      </button>
    </div>
  );

  case "route": return (
    <div style={{...page,paddingTop:0,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"20px 0 4px"}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Route Safety</h2>
      </div>
      {!rtOpen?(
        <button onClick={()=>setRtOpen(true)} style={{...Card({display:"flex",gap:10,alignItems:"center",cursor:"pointer",border:"none",width:"100%",padding:"14px 16px"})}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={16} color={C.txs}/></div>
          <span style={{flex:1,fontSize:14,color:C.txm,textAlign:"left"}}>Where are you going?</span>
          <ChevronDown size={16} color={C.txm}/>
        </button>
      ):(
        <div style={Card()}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <button onClick={()=>setRtOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><X size={16}/></button>
            <span style={{fontSize:12,fontWeight:700,color:C.txm,letterSpacing:.5}}>ROUTE CHECK</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:C.primary,flexShrink:0}}/>
              <input style={Inp({flex:1})} value={rtFrom} onChange={e=>setRtFrom(e.target.value)} placeholder={loc||"From your location"}/>
            </div>
            <div style={{height:1,background:C.bdr,marginLeft:18}}/>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <MapPin size={10} color={C.danger} style={{flexShrink:0}}/>
              <input style={Inp({flex:1})} value={rtTo} onChange={e=>setRtTo(e.target.value)} placeholder="To destination"/>
            </div>
          </div>
          <button onClick={()=>{const n=MAP_NODES.find(r=>r.name.toLowerCase().includes(rtTo.toLowerCase()));setMapSel(n||null);setRtOpen(false);}} style={PBtn({marginTop:12})}>Check Safety</button>
        </div>
      )}
      {mapSel&&(
        <div style={{...Card({border:"1px solid "+SEV[mapSel.s].c+"33",background:SEV[mapSel.s].bg})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h3 style={{fontSize:16,fontWeight:700,color:C.tx}}>{mapSel.name}</h3><SBadge s={mapSel.s}/>
          </div>
          <p style={{fontSize:13,color:C.txs,lineHeight:1.7,marginBottom:10}}>{mapSel.notes}</p>
          {mapSel.r>0&&<p style={{fontSize:12,color:C.txm,marginBottom:10}}>{mapSel.r} report{mapSel.r!==1?"s":""}</p>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setJSetup(mapSel);go("journey-setup");}} style={PBtn({flex:1,padding:"11px 14px",fontSize:13})}>Start Journey</button>
            <button onClick={()=>{setRpLoc(mapSel.name);go("report");}} style={{...GBtn(C.txs,{flex:1,padding:"11px 14px",fontSize:13,width:"auto"})}}>Report</button>
          </div>
        </div>
      )}
      <div>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:10}}>THREAT HEAT MAP NIGER STATE</p>
        <div style={{borderRadius:14,overflow:"hidden",border:"1px solid "+C.bdr}}>
          <NigerMap selected={mapSel} onSelect={setMapSel} journey={journey?.dest} SEV={SEV}/>
        </div>
        <p style={{fontSize:11,color:C.txm,marginTop:6,textAlign:"center"}}>Tap any region for threat details</p>
      </div>
      <div>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:8}}>ALL REGIONS</p>
        {MAP_NODES.map(n=>(
          <button key={n.id} onClick={()=>setMapSel(mapSel?.id===n.id?null:n)} style={{display:"flex",gap:12,alignItems:"center",width:"100%",padding:"12px 4px",border:"none",borderBottom:"1px solid "+C.bdr,background:"transparent",cursor:"pointer",textAlign:"left"}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:SEV[n.s].c,flexShrink:0}}/>
            <span style={{flex:1,fontSize:13,fontWeight:mapSel?.id===n.id?600:400,color:C.tx}}>{n.name}</span>
            {n.r>0&&<span style={{fontSize:11,color:C.txm}}>{n.r} rpt</span>}
            <SBadge s={n.s}/>
          </button>
        ))}
      </div>
    </div>
  );

  case "journey-setup": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Start a Journey</h2>
      </div>
      <p style={{fontSize:14,color:C.txs,lineHeight:1.6}}>RAS monitors your route. Check in every 30 minutes. Miss a check-in and your contacts are alerted.</p>
      {jSetup?(
        <div style={{...Card({border:"1px solid "+SEV[jSetup.s].c+"33"})}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <p style={{fontSize:15,fontWeight:700,color:C.tx}}>{jSetup.name}</p><SBadge s={jSetup.s}/>
          </div>
          <p style={{fontSize:12,color:C.txs}}>{jSetup.notes}</p>
          <button onClick={()=>setJSetup(null)} style={{background:"none",border:"none",color:C.txm,fontSize:12,cursor:"pointer",marginTop:8}}>Change destination</button>
        </div>
      ):(
        <div>
          <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:10}}>SELECT DESTINATION</p>
          {MAP_NODES.slice(0,6).map(n=>(
            <button key={n.id} onClick={()=>setJSetup(n)} style={{...Card({marginBottom:8,display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left"})}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:SEV[n.s].c,flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,color:C.tx}}>{n.name}</span><SBadge s={n.s}/>
            </button>
          ))}
        </div>
      )}
      {jSetup&&jSetup.s!=="safe"&&(
        <div style={{...Card({border:"1px solid "+C.danger+"22",background:C.dangerBg})}}><p style={{fontSize:13,color:C.danger,fontWeight:600}}>{jSetup.name} has active threat reports. Do you need to travel there?</p></div>
      )}
      <button onClick={()=>{if(jSetup)startJourney(jSetup);else alert("Please select a destination.");}} style={PBtn({background:jSetup?C.primaryBtn:"#ccc",color:jSetup?C.primaryBtnTx:"#888"})}>Start Journey</button>

      {dependencies.length>0&&(
        <div style={Card()}>
          <p style={{fontSize:11,fontWeight:700,color:C.dep,letterSpacing:.8,marginBottom:4}}>MONITOR A DEPENDANT</p>
          <p style={{fontSize:12,color:C.txs,marginBottom:14,lineHeight:1.6}}>These people requested you as their guardian. You can track their location during this journey.</p>
          {dependencies.map((d,i)=>(
            <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:i<dependencies.length-1?12:0}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:C.depBg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:C.dep,flexShrink:0}}>{d.name[0]}</div>
              <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:C.tx}}>{d.name}</p><p style={{fontSize:11,color:C.txs}}>{d.phone}</p></div>
              <button onClick={()=>{setMonitorDep(d);go("monitor-dep");}} style={{background:C.depBg,border:"1px solid "+C.dep+"44",color:C.dep,borderRadius:10,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Monitor</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={()=>go("home")} style={GBtn(C.txs)}>Cancel</button>
    </div>
  );

  case "monitor-dep": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("contacts")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Monitoring {monitorDep?.name}</h2>
          <p style={{fontSize:12,color:C.txs}}>Live location (simulated)</p>
        </div>
      </div>
      <div style={{...Card({border:"1px solid "+C.dep+"33",background:C.depBg})}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.dep+"18",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:C.dep}}>{monitorDep?.name?.[0]}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:14,fontWeight:600,color:C.tx}}>{monitorDep?.name}</p>
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.safe}}/>
              <p style={{fontSize:12,color:C.txs}}>Location active updated just now</p>
            </div>
          </div>
          <button style={{width:36,height:36,borderRadius:"50%",background:C.safeBg,border:"1px solid "+C.safe,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <PhoneCall size={15} color={C.safe}/>
          </button>
        </div>
      </div>
      <div style={{...Card({padding:0,overflow:"hidden"})}}>
        <div style={{padding:"12px 16px 10px"}}><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8}}>CURRENT LOCATION NIGER STATE</p></div>
        <div style={{borderRadius:"0 0 16px 16px",overflow:"hidden"}}>
          <NigerMap selected={null} onSelect={()=>{}} journey={null} SEV={SEV} depMarker={{x:270,y:315,initials:monitorDep?.name?.[0]||"?",label:"Near Minna"}}/>
        </div>
      </div>
      <div style={Card()}>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:12}}>JOURNEY STATUS</p>
        {[{l:"Last seen location",v:"Near Minna, Niger State"},{l:"Last updated",v:"Just now (simulated)"},{l:"Travel status",v:"Moving no alerts"},].map(({l,v})=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid "+C.bdr}}>
            <p style={{fontSize:13,color:C.txs}}>{l}</p>
            <p style={{fontSize:13,fontWeight:600,color:C.tx}}>{v}</p>
          </div>
        ))}
      </div>
      <div style={{...Card({background:C.depBg,border:"1px solid "+C.dep+"22"})}}>
        <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
          <Radio size={16} color={C.dep} style={{flexShrink:0,marginTop:1}}/>
          <p style={{fontSize:12,color:C.txs,lineHeight:1.65}}>You are monitoring <span style={{fontWeight:600,color:C.tx}}>{monitorDep?.name}</span> because they added you as their emergency contact. If they send an SOS, you will be notified immediately.</p>
        </div>
      </div>
      <button onClick={()=>go("journey-setup")} style={GBtn(C.txs)}>Stop monitoring</button>
    </div>
  );

  case "report": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <div><h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Report an Incident</h2><p style={{fontSize:12,color:C.txs}}>Always anonymous.</p></div>
      </div>
      <div style={{...Card({border:"1px solid "+C.primary+"22",background:C.primaryL,padding:"10px 14px"})}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><Shield size={14} color={C.primary}/><p style={{fontSize:12,color:C.primary}}>Your identity is never attached to any public report.</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {INCIDENTS.map(inc=>(
          <button key={inc.id} onClick={()=>{setRpType(inc.id);go("report-detail");}} style={{...Card({display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"20px 12px",cursor:"pointer",border:"none",textAlign:"center"})}}>
            <div style={{width:44,height:44,borderRadius:14,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center"}}><inc.Icon size={20} color={C.txs}/></div>
            <span style={{fontSize:12,fontWeight:500,color:C.tx}}>{lang==="ha"?inc.ha:inc.en}</span>
          </button>
        ))}
      </div>
      {reports.length>0&&(
        <div>
          <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:10}}>YOUR RECENT REPORTS</p>
          {reports.slice(0,3).map(r=>(
            <div key={r.id} style={{...Card({display:"flex",gap:12,alignItems:"center",marginBottom:8,padding:"12px 14px"})}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:C.safe,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,color:C.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.label}</p>
                <p style={{fontSize:11,color:C.txs}}>{r.area} · {r.time}</p>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:C.safe,background:C.safeBg,padding:"3px 8px",borderRadius:8,flexShrink:0}}>SENT</span>
            </div>
          ))}
          {reports.length>3&&<button onClick={()=>go("my-reports")} style={{background:"none",border:"none",color:C.txs,fontSize:12,cursor:"pointer",padding:"4px 0"}}>See all {reports.length} reports →</button>}
        </div>
      )}
    </div>
  );

  case "report-detail": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("report")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>{lang==="ha"?INCIDENTS.find(i=>i.id===rpType)?.ha:INCIDENTS.find(i=>i.id===rpType)?.en}</h2>
      </div>
      <div style={Card()}><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:10}}>LOCATION</p><input style={Inp()} value={rpLoc||loc} onChange={e=>setRpLoc(e.target.value)} placeholder="Area, LGA, or nearby landmark"/></div>
      <div style={Card()}><p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:10}}>WHAT HAPPENED?</p><textarea value={rpNote} onChange={e=>setRpNote(e.target.value)} placeholder="Vehicles, direction, count..." style={{...Inp({resize:"vertical",minHeight:100})}}/></div>
      <div style={Card()}>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:12}}>VOICE NOTE (OPTIONAL)</p>
        {!rpAudio?(isRec?(
          <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",gap:3,alignItems:"flex-end",height:28}}>
              {[0,1,2,3,4,5].map(i=><div key={i} style={{width:3,background:C.danger,borderRadius:3,height:(8+Math.random()*18)+"px",animation:"dot .5s "+(i*.08)+"s infinite"}}/>)}
              <span style={{color:C.danger,fontSize:13,fontWeight:700,marginLeft:8}}>{Math.floor(recSec/60)}:{String(recSec%60).padStart(2,"0")}</span>
            </div>
            <button onClick={stopRec} style={PBtn({background:C.danger,width:"auto",padding:"10px 28px"})}>Stop</button>
          </div>
        ):(
          <button onClick={startRec} style={{...GBtn(C.txs,{display:"flex",alignItems:"center",gap:8,justifyContent:"center"})}}><Mic size={16}/>Record voice note</button>
        )):(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <audio controls src={rpAudio} style={{width:"100%",borderRadius:8}}/>
            <button onClick={()=>setRpAudio(null)} style={{background:"none",border:"none",color:C.danger,fontSize:12,cursor:"pointer"}}>Remove</button>
          </div>
        )}
      </div>
      <div style={{...Card({border:"1px solid "+C.primary+"22",background:C.primaryL,padding:"10px 14px"})}}><p style={{fontSize:11,color:C.primary}}>Anonymous by default.</p></div>
      <button onClick={submitReport} style={PBtn()}>Submit Report</button>
    </div>
  );

  case "report-done": return (
    <div style={{...page,alignItems:"center",textAlign:"center",color:C.tx}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:C.safeBg,display:"flex",alignItems:"center",justifyContent:"center"}}><CheckCircle size={32} color={C.safe}/></div>
        <h2 style={{fontSize:22,fontWeight:700,color:C.tx}}>Report Received</h2>
        <p style={{fontSize:14,color:C.txs,lineHeight:1.7,maxWidth:280}}>You just made the road safer for the next person.</p>
        <div style={{...Card({border:"1px solid "+C.primary+"22",background:C.primaryL,padding:"12px 24px"})}}><p style={{fontSize:11,color:C.txm,marginBottom:4}}>Reference</p><p style={{fontSize:18,fontWeight:700,color:C.primary,letterSpacing:2}}>{rpRef}</p></div>
        <button onClick={()=>go("home")} style={PBtn({maxWidth:280})}>Back to Home</button>
        <button onClick={()=>{setRpType(null);go("report");}} style={{background:"none",border:"none",color:C.txs,fontSize:14,cursor:"pointer"}}>Report another</button>
      </div>
    </div>
  );

  case "sos": return (
    <div style={{minHeight:"100vh",background:isDark?"#080303":"#FFF5F5",display:"flex",flexDirection:"column",padding:"24px 20px",gap:14,fontFamily:"DM Sans,system-ui,sans-serif",color:C.tx}}>
      <style>{G}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>{clearInterval(sosTimRef.current);go("home");}} style={{background:"none",border:"none",color:C.txs,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:15}}><X size={18}/>Cancel</button>
        <span style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:1}}>EMERGENCY SOS</span>
        <div style={{width:80}}/>
      </div>
      {sosStep===0&&(<>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,flex:1,justifyContent:"center"}}>
          <p style={{fontSize:14,color:C.txs,textAlign:"center"}}>Sending in {sosTimer} seconds or choose type below</p>
          <div style={{position:"relative",width:180,height:180}}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(181,44,31,0.2)" strokeWidth="8"/>
              <circle cx="90" cy="90" r="82" fill="none" stroke={C.sos} strokeWidth="8" strokeDasharray="515" strokeLinecap="round" transform="rotate(-90 90 90)" style={{transition:"stroke-dashoffset .5s",strokeDashoffset:515*(1-(sosTimer/8))}}/>
            </svg>
            <button onClick={()=>fireSOS(sosType||"other")} style={{position:"absolute",inset:12,borderRadius:"50%",background:C.sos,border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"glow 1.5s infinite"}}>
              <span style={{color:"#FFF",fontSize:20,fontWeight:900}}>SOS</span>
              <span style={{color:"rgba(255,255,255,.7)",fontSize:36,fontWeight:900,lineHeight:1}}>{sosTimer}</span>
            </button>
          </div>
          <p style={{fontSize:12,color:C.txm,textAlign:"center",maxWidth:240}}>Or pick the emergency type. Press the button to send immediately.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {SOS_OPTS.map(s=>(
            <button key={s.id} onClick={()=>fireSOS(s.id)} style={{...Card({display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"16px 10px",cursor:"pointer",border:"1px solid "+(sosType===s.id?C.danger:C.bdr),background:sosType===s.id?C.dangerBg:C.bgCard,textAlign:"center"})}}>
              <s.Icon size={22} color={sosType===s.id?C.danger:C.txs}/>
              <span style={{fontSize:12,fontWeight:500,color:C.tx}}>{lang==="ha"?s.ha:s.en}</span>
            </button>
          ))}
        </div>
      </>)}
      {sosStep===1&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
          <div style={{width:60,height:60,border:"4px solid "+C.sos,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
          <h2 style={{fontSize:20,fontWeight:700,color:C.tx}}>Sending SOS...</h2>
          <p style={{fontSize:14,color:C.txs,textAlign:"center"}}>Alerting your contacts and security responders</p>
        </div>
      )}
      {sosStep===2&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:14,paddingTop:8}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:C.safeBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}><CheckCircle size={28} color={C.safe}/></div>
            <h2 style={{fontSize:22,fontWeight:700,color:C.tx}}>SOS Sent</h2>
            <p style={{fontSize:14,color:C.txs,marginTop:4}}>Stay calm. Help is on the way.</p>
          </div>
          <div style={Card()}>
            {[
              primaryContacts.length>0?"Primary contact "+primaryContacts[0].name+" notified immediately":"",
              "112 Emergency Services alerted",
              "GPS location shared "+(loc||"last known area"),
              secondaryContacts.length>0?"Secondary contacts on standby if no response in 5 min":"",
              disab.includes("deaf")?"Responders told: use text only":"",
            ].filter(Boolean).map((l,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}><Check size={14} color={C.safe}/><span style={{fontSize:13,color:C.tx}}>{l}</span></div>
            ))}
            <div style={{height:1,background:C.bdr,margin:"8px 0"}}/><p style={{fontSize:11,color:C.txm}}>Ref: {sosRef}</p>
          </div>
          <button onClick={()=>{clearInterval(sosTimRef.current);go("sos-safe");}} style={PBtn({background:C.safe})}>I am Safe Cancel SOS</button>
          <button onClick={()=>setShowZones(true)} style={GBtn()}>Find nearest safe zone</button>
        </div>
      )}
    </div>
  );

  case "sos-safe": return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:C.bg,padding:32,gap:16,textAlign:"center",color:C.tx}}>
      <style>{G}</style>
      <div style={{width:72,height:72,borderRadius:"50%",background:C.safeBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Home size={30} color={C.safe}/></div>
      <h2 style={{fontSize:22,fontWeight:700,color:C.safe}}>SOS Cancelled</h2>
      <p style={{fontSize:14,color:C.txs}}>Your contacts have been told you are safe.</p>
      <button onClick={()=>go("home")} style={PBtn({maxWidth:240})}>Back to Home</button>
    </div>
  );

  case "alerts": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Alerts</h2>
      </div>
      {[{s:"danger",l:"Bandit activity near Kontagora market",ago:"2h",v:true},{s:"caution",l:"Roadblock reported on Bida road",ago:"4h",v:false},{s:"safe",l:"Minna Suleja corridor now clear",ago:"Yesterday",v:true},{s:"caution",l:"Advisory: Abuja Kaduna travel early",ago:"2 days",v:true}].map((a,i)=>(
        <button key={i} onClick={()=>setShowAlert(true)} style={{...Card({display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left"})}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:SEV[a.s].c,flexShrink:0}}/>
          <div style={{flex:1}}><p style={{fontSize:13,color:C.tx}}>{a.l}</p><p style={{fontSize:11,color:C.txm,marginTop:2}}>{a.ago}{a.v?" Verified":""}</p></div>
          <SBadge s={a.s}/>
        </button>
      ))}
      <button onClick={()=>setShowAlert(true)} style={PBtn({background:C.danger})}>Simulate Live Alert (demo)</button>
    </div>
  );

  case "profile": return (
    <div style={{...page,color:C.tx}}>
      <h2 style={{fontSize:22,fontWeight:800,color:C.tx,paddingTop:8}}>Profile</h2>

      {/* 1 - Identity */}
      <div style={{...Card({display:"flex",gap:14,alignItems:"center"})}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:C.primaryL,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,color:C.primary}}>{profile?.name?.[0]||"U"}</div>
        {profEdit===null?(
          <div style={{flex:1}}><p style={{fontSize:16,fontWeight:700,color:C.tx}}>{profile?.name}</p><p style={{fontSize:13,color:C.txs}}>{profile?.phone}</p></div>
        ):(
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
            <input style={Inp({fontSize:13})} value={profEdit.name} onChange={e=>setProfEdit(p=>({...p,name:e.target.value}))} placeholder="Name"/>
            <input style={Inp({fontSize:13})} type="tel" value={profEdit.phone} onChange={e=>setProfEdit(p=>({...p,phone:e.target.value}))} placeholder="Phone"/>
          </div>
        )}
        {profEdit===null
          ?<button onClick={()=>setProfEdit({name:profile.name,phone:profile.phone})} style={{background:"none",border:"none",color:C.primary,fontSize:13,fontWeight:600,cursor:"pointer"}}>Edit</button>
          :<button onClick={()=>{const p={...profile,...profEdit};setProfile(p);save("ras_profile",p);setProfEdit(null);}} style={{background:"none",border:"none",color:C.safe,fontSize:13,fontWeight:600,cursor:"pointer"}}>Save</button>}
      </div>

      {/* 2 - Emergency Contacts — top priority */}
      <button onClick={()=>go("contacts")} style={{...Card({
        display:"flex",gap:14,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left",
        ...(primaryContacts.length===0?{border:"1.5px solid "+C.warn+"50",background:C.warnBg}:{})
      })}}>
        <div style={{width:40,height:40,borderRadius:12,background:primaryContacts.length===0?C.warn+"18":C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Users size={18} color={primaryContacts.length===0?C.warn:C.txs}/>
        </div>
        <div style={{flex:1}}>
          <p style={{fontSize:14,fontWeight:500,color:primaryContacts.length===0?C.warn:C.tx}}>Emergency Contacts</p>
          <p style={{fontSize:11,color:primaryContacts.length===0?C.warn+"BB":C.txs,marginTop:1}}>
            {primaryContacts.length===0?"Not set up required for SOS":primaryContacts.length+" primary  "+secondaryContacts.length+" secondary  "+dependencies.length+" dependants"}
          </p>
        </div>
        <ChevronRight size={16} color={primaryContacts.length===0?C.warn:C.txm}/>
      </button>

      {/* 3 - Location */}
      <div style={Card()}>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:12}}>YOUR LOCATION</p>
        <input style={Inp()} value={loc} onChange={e=>{setLoc(e.target.value);save("ras_loc",e.target.value);}} placeholder="e.g. Government Road, Bosso"/>
        <button onClick={useGPS} style={{background:"none",border:"none",color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",padding:"10px 0",marginTop:4,display:"flex",alignItems:"center",gap:6}}>
          <MapPin size={12}/>{locLoad?"Detecting...":"Use current location"}
        </button>
      </div>

      {/* 4 - Accessibility */}
      <button onClick={()=>go("accessibility")} style={{...Card({display:"flex",gap:14,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left"})}}>
        <div style={{width:40,height:40,borderRadius:12,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Activity size={18} color={C.txs}/></div>
        <div style={{flex:1}}><p style={{fontSize:14,fontWeight:500,color:C.tx}}>Accessibility</p><p style={{fontSize:11,color:C.txs,marginTop:1}}>{disab.length+" option"+(disab.length!==1?"s":"")+" active"}</p></div>
        <ChevronRight size={16} color={C.txm}/>
      </button>

      {/* 5 - Language */}
      <div style={Card()}>
        <p style={{fontSize:11,fontWeight:700,color:C.txm,letterSpacing:.8,marginBottom:14}}>LANGUAGE</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {LANGS.map(l2=>(
            <button key={l2.id} onClick={()=>{setLang(l2.id);save("ras_lang",l2.id);}} style={{padding:"8px 14px",borderRadius:10,border:"1.5px solid "+(lang===l2.id?C.primary:C.bdr),background:lang===l2.id?C.primaryL:"transparent",color:lang===l2.id?C.primary:C.tx,fontWeight:lang===l2.id?600:400,cursor:"pointer",fontSize:13}}>
              {l2.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6 - Dark mode */}
      <div style={Card()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {isDark?<Moon size={18} color={C.txs}/>:<Sun size={18} color={C.txs}/>}
            <div><p style={{fontSize:14,fontWeight:500,color:C.tx}}>{isDark?"Dark Mode":"Light Mode"}</p><p style={{fontSize:11,color:C.txs}}>Tap to switch</p></div>
          </div>
          <button onClick={toggleTheme} style={{width:52,height:28,borderRadius:14,background:isDark?C.primary:C.bgMuted,border:"none",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
            <div style={{position:"absolute",top:3,left:isDark?24:3,width:22,height:22,borderRadius:"50%",background:"#FFF",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
          </button>
        </div>
      </div>

      {/* 7 - My Reports */}
      <button onClick={()=>go("my-reports")} style={{...Card({display:"flex",gap:14,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left"})}}>
        <div style={{width:40,height:40,borderRadius:12,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FileText size={18} color={C.txs}/></div>
        <div style={{flex:1}}><p style={{fontSize:14,fontWeight:500,color:C.tx}}>My Reports</p><p style={{fontSize:11,color:C.txs,marginTop:1}}>{reports.length+" submitted"}</p></div>
        <ChevronRight size={16} color={C.txm}/>
      </button>

      {/* 8 - Help */}
      <button onClick={()=>go("help")} style={{...Card({display:"flex",gap:14,alignItems:"center",cursor:"pointer",border:"none",width:"100%",textAlign:"left"})}}>
        <div style={{width:40,height:40,borderRadius:12,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><HelpCircle size={18} color={C.txs}/></div>
        <div style={{flex:1}}><p style={{fontSize:14,fontWeight:500,color:C.tx}}>Help and About</p></div>
        <ChevronRight size={16} color={C.txm}/>
      </button>

      {/* 9 - Reset */}
      <button onClick={()=>{if(window.confirm("Reset all data and start over?"))[...["ras_profile","ras_disab","ras_contacts","ras_reports","ras_simple","ras_lang","ras_loc","ras_dark"]].forEach(k=>{try{window.storage.delete(k);}catch{}});window.location.reload();}} style={{fontSize:13,color:C.danger,background:"none",border:"1px solid "+C.danger+"22",borderRadius:10,padding:"10px",cursor:"pointer"}}>Reset and Start Over</button>
    </div>
  );

  case "accessibility": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("profile")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Accessibility</h2>
      </div>
      <p style={{fontSize:13,color:C.txs,lineHeight:1.6}}>Tap the arrow to see what changes for each option.</p>
      {DISABILITIES.map(d=>{const sel=disab.includes(d.id);return(
        <div key={d.id} style={{display:"flex",gap:0}}>
          <button onClick={()=>{const n=d.id==="none"?[]:(sel?disab.filter(x=>x!==d.id):[...disab.filter(x=>x!=="none"),d.id]);setDisab(n);save("ras_disab",n);if(d.id==="cognitive"){setSimple(!sel);save("ras_simple",!sel);}}}
            style={{flex:1,display:"flex",alignItems:"center",gap:12,padding:"13px 14px",borderRadius:"12px 0 0 12px",border:"1.5px solid "+(sel?C.primary:C.bdr),borderRight:"none",background:sel?C.primaryL:C.bgCard,cursor:"pointer",textAlign:"left"}}>
            <d.Icon size={18} color={sel?C.primary:C.txs}/>
            <div style={{flex:1}}><p style={{fontSize:14,fontWeight:sel?600:400,color:sel?C.primary:C.tx}}>{d.en}</p>{sel&&<p style={{fontSize:11,color:C.primary}}>Active</p>}</div>
            <div style={{width:20,height:20,borderRadius:"50%",border:"2px solid "+(sel?C.primary:C.bdrMid),background:sel?C.primary:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{sel&&<Check size={11} color="#FFF"/>}</div>
          </button>
          <button onClick={()=>setShowDF(d.id)} style={{padding:"13px 12px",borderRadius:"0 12px 12px 0",border:"1.5px solid "+(sel?C.primary:C.bdr),borderLeft:"none",background:sel?C.primaryL:C.bgCard,cursor:"pointer",color:C.txs}}><ChevronRight size={16}/></button>
        </div>
      );})}
      <div style={{...Card({border: simple?"1.5px solid "+C.primary+"44":"1px solid "+C.bdr, background: simple?C.primaryL:C.bgCard})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{fontSize:14,fontWeight:600,color:simple?C.primary:C.tx}}>Simple Mode</p>
            <p style={{fontSize:11,color:C.txs,marginTop:2}}>3-button interface for easier use</p>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <button onClick={()=>setShowSimEx(true)} style={{fontSize:11,color:C.txs,background:"none",border:"1px solid "+C.bdr,borderRadius:8,padding:"4px 10px",cursor:"pointer"}}>?</button>
            <button onClick={()=>{const n=!simple;setSimple(n);save("ras_simple",n);}} style={{width:52,height:28,borderRadius:14,background:simple?C.primary:C.bgMuted,border:"none",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:simple?24:3,width:22,height:22,borderRadius:"50%",background:"#FFF",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.2)"}}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  case "contacts": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("profile")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <div>
          <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Emergency Contacts</h2>
          <p style={{fontSize:12,color:C.txs}}>Who gets your SOS and when</p>
        </div>
      </div>

      {/* HOW IT WORKS — compact 3-step strip */}
      <div style={{...Card({padding:"12px 14px"})}}>
        <div style={{display:"flex",gap:0}}>
          {[
            {n:"1",c:C.danger, t:"SOS sent",     s:"Primary + authorities"},
            {n:"2",c:C.warn,   t:"5 min later",  s:"Secondary alerted"},
            {n:"3",c:C.txm,   t:"Dependants",    s:"Not involved"},
          ].map(({n,c,t,s},i,arr)=>(
            <div key={n} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",position:"relative"}}>
              {i<arr.length-1&&<div style={{position:"absolute",top:10,right:0,width:"50%",height:1,background:C.bdr}}/>}
              {i>0&&<div style={{position:"absolute",top:10,left:0,width:"50%",height:1,background:C.bdr}}/>}
              <div style={{width:20,height:20,borderRadius:"50%",background:c+"18",border:"1px solid "+c+"50",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:5,zIndex:1,background:C.bgCard}}>
                <span style={{fontSize:10,fontWeight:700,color:c}}>{n}</span>
              </div>
              <p style={{fontSize:11,fontWeight:600,color:C.tx}}>{t}</p>
              <p style={{fontSize:10,color:C.txs}}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRIMARY CONTACTS */}
      <div>
        <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.danger,marginRight:8,flexShrink:0}}/>
          <p style={{fontSize:12,fontWeight:700,color:C.tx,flex:1}}>Primary Contacts <span style={{fontWeight:400,color:C.txm}}>({primaryContacts.length})</span></p>
        </div>
        <p style={{fontSize:12,color:C.txs,marginBottom:10,lineHeight:1.5}}>Notified immediately when you send SOS, along with emergency services.</p>
        {primaryContacts.map((c,i)=>(
          <div key={i} style={{...Card({display:"flex",gap:10,alignItems:"center",marginBottom:6,padding:"10px 12px",border:"1px solid "+C.danger+"18"})}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.danger+"10",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:C.danger,flexShrink:0}}>{c.name[0]}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:11,color:C.txs}}>{c.phone}</p></div>
            <button onClick={()=>{const n=contacts.filter(x=>x!==c);setContacts(n);save("ras_contacts",n);}} style={{background:"none",border:"none",color:C.txm,cursor:"pointer",padding:4}}><X size={15}/></button>
          </div>
        ))}
        {addingFor==="primary"
          ?<InlineForm type="primary"/>
          :<button onClick={()=>{setAddingFor("primary");setNewCon({name:"",phone:"",type:"primary"});}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"1.5px dashed "+C.danger+"50",borderRadius:10,padding:"9px 14px",color:C.danger,fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",marginTop:4}}>
            <span style={{fontSize:18,lineHeight:1}}>+</span> Add primary contact
          </button>
        }
      </div>

      {/* SECONDARY CONTACTS */}
      <div style={{borderTop:"1px solid "+C.bdr,paddingTop:20}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.warn,marginRight:8,flexShrink:0}}/>
          <p style={{fontSize:12,fontWeight:700,color:C.tx,flex:1}}>Secondary Contacts <span style={{fontWeight:400,color:C.txm}}>({secondaryContacts.length})</span></p>
        </div>
        <p style={{fontSize:12,color:C.txs,marginBottom:10,lineHeight:1.5}}>Only contacted if no primary contact responds within 5 minutes.</p>
        {secondaryContacts.map((c,i)=>(
          <div key={i} style={{...Card({display:"flex",gap:10,alignItems:"center",marginBottom:6,padding:"10px 12px",border:"1px solid "+C.warn+"18"})}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.warn+"10",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:C.warn,flexShrink:0}}>{c.name[0]}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:11,color:C.txs}}>{c.phone}</p></div>
            <button onClick={()=>{const n=contacts.filter(x=>x!==c);setContacts(n);save("ras_contacts",n);}} style={{background:"none",border:"none",color:C.txm,cursor:"pointer",padding:4}}><X size={15}/></button>
          </div>
        ))}
        {addingFor==="secondary"
          ?<InlineForm type="secondary"/>
          :<button onClick={()=>{setAddingFor("secondary");setNewCon({name:"",phone:"",type:"secondary"});}} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"1.5px dashed "+C.warn+"50",borderRadius:10,padding:"9px 14px",color:C.warn,fontSize:13,fontWeight:600,cursor:"pointer",width:"100%",marginTop:4}}>
            <span style={{fontSize:18,lineHeight:1}}>+</span> Add secondary contact
          </button>
        }
      </div>

      {/* DEPENDANTS */}
      <div style={{borderTop:"1px solid "+C.bdr,paddingTop:20}}>
        <div style={{display:"flex",alignItems:"center",marginBottom:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.dep,marginRight:8,flexShrink:0}}/>
          <p style={{fontSize:12,fontWeight:700,color:C.tx,flex:1}}>Dependants <span style={{fontWeight:400,color:C.txm}}>({dependencies.length})</span></p>
        </div>
        <p style={{fontSize:12,color:C.txs,marginBottom:6,lineHeight:1.5}}>People who added you as <em>their</em> emergency contact. <strong style={{color:C.tx}}>They do not receive your SOS.</strong> You watch over them — not the other way around.</p>

        {conReqs.length>0&&(
          <div style={{...Card({border:"1px solid "+C.warn+"30",background:C.warnBg,padding:"12px 14px",marginBottom:10})}}>
            <p style={{fontSize:11,fontWeight:700,color:C.warn,marginBottom:10}}>REQUESTS TO BE YOUR DEPENDANT</p>
            {conReqs.map(r=>(
              <div key={r.id} style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:C.txs,flexShrink:0}}>{r.name[0]}</div>
                <div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:C.tx}}>{r.name}</p><p style={{fontSize:11,color:C.txs}}>{r.ago}</p></div>
                <button onClick={()=>acceptReq(r.id)} style={{background:C.dep+"15",border:"1px solid "+C.dep+"44",color:C.dep,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0}}>Accept</button>
                <button onClick={()=>setConReqs(p=>p.filter(x=>x.id!==r.id))} style={{background:"none",border:"1px solid "+C.bdr,color:C.txm,borderRadius:8,padding:"5px 8px",cursor:"pointer",flexShrink:0}}><X size={13}/></button>
              </div>
            ))}
          </div>
        )}

        {dependencies.map((c,i)=>(
          <div key={i} style={{...Card({display:"flex",gap:10,alignItems:"center",marginBottom:6,padding:"10px 12px",border:"1px solid "+C.dep+"18"})}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:C.depBg,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:C.dep,flexShrink:0}}>{c.name[0]}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:13,fontWeight:600,color:C.tx}}>{c.name}</p><p style={{fontSize:11,color:C.txs}}>{c.phone}</p></div>
            <button onClick={()=>{setMonitorDep(c);go("monitor-dep");}} style={{background:C.depBg,border:"1px solid "+C.dep+"44",color:C.dep,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Track</button>
            <button onClick={()=>{const n=contacts.filter(x=>x!==c);setContacts(n);save("ras_contacts",n);}} style={{background:"none",border:"none",color:C.txm,cursor:"pointer",padding:4}}><X size={15}/></button>
          </div>
        ))}
        {dependencies.length===0&&conReqs.length===0&&(
          <p style={{fontSize:12,color:C.txm,fontStyle:"italic",padding:"8px 0"}}>None yet. When someone adds you as their contact, they show up here.</p>
        )}
      </div>

      <button onClick={()=>setShowRcv(true)} style={GBtn(C.txs,{marginTop:4})}>Simulate receiving an SOS (demo)</button>
    </div>
  );

  case "my-reports": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("profile")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>My Reports</h2>
      </div>
      {reports.length===0?(
        <div style={{...Card({textAlign:"center",padding:"40px 20px"})}}>
          <FileText size={36} color={C.txm} style={{margin:"0 auto 14px",display:"block"}}/>
          <p style={{fontSize:14,color:C.txs}}>No reports yet.</p>
          <button onClick={()=>go("report")} style={PBtn({marginTop:16})}>Report an Incident</button>
        </div>
      ):(reports.map(r=>(
        <div key={r.id} style={Card()}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:40,height:40,borderRadius:12,background:C.bgMuted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {(()=>{const Ic=INCIDENTS.find(i=>i.id===r.type)?.Icon||FileText;return <Ic size={18} color={C.txs}/>;})()}
            </div>
            <div style={{flex:1}}><p style={{fontSize:14,fontWeight:600,color:C.tx}}>{r.label}</p><p style={{fontSize:12,color:C.txs}}>{r.area}  {r.time}</p>{r.hasAudio&&<p style={{fontSize:11,color:C.primary,marginTop:4}}>Voice note attached</p>}</div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid "+C.bdr}}>
            <span style={{fontSize:10,fontWeight:700,color:C.safe,background:C.safeBg,padding:"3px 10px",borderRadius:10}}>SUBMITTED</span>
            <span style={{fontSize:11,color:C.txm}}>#{r.ref}</span>
          </div>
        </div>
      )))}
    </div>
  );

  case "help": return (
    <div style={{...page,color:C.tx}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>go("profile")} style={{background:"none",border:"none",cursor:"pointer",color:C.txs}}><ArrowLeft size={22}/></button>
        <h2 style={{fontSize:18,fontWeight:700,color:C.tx}}>Help and About</h2>
      </div>
      <div style={{...Card({textAlign:"center",padding:"24px",background:C.primaryL,border:"1px solid "+C.primary+"22"})}}>
        <Shield size={36} color={C.primary} style={{margin:"0 auto 10px",display:"block"}}/>
        <h2 style={{fontSize:20,fontWeight:800,color:C.tx}}>RAS</h2>
        <p style={{color:C.txs,fontSize:12,marginTop:4}}>Rapid Alert System  Niger State  v4.0</p>
      </div>
      {[
        {q:"How does SOS work without internet?",a:"RAS tries the internet first. If unavailable, it auto-sends via SMS to your contacts and 112. You only need a basic mobile signal."},
        {q:"Are my reports anonymous?",a:"Yes. Your name and phone are never shown publicly. Only the platform knows, for abuse prevention and it is never shared."},
        {q:"What is Start a Journey?",a:"RAS monitors your route while you travel. Check in every 30 minutes. Miss a check-in and your emergency contacts are alerted with your last known location."},
        {q:"What is the difference between Primary and Secondary contacts?",a:"Primary contacts are notified the moment you send SOS, along with emergency services. If none of them respond within 5 minutes, your SOS automatically escalates to your Secondary contacts. Set both for the best safety net."},
        {q:"What is a Dependant? Will they get my SOS?",a:"No. A Dependant is someone who has added YOU as their emergency contact. They do not receive your SOS when you are in danger. You are their guardian. What you can do is monitor their location and journeys to help keep them safe."},
        {q:"What does the vibration pattern mean?",a:"3 Long pulses means Danger. 3 Short pulses means Caution. Long Short Long means Evacuate. 1 Short pulse means All clear."},
        {q:"Can I use RAS on a basic phone?",a:"Yes. Alerts work via SMS. SOS works via SMS. A USSD version is available for feature phones with no internet."},
      ].map(({q,a},i)=>(
        <div key={i} style={Card()}><p style={{fontSize:13,fontWeight:700,color:C.primary,marginBottom:6}}>{q}</p><p style={{fontSize:13,color:C.txs,lineHeight:1.7}}>{a}</p></div>
      ))}
      <div style={{...Card({textAlign:"center",background:C.bgMuted})}}><p style={{fontSize:12,color:C.txm}}>Emergency: 112  NSCDC: 0800-2255-5353</p></div>
    </div>
  );

  default: return null;
  }};

  const NAV=[{id:"home",Icon:Home,l:"Home"},{id:"route",Icon:Map,l:"Route"},null,{id:"alerts",Icon:Bell,l:"Alerts"},{id:"profile",Icon:User,l:"Me"}];
  return (
    <div style={{maxWidth:440,width:"100%",margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"DM Sans,system-ui,sans-serif",color:C.tx,position:"relative",overflowX:"hidden"}}>
      <style>{G}</style>
      {render()}
      {showNav&&(
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:isDark?"rgba(10,10,10,.96)":"rgba(255,255,255,.96)",backdropFilter:"blur(20px)",borderTop:"1px solid "+C.bdr,display:"flex",alignItems:"flex-end",zIndex:50,paddingBottom:"max(env(safe-area-inset-bottom),8px)"}}>
          {NAV.map((item,i)=>{
            if(!item)return(
              <div key="sos" style={{flex:1,display:"flex",justifyContent:"center",paddingBottom:4}}>
                <button onClick={initSOS} aria-label="SOS" style={{width:54,height:54,borderRadius:"50%",background:C.sos,border:"3px solid "+C.bg,boxShadow:"0 4px 20px "+C.sos+"55",display:"flex",alignItems:"center",justifyContent:"center",marginTop:-20,cursor:"pointer",animation:"pulse 3s infinite"}}>
                  <span style={{color:"#FFF",fontSize:11,fontWeight:900}}>SOS</span>
                </button>
              </div>
            );
            const active=screen===item.id;
            return(
              <button key={item.id} onClick={()=>go(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"10px 4px 6px",border:"none",background:"none",cursor:"pointer",color:active?C.primary:C.txm}}>
                <item.Icon size={19} strokeWidth={active?2.2:1.6}/>
                <span style={{fontSize:9,fontWeight:active?700:400}}>{item.l}</span>
                {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.primary}}/>}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}