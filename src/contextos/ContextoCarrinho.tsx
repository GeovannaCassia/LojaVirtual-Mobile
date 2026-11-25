import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemCarrinho, Produto, VarianteProduto } from '../tipos';
import { calcularTotaisCarrinho } from '../utilitarios/calculosCarrinho';

interface DadosContextoCarrinho {
  items: ItemCarrinho[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  isLoading: boolean;
  addItem: (product: Produto, variant: VarianteProduto, quantity: number) => Promise<{ success: boolean; message?: string }>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<{ success: boolean; message?: string }>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: string, variantId: string) => number;
  isInCart: (productId: string, variantId: string) => boolean;
}

const ContextoCarrinho = createContext<DadosContextoCarrinho>({} as DadosContextoCarrinho);

const STORAGE_KEY = '@store_cart';

export const ProvedorCarrinho: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrinho[]>([]);
  const itemsRef = useRef<ItemCarrinho[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // O ref garante que alterações feitas antes do próximo render não se percam.
  const persistCart = useCallback(async (newItems: ItemCarrinho[]) => {
    itemsRef.current = newItems;
    setItems(newItems);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.error('Erro ao salvar o carrinho:', e);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const loadedItems = Array.isArray(parsed) ? parsed : [];
          itemsRef.current = loadedItems;
          setItems(loadedItems);
        }
      } catch (e) {
        console.error('Erro ao carregar o carrinho:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, []);

  const { itemCount, subtotal, shipping, total } = calcularTotaisCarrinho(items);

  const addItem = useCallback(
    async (product: Produto, variant: VarianteProduto, quantity: number) => {
      if (!Number.isFinite(quantity) || quantity < 1) {
        return { success: false, message: 'Quantidade inválida.' };
      }

      if (variant.stock < quantity) {
        return { success: false, message: `Apenas ${variant.stock} unidades disponíveis em estoque.` };
      }

      const currentItems = itemsRef.current;
      const existingIndex = currentItems.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      let newItems: ItemCarrinho[];

      if (existingIndex >= 0) {
        const currentItem = currentItems[existingIndex];
        const newQuantity = currentItem.quantity + quantity;

        if (newQuantity > variant.stock) {
          return {
            success: false,
            message: `Você já tem ${currentItem.quantity} unidade(s) no carrinho. Limite de estoque: ${variant.stock}.`,
          };
        }

        newItems = [...currentItems];
        newItems[existingIndex] = {
          ...currentItem,
          quantity: newQuantity,
          stock: variant.stock,
        };
      } else {
        newItems = [
          ...currentItems,
          {
            id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            productId: product.id,
            productName: product.name,
            productImage: product.images[0],
            variantId: variant.id,
            color: variant.color,
            colorHex: variant.colorHex,
            size: variant.size,
            price: product.price,
            quantity,
            stock: variant.stock,
          },
        ];
      }

      await persistCart(newItems);
      return { success: true };
    },
    [persistCart]
  );

  const removeItem = useCallback(
    async (cartItemId: string) => {
      const newItems = itemsRef.current.filter((item) => item.id !== cartItemId);
      await persistCart(newItems);
    },
    [persistCart]
  );

  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity < 1) {
        await removeItem(cartItemId);
        return { success: true };
      }

      const item = itemsRef.current.find((i) => i.id === cartItemId);
      if (!item) return { success: false, message: 'Item não encontrado.' };

      if (quantity > item.stock) {
        return { success: false, message: `Estoque máximo: ${item.stock} unidades.` };
      }

      const newItems = itemsRef.current.map((i) =>
        i.id === cartItemId ? { ...i, quantity } : i
      );

      await persistCart(newItems);
      return { success: true };
    },
    [persistCart, removeItem]
  );

  const clearCart = useCallback(async () => {
    await persistCart([]);
  }, [persistCart]);

  const getItemQuantity = useCallback(
    (productId: string, variantId: string) => {
      const item = items.find((i) => i.productId === productId && i.variantId === variantId);
      return item?.quantity || 0;
    },
    [items]
  );

  const isInCart = useCallback(
    (productId: string, variantId: string) => {
      return items.some((i) => i.productId === productId && i.variantId === variantId);
    },
    [items]
  );

  return (
    <ContextoCarrinho.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shipping,
        total,
        isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
      }}
    >
      {children}
    </ContextoCarrinho.Provider>
  );
};

export const useCarrinho = () => useContext(ContextoCarrinho);