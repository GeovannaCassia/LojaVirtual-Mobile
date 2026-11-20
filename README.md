# Urban Store

Aplicativo de e-commerce de moda urbana feito em React Native com Expo.

- **Repositório:** [github.com/seu-usuario/projeto-aplicacoes-moveis](https://github.com/GeovannaCassia/LojaVirtual-Mobile) 

## Sobre o projeto

A loja tem cadastro e login de usuário, catálogo de produtos com busca e filtros,
tela de detalhes com escolha de cor, tamanho e quantidade, favoritos, carrinho e
finalização de compra com endereço e forma de pagamento.

O catálogo vem da [DummyJSON](https://dummyjson.com/products), uma API pública
que não exige chave. Como ela é em inglês e com preços em dólar, os valores são
convertidos para real e cada produto é encaixado em uma das categorias da loja
(Camisetas, Vestidos, Calçados e Acessórios). Se a API estiver fora do ar ou a internet
falhar, o app cai no catálogo local de exemplo, mostra um aviso e oferece o
botão "Tentar de novo" — assim dá para navegar pela loja mesmo sem conexão.

## Requisitos da disciplina

| Requisito | Como foi feito |
| --- | --- |
| React Native com Expo | Projeto Expo SDK 58 |
| Pelo menos 3 telas com navegação | 16 telas: 5 abas (Início, Catálogo, Favoritos, Carrinho, Perfil) e telas de pilha (detalhes do produto, login, cadastro, checkout, endereços, pedidos...) |
| Uso de FlatList | Lista do catálogo com 2 colunas, lista de favoritos e histórico de pedidos |
| Consumo de API com loading e erro | `src/servicos/apiProdutos.ts` + estado `isLoading`/`error` no `ContextoLoja`, com esqueleto de carregamento, aviso de falha e botão de nova tentativa |
| Context API | `ContextoLoja`, `ContextoCarrinho` e `ContextoAutenticacao` |
| Persistência | AsyncStorage guardando filtros, carrinho, usuário logado, sessão e pedidos |

## Como executar

Pré-requisitos: Node.js 20 ou superior e o app **Expo Go** no celular (ou um
emulador Android/iOS instalado).

```bash
# 1. instale as dependências
npm install

# 2. suba o servidor de desenvolvimento
npx expo start
```

Depois disso, escaneie o QR Code com o Expo Go (Android) ou com a câmera
(iPhone). Também é possível rodar no navegador com:

```bash
npm run web
```

Para abrir direto em um emulador:

```bash
npm run android
npm run ios
```

## Organização das pastas

```
src/
  componentes/   componentes reutilizáveis (cartão de produto, cabeçalho, botões...)
  constantes/    tema (cores, espaçamentos) e dados de exemplo
  contextos/     estado global: loja, carrinho e autenticação
  navegacao/     abas e pilha de telas
  servicos/      chamadas à API do catálogo
  telas/         as telas do aplicativo
  tipos/         tipagens do projeto
  utilitarios/   formatação de preço, CEP, validações etc.
```

## Observações

- Não há backend próprio: usuários (nome, e-mail e senha) e pedidos ficam
  gravados no AsyncStorage do aparelho.
- A documentação completa de requisitos está em `PROJETO_SOLUCAO.md`.
- Para gerar o arquivo de entrega, compacte a pasta do projeto em `.zip`
  (sem a pasta `node_modules`).
