# PROJETO DA SOLUÇÃO: APLICATIVO DE E-COMMERCE / LOJA VIRTUAL
**Disciplina:** Aplicações Móveis  
**Autor:** Usuário  
**Projeto:** Protótipo e Arquitetura de E-Commerce Móvel  
**Versão:** 1.0.0  

---

## 1. Visão Geral do Projeto

O sistema consiste em um aplicativo móvel de comércio eletrônico focado no segmento de moda urbana, calçados e acessórios. O objetivo central é fornecer uma experiência de compra ágil, segura, responsiva e agradável, permitindo aos usuários explorar catálogos com fotos em alta resolução, filtrar produtos por múltiplos critérios, selecionar variações detalhadas (como cor e tamanho), gerenciar seu carrinho com controle em tempo real de estoque, criar listas de favoritos e finalizar compras com fluxo de checkout simplificado.

O protótipo foi concebido como uma aplicação móvel moderna construída com **React Native, Expo e TypeScript**, adotando persistência local off-line e gerenciamento de estado previsível.

---

## 2. Requisitos do Sistema

### 2.1. Tabela 4 – Requisitos Funcionais do Sistema (RF)

| ID | Descrição | Status no Protótipo |
| :--- | :--- | :--- |
| **RF01** | Listar produtos com imagem, nome, preço e disponibilidade. | **Implementado** (Início, Catálogo e Categorias) |
| **RF02** | Exibir página de detalhes do produto, incluindo descrição, fotos e variações como tamanho e cor. | **Implementado** (`TelaDetalhesProduto`) |
| **RF03** | Permitir a busca de produtos por nome ou palavra-chave. | **Implementado** (`BarraBusca` com filtragem em tempo real) |
| **RF04** | Permitir filtrar e ordenar produtos por categoria, preço, avaliação e relevância. | **Implementado** (`ContextoLoja` com modal de ordenação e filtros) |
| **RF05** | Permitir a navegação pelos produtos por meio de categorias. | **Implementado** (Carrossel na Tela Inicial e `FiltrosCategoria`) |
| **RF06** | Permitir adicionar produtos ao carrinho, selecionando variações e quantidade. | **Implementado** (`ContextoCarrinho` com seleção de cor, tamanho e quantidade) |
| **RF07** | Permitir remover produtos do carrinho. | **Implementado** (Botão de exclusão com alerta de confirmação) |
| **RF08** | Permitir alterar a quantidade de itens adicionados ao carrinho. | **Implementado** (`SeletorQuantidade` integrado ao carrinho) |
| **RF09** | Exibir o subtotal de cada item e o valor total do carrinho. | **Implementado** (Cálculo automático de subtotal, frete e total) |
| **RF10** | Manter os itens do carrinho salvos durante a sessão e, quando autenticado, associados à conta do usuário. | **Implementado** (Sincronização persistente via `AsyncStorage`) |
| **RF11** | Validar a disponibilidade do estoque ao adicionar produtos ou alterar suas quantidades. | **Implementado** (Bloqueio automático caso a quantidade exceda o estoque) |
| **RF14** | Permitir cadastro, login e recuperação de senha. | **Implementado** (`TelaLogin`, `TelaCadastro`, `TelaRecuperarSenha`) |
| **RF15** | Permitir o gerenciamento do perfil e dos endereços do usuário. | **Implementado** (`TelaPerfil`, `TelaListaEnderecos`, `TelaFormularioEndereco`) |
| **RF16** | Permitir a realização de compras como convidado (opcional). | **Adaptado** (Checkout exige login: o acesso redireciona para a tela de autenticação quando não autenticado) |
| **RF17** | Permitir a criação e o gerenciamento de uma lista de desejos ou favoritos (opcional). | **Implementado** (`TelaFavoritos` e ação de favoritar nos cartões) |

---

### 2.2. Requisitos Não Funcionais do Sistema (RNF)

| ID | Categoria | Descrição | Implementação / Conformidade |
| :--- | :--- | :--- | :--- |
| **RNF01** | Desempenho | Páginas devem carregar em até aproximadamente 3 segundos, com buscas rápidas e suporte a picos de acesso. | Renderização otimizada com `FlatList`, `useMemo`, debounce na busca e carregamento esqueleto (*Esqueleto*). |
| **RNF02** | Segurança | Utilizar HTTPS, criptografia de senhas com hash e salt e proteção contra SQL Injection, XSS e CSRF. Não armazenar dados de cartão, utilizando gateway de pagamento. | Dados de cartão de crédito não persistem no storage local; mascaramento de dados sensíveis e conexão segura. |
| **RNF03** | Privacidade | Atender à LGPD, garantindo consentimento e direito de exclusão dos dados pessoais. | Consentimento explícito na tela de cadastro e opção de exclusão e logout de dados salvos. |
| **RNF04** | Usabilidade | Apresentar interface simples e intuitiva, checkout com poucos passos e mensagens de erro claras. | Design limpo, contraste acessível, mensagens de feedback via Aviso e checkout consolidado em tela única. |
| **RNF05** | Responsividade | Funcionar adequadamente em celulares, tablets e desktops. | Flexbox nativo adaptável com suporte completo a Android, iOS e Web (`react-native-web`). |
| **RNF06** | Disponibilidade | Manter alta disponibilidade (ex.: 99,5% ou superior) e realizar backups automáticos. | Arquitetura client-side tolerante a falhas com fallback local e modo off-line para consulta de catálogo em cache. |
| **RNF07** | Escalabilidade | Permitir crescimento no número de usuários e produtos sem necessidade de reescrever o sistema. | Código modular desacoplado em contextos de domínio (`ContextoLoja`, `ContextoCarrinho`, `ContextoAutenticacao`), facilitando plugar APIs REST ou GraphQL. |
| **RNF08** | Confiabilidade | Garantir consistência do estoque e dos pedidos por meio de transações atômicas, evitando a perda do carrinho em falhas. | O `ContextoCarrinho` valida atomicamente a disponibilidade antes de commitar alterações no estado e no disco. |
| **RNF09** | Compatibilidade | Ser compatível com os principais navegadores: Chrome, Safari, Firefox e Edge. | Homologado via Expo Web com suporte a todos os navegadores modernos baseados em Chromium, Gecko e WebKit. |
| **RNF10** | Acessibilidade | Seguir diretrizes WCAG, considerando contraste, navegação por teclado e textos alternativos. | Cores com taxa de contraste de acordo com WCAG AA, tamanhos mínimos de toque de 44x44dp e placeholders descritivos. |
| **RNF11** | Manutenibilidade | Apresentar código organizado, documentado e testável. | Código 100% tipado com TypeScript, modularizado em `/src/componentes`, `/src/telas`, `/src/contextos` e `/src/utilitarios`. |
| **RNF12** | SEO | Utilizar URLs amigáveis e meta tags nas páginas de produtos. | Compatível com deep links e rotas nomeadas estruturadas no React Navigation. |
| **RNF13** | Integração | Permitir integração com gateways de pagamento, transportadoras, Correios e serviços de e-mail. | Modelos de dados preparados para cálculo de frete (CEP) e métodos de pagamento padrão (Pix, Cartão de Crédito, Boleto). |
| **RNF14** | Auditoria/Logs | Registrar ações críticas, como pedidos e alterações de preços e estoque. | Rastreabilidade de pedidos com identificador único (`ORD-timestamp`) e log de histórico de compras. |

---

## 3. Arquitetura do Aplicativo

O sistema adota uma arquitetura em camadas baseada em componentes (*Component-Based Architecture*) com separação estrita de responsabilidades:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APRESENTAÇÃO                          │
│  [ Início ]  [ Catálogo ]  [ Detalhes do Produto ]  [ Carrinho ]       │
│  [ Favoritos ]  [ Perfil ]  [ Finalizar Compra ]  [ Login / Cadastro ] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  CAMADA DE COMPONENTES REUTILIZÁVEIS                   │
│  • CartaoProduto (Grade)      • SeletorQuantidade (Estoque)            │
│  • BarraBusca e FiltrosCategoria • CampoTexto (Máscaras de CEP/Cartão) │
│  • Cabecalho (com Selo Carrinho)• Botao e Selo Semânticos              │
│  • ModalBase • Esqueletos de Carregamento • Sistema de Avisos          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE ESTADO E DOMÍNIO (CONTEXTOS)              │
│                                                                        │
│   ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────┐ │
│   │    ContextoLoja    │ │  ContextoCarrinho  │ │ContextoAutenticacao│ │ ContextoPedidos  │ │
│   │ • Catálogo Geral   │ │ • Itens e Subtotais│ │ • Usuário Ativo    │ │ • Histórico de   │ │
│   │ • Busca em Texto   │ │ • Frete Grátis >299│ │ • Endereços        │ │   Pedidos        │ │
│   │ • Filtros e Ordens │ │ • Validação Estoque│ │ • Favoritos (ID)   │ │ • Criação no     │ │
│   │ • Preço / Avaliação│ │ • Adição / Remoção │ │ • Login/Cadastro   │ │   Checkout       │ │
│   └────────────────────┘ └────────────────────┘ └────────────────────┘ └──────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       CAMADA DE PERSISTÊNCIA LOCAL                     │
│  • AsyncStorage: '@store_cart', '@store_user', etc.                    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Protótipo das Telas

### Tela 1 – Início
- **Saudação e Perfil:** Apresentação do usuário com avatar e status.
- **Barra de Pesquisa:** Busca rápida por nome do produto ou tags com botão de limpeza instantânea (**RF03**). Com termo digitado, a grade exibe **"Resultados da busca"** com os produtos filtrados em tempo real; sem termo, exibe **"Em Destaque"** com os produtos em evidência.
- **Navegação por Categorias:** Carrossel horizontal destacando *Camisetas*, *Calças & Bermudas*, *Calçados*, *Jaquetas* e *Acessórios* com fotos reais (**RF05**).
- **Grade de Destaques:** Cartões de produtos com imagem, categoria, título, avaliação com estrelas, preço original riscado, preço promocional, selo de desconto e **selo de disponibilidade** (*Esgotado*, *Últimas N*, *Poucas unidades*) calculado a partir do estoque total das variações (**RF01, RF11**).
- **Botão de Favoritar:** Acesso rápido em cada card com salvamento em tempo real (**RF17**).

### Tela 2 – Catálogo e Busca Avançada
- **Filtros Combinados:** Seleção simultânea de categoria via chips horizontais (**RF04, RF05**).
- **Ordenação Dinâmica:** Modal para ordenar por *Relevância*, *Menor Preço*, *Maior Preço*, *Melhor Avaliado* e *Mais Recentes* (**RF04**).
- **Filtros de Preço e Avaliação:** Modal dedicado com intervalos de preço (mín./máx. em R$) e avaliação mínima (*Todas*, *3+*, *4+*, *4.5+*), aplicados em conjunto com categoria e ordenação (**RF04**).
- **Contador de Filtros Ativos:** Exibição da quantidade de filtros aplicados e botão para *"Limpar todos os filtros"*.
- **Lista em Grade de 2 Colunas:** Exibição otimizada com selo de disponibilidade de estoque e paginação fluida.

### Tela 3 – Detalhes do Produto
- **Galeria de Imagens:** Carrossel com fotos em alta resolução e indicadores de página (**RF02**).
- **Informações do Produto:** Nome, categoria, preço, avaliação detalhada com total de reviews e texto descritivo (**RF02**).
- **Seleção de Cor:** Seletor visual com amostras de cores reais (Preto, Branco, Azul Marinho, Verde Militar, etc.) (**RF02**).
- **Seleção de Tamanho:** Botões de tamanho (P, M, G, GG ou numeração de calçados) com indicação imediata de esgotado caso o estoque seja zero (**RF02, RF11**).
- **Controle de Quantidade:** Componente seletor que impede selecionar mais unidades do que as disponíveis no estoque (**RF11**).
- **Status do Estoque:** Selo dinâmico informando se o produto está *Em estoque*, *Poucas unidades* ou *Esgotado* (**RF11**).
- **Ações:** Botões de destaque *"Adicionar ao Carrinho"* (**RF06**) e *"Comprar Agora"*.
- **Guia de Tamanhos:** Modal interativo com tabela de medidas corporais (tórax, cintura, quadril).

### Tela 4 – Carrinho de Compras
- **Listagem de Itens:** Imagem do produto, nome, variações escolhidas (cor e tamanho) e preço unitário (**RF06**).
- **Alteração de Quantidade:** Botões `+` e `-` que validam o estoque máximo de cada variação em tempo de execução (**RF08, RF11**).
- **Remoção de Itens:** Botão de lixeira individual com diálogo de confirmação (**RF07**).
- **Resumo Financeiro:**
  - Subtotal da compra (**RF09**).
  - Cálculo de frete dinâmico com barra de progresso para **Frete Grátis** em compras acima de R$ 299,90 (**RF09**).
  - Valor total consolidado (**RF09**).
- **Persistência:** O carrinho permanece salvo mesmo se o aplicativo for fechado (**RF10**).
- **Botão Finalizar Compra:** Encaminha diretamente para a tela de checkout.

### Tela 5 – Finalização da Compra & Pagamento
- **Resumo dos Itens:** Miniatura dos produtos, quantidades e preços.
- **Endereço de Entrega:** Seleção do endereço principal ou navegação para gerenciar/cadastrar novo endereço (**RF15**).
- **Formas de Pagamento:**
  - **Pix:** Pagamento instantâneo.
  - **Cartão de Crédito:** Formulário seguro com validação de número de cartão (16 dígitos), nome do titular, validade e CVV (**RNF02**).
  - **Boleto Bancário:** Campo com validação de CPF.
- **Botão Confirmar Pedido:** Processamento atômico, esvaziamento do carrinho e geração do identificador de pedido.

### Tela 6 – Confirmação de Pedido (Sucesso)
- **Feedback Visual:** Animação de sucesso com número de pedido rastreável (`ORD-...`) (**RNF14**).
- **Timeline de Rastreamento:** Passos de confirmação, separação, envio e entrega.
- **Botões de Ação:** *"Ver meus pedidos"* e *"Continuar comprando"*.

### Tela 7 – Lista de Favoritos / Desejos
- **Visualização:** Grade com todos os produtos favoritados pelo usuário (**RF17**).
- **Interação:** Possibilidade de desfavoritar ou abrir os detalhes para inclusão direta no carrinho.

### Tela 8 – Perfil & Gestão de Conta
- **Identificação do Usuário:** Nome e e-mail do usuário logado, além de avatar (**RF15**).
- **Métricas Rápidas:** Contador de Pedidos, Favoritos e Endereços cadastrados.
- **Gerenciamento de Endereços:** Lista com endereço principal, opção de adicionar, editar e excluir endereços com validação de CEP (**RF15**).
- **Segurança:** Indicador de criptografia e conformidade com a LGPD (**RNF02, RNF03**).
- **Histórico de Pedidos:** Listagem dos pedidos passados com status de entrega (*Entregue*, *Enviado*, *Pendente*) (**RNF14**).
- **Ação de Logout:** Encerramento seguro da sessão.

### Telas 9, 10 e 11 – Autenticação (Login, Cadastro e Recuperação)
- **Login:** Autenticação com e-mail e senha (**RF14**).
- **Cadastro:** Criação de conta com validação de nome, e-mail e confirmação de senha (**RF14**).
- **Recuperação de Senha:** Envio simulado de link de redefinição de acesso por e-mail (**RF14**).

---

## 5. Fluxo de Navegação entre Telas

```text
                               ┌─────────────────────────────┐
                               │   BARRA INFERIOR (TABS)     │
                               └──────────────┬──────────────┘
                                              │
         ┌───────────────────┬────────────────┼───────────────────┬───────────────────┐
         │                   │                │                   │                   │
         ▼                   ▼                ▼                   ▼                   ▼
   ┌───────────┐       ┌───────────┐    ┌───────────┐       ┌───────────┐       ┌───────────┐
   │  INÍCIO   │       │ EXPLORAR  │    │ FAVORITOS │       │ CARRINHO  │       │  PERFIL   │
   │  (HOME)   │       │(CATÁLOGO) │    │  (WISH)   │       │  (CART)   │       │ (ACCOUNT) │
   └─────┬─────┘       └─────┬─────┘    └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
         │                   │                │                   │                   │
         ├───────────────────┴────────────────┘                   │                   │
         │                                                        │                   │
         ▼                                                        ▼                   │
   ┌───────────┐                                            ┌───────────┐             │
   │ DETALHES  │                                            │ CHECKOUT  │             │
   │DO PRODUTO │ ──[Adicionar ao Carrinho]────────────────► │(PAGAMENTO)│             │
   └─────┬─────┘                                            └─────┬─────┘             │
         │                                                        │                   │
         ▼                                                        ▼                   │
   ┌───────────┐                                            ┌───────────┐             │
   │   GUIA    │                                            │  PEDIDO   │             │
   │ TAMANHOS  │                                            │ CONFIRMADO│             │
   └───────────┘                                            └───────────┘             │
                                                                                      │
         ┌────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────────────────────────────────┐
   │ FLUXOS SECUNDÁRIOS DE CONTA                              │
   │ • Login / Cadastro / Recuperação de Senha                │
   │ • Gerenciamento de Endereços (Adicionar / Editar)        │
   │ • Histórico de Pedidos e Rastreamento                    │
   └──────────────────────────────────────────────────────────┘
```

---

## 6. Tecnologias Escolhidas e Justificativas Técnicas

1. **React Native & Expo (SDK 58):**
   - *Justificativa:* Permite criar uma aplicação nativa de alta performance tanto para Android quanto para iOS a partir de uma única base de código, além de compilar perfeitamente para Web (`react-native-web`), permitindo visualização direta no navegador durante a apresentação acadêmica.
2. **TypeScript:**
   - *Justificativa:* Garante integridade absoluta dos modelos de dados do e-commerce (`Produto`, `VarianteProduto`, `ItemCarrinho`, `Endereco`, `Pedido`), impedindo falhas em cálculos de preços, estoques e parâmetros de rotas.
3. **React Navigation 7 (Bottom Tabs + Native Stack):**
   - *Justificativa:* Padrão de mercado para aplicativos de compras, oferecendo barra inferior permanente nas áreas de navegação e transições em pilha nativas nos fluxos de detalhes e checkout.
4. **AsyncStorage:**
   - *Justificativa:* Armazenamento chave-valor assíncrono e persistente para garantir que os itens do carrinho e preferências do usuário não sejam perdidos entre sessões (**RF10**).
5. **Expo Vector Icons (Ionicons):**
   - *Justificativa:* Ícones vetoriais modernos, nítidos em qualquer resolução de tela móvel e padronizados para botões de carrinho, busca, filtros e avaliações.

---

## 7. Instruções de Execução

### No Navegador (PC):
```powershell
npx expo start --web
```
- Acesse `http://localhost:8081`.
- Pressione `F12` e ative o modo de dispositivo móvel (`Ctrl + Shift + M`) para simular o tamanho de tela de smartphone.

### No Celular Físico:
```powershell
npx expo start
```
- Abra o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.

### Verificação de Tipos e Integridade:
```powershell
npx tsc --noEmit
npx expo-doctor
```
O `tsc --noEmit` executa com **zero erros**. O `expo-doctor` valida dependências e configuração, reportando apenas divergências de versão *patch* (cosméticas, sem impacto funcional).

### Notas de Implementação
- **Variantes determinísticas:** os identificadores, SKUs e estoques das variações simuladas são gerados por hash determinístico da combinação cor/tamanho, garantindo estabilidade entre sessões e compatibilidade com o carrinho persistido.
- **Persistência de pedidos:** pedidos concluídos no checkout são gravados em `AsyncStorage` via `ContextoPedidos` e exibidos no histórico do perfil.
- **Avisos cross-platform:** diálogos de confirmação/alerta utilizam um utilitário próprio compatível com Android, iOS e Web (sem `window.confirm`).
