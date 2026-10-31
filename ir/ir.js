/* Gateway de medição da hub do Abuelo — Kovantu Digital (Semana 2 do Plano Premium)
   Cada página /ir/<produto>.html conta o clique (contador próprio por produto e
   produto+origem) e redireciona pro checkout da Hotmart com UTM + src.
   Leitura dos contadores: https://abacus.jasoncameron.dev/get/kovantu-hub/<chave>
   Chaves: <produto> (total) e <produto>_<origem> (ex.: botica_ig). */
(function () {
  var PRODUTOS = {
    botica:     { nome: "La Botica del Abuelo",          url: "https://pay.hotmart.com/O108041747B" },
    noches:     { nome: "7 Noches de Descanso",          url: "https://pay.hotmart.com/X108041586D" },
    azucar:     { nome: "Azúcar Bajo Control",           url: "https://pay.hotmart.com/S108043878K" },
    vision:     { nome: "Visión Clara",                  url: "https://pay.hotmart.com/O108044404F" },
    detox:      { nome: "Detox Natural de 7 Días",       url: "https://pay.hotmart.com/R108041842Y" },
    biblioteca: { nome: "Biblioteca Vitalicia del Abuelo", url: "https://pay.hotmart.com/O108044229I" }
  };
  var NS = "kovantu-hub";
  var slug = document.body.getAttribute("data-produto");
  var p = PRODUTOS[slug];
  if (!p) { window.location.replace("https://guias-abuelo-francisco.vercel.app"); return; }

  var qs = new URLSearchParams(window.location.search);
  var origem = (qs.get("o") || "hub").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "hub";
  var utmSource = { ig: "instagram", fb: "facebook", hub: "hub", pinterest: "pinterest" }[origem] || origem;

  function hit(chave) {
    var img = new Image();
    img.src = "https://abacus.jasoncameron.dev/hit/" + NS + "/" + chave + "?_=" + Date.now();
  }
  hit(slug);
  hit(slug + "_" + origem);

  var destino = p.url +
    "?utm_source=" + encodeURIComponent(utmSource) +
    "&utm_medium=hub" +
    "&utm_campaign=guias-abuelo" +
    "&utm_content=" + encodeURIComponent(slug) +
    "&src=" + encodeURIComponent("hub_" + slug + "_" + origem);

  var link = document.getElementById("fallback");
  if (link) { link.href = destino; link.textContent = "Continuar a " + p.nome + " →"; }
  var nome = document.getElementById("produto-nome");
  if (nome) { nome.textContent = p.nome; }

  setTimeout(function () { window.location.replace(destino); }, 700);
})();
