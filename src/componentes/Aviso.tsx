import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

type TipoAviso = 'success' | 'error' | 'info' | 'warning';

interface DadosContextoAviso {
  mostrarAviso: (message: string, type: TipoAviso, duration?: number) => void;
}

const ContextoAviso = createContext<DadosContextoAviso>({} as DadosContextoAviso);

interface ItemAviso {
  id: string;
  message: string;
  type: TipoAviso;
}

export const ProvedorAviso: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ItemAviso[]>([]);

  const mostrarAviso = useCallback((message: string, type: TipoAviso, duration = 3000) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const renderToast = (toast: ItemAviso) => {
    const icons = {
      success: 'checkmark-circle',
      error: 'alert-circle',
      info: 'information-circle',
      warning: 'alert',
    };

    const colors = {
      success: CORES.success,
      error: CORES.danger,
      info: CORES.primary,
      warning: CORES.warning,
    };

    const bgColors = {
      success: '#ECFDF5',
      error: '#FEF2F2',
      info: '#DBEAFE',
      warning: '#FFFBEB',
    };

    return (
      <Animated.View
        key={toast.id}
        style={[
          styles.toast,
          { backgroundColor: bgColors[toast.type] },
        ]}
      >
        <View style={styles.toastContent}>
          <Ionicons
            name={icons[toast.type] as any}
            size={20}
            color={colors[toast.type]}
            style={styles.toastIcon}
          />
          <Text style={[styles.toastText, { color: colors[toast.type] }]}>
            {toast.message}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.progressBar,
            { backgroundColor: colors[toast.type] },
          ]}
        />
      </Animated.View>
    );
  };

  return (
    <ContextoAviso.Provider value={{ mostrarAviso }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map(renderToast)}
      </View>
    </ContextoAviso.Provider>
  );
};

export const useAviso = () => useContext(ContextoAviso);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: ESPACAMENTO.md,
    right: ESPACAMENTO.md,
    zIndex: 9999,
    gap: ESPACAMENTO.sm,
  },
  toast: {
    borderRadius: RAIO.md,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toastIcon: {
    marginRight: ESPACAMENTO.sm,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});