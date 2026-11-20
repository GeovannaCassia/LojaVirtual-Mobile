import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Produto, Categoria, EstadoFiltro, OpcaoOrdenacao } from '../tipos';
import { PRODUTOS_SIMULADOS, CATEGORIAS_SIMULADAS } from '../constantes/dadosSimulados';
import { buscarProdutosDaApi } from '../servicos/apiProdutos';

interface DadosContextoLoja {
  products: Produto[];
  categories: Categoria[];
  filteredProducts: Produto[];
  featuredProducts: Produto[];
  isLoading: boolean;
  error: string | null;
  reloadProducts: () => void;
  filterState: EstadoFiltro;
  setFilterState: (filters: Partial<EstadoFiltro>) => void;
  clearFilters: () => void;
  getProductById: (id: string) => Produto | undefined;
  getProductsByCategory: (categoryId: string) => Produto[];
  searchProducts: (query: string) => Produto[];
}

const ContextoLoja = createContext<DadosContextoLoja>({} as DadosContextoLoja);

const STORAGE_KEYS = {
  FILTERS: '@store_filters',
};

const DEFAULT_FILTERS: EstadoFiltro = {
  categoryId: null,
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  sortBy: 'relevance',
  searchQuery: '',
};

export const ProvedorLoja: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [filterState, setFilterStateInternal] = useState<EstadoFiltro>(DEFAULT_FILTERS);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // O catálogo da API não cobre todas as categorias da loja, então mostramos
  // apenas aquelas em que realmente sobrou algum produto.
  const categories = useMemo(
    () => CATEGORIAS_SIMULADAS.filter((c) => products.some((p) => p.categoryId === c.id)),
    [products]
  );

  const isLoading = isLoadingFilters || isLoadingProducts;

  // Load persisted filters
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEYS.FILTERS);
        if (saved) {
          setFilterStateInternal(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Error loading filters:', e);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  // Busca o catálogo na API. Se der ruim, a loja continua aberta com os
  // produtos locais e a tela mostra o aviso com a opção de tentar de novo.
  const reloadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setError(null);

    try {
      const produtosDaApi = await buscarProdutosDaApi();
      setProducts(produtosDaApi);
    } catch (e) {
      console.warn('Não foi possível carregar o catálogo da API:', e);
      setProducts(PRODUTOS_SIMULADOS);
      setError('Não conseguimos atualizar o catálogo. Exibindo os produtos de exemplo do app.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    reloadProducts();
  }, [reloadProducts]);

  // Persist filters
  const setFilterState = useCallback((filters: Partial<EstadoFiltro>) => {
    setFilterStateInternal((prev) => {
      const next = { ...prev, ...filters };
      AsyncStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(next)).catch(console.error);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilterStateInternal(DEFAULT_FILTERS);
    AsyncStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(DEFAULT_FILTERS)).catch(console.error);
  }, []);

  // Se o filtro salvo apontar para uma categoria que não existe no catálogo
  // carregado, volta para "Todos" em vez de deixar a lista sempre vazia.
  useEffect(() => {
    if (isLoading || !filterState.categoryId) return;
    if (!categories.some((c) => c.id === filterState.categoryId)) {
      setFilterState({ categoryId: null });
    }
  }, [isLoading, categories, filterState.categoryId, setFilterState]);

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (filterState.searchQuery.trim()) {
      const query = filterState.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Filtro por categoria
    if (filterState.categoryId) {
      result = result.filter((p) => p.categoryId === filterState.categoryId);
    }

    // Price range
    if (filterState.minPrice !== null) {
      result = result.filter((p) => p.price >= (filterState.minPrice || 0));
    }
    if (filterState.maxPrice !== null) {
      result = result.filter((p) => p.price <= (filterState.maxPrice || Infinity));
    }

    // Avaliacao
    if (filterState.minRating > 0) {
      result = result.filter((p) => p.rating >= filterState.minRating);
    }

    // Sorting
    switch (filterState.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assuming newer products have higher IDs or we could add a createdAt field
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // Relevance: prioritize higher rating, then discount, then review count
        result.sort((a, b) => {
          const aDiscount = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const bDiscount = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          if (bDiscount !== aDiscount) return bDiscount - aDiscount;
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviewCount - a.reviewCount;
        });
        break;
    }

    return result;
  }, [products, filterState]);

  // Featured products for home (high rating + discount)
  const featuredProducts = useMemo(() => {
    const emPromocao = products
      .filter((p) => p.originalPrice && p.rating >= 4.5)
      .sort((a, b) => {
        const aDisc = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const bDisc = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return bDisc - aDisc;
      });

    // Nem sempre o catálogo tem desconto e nota alta de sobra, então os
    // destaques são completados com os produtos mais bem avaliados.
    if (emPromocao.length >= 4) return emPromocao.slice(0, 8);

    const jaEscolhidos = new Set(emPromocao.map((p) => p.id));
    const maisBemAvaliados = [...products]
      .filter((p) => !jaEscolhidos.has(p.id))
      .sort((a, b) => b.rating - a.rating);

    return [...emPromocao, ...maisBemAvaliados].slice(0, 8);
  }, [products]);

  const getProductById = useCallback((id: string) => {
    return products.find((p) => p.id === id);
  }, [products]);

  const getProductsByCategory = useCallback((categoryId: string) => {
    return products.filter((p) => p.categoryId === categoryId);
  }, [products]);

  const searchProducts = useCallback((query: string) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [products]);

  return (
    <ContextoLoja.Provider
      value={{
        products,
        categories,
        filteredProducts,
        featuredProducts,
        isLoading,
        error,
        reloadProducts,
        filterState,
        setFilterState,
        clearFilters,
        getProductById,
        getProductsByCategory,
        searchProducts,
      }}
    >
      {children}
    </ContextoLoja.Provider>
  );
};

export const useLoja = () => useContext(ContextoLoja);