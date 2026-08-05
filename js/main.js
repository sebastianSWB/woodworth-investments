const _I = {
  hc1:"images/img_09_hc1.jpg", hc2:"images/img_10_hc2.jpg",
  sh1:"images/img_03.jpg",    sh2:"images/img_11_sh2.jpg", sh3:"images/img_12_sh3.jpg", sh4:"images/img_13_sh4.jpg",
  ge1:"images/img_14_ge1.jpg",   ge2:"images/img_15_ge2.jpg", ge3:"images/img_16_ge3.jpg"
};
const P = {
  hideout:{name:"Hideout Canyon",location:"Hideout, Utah",status:"Completed",sc:"badge-done",
    images:[_I.hc1,_I.hc2],
    specs:[{v:"6,534 sq ft",l:"Lot Area"},{v:"3,140 sq ft",l:"Home Size"},{v:"4 en-suite",l:"Bedrooms"},{v:"5",l:"Bathrooms"}]},
  soaring:{name:"Soaring Hawk",location:"Park City Area, Utah",status:"Completed",sc:"badge-done",
    images:[_I.sh1,_I.sh2,_I.sh3,_I.sh4],
    specs:[{v:"12,197 sq ft",l:"Lot Area"},{v:"4,246 sq ft",l:"Home Size"},{v:"4 en-suite",l:"Bedrooms"},{v:"6",l:"Bathrooms"}]},
  golden:{name:"Golden Eagle",location:"Park City Area, Utah",status:"In Development",sc:"badge-active",
    images:[_I.ge1,_I.ge2,_I.ge3],
    specs:[{v:"24,394 sq ft",l:"Lot Area"},{v:"4,743 sq ft",l:"Home Size"},{v:"5 en-suite",l:"Bedrooms"},{v:"7",l:"Bathrooms"}]}
};
let cur=[],idx=0,tx=0;

function openProject(k){
  const p=P[k]; cur=p.images; idx=0;
  document.getElementById("modal-title").textContent=p.name;
  document.getElementById("modal-loc").textContent=p.location;
  document.getElementById("modal-loc").style.cssText="font-size:.75rem;letter-spacing:.09em;text-transform:uppercase;color:var(--gold)";
  const b=document.getElementById("modal-badge"); b.textContent=p.status; b.className="modal-badge "+p.sc;
  document.getElementById("modal-specs").innerHTML=p.specs.map(s=>"<div class='spec-item'><div class='spec-val'>"+s.v+"</div><div class='spec-lbl'>"+s.l+"</div></div>").join("");
  buildDots(); setSlide(0,false);
  document.getElementById("modal-overlay").classList.add("open");
  document.body.style.overflow="hidden";
}
function closeModal(){document.getElementById("modal-overlay").classList.remove("open");document.body.style.overflow="";}
function setSlide(i,anim){
  idx=(i+cur.length)%cur.length;
  const img=document.getElementById("modal-img");
  if(anim){img.style.opacity="0";setTimeout(()=>{img.src=cur[idx];img.style.opacity="1";},200);}
  else{img.src=cur[idx];img.style.opacity="1";}
  document.getElementById("carIdx").textContent=idx+1;
  document.getElementById("carTotal").textContent=cur.length;
  document.querySelectorAll(".car-dot").forEach((d,i)=>d.classList.toggle("active",i===idx));
  const show=cur.length>1;
  document.getElementById("carPrev").style.display=show?"":"none";
  document.getElementById("carNext").style.display=show?"":"none";
}
function buildDots(){
  const el=document.getElementById("carDots");
  el.innerHTML=cur.map((_,i)=>"<span class='car-dot"+(i===0?" active":"")+"' data-i='"+i+"'></span>").join("");
  el.style.display=cur.length>1?"":"none";
  el.querySelectorAll(".car-dot").forEach(d=>d.addEventListener("click",()=>setSlide(parseInt(d.dataset.i),true)));
}
document.getElementById("modal-close").addEventListener("click",closeModal);
document.getElementById("modal-overlay").addEventListener("click",e=>{if(e.target===document.getElementById("modal-overlay"))closeModal();});
document.getElementById("carPrev").addEventListener("click",()=>setSlide(idx-1,true));
document.getElementById("carNext").addEventListener("click",()=>setSlide(idx+1,true));
document.addEventListener("keydown",e=>{
  if(!document.getElementById("modal-overlay").classList.contains("open"))return;
  if(e.key==="Escape")closeModal();
  if(e.key==="ArrowLeft")setSlide(idx-1,true);
  if(e.key==="ArrowRight")setSlide(idx+1,true);
});
document.querySelectorAll(".port-card[tabindex]").forEach(c=>c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" ")c.click();}));
const cw=document.getElementById("carWrap");
cw.addEventListener("touchstart",e=>{tx=e.touches[0].clientX;},{passive:true});
cw.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>48)setSlide(d>0?idx-1:idx+1,true);},{passive:true});

// Header scroll
const hdr=document.getElementById("hdr");
window.addEventListener("scroll",()=>hdr.classList.toggle("scrolled",window.scrollY>40),{passive:true});

// Parallax
const marketBg=document.querySelector(".market-bg");
const marketEl=document.getElementById("market");
function updateParallax(){
  const rect=marketEl.getBoundingClientRect();
  const offset=rect.top*0.35;
  marketBg.style.transform=marketBg.classList.contains("vis")?`translateY(${offset}px)`:`translateX(80px)`;
}
window.addEventListener("scroll",updateParallax,{passive:true});

// Scroll animations
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("vis");}),{threshold:0.1,rootMargin:"0px 0px -28px 0px"});
document.querySelectorAll(".fu, .fu-left, .fu-right, .market-bg").forEach(el=>obs.observe(el));

// Smooth scroll
document.querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();window.scrollTo({top:t.offsetTop-68,behavior:"smooth"});}}));

// Contact form
document.getElementById("cForm").addEventListener("submit",function(e){
  e.preventDefault();const btn=this.querySelector(".btn-send");
  btn.textContent="Sending...";btn.disabled=true;
  var params={
    from_name:this.querySelector('[name="fname"]').value+' '+this.querySelector('[name="lname"]').value,
    from_email:this.querySelector('[name="email"]').value,
    phone:this.querySelector('[name="phone"]').value||'Not provided',
    investment_range:this.querySelector('[name="range"]').value||'Not specified',
    message:this.querySelector('[name="msg"]').value||'No message'
  };
  emailjs.send('service_twgtu44','template_tf07rzd',params)
    .then(function(){
      document.getElementById("formOk").style.display="block";
      document.getElementById("cForm").reset();
      btn.textContent="Send Message";btn.disabled=false;
    },function(err){
      alert("Error: " + JSON.stringify(err));
      btn.textContent="Send Message";btn.disabled=false;
    }).catch(function(err){
      alert("Caught: " + JSON.stringify(err));
      btn.textContent="Send Message";btn.disabled=false;
    });
});

// Accordion
function toggleAcc(btn){
  btn.classList.toggle('open');
  var body=btn.nextElementSibling;
  body.classList.toggle('open');
}

// Mobile nav
function toggleNav(){
  var b=document.getElementById('navBurger');
  var n=document.getElementById('navLinks');
  b.classList.toggle('open');
  n.classList.toggle('open');
  document.body.style.overflow=n.classList.contains('open')?'hidden':'';
}
function closeNav(){
  document.getElementById('navBurger').classList.remove('open');
  document.getElementById('navLinks').classList.remove('open');
  document.body.style.overflow='';
}

// Partner modal
function openPartnerModal(){
  document.getElementById('partner-overlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closePartnerModal(){
  document.getElementById('partner-overlay').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('partner-overlay').addEventListener('click',function(e){
  if(e.target===this) closePartnerModal();
});
document.getElementById('partnerForm').addEventListener('submit',function(e){
  e.preventDefault();
  var btn=this.querySelector('.p-submit');
  btn.textContent='Sending...'; btn.disabled=true;
  var params={
    from_name: this.querySelector('[name="pname"]').value,
    from_email: this.querySelector('[name="pemail"]').value,
    phone: this.querySelector('[name="pcountry"]').value,
    investment_range: this.querySelector('[name="ptype"]').value,
    message: 'Partner inquiry'
  };
  emailjs.send('service_twgtu44','template_tf07rzd',params)
    .then(function(){
      document.getElementById('partnerOk').style.display='block';
      document.getElementById('partnerForm').reset();
      btn.textContent='Submit'; btn.disabled=false;
    },function(err){
      alert('Something went wrong. Please email us at sebastiansanchwb@gmail.com');
      btn.textContent='Submit'; btn.disabled=false;
    }).catch(function(err){
      alert('Error: '+JSON.stringify(err));
      btn.textContent='Submit'; btn.disabled=false;
    });
});
