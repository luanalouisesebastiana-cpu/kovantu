# Torre Kovantu — AO VIVO

Sede voxel da **Kovantu Digital**, publicada no GitHub Pages:
**https://luanalouisesebastiana-cpu.github.io/kovantu/**

## Como funciona o "ao vivo"

- `index.html` é a torre (v3). Ela **não** guarda o elenco: a cada **30 segundos**
  ela busca `equipe.json` (com cache-busting) e aplica as mudanças **sem recarregar**.
- `equipe.json` é a fonte da verdade do elenco: quem está na empresa, cargo,
  departamento, status (`ativo`|`pausado`), o que está fazendo (`fazendo`) e as
  `tarefas` (lista de `{nome, progresso}`).
- **Contratar alguém = adicionar um objeto no array `equipe`** com um `id` novo.
  A pessoa aparece sozinha na torre em até ~30s + o tempo do deploy do Pages (~1 min).
  Remover o objeto aposenta a pessoa. Mudar `fazendo`/`tarefas` atualiza o painel,
  o ticker e os balões na hora.
- Campos opcionais por pessoa: `comportamento` — `sentado` (padrão), `empe`
  (fica em pé, ex.: Titiku) ou `dormindo` (dorme no sofá do depto, ex.: Teodoro).
- Uniformes (passe de 29/out): o padrão é camisa na cor do departamento + calça
  escura + mini-K verde no peito. Exceções via `uniforme`: `blazer-preto`
  (Charlis) ou `blazer-cinza` (Titiku) — blazer com camisa branca e gravata.
  `genero`: `F` liga o visual feminino (rosto com cílios/boca marcada, corte da
  blusa) e `cabelo`: `longo` | `coque` | `rabo` (só faz efeito com `genero: "F"`).
- Departamentos válidos (`depto`): `diretoria`, `abuelo`, `hotmart`, `stock`,
  `blogs`, `arcade`, `youtube`, `kdp`, `apps`, `farejador`.
  Se um departamento lotar as mesas, a pessoa extra fica em pé na área do depto —
  ninguém é descartado.
- Se o `equipe.json` não carregar (ex.: arquivo aberto direto do disco), a página
  usa uma cópia embutida e o selo no topo mostra **MODO ARQUIVO**; com o JSON vivo,
  o selo mostra **AO VIVO • atualizado às HH:MM**.
- Atualize também o campo `atualizadoEm` (topo do JSON, ISO com fuso -03:00) a
  cada edição — é ele que aparece no selo.

## Versão e atualização automática (sem truque de `?v=`)

O celular do dono vivia servindo a cópia velha em cache a cada correção.
Agora a página se atualiza sozinha:

- O HTML carrega a constante **`PAGE_VERSION`** (formato `AAAA-MM-DD.N`,
  ex.: `2026-10-29.6` — data + sequencial do dia).
- Ao lado da página mora o **`versao.json`**: `{ "v": "<versão>", "publicadoEm": "<ISO>" }`.
- A cada polling (30s), junto da busca do `equipe.json`, a página busca o
  `versao.json` com cache-busting e compara com o seu `PAGE_VERSION`. Se
  divergir, ela mostra um toast ("🔄 Atualizando…") e **se recarrega uma
  única vez** navegando pra mesma URL com `?v=<versão nova>` — URL nova
  fura o cache do navegador e baixa o HTML fresco.
- Anti-loop: no máximo **um reload por versão por sessão** (a tentativa
  fica em `sessionStorage`). Se o CDN demorar a trocar o HTML, ela só
  tenta de novo após ~10 ciclos (~5 min) de divergência contínua, ou
  quando o `versao.json` mudar outra vez. Falha de fetch (ex.: arquivo
  aberto direto do disco, sem os arquivos ao lado) = silêncio total:
  nenhum reload, a página segue no modo embutido.

**⚠️ REGRA DE PUBLICAÇÃO — toda vez que o `index.html` mudar:**
1. Suba o sequencial do `PAGE_VERSION` dentro do HTML.
2. Grave a **mesma** versão no `versao.json` (e atualize o `publicadoEm`).
3. Commit dos dois juntos + push. Sem isso, quem já tem a página aberta
   não recebe a versão nova — e com os dois diferentes sem querer, as
   páginas abertas recarregam à toa.

Mudança **só no `equipe.json`** (elenco/status/tarefas) NÃO precisa mexer
na versão — o polling de dados já entrega sem reload.

## Atualizar

Edite `equipe.json` → commit → push pra `main`. O Pages republica sozinho.
Cópia local de trabalho: `~/workspace/kovantu-site/` (clone deste repo);
a versão de entrega fica em `~/workspace/your_files/kovantu-digital-3d/`.
