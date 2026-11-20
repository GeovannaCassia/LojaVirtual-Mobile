import { Produto, VarianteProduto } from '../tipos';
import { CATEGORIAS_SIMULADAS } from '../constantes/dadosSimulados';

/**
 * Catálogo da loja carregado da DummyJSON, uma API pública que não pede chave
 * de acesso. Os dados vêm em inglês e com o preço em dólar, então cada item é
 * convertido para real e encaixado em uma das categorias que já existem no app.
 *
 * Os produtos "de exemplo" que estão em constantes/dadosSimulados.ts continuam
 * valendo como reserva: se a API estiver fora do ar, a loja abre com eles.
 */

const URL_CATALOGO =
  'https://dummyjson.com/products?limit=0&select=id,title,description,category,price,discountPercentage,rating,stock,tags,images,thumbnail';

// Câmbio fixo só para os preços ficarem numa faixa parecida com a da loja.
const DOLAR_EM_REAIS = 5.5;

// Sem isso uma conexão ruim deixaria a tela de carregamento presa para sempre.
const TEMPO_LIMITE_MS = 12000;

interface ProdutoApi {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  images?: string[];
  thumbnail?: string;
}

// A API tem 24 categorias (comida, eletrônicos, etc). Só interessam as de moda,
// e cada uma aponta para a categoria correspondente dentro da loja.
const CATEGORIA_DA_API: Record<string, string> = {
  'mens-shirts': 'cat-tshirts',
  tops: 'cat-tshirts',
  'womens-dresses': 'cat-dresses',
  'mens-shoes': 'cat-shoes',
  'womens-shoes': 'cat-shoes',
  sunglasses: 'cat-accessories',
  'mens-watches': 'cat-accessories',
  'womens-watches': 'cat-accessories',
  'womens-bags': 'cat-accessories',
  'womens-jewellery': 'cat-accessories',
};

// A API não devolve cor nem tamanho, então montamos as variações a partir do
// estoque total do produto, usando uma paleta e uma grade de tamanhos por tipo.
const CORES_POR_CATEGORIA: Record<string, { nome: string; hex: string }[]> = {
  'cat-tshirts': [
    { nome: 'Preto', hex: '#1E293B' },
    { nome: 'Branco', hex: '#F8FAFC' },
    { nome: 'Verde Militar', hex: '#4D5D3D' },
  ],
  'cat-shoes': [
    { nome: 'Preto', hex: '#1E293B' },
    { nome: 'Branco', hex: '#F8FAFC' },
    { nome: 'Cinza', hex: '#64748B' },
  ],
  'cat-dresses': [
    { nome: 'Preto', hex: '#1E293B' },
    { nome: 'Vinho', hex: '#7F1D1D' },
    { nome: 'Bege', hex: '#D4C4B0' },
  ],
  'cat-accessories': [
    { nome: 'Preto', hex: '#1E293B' },
    { nome: 'Marrom', hex: '#8B5E3C' },
  ],
};

const TAMANHOS_POR_CATEGORIA: Record<string, string[]> = {
  'cat-tshirts': ['P', 'M', 'G', 'GG'],
  'cat-dresses': ['P', 'M', 'G', 'GG'],
  'cat-shoes': ['38', '39', '40', '41', '42', '43'],
  'cat-accessories': ['Único'],
};

function nomeDaCategoria(categoriaId: string): string {
  const encontrada = CATEGORIAS_SIMULADAS.find((c) => c.id === categoriaId);
  return encontrada ? encontrada.name : 'Acessórios';
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function gerarVariantes(item: ProdutoApi, categoriaId: string): VarianteProduto[] {
  const cores = CORES_POR_CATEGORIA[categoriaId] || CORES_POR_CATEGORIA['cat-accessories'];
  const tamanhos = TAMANHOS_POR_CATEGORIA[categoriaId] || ['Único'];
  const combinacoes = cores.length * tamanhos.length;

  // Divide o estoque da API entre as combinações que criamos, sempre deixando
  // pelo menos uma unidade para o produto não aparecer esgotado.
  const estoquePorVariante = Math.max(1, Math.floor(item.stock / combinacoes));

  const variantes: VarianteProduto[] = [];
  cores.forEach((cor) => {
    tamanhos.forEach((tamanho) => {
      variantes.push({
        id: `var-${item.id}-${cor.nome}-${tamanho}`.replace(/\s+/g, '-'),
        color: cor.nome,
        colorHex: cor.hex,
        size: tamanho,
        stock: estoquePorVariante,
        sku: `API-${item.id}-${tamanho}`,
      });
    });
  });
  return variantes;
}

function converterProduto(item: ProdutoApi, categoriaId: string): Produto {
  const preco = arredondar(item.price * DOLAR_EM_REAIS);

  // O desconto da API vem em porcentagem; aqui ele vira o "preço cheio" que a
  // vitrine risca, e só entra quando faz diferença de pelo menos um real.
  const precoCheio =
    item.discountPercentage > 0 ? arredondar(preco / (1 - item.discountPercentage / 100)) : 0;

  const imagens =
    item.images && item.images.length > 0 ? item.images : item.thumbnail ? [item.thumbnail] : [];

  return {
    id: `api-${item.id}`,
    name: item.title,
    description: item.description,
    price: preco,
    originalPrice: precoCheio > preco ? precoCheio : undefined,
    images: imagens,
    category: nomeDaCategoria(categoriaId),
    categoryId: categoriaId,
    variants: gerarVariantes(item, categoriaId),
    rating: Math.round(item.rating * 10) / 10,
    // A listagem da API não traz o total de avaliações, só a nota média. Esse
    // número é só ilustrativo, para a vitrine não ficar toda com "0 avaliações".
    reviewCount: 30 + ((item.id * 37) % 420),
    tags: (item.tags || []).slice(0, 4),
  };
}

export async function buscarProdutosDaApi(): Promise<Produto[]> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);

  try {
    const resposta = await fetch(URL_CATALOGO, { signal: controlador.signal });

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}`);
    }

    const dados = await resposta.json();
    const itens: ProdutoApi[] = Array.isArray(dados?.products) ? dados.products : [];

    const produtos = itens
      .filter((item) => Boolean(CATEGORIA_DA_API[item.category]))
      .map((item) => converterProduto(item, CATEGORIA_DA_API[item.category]));

    // Se a API mudar e nenhuma categoria bater, é melhor tratar como falha e
    // cair no catálogo local do que abrir uma loja vazia.
    if (produtos.length === 0) {
      throw new Error('A API não devolveu nenhum produto de moda');
    }

    return produtos;
  } finally {
    clearTimeout(temporizador);
  }
}
