// Carte Leaflet réelle (fond OpenStreetMap) + couches de valeurs FICTIVES. Sert aussi de gabarit pour les vraies couches.
export const mapHtml = layer => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass:wght@400;600;700&display=swap">
<style>html,body,#m{height:100%;margin:0;background:#F2F5FB;font:13px Overpass,Helvetica,Arial,sans-serif;color:#07173F}
.ctl{position:absolute;z-index:999;top:10px;right:10px;background:#fffffff2;border:1px solid #D5DDEB;border-radius:6px;padding:10px;width:176px;box-shadow:0 2px 8px #07173f22}.ctl h6{margin:8px 0 4px;font:700 10px Overpass;letter-spacing:1.4px;color:#4A5A78;text-transform:uppercase}.ctl h6:first-child{margin-top:0}
.ctl button{display:block;width:100%;margin:3px 0;background:#fff;color:#07173F;border:1px solid #D5DDEB;border-radius:4px;padding:7px 10px;text-align:left;cursor:pointer;font:600 13px Overpass,Arial}.ctl button.on{background:#0042A6;border-color:#0042A6;color:#fff}.ctl input{width:100%;box-sizing:border-box;padding:6px;border:1px solid #D5DDEB;border-radius:4px;font:13px Overpass}
.lg{position:absolute;z-index:999;left:10px;bottom:28px;background:#fffffff2;border:1px solid #D5DDEB;border-radius:6px;padding:10px 12px;width:230px;box-shadow:0 2px 8px #07173f22}.bar{height:9px;border-radius:2px;margin:7px 0 4px}
.rb{position:absolute;z-index:999;left:62px;top:10px;background:#07173F;color:#EAFE07;font:700 11px Overpass;letter-spacing:1.4px;padding:6px 10px;border-radius:3px}
.tt{background:#fff;color:#07173F;border:1px solid #07173F;font:700 12px Overpass}.px{color:#07173F;font:700 12px Overpass;text-shadow:0 0 3px #fff,0 0 3px #fff}.leaflet-control-attribution{font-size:10px}</style></head>
<body><div id="m"></div><div class="rb">MAQUETTE · VALEURS FICTIVES</div><div class="ctl" id="ctl"></div><div class="lg" id="lg"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script>
var R=function(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
function G(a,b,c,d,s){return Math.exp(-((a-c)*(a-c)+(b-d)*(b-d))/(s*s))}
function urb(a,b){return Math.max(G(a,b,4.05,9.70,.04),G(a,b,4.085,9.745,.03),.6*G(a,b,4.0,9.74,.05))}
function grn(a,b){return Math.max(G(a,b,3.985,9.785,.045),.7*G(a,b,4.13,9.82,.05))}
var CFG={
pr:{n:'Précipitations (moy. mensuelle 2015–2025)',u:'mm/mois',d:0,min:250,max:340,s:.1,E:[9.6,9.9,3.9,4.2],r:['#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b'],f:function(a,b){return 270+60*R(Math.floor(b*10)*13+Math.floor(a*10)*7)}},
lst:{n:'Température de surface (moy. diurne)',u:'°C',d:1,min:26,max:37,s:.009,E:[9.68,9.88,3.98,4.14],r:['#ffffb2','#fecc5c','#fd8d3c','#e31a1c','#800026'],f:function(a,b){return 29+6*urb(a,b)-3.5*grn(a,b)+(R(Math.floor(b/.009)*17+Math.floor(a/.009)*5)-.5)*1.2}},
ndvi:{n:'NDVI (moyenne)',u:'indice',d:2,min:.15,max:.85,s:.00225,E:[9.68,9.88,3.98,4.14],r:['#8c510a','#d8b365','#f6e8c3','#a6d96a','#1a9850','#00441b'],f:function(a,b){return Math.max(.1,Math.min(.9,.3+.5*grn(a,b)+.12*(1-urb(a,b))+(R(Math.floor(b/.00225)*3+Math.floor(a/.00225)*11)-.5)*.08))}}};
function hx(c){return[parseInt(c.substr(1,2),16),parseInt(c.substr(3,2),16),parseInt(c.substr(5,2),16)]}
function col(r,t){t=Math.max(0,Math.min(1,t));var p=t*(r.length-1),i=Math.min(r.length-2,Math.floor(p)),a=hx(r[i]),b=hx(r[i+1]),f=p-i;return'rgb('+a.map(function(x,k){return Math.round(x+(b[k]-x)*f)}).join(',')+')'}
var map=L.map('m',{preferCanvas:true,zoomControl:false}).setView([4.07,9.76],12);
L.control.zoom({position:'bottomright'}).addTo(map);L.control.scale({imperial:false,position:'bottomright'}).addTo(map);
var gu=function(d){return'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/'+d+'/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'};
var D0='2025-01-20',sat=L.tileLayer(gu(D0),{maxNativeZoom:9,maxZoom:14,attribution:'Imagerie : NASA EOSDIS GIBS / Worldview (MODIS Terra, 250 m)'}),osm=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17,attribution:'© contributeurs OpenStreetMap'});sat.addTo(map);
var cv=L.canvas({padding:.5}),grp=L.layerGroup().addTo(map),zg=L.layerGroup().addTo(map),cur='${layer}';
var Z=[['Bonamoussadi',[[4.075,9.725],[4.105,9.762]],'#FC3D21',null],['Akwa / Bonanjo',[[4.035,9.685],[4.06,9.715]],'#ffffff','6 5'],['Yassa / mangrove',[[3.975,9.765],[4.0,9.805]],'#ffffff','6 5']];
Z.forEach(function(z){z[2]=z[2]==='#ffffff'?'#EAFE07':z[2];L.rectangle(z[1],{color:z[2],weight:2,dashArray:z[3],fillOpacity:.04}).bindTooltip(z[0]+' (emprise indicative)',{permanent:true,direction:'top',className:'tt'}).addTo(zg)});
function draw(k){grp.clearLayers();cur=k;var c=CFG[k],lg=document.getElementById('lg');if(!c){lg.style.display='none';return}lg.style.display='block';
var E=c.E,s=c.s,i0=Math.floor(E[0]/s),i1=Math.ceil(E[1]/s),j0=Math.floor(E[2]/s),j1=Math.ceil(E[3]/s);
for(var i=i0;i<i1;i++)for(var j=j0;j<j1;j++){var lo=i*s,la=j*s,v=c.f(la+s/2,lo+s/2);
L.rectangle([[la,lo],[la+s,lo+s]],{renderer:cv,stroke:k==='pr',color:'#fff',weight:1,fillColor:col(c.r,(v-c.min)/(c.max-c.min)),fillOpacity:.62,interactive:false}).addTo(grp);
if(k==='pr')L.marker([la+s/2,lo+s/2],{interactive:false,icon:L.divIcon({className:'px',html:v.toFixed(0),iconSize:[30,14],iconAnchor:[15,7]})}).addTo(grp)}
lg.innerHTML='<b>'+c.n+'</b><div class="bar" style="background:linear-gradient(90deg,'+c.r.join(',')+')"></div><div style="display:flex;justify-content:space-between"><span>'+c.min+'</span><span>'+c.u+'</span><span>'+c.max+'+</span></div><div style="color:#8E9AAB;margin-top:4px">Cellule : '+(k==='pr'?'0,1° (≈ 11 km)':k==='lst'?'≈ 1 km':'≈ 250 m')+' · cliquez pour lire la valeur</div>';
[].forEach.call(document.querySelectorAll('.ctl button'),function(b){b.className=b.dataset.k===k?'on':''})}
var ctl=document.getElementById('ctl');function H(x){var h=document.createElement('h6');h.textContent=x;ctl.appendChild(h)}
H('Données (fictives)');[['pr','Précipitations'],['lst','Température'],['ndvi','Végétation'],['none','Aucune couche']].forEach(function(a){var b=document.createElement('button');b.textContent=a[1];b.dataset.k=a[0];b.onclick=function(){draw(a[0])};ctl.appendChild(b)});
H('Fond de carte');var bs=document.createElement('button'),bo=document.createElement('button'),di=document.createElement('input');bs.textContent='Satellite NASA';bo.textContent='Plan';bs.className='on';
function sb(s){if(s){map.removeLayer(osm);sat.addTo(map);di.style.display='block'}else{map.removeLayer(sat);osm.addTo(map);di.style.display='none'}bs.className=s?'on':'';bo.className=s?'':'on'}bs.onclick=function(){sb(1)};bo.onclick=function(){sb(0)};
di.type='date';di.value=D0;di.min='2015-01-01';di.max=new Date(Date.now()-864e5*2).toISOString().slice(0,10);di.onchange=function(){if(di.value)sat.setUrl(gu(di.value))};ctl.appendChild(bs);ctl.appendChild(bo);ctl.appendChild(di);
draw(cur);
map.on('click',function(e){var c=CFG[cur];if(!c)return;var v=c.f(e.latlng.lat,e.latlng.lng);L.popup().setLatLng(e.latlng).setContent('<b>'+c.n+'</b><br>'+v.toFixed(c.d)+' '+c.u+'<br><i>valeur fictive</i><br>'+e.latlng.lat.toFixed(4)+'°N, '+e.latlng.lng.toFixed(4)+'°E').openOn(map)});
</script></body></html>`;
