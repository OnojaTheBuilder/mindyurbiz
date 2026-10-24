var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

// header
var hdr=document.getElementById('hdr');
if(hdr){
  var hero=document.querySelector('.page-hero');
  if(!hdr.classList.contains('solid') && hero){
    var trigger=function(){ hdr.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - 120); };
    trigger(); window.addEventListener('scroll',trigger,{passive:true});
  } else if(!hdr.classList.contains('solid')){ hdr.classList.add('solid'); }
}

// mobile menu
var burger=document.querySelector('.burger'), menu=document.getElementById('menu');
if(burger&&menu){
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);});});
}

// marquee loop
var marq=document.getElementById('marq'); if(marq) marq.innerHTML+=marq.innerHTML;

// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.rise').forEach(function(el){io.observe(el);});

// testimonial video: autoplays (muted, as browsers require), plays when on screen, pauses when off
document.querySelectorAll('video.auto').forEach(function(v){
  v.muted=true; v.defaultMuted=true;
  var btn=v.parentElement.querySelector('.vid-btn');
  if(btn){ btn.addEventListener('click',function(){ v.muted=!v.muted; btn.textContent=v.muted?'🔇 Tap for sound':'🔊 Sound on'; if(v.paused) v.play(); }); }
  var vio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else { v.pause(); }
  });},{threshold:.35});
  vio.observe(v);
});

// forms (Formspree)
var ENDPOINT='https://formspree.io/f/mvkgrglk';
document.querySelectorAll('form.js-form').forEach(function(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var note=form.querySelector('.form-note');
    var say=function(t,err){ if(note){ note.style.color=err?'#ff9a85':'var(--gold-bright)'; note.textContent=t; } };
    var groups=form.querySelectorAll('[data-need-check]');
    for(var i=0;i<groups.length;i++){
      if(!groups[i].querySelector('input:checked')){ say(groups[i].getAttribute('data-need-check'),true); groups[i].scrollIntoView({behavior:'smooth',block:'center'}); return; }
    }
    say('Sending…');
    var btn=form.querySelector('button[type=submit]'); if(btn) btn.disabled=true;
    fetch(ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(form)})
    .then(function(res){
      if(res.ok){
        form.innerHTML='<div style="padding:8px 0"><p class="eyebrow">Inquiry Received</p><h2 style="font-size:clamp(30px,4vw,48px)">You\u2019re In.</h2><p style="margin-top:14px;max-width:46ch">Thanks for reaching out. Evan\u2019s team has your message and will get back to you soon.</p></div>';
      } else {
        if(btn) btn.disabled=false;
        res.json().then(function(d){
          say((d&&d.errors&&d.errors.length)?d.errors.map(function(x){return x.message;}).join(', '):'Something went wrong. Email thebiz@mindyourbiz.biz instead.',true);
        }).catch(function(){ say('Something went wrong. Email thebiz@mindyourbiz.biz instead.',true); });
      }
    }).catch(function(){ if(btn) btn.disabled=false; say('Something went wrong. Email thebiz@mindyourbiz.biz instead.',true); });
  });
});
