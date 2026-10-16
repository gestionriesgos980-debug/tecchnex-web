// CAM-PÁGINA-01U — navegación, año y formulario que prepara un correo para contacto@tecchnex.com.
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
const navLinks = [...document.querySelectorAll('#mainNav a:not(.nav-cta)')];
const sections = [...document.querySelectorAll('main section[id]')];
function updateActive(){
  const y = window.scrollY + 120; let current = 'inicio';
  sections.forEach(section => { if(section.offsetTop <= y) current = section.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateActive, {passive:true}); updateActive();
const year = document.getElementById('year'); if(year) year.textContent = new Date().getFullYear();
document.getElementById('contactForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const email = form.dataset.contactEmail || 'contacto@tecchnex.com';
  const name = String(data.get('name') || '').trim();
  const company = String(data.get('company') || '').trim();
  const message = String(data.get('message') || '').trim();
  const subject = `Consulta desde la página TECCHNEX — ${name}`;
  const body = `Nombre: ${name}\nOrganización: ${company || 'No especificada'}\n\nNecesidad, problema o idea:\n${message}\n\nEnviado desde la página comercial de TECCHNEX.`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});


// CAM-PÁGINA-01Y — selección de necesidad: orienta el formulario sin enviar datos automáticamente.
const needChoices = [...document.querySelectorAll('[data-need-choice]')];
function chooseNeed(card){
  needChoices.forEach(item => {
    const selected = item === card;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  const form = document.getElementById('contactForm');
  const message = form?.querySelector('[name="message"]');
  const name = card.dataset.needChoice || '';
  if(message){
    const prefix = `Tipo de necesidad: ${name}.\n\n`;
    if(!message.value.trim() || message.dataset.needPrefill === 'true'){
      message.value = prefix;
      message.dataset.needPrefill = 'true';
    } else if(!message.value.startsWith('Tipo de necesidad:')) {
      message.value = prefix + message.value;
      message.dataset.needPrefill = 'true';
    } else {
      message.value = message.value.replace(/^Tipo de necesidad: .*?(?:\n\n|$)/, prefix);
      message.dataset.needPrefill = 'true';
    }
  }
  document.getElementById('contacto')?.scrollIntoView({behavior:'smooth',block:'start'});
  window.setTimeout(() => message?.focus({preventScroll:true}), 450);
}
needChoices.forEach(card => {
  card.setAttribute('aria-pressed','false');
  card.addEventListener('click', () => chooseNeed(card));
  card.addEventListener('keydown', event => {
    if(event.key === 'Enter' || event.key === ' '){event.preventDefault();chooseNeed(card);}
  });
});

// CAM-PÁGINA-01Z — navegación explícita al inicio desde menú y pie de página.
document.querySelectorAll('a[href="#inicio"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('menuToggle');
    nav?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (window.location.hash !== '#inicio') {
      window.history.replaceState(null, '', '#inicio');
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  });
});
