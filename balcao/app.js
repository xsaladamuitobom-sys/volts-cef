const state = {
  name: "Cidadao",
  id: 0,
  bank: 0,
  hasRg: 0,
  fines: 0,
  hasAlvara: 0,
  protocols: []
};

const SERVICES = [
  {
    code: "rg_1via",
    cat: "documentos",
    popular: true,
    name: "Emissao de RG - 1a via",
    priceLabel: "R$ 150",
    amount: 150,
    desc: "Emissao inicial da carteira de identidade civil do cidadao.",
    req: "Requisito: Nao possuir RG emitido.",
    needInput: false
  },
  {
    code: "rg_2via",
    cat: "documentos",
    popular: false,
    name: "Emissao de RG - 2a via",
    priceLabel: "R$ 300",
    amount: 300,
    desc: "Segunda via da identidade em caso de perda ou extravio.",
    req: "Requisito: Possuir RG ja emitido.",
    needInput: false
  },
  {
    code: "cert_residencia",
    cat: "documentos",
    popular: false,
    name: "Certidao de residencia",
    priceLabel: "R$ 200",
    amount: 200,
    desc: "Comprovante oficial de residencia municipal.",
    req: "Requisito: Conta ativa no servidor.",
    needInput: false
  },
  {
    code: "cert_nada_consta",
    cat: "documentos",
    popular: true,
    name: "Certidao negativa / Nada Consta",
    priceLabel: "R$ 250",
    amount: 250,
    desc: "Atesta ausencia de multas municipais pendentes.",
    req: "Requisito: Nao possuir multas pendentes.",
    needInput: false
  },
  {
    code: "alteracao_nome",
    cat: "documentos",
    popular: true,
    name: "Alteracao de nome / registro civil",
    priceLabel: "R$ 2.500",
    amount: 2500,
    desc: "Registra solicitacao de alteracao de nome civil mantendo historico.",
    req: "Requisito: Informar novo nome (3 a 24 caracteres).",
    needInput: true,
    label: "Novo nome civil desejado",
    placeholder: "Ex: Lucas Andrade"
  },
  {
    code: "reg_cadastral",
    cat: "documentos",
    popular: false,
    name: "Regularizacao cadastral",
    priceLabel: "R$ 350",
    amount: 350,
    desc: "Atualizacao e conferencia dos dados cadastrais municipais.",
    req: "Requisito: Conta ativa.",
    needInput: false
  },
  {
    code: "procuracao",
    cat: "documentos",
    popular: false,
    name: "Registro de procuracao",
    priceLabel: "R$ 500",
    amount: 500,
    desc: "Formaliza procuracao administrativa para representacao.",
    req: "Requisito: Informar outorgado ou finalidade.",
    needInput: true,
    label: "Outorgado ou finalidade",
    placeholder: "Ex: Representacao patrimonial"
  },
  {
    code: "quitar_multas",
    cat: "veiculos",
    popular: true,
    name: "Quitacao de multas",
    priceLabel: "Multas + 10%",
    amount: null,
    desc: "Quita debitos de multas pendentes acrescidos de 10% de taxa administrativa.",
    req: "Requisito: Possuir multas pendentes.",
    needInput: false
  },
  {
    code: "reg_veiculo",
    cat: "veiculos",
    popular: true,
    name: "Regularizacao de veiculo / IPVA / licenciamento",
    priceLabel: "R$ 400",
    amount: 400,
    desc: "Regulariza documentacao e licenciamento veicular.",
    req: "Requisito: Informar placa ou modelo do veiculo.",
    needInput: true,
    label: "Placa ou identificacao do veiculo",
    placeholder: "Ex: VLT-1024"
  },
  {
    code: "transf_veiculo",
    cat: "veiculos",
    popular: false,
    name: "Transferencia de veiculo",
    priceLabel: "R$ 600",
    amount: 600,
    desc: "Registra processo de transferencia de propriedade veicular.",
    req: "Requisito: Informar comprador ou destino.",
    needInput: true,
    label: "Nome ou ID do comprador",
    placeholder: "Ex: Carlos Silva"
  },
  {
    code: "cert_propriedade",
    cat: "veiculos",
    popular: false,
    name: "Certidao de propriedade",
    priceLabel: "R$ 300",
    amount: 300,
    desc: "Emite certidao de propriedade vinculada ao veiculo.",
    req: "Requisito: Informar veiculo.",
    needInput: true,
    label: "Placa ou modelo do veiculo",
    placeholder: "Ex: VLT-1024"
  },
  {
    code: "hist_veicular",
    cat: "veiculos",
    popular: false,
    name: "Historico veicular",
    priceLabel: "R$ 350",
    amount: 350,
    desc: "Consulta e emite historico administrativo do veiculo.",
    req: "Requisito: Informar veiculo.",
    needInput: true,
    label: "Placa ou modelo do veiculo",
    placeholder: "Ex: VLT-1024"
  },
  {
    code: "alvara_mei",
    cat: "empresas",
    popular: true,
    name: "Alvara autonomo / MEI",
    priceLabel: "R$ 500 (7d)",
    amount: 500,
    desc: "Emite alvara de atividade autonoma com validade de 7 dias reais.",
    req: "Requisito: Saldo bancario de R$ 500.",
    needInput: false
  },
  {
    code: "reg_empresa",
    cat: "empresas",
    popular: false,
    name: "Registro de empresa",
    priceLabel: "R$ 1.500",
    amount: 1500,
    desc: "Protocola abertura e registro de nova empresa municipal.",
    req: "Requisito: Informar nome da empresa.",
    needInput: true,
    label: "Nome da empresa",
    placeholder: "Ex: Oficina Central Volts"
  },
  {
    code: "alvara_comercial",
    cat: "empresas",
    popular: false,
    name: "Alvara comercial",
    priceLabel: "R$ 1.000",
    amount: 1000,
    desc: "Emite alvara de funcionamento comercial.",
    req: "Requisito: Informar estabelecimento.",
    needInput: true,
    label: "Nome do estabelecimento",
    placeholder: "Ex: Conveniencia Sul"
  },
  {
    code: "renovar_alvara",
    cat: "empresas",
    popular: false,
    name: "Renovacao de alvara",
    priceLabel: "R$ 500",
    amount: 500,
    desc: "Renova a validade do alvara por mais 7 dias reais.",
    req: "Requisito: Saldo bancario de R$ 500.",
    needInput: false
  },
  {
    code: "licenca_evento",
    cat: "empresas",
    popular: false,
    name: "Licenca para evento",
    priceLabel: "R$ 750",
    amount: 750,
    desc: "Autorizacao municipal para realizacao de evento.",
    req: "Requisito: Informar nome ou local do evento.",
    needInput: true,
    label: "Nome ou local do evento",
    placeholder: "Ex: Encontro Automotivo"
  },
  {
    code: "consulta_pendencias",
    cat: "multas",
    popular: false,
    name: "Consulta de pendencias",
    priceLabel: "R$ 100",
    amount: 100,
    desc: "Emite consulta oficial de debitos e situacao cadastral.",
    req: "Requisito: Saldo bancario de R$ 100.",
    needInput: false
  },
  {
    code: "parcelar_debitos",
    cat: "multas",
    popular: false,
    name: "Parcelamento de debitos",
    priceLabel: "Entrada 10%",
    amount: null,
    desc: "Registra entrada de 10% sobre os debitos pendentes.",
    req: "Requisito: Possuir multas pendentes.",
    needInput: false
  },
  {
    code: "limpeza_ficha",
    cat: "multas",
    popular: true,
    name: "Limpeza de ficha administrativa",
    priceLabel: "R$ 1.200",
    amount: 1200,
    desc: "Remove infracoes administrativas leves ja resolvidas. Nao apaga multas pendentes.",
    req: "Requisito: Sem multas pendentes.",
    needInput: false
  }
];

const TAB_TITLES = {
  inicio: "Inicio",
  todos: "Todos os servicos",
  documentos: "Documentos & Identidade",
  veiculos: "Veiculos & Transito",
  empresas: "Empresas & Licencas",
  multas: "Multas & Pendencias",
  protocolos: "Meus protocolos",
  historico: "Historico",
  informacoes: "Informacoes"
};

let pendingService = null;

function formatBRL(val) {
  return "R$ " + Number(val || 0).toLocaleString("pt-BR");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(type, msg, proto) {
  const box = document.getElementById("toastBox");
  if (!box) return;
  box.className = "toast open " + (type || "success");
  box.innerHTML =
    "<strong>" + escapeHtml(msg) + "</strong>" +
    (proto ? "<div style='margin-top:4px;color:#f5b82e'>Protocolo: " + escapeHtml(proto) + "</div>" : "");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => box.classList.remove("open"), 4500);
}

function emitCef(eventName, payload) {
  if (window.cef && typeof window.cef.emit === "function") {
    window.cef.emit(eventName, String(payload || ""));
  }
}

function renderServiceCard(srv) {
  const card = document.createElement("div");
  card.className = "service-card";
  card.innerHTML = `
    <div>
      <div class="service-top">
        <div class="service-name">${escapeHtml(srv.name)}</div>
        <span class="price-pill">${escapeHtml(srv.priceLabel)}</span>
      </div>
      <div class="service-desc" style="margin-top:6px">${escapeHtml(srv.desc)}</div>
      <div class="service-req" style="margin-top:6px">${escapeHtml(srv.req)}</div>
    </div>
    <div class="service-actions">
      <button class="btn-gold" type="button">Solicitar</button>
    </div>
  `;
  card.querySelector("button").addEventListener("click", () => openServiceModal(srv));
  return card;
}

function renderAllServices() {
  const grids = {
    populares: document.getElementById("gridPopulares"),
    todos: document.getElementById("gridTodos"),
    documentos: document.getElementById("gridDocumentos"),
    veiculos: document.getElementById("gridVeiculos"),
    empresas: document.getElementById("gridEmpresas"),
    multas: document.getElementById("gridMultas")
  };

  Object.values(grids).forEach((g) => {
    if (g) g.innerHTML = "";
  });

  SERVICES.forEach((srv) => {
    if (srv.popular && grids.populares) grids.populares.appendChild(renderServiceCard(srv));
    if (grids.todos) grids.todos.appendChild(renderServiceCard(srv));
    if (grids[srv.cat]) grids[srv.cat].appendChild(renderServiceCard(srv));
  });
}

function estimateAmount(srv) {
  if (typeof srv.amount === "number") return srv.amount;
  if (srv.code === "quitar_multas") {
    if (state.fines <= 0) return 0;
    return state.fines + Math.ceil(state.fines * 0.10);
  }
  if (srv.code === "parcelar_debitos") {
    if (state.fines <= 0) return 0;
    return Math.max(1, Math.ceil(state.fines * 0.10));
  }
  return 0;
}

function openServiceModal(srv) {
  pendingService = srv;
  document.getElementById("modalTitle").textContent = srv.name;
  document.getElementById("modalDesc").textContent = srv.desc;

  const group = document.getElementById("groupParam1");
  const input = document.getElementById("inputParam1");

  if (srv.needInput) {
    group.classList.add("visible");
    document.getElementById("labelParam1").textContent = srv.label || "Informacao";
    input.placeholder = srv.placeholder || "";
    input.value = "";
  } else {
    group.classList.remove("visible");
    input.value = "";
  }

  const est = estimateAmount(srv);
  document.getElementById("modalSummary").innerHTML = `
    <div><strong>Valor estimado:</strong> ${formatBRL(est)}</div>
    <div><strong>Saldo em conta:</strong> ${formatBRL(state.bank)}</div>
    <div><strong>Cobranca:</strong> Direto no banco apos validacao do servidor</div>
  `;

  document.getElementById("modalConfirm").classList.add("open");
  if (srv.needInput) {
    setTimeout(() => input.focus(), 30);
  }
}

function closeServiceModal() {
  pendingService = null;
  document.getElementById("modalConfirm").classList.remove("open");
}

function renderPlayerState() {
  document.getElementById("topNome").textContent = state.name;
  document.getElementById("topId").textContent = "#" + state.id;
  document.getElementById("topBanco").textContent = formatBRL(state.bank);

  document.getElementById("statBanco").textContent = formatBRL(state.bank);
  document.getElementById("statRG").textContent = state.hasRg ? "Emitido" : "Nao emitido";
  document.getElementById("statMultas").textContent = formatBRL(state.fines);
  document.getElementById("statAlvara").textContent = state.hasAlvara ? "Ativo (7d)" : "Inativo";
}

function renderProtocols() {
  const homeEl = document.getElementById("homeProtocolos");
  const fullEl = document.getElementById("listaProtocolos");
  const histEl = document.getElementById("listaHistorico");

  if (!state.protocols.length) {
    homeEl.innerHTML = '<div class="list-item">Nenhum protocolo registrado ainda.</div>';
    fullEl.innerHTML = '<div class="list-item">Nenhum protocolo encontrado.</div>';
    histEl.innerHTML = '<div class="list-item">Nenhum registro no historico.</div>';
    return;
  }

  homeEl.innerHTML = state.protocols
    .slice(0, 4)
    .map(
      (p) => `
      <div class="list-item">
        <span class="proto-code">${escapeHtml(p.code)}</span> • ${escapeHtml(p.name)} — <strong>${formatBRL(p.amount)}</strong> (${escapeHtml(p.status)})
      </div>
    `
    )
    .join("");

  const allHtml = state.protocols
    .map(
      (p) => `
      <div class="list-item">
        <div><span class="proto-code">${escapeHtml(p.code)}</span> • <strong>${escapeHtml(p.name)}</strong> • ${escapeHtml(p.status)}</div>
        <div style="color:#98a6c2;margin-top:3px">${escapeHtml(p.date)} • Valor: ${formatBRL(p.amount)}${p.details ? " • " + escapeHtml(p.details) : ""}</div>
      </div>
    `
    )
    .join("");

  fullEl.innerHTML = allHtml;
  histEl.innerHTML = allHtml;
}

function switchTab(tabName) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  document.querySelectorAll(".section").forEach((sec) => {
    sec.classList.remove("active");
  });

  const target = document.getElementById("sec-" + tabName);
  if (target) target.classList.add("active");

  document.getElementById("pageTitle").textContent = TAB_TITLES[tabName] || "Balcao Administrativo";
}

function bindEvents() {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll("[data-jump]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.jump));
  });

  document.getElementById("btnCancelModal").addEventListener("click", closeServiceModal);

  document.getElementById("modalConfirm").addEventListener("click", (e) => {
    if (e.target.id === "modalConfirm") closeServiceModal();
  });

  document.getElementById("btnConfirmModal").addEventListener("click", () => {
    if (!pendingService) return;
    const rawInput = document.getElementById("inputParam1").value.trim().replace(/\|/g, " ");
    const payload = rawInput ? `${pendingService.code}|${rawInput}` : pendingService.code;
    emitCef("volts:balcao_request", payload);
    closeServiceModal();
  });

  document.getElementById("btnFechar").addEventListener("click", () => {
    emitCef("volts:balcao_close", "1");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.getElementById("modalConfirm").classList.contains("open")) {
        closeServiceModal();
      } else {
        emitCef("volts:balcao_close", "1");
      }
    }
  });
}

function registerCefListeners() {
  if (!window.cef || typeof window.cef.on !== "function") return;

  window.cef.on("volts:balcao_player", (raw) => {
    const parts = String(raw || "").split("|");
    state.name = parts[0] || "Cidadao";
    state.id = parseInt(parts[1] || "0", 10) || 0;
    state.bank = parseInt(parts[2] || "0", 10) || 0;
    state.hasRg = parseInt(parts[3] || "0", 10) || 0;
    state.fines = parseInt(parts[4] || "0", 10) || 0;
    state.hasAlvara = parseInt(parts[5] || "0", 10) || 0;
    renderPlayerState();
  });

  window.cef.on("volts:balcao_protocols_clear", () => {
    state.protocols = [];
    renderProtocols();
  });

  window.cef.on("volts:balcao_protocol_item", (raw) => {
    const parts = String(raw || "").split("|");
    state.protocols.push({
      code: parts[0] || "",
      name: parts[1] || "",
      amount: parseInt(parts[2] || "0", 10) || 0,
      status: parts[3] || "Concluido",
      date: parts[4] || "",
      details: parts[5] || ""
    });
    renderProtocols();
  });

  window.cef.on("volts:balcao_feedback", (tipo, mensagem, protocolo) => {
    showToast(tipo, mensagem, protocolo);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  registerCefListeners();
  renderAllServices();
  renderPlayerState();
  renderProtocols();
  emitCef("volts:balcao_ready", "1");
});
