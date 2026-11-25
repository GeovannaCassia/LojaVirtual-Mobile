import type { NavigatorScreenParams } from '@react-navigation/native';

export interface VarianteProduto {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  stock: number;
  sku: string;
}

export interface Produto {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // preço antes do desconto
  images: string[]; // URLs ou imagens locais
  category: string;
  categoryId: string;
  variants: VarianteProduto[];
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Categoria {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface ItemCarrinho {
  id: string; // id do item dentro do carrinho
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  color: string;
  colorHex: string;
  size: string;
  price: number; // preço no momento em que foi adicionado
  quantity: number;
  stock: number; // estoque usado na validação
}

export interface Endereco {
  id: string;
  label: string; // "Casa", "Trabalho"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Usuario {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  addresses: Endereco[];
  favorites: string[]; // ids dos produtos favoritados
}

export interface Pedido {
  id: string;
  userId: string;
  items: ItemCarrinho[];
  shippingAddress: Endereco;
  paymentMethod: 'pix' | 'credit_card' | 'boleto';
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export type OpcaoOrdenacao = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export interface EstadoFiltro {
  categoryId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
  sortBy: OpcaoOrdenacao;
  searchQuery: string;
}

export type ParametrosPilhaRaiz = {
  AbasPrincipais: NavigatorScreenParams<ParametrosAbas> | undefined;
  DetalhesProduto: { produtoId: string };
  Login: { redirecionarParaCheckout?: boolean } | undefined;
  Cadastro: { redirecionarParaCheckout?: boolean } | undefined;
  RecuperarSenha: undefined;
  ListaEnderecos: { origemCheckout?: boolean } | undefined;
  FormularioEndereco: { endereco?: Endereco; origemCheckout?: boolean } | undefined;
  FinalizarCompra: undefined;
  PedidoConfirmado: { pedidoId: string };
  HistoricoPedidos: undefined;
  ProdutosCategoria: { categoriaId: string; nomeCategoria: string };
  EditarPerfil: undefined;
  AlterarSenha: undefined;
};

export type ParametrosAbas = {
  Inicio: undefined;
  Catalogo: undefined;
  Favoritos: undefined;
  Carrinho: undefined;
  Perfil: undefined;
};
