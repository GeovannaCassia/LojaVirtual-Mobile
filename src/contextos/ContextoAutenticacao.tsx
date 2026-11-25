import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, Endereco } from '../tipos';
import { USUARIO_SIMULADO } from '../constantes/dadosSimulados';

interface DadosContextoAutenticacao {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: Partial<Usuario>) => Promise<void>;
  addAddress: (address: Omit<Endereco, 'id'>) => Promise<void>;
  updateAddress: (address: Endereco) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const ContextoAutenticacao = createContext<DadosContextoAutenticacao>({} as DadosContextoAutenticacao);

const STORAGE_KEYS = {
  USER: '@store_user',
  SESSION: '@store_session',
};

export const ProvedorAutenticacao: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura a sessão salva, se existir.
  useEffect(() => {
    const loadSession = async () => {
      try {
        const [savedUser, session] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.SESSION),
        ]);

        if (session && savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error('Erro ao carregar a sessão:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const persistUser = useCallback(async (updatedUser: Usuario) => {
    setUser(updatedUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Erro ao salvar o usuário:', e);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simula o tempo de resposta de um servidor.
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Projeto acadêmico: qualquer e-mail e senha válidos entram, e os dados
    // complementares vêm do usuário de exemplo.
    if (!email || !password) {
      return { success: false, message: 'Preencha todos os campos.' };
    }

    if (password.length < 4) {
      return { success: false, message: 'Senha deve ter pelo menos 4 caracteres.' };
    }

    const loggedInUser = { ...USUARIO_SIMULADO, email, name: email.split('@')[0] };
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    await persistUser(loggedInUser);

    return { success: true };
  }, [persistUser]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      return { success: false, message: 'Preencha todos os campos.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Senha deve ter pelo menos 6 caracteres.' };
    }

    const newUser: Usuario = {
      id: `user-${Date.now()}`,
      name,
      email,
      addresses: [],
      favorites: [],
    };

    await AsyncStorage.setItem(STORAGE_KEYS.SESSION, 'true');
    await persistUser(newUser);

    return { success: true };
  }, [persistUser]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (!email) {
      return { success: false, message: 'Informe seu e-mail.' };
    }
    // Sem backend de e-mail, a resposta é sempre a mesma para não expor quais
    // endereços estão cadastrados.
    return { success: true, message: 'Se o e-mail existir, enviaremos instruções de recuperação.' };
  }, []);

  const updateProfile = useCallback(async (data: Partial<Usuario>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    await persistUser(updated);
  }, [user, persistUser]);

  const addAddress = useCallback(async (address: Omit<Endereco, 'id'>) => {
    if (!user) return;
    const newAddress: Endereco = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    const isFirst = user.addresses.length === 0;
    const updatedAddresses = [...user.addresses, { ...newAddress, isDefault: isFirst }];
    await updateProfile({ addresses: updatedAddresses });
  }, [user, updateProfile]);

  const updateAddress = useCallback(async (address: Endereco) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map((a) => (a.id === address.id ? address : a));
    await updateProfile({ addresses: updatedAddresses });
  }, [user, updateProfile]);

  const removeAddress = useCallback(async (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.filter((a) => a.id !== addressId);
    const hasDefault = updatedAddresses.some((a) => a.isDefault);
    if (!hasDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    await updateProfile({ addresses: updatedAddresses });
  }, [user, updateProfile]);

  const setDefaultAddress = useCallback(async (addressId: string) => {
    if (!user) return;
    const updatedAddresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    await updateProfile({ addresses: updatedAddresses });
  }, [user, updateProfile]);

  const toggleFavorite = useCallback(async (productId: string) => {
    if (!user) return;
    const favorites = user.favorites.includes(productId)
      ? user.favorites.filter((id) => id !== productId)
      : [...user.favorites, productId];
    await updateProfile({ favorites });
  }, [user, updateProfile]);

  const isFavorite = useCallback(
    (productId: string) => {
      return user?.favorites.includes(productId) || false;
    },
    [user]
  );

  return (
    <ContextoAutenticacao.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </ContextoAutenticacao.Provider>
  );
};

export const useAutenticacao = () => useContext(ContextoAutenticacao);