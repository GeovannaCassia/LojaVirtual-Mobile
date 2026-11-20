import { Produto, VarianteProduto, Categoria, Usuario } from '../tipos';

const variantColors = {
  black: { name: 'Preto', hex: '#1E293B' },
  white: { name: 'Branco', hex: '#F8FAFC' },
  navy: { name: 'Azul Marinho', hex: '#1E3A8A' },
  olive: { name: 'Verde Militar', hex: '#4D5D3D' },
  gray: { name: 'Cinza', hex: '#64748B' },
  beige: { name: 'Bege', hex: '#D4C4B0' },
  brown: { name: 'Marrom', hex: '#8B5E3C' },
  silver: { name: 'Prata', hex: '#94A3B8' },
};

const sizes = ['P', 'M', 'G', 'GG'];
const shoeSizes = ['38', '39', '40', '41', '42', '43', '44'];

function hashSeed(...parts: (string | number)[]): number {
  let h = 2166136261;
  const str = parts.join('-');
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function generateVariants(colorKeys: string[], sizeSet: string[], baseStock = 15): VarianteProduto[] {
  const variants: VarianteProduto[] = [];
  colorKeys.forEach((colorKey) => {
    const color = variantColors[colorKey as keyof typeof variantColors] || { name: colorKey, hex: '#64748B' };
    sizeSet.forEach((size) => {
      variants.push({
        id: `var-${colorKey}-${size}-${Math.floor(hashSeed(colorKey, size) * 1e6).toString(36)}`,
        color: color.name,
        colorHex: color.hex,
        size,
        stock: Math.floor(hashSeed(colorKey, size, 'stock') * baseStock) + 1,
        sku: `SKU-${colorKey.toUpperCase()}-${size}-${Math.floor(hashSeed(colorKey, size, 'sku') * 1000)}`,
      });
    });
  });
  return variants;
}

export const CATEGORIAS_SIMULADAS: Categoria[] = [
  {
    id: 'cat-tshirts',
    name: 'Camisetas',
    icon: 'shirt-outline',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
  },
  {
    id: 'cat-dresses',
    name: 'Vestidos',
    icon: 'rose-outline',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
  },
  {
    id: 'cat-pants',
    name: 'Calças & Bermudas',
    icon: 'pants-outline',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop',
  },
  {
    id: 'cat-shoes',
    name: 'Calçados',
    icon: 'footsteps-outline',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
  },
  {
    id: 'cat-jackets',
    name: 'Jaquetas & Casacos',
    icon: 'jacket-outline',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
  },
  {
    id: 'cat-accessories',
    name: 'Acessórios',
    icon: 'watch-outline',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop',
  },
];

const unsplashImages = {
  shirts: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
  ],
  pants: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop',
  ],
  jackets: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&h=800&fit=crop',
  ],
};

export const PRODUTOS_SIMULADOS: Produto[] = [
  // CAMISETAS
  {
    id: 'prod-1',
    name: 'Camiseta Básica Premium',
    description: 'Camiseta 100% algodão orgânico, fio 30.1 penteado. Caimento perfeito, toque macio e durabilidade superior. Ideal para o dia a dia ou compor looks casuais elegantes.',
    price: 79.90,
    originalPrice: 99.90,
    images: unsplashImages.shirts,
    category: 'Camisetas',
    categoryId: 'cat-tshirts',
    variants: generateVariants(['black', 'white', 'navy', 'gray'], sizes, 20),
    rating: 4.8,
    reviewCount: 324,
    tags: ['básica', 'algodão', 'orgânico', 'essencial'],
  },
  {
    id: 'prod-2',
    name: 'Camiseta Oversized Streetwear',
    description: 'Modelagem oversized contemporânea, tecido encorpado 260g/m². Estilo urbano com acabamento premium. Disponível em cores neutras e vibrantes.',
    price: 119.90,
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
    ],
    category: 'Camisetas',
    categoryId: 'cat-tshirts',
    variants: generateVariants(['black', 'olive', 'beige', 'white'], sizes, 15),
    rating: 4.6,
    reviewCount: 187,
    tags: ['oversized', 'streetwear', 'urbano', 'tendência'],
  },
  {
    id: 'prod-3',
    name: 'Camiseta Manga Longa Thermal',
    description: 'Tecnologia thermal para conforto térmico. Tecido duplo face com interior flanelado. Perfeita para meia-estação e inverno leve.',
    price: 139.90,
    originalPrice: 169.90,
    images: unsplashImages.shirts,
    category: 'Camisetas',
    categoryId: 'cat-tshirts',
    variants: generateVariants(['black', 'navy', 'gray', 'olive'], sizes, 12),
    rating: 4.7,
    reviewCount: 95,
    tags: ['manga longa', 'thermal', 'inverno', 'conforto'],
  },

  // CALÇAS & BERMUDAS
  {
    id: 'prod-4',
    name: 'Calça Jogger Tech Fleece',
    description: 'Tecido tech fleece com elastano. Bolso com zíper invisível, cordão interno ajustável. Conforto máximo para movimento e estilo athleisure.',
    price: 189.90,
    images: unsplashImages.pants,
    category: 'Calças & Bermudas',
    categoryId: 'cat-pants',
    variants: generateVariants(['black', 'navy', 'gray', 'olive'], sizes, 18),
    rating: 4.9,
    reviewCount: 412,
    tags: ['jogger', 'tech fleece', 'athleisure', 'conforto'],
  },
  {
    id: 'prod-5',
    name: 'Bermuda Cargo Utilitária',
    description: 'Modelagem cargo com 6 bolsos funcionais. Tecido ripstop resistente à água. Cintura elástica com cadarço. Estilo militar moderno.',
    price: 159.90,
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506630448388-4e6838180c5f?w=600&h=800&fit=crop',
    ],
    category: 'Calças & Bermudas',
    categoryId: 'cat-pants',
    variants: generateVariants(['olive', 'black', 'beige', 'navy'], sizes, 14),
    rating: 4.5,
    reviewCount: 156,
    tags: ['cargo', 'utilitária', 'ripstop', 'bolsos'],
  },
  {
    id: 'prod-6',
    name: 'Calça Jeans Slim Fit Premium',
    description: 'Denim premium com 2% elastano. Lavagem industrial sustentável. Modelagem slim contemporânea que valoriza a silhueta sem apertar.',
    price: 229.90,
    images: unsplashImages.pants,
    category: 'Calças & Bermudas',
    categoryId: 'cat-pants',
    variants: generateVariants(['navy', 'black', 'gray'], ['38', '40', '42', '44', '46', '48'], 16),
    rating: 4.7,
    reviewCount: 289,
    tags: ['jeans', 'slim fit', 'denim', 'elastano'],
  },

  // CALÇADOS
  {
    id: 'prod-7',
    name: 'Tênis Runner Pro Knit',
    description: 'Cabedal em knit respirável, entressola EVA de alta resposta, solado de borracha antiderrapante. Leveza e amortecimento para corrida e dia a dia.',
    price: 349.90,
    originalPrice: 399.90,
    images: unsplashImages.shoes,
    category: 'Calçados',
    categoryId: 'cat-shoes',
    variants: generateVariants(['black', 'white', 'gray', 'navy'], shoeSizes, 10),
    rating: 4.8,
    reviewCount: 523,
    tags: ['running', 'knit', 'amortecimento', 'leve'],
  },
  {
    id: 'prod-8',
    name: 'Bota Chelsea Couro Legítimo',
    description: 'Couro bovino premium, elástico lateral, solado de borracha costurado. Forração em couro. Estilo atemporal com durabilidade de décadas.',
    price: 549.90,
    images: [
      'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=800&fit=crop',
    ],
    category: 'Calçados',
    categoryId: 'cat-shoes',
    variants: generateVariants(['brown', 'black'], shoeSizes, 8),
    rating: 4.9,
    reviewCount: 267,
    tags: ['chelsea', 'couro', 'premium', 'atemporal'],
  },
  {
    id: 'prod-9',
    name: 'Tênis Casual Canvas',
    description: 'Lona de algodão reforçada, palmilha ortopédica removível, solado vulcanizado. Clássico reinventado com conforto moderno.',
    price: 179.90,
    images: unsplashImages.shoes,
    category: 'Calçados',
    categoryId: 'cat-shoes',
    variants: generateVariants(['white', 'black', 'navy', 'beige'], shoeSizes, 22),
    rating: 4.4,
    reviewCount: 389,
    tags: ['casual', 'canvas', 'vulcanizado', 'clássico'],
  },

  // JAQUETAS & CASACOS
  {
    id: 'prod-10',
    name: 'Jaqueta Puffer Ultralight',
    description: 'Enchimento sintético reciclado 100g, tecido ripstop 20D resistente à água. Compressível na própria bolsa. Isolamento térmico superior.',
    price: 299.90,
    originalPrice: 359.90,
    images: unsplashImages.jackets,
    category: 'Jaquetas & Casacos',
    categoryId: 'cat-jackets',
    variants: generateVariants(['black', 'navy', 'olive', 'beige'], sizes, 11),
    rating: 4.8,
    reviewCount: 234,
    tags: ['puffer', 'ultralight', 'reciclado', 'impermeável'],
  },
  {
    id: 'prod-11',
    name: 'Casaco Wool Blend Overcoat',
    description: 'Mistura de lã merino (70%) e poliéster reciclado. Forro de cetim, bolsos internos, botões de madrepérola. Elegância clássica para o inverno.',
    price: 499.90,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=800&fit=crop',
    ],
    category: 'Jaquetas & Casacos',
    categoryId: 'cat-jackets',
    variants: generateVariants(['navy', 'black', 'gray', 'beige'], sizes, 9),
    rating: 4.7,
    reviewCount: 145,
    tags: ['wool', 'overcoat', 'lã', 'elegante'],
  },
  {
    id: 'prod-12',
    name: 'Jaqueta Trucker Denim',
    description: 'Denim 14oz selvedge japonês. Botões de cobre, bolsos frontais com lapela, acabamento sanforizado. Envelhece com personalidade única.',
    price: 389.90,
    images: unsplashImages.jackets,
    category: 'Jaquetas & Casacos',
    categoryId: 'cat-jackets',
    variants: generateVariants(['navy', 'black'], sizes, 13),
    rating: 4.9,
    reviewCount: 198,
    tags: ['trucker', 'denim', 'selvedge', 'japonesa'],
  },

  // ACESSÓRIOS
  {
    id: 'prod-13',
    name: 'Relógio Minimalista Automático',
    description: 'Movimento automático japonês Miyota 8215, caixa de aço 316L 40mm, cristal de safira, pulseira de couro italiano intercambiável. Resistência 5ATM.',
    price: 899.90,
    originalPrice: 1099.90,
    images: unsplashImages.accessories,
    category: 'Acessórios',
    categoryId: 'cat-accessories',
    variants: generateVariants(['black', 'brown', 'silver'], ['Único'], 5),
    rating: 4.8,
    reviewCount: 87,
    tags: ['relógio', 'automático', 'safira', 'minimalista'],
  },
  {
    id: 'prod-14',
    name: 'Mochila Urban Tech 25L',
    description: 'Nylon balístico 1680D, compartimento notebook 16\", porta USB externa, alças ergonômicas com ventilação, zíperes YKK AquaGuard. Garantia vitalícia.',
    price: 429.90,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
    ],
    category: 'Acessórios',
    categoryId: 'cat-accessories',
    variants: generateVariants(['black', 'navy', 'olive', 'gray'], ['Único'], 12),
    rating: 4.9,
    reviewCount: 312,
    tags: ['mochila', 'tech', 'notebook', 'impermeável'],
  },
  {
    id: 'prod-15',
    name: 'Cinto de Couro Reversível',
    description: 'Couro italiano pleno flor, fivela magnética intercambiável, dois tons em uma peça (preto/marrom). Largura 3,5cm. Ajuste preciso sem furos visíveis.',
    price: 189.90,
    images: unsplashImages.accessories,
    category: 'Acessórios',
    categoryId: 'cat-accessories',
    variants: generateVariants(['black', 'brown'], ['95', '100', '105', '110', '115'], 20),
    rating: 4.6,
    reviewCount: 176,
    tags: ['cinto', 'couro', 'reversível', 'magnético'],
  },
];

export const USUARIO_SIMULADO: Usuario = {
  id: 'user-1',
  name: 'Usuário',
  email: 'usuario@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Usuario',
  addresses: [
    {
      id: 'addr-1',
      label: 'Casa',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Trabalho',
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 1201',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false,
    },
  ],
  favorites: ['prod-1', 'prod-4', 'prod-7', 'prod-10'],
};
