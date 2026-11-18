// ================================
// BALAZI VARAIS - main.js FINAL
// Tracking GA4 + Pixel + Scroll
// Carrossel Mobile + iOS
// ================================

console.log("Balazi LP carregada.");

/* ================
   SAFETY WRAPPERS
   ================ */
function safeGtag(event, params = {}) {
  try { gtag('event', event, params); } catch(e){}
}
function safeFb(event, params = {}) {
  try { fbq('trackCustom', event, params); } catch(e){}
}

/* ==============================================
   TRACK — WhatsApp
============================================== */
document.addEventListener("click", function(e){
  const el = e.target.closest('a[href*="wa.me"]');
  if (!el) return;

  safeGtag('whatsapp_click', {event_category:'lead'});
  safeFb('WhatsAppClick');
});

/* ==============================================
   TRACK — Clique em telefone
============================================== */
document.addEventListener("click", function(e){
  const el = e.target.closest('a[href^="tel:"]');
  if (!el) return;

  safeGtag('phone_click', {event_category:'lead'});
  safeFb('PhoneClick');
});

/* ==============================================
   TRACK — Formulário Kommo
============================================== */
document.addEventListener("submit", function(){
  safeGtag('form_submit', {event_category:'lead'});
  safeFb('FormSubmit');
}, true);

/* ==============================================
   TRACK — Scroll (25% / 50% / 75% / 100%)
============================================== */
let scrollMarks = {25:false, 50:false, 75:false, 100:false};

window.addEventListener("scroll", function(){
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = Math.floor((window.scrollY / height) * 100);

  [25, 50, 75, 100].forEach(mark => {
    if (percent >= mark && !scrollMarks[mark]) {
      scrollMarks[mark] = true;
      safeGtag(`scroll_${mark}`);
      safeFb(`Scroll${mark}`);
    }
  });
});

/* ==============================================
   CARROSSEL DE PROJETOS
============================================== */
(function(){
  const car = document.getElementById("carrosselProjetos");
  if (!car) return;

  const left = document.querySelector(".seta-esquerda");
  const right = document.querySelector(".seta-direita");

  if (right) {
    right.addEventListener("click", () => {
      car.scrollBy({left: 300, behavior: "smooth"});
    });
  }

  if (left) {
    left.addEventListener("click", () => {
      car.scrollBy({left: -300, behavior: "smooth"});
    });
  }

  // Swipe mobile
  let startX = 0;
  car.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  }, {passive:true});

  car.addEventListener("touchmove", e => {
    let currentX = e.touches[0].clientX;
    let delta = startX - currentX;
    car.scrollLeft += delta;
    startX = currentX;
  }, {passive:true});
})();

// FAQ toggle
document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.classList.toggle("open");
        const answer = btn.nextElementSibling;
        answer.style.display = answer.style.display === "block" ? "none" : "block";
    });
});

// Função para controlar a rolagem da galeria de depoimentos
function scrollDepoimentos(distance) {
  const galeria = document.getElementById("depoimentosGaleria");
  if (galeria) {
    galeria.scrollBy({left: distance, behavior: "smooth"});
  }
}


/* =====================================
   FORMULÁRIO BALAZI + WHATSAPP
   GA4 + META PIXEL
===================================== */

const formulario = document.getElementById("formOrcamento");

if (formulario) {

    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

        if (!formulario.reportValidity()) return;

        const dados = {
            nome: document.getElementById("nome").value.trim(),
            telefone: document.getElementById("telefone").value.trim(),
            cidade: document.getElementById("cidade").value.trim(),
            produto: document.getElementById("produto").value,
            medidas: document.getElementById("medidas").value.trim(),
            teto: document.getElementById("teto").value,
            observacoes: document.getElementById("observacoes").value.trim()
        };

        // Captura origem dos anúncios
        const parametros = new URLSearchParams(window.location.search);

        const utms = [
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content"
        ];

        let origem = [];

        utms.forEach(function(item) {
            const valor = parametros.get(item);
            if (valor) {
                origem.push(item + ": " + valor);
            }
        });

        // Monta mensagem
        const mensagem = `
Olá! Gostaria de solicitar um orçamento com a Balazi Varais.

*Nome:* ${dados.nome}
*WhatsApp:* ${dados.telefone}
*Cidade:* ${dados.cidade}
*Produto:* ${dados.produto}
*Medidas:* ${dados.medidas || "Não informado"}
*Tipo de teto:* ${dados.teto || "Não informado"}
*Observações:* ${dados.observacoes || "Nenhuma"}

*Origem do contato:*
${origem.length ? origem.join("\n") : "Acesso direto"}

#landing_page_google_ads
        `.trim();

        const numero = "555183140026";

        const link = "https://wa.me/" + numero +
            "?text=" + encodeURIComponent(mensagem);

        // Rastreamento GA4
        if (typeof gtag === "function") {
            gtag("event", "whatsapp_form_open", {
                event_category: "lead",
                event_label: "Formulario Landing Page",
                product: dados.produto
            });
        }

        // Rastreamento Meta Pixel
        if (typeof fbq === "function") {
            fbq("track", "Contact");
        }

        // Abre o WhatsApp
        window.open(link, "_blank", "noopener,noreferrer");

    });

}
