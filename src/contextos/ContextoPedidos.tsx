import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Endereco, ItemCarrinho, Pedido } from '../tipos';

interface DadosNovoPedido {
  userId: string;
  items: ItemCarrinho[];
  shippingAddress: Endereco;
  paymentMethod: Pedido['paymentMethod'];
  subtotal: number;
  shipping: number;
  total: number;
}

interface DadosContextoPedidos {
  pedidos: Pedido[];
  isLoading: boolean;
  criarPedido: (dados: DadosNovoPedido) => Promise<Pedido>;
  buscarPedido: (pedidoId: string) => Pedido | undefined;
}

const ContextoPedidos = createContext<DadosContextoPedidos>({} as DadosContextoPedidos);

const STORAGE_KEY = '@store_orders';

export const ProvedorPedidos: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const pedidosRef = useRef<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const loadedOrders = Array.isArray(parsed) ? parsed : [];
          pedidosRef.current = loadedOrders;
          setPedidos(loadedOrders);
        }
      } catch (e) {
        console.error('Error loading orders:', e);
      } finally {
        setIsLoading(false);
      }
    };

    void carregarPedidos();
  }, []);

  const criarPedido = useCallback(async (dados: DadosNovoPedido) => {
    const pedido: Pedido = {
      ...dados,
      id: `ORD-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const novosPedidos = [pedido, ...pedidosRef.current];
    pedidosRef.current = novosPedidos;
    setPedidos(novosPedidos);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosPedidos));
    } catch (e) {
      console.error('Error saving order:', e);
    }

    return pedido;
  }, []);

  const buscarPedido = useCallback(
    (pedidoId: string) => pedidos.find((pedido) => pedido.id === pedidoId),
    [pedidos]
  );

  return (
    <ContextoPedidos.Provider value={{ pedidos, isLoading, criarPedido, buscarPedido }}>
      {children}
    </ContextoPedidos.Provider>
  );
};

export const usePedidos = () => useContext(ContextoPedidos);
