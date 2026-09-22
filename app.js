// year
var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();

// header background: solid on interior pages, scroll-triggered on pages with a tall dark hero
var hdr=document.getElementById('hdr');
if(hdr){
  var hero=document.querySelector('.page-hero');
  if(hdr.classList.contains('solid')){
    // stays solid
  } else if(hero){
    var trigger=function(){ hdr.classList.toggle('scrolled', window.scrollY > hero.offsetHeight - 120); };
    trigger(); window.addEventListener('scroll',trigger,{passive:true});
  } else {
    hdr.classList.add('solid');
  }
}

// mobile menu
var burger=document.querySelector('.burger'), menu=document.getElementById('menu');
if(burger&&menu){
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded',false);});});
}

// marquee seamless loop
var marq=document.getElementById('marq'); if(marq) marq.innerHTML+=marq.innerHTML;

// reveal on scroll
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
document.querySelectorAll('.rise').forEach(function(el){io.observe(el);});

// inquiry form: validate, then POST to Netlify via fetch so it works reliably
// and we can show an inline success message (no dependency on a separate page).
var form=document.getElementById('inquiryForm');
if(form){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var note=document.getElementById('formNote');
    var checked=form.querySelectorAll('input[name="interest"]:checked').length;
    if(checked===0){
      if(note) note.textContent='Pick at least one thing you\u2019re interested in.';
      return;
    }
    if(note){ note.style.color='var(--gold-bright)'; note.textContent='Sending…'; }

    var data=new URLSearchParams(new FormData(form)).toString();
    fetch('/',{
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:data
    }).then(function(res){
      if(res.ok){
        // swap the form for an inline thank-you block
        form.innerHTML='<div style="padding:8px 0"><p class="eyebrow" style="color:var(--gold-bright)">Inquiry Received</p>'
          +'<h2 style="color:var(--ivory);font-size:clamp(30px,4vw,48px)">You\u2019re In.</h2>'
          +'<p style="color:#c9c1b0;margin-top:14px;max-width:46ch">Thanks for reaching out. Evan\u2019s team has your message and will get back to you soon.</p></div>';
      } else {
        if(note){ note.style.color='#e0785f'; note.textContent='Something went wrong. Email thebiz@mindyourbiz.biz instead.'; }
      }
    }).catch(function(){
      if(note){ note.style.color='#e0785f'; note.textContent='Something went wrong. Email thebiz@mindyourbiz.biz instead.'; }
    });
  });
}
