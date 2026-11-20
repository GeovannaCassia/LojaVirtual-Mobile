import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface SkeletonProps {
  width?: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

export const Esqueleto: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  borderRadius = RAIO.md,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        style,
      ]}
    />
  );
};

export const EsqueletoCartaoProduto: React.FC = () => {
  return (
    <View style={styles.cardSkeleton}>
      <Esqueleto height={160} borderRadius={RAIO.md} style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <Esqueleto width="60%" height={16} style={styles.skeletonLine} />
        <Esqueleto width="40%" height={12} style={[styles.skeletonLine, { marginTop: ESPACAMENTO.xs }]} />
        <Esqueleto width="80%" height={12} style={[styles.skeletonLine, { marginTop: ESPACAMENTO.sm }]} />
        <Esqueleto width="50%" height={20} style={[styles.skeletonLine, { marginTop: ESPACAMENTO.md }]} />
      </View>
    </View>
  );
};

export const EsqueletoLista: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <View style={styles.listSkeleton}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={styles.listItemSkeleton}>
          <Esqueleto width={100} height={100} borderRadius={RAIO.md} />
          <View style={styles.listItemContent}>
            <Esqueleto width="70%" height={16} />
            <Esqueleto width="40%" height={12} style={{ marginTop: ESPACAMENTO.xs }} />
            <Esqueleto width="50%" height={20} style={{ marginTop: ESPACAMENTO.sm }} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: CORES.divider,
    overflow: 'hidden',
  },
  cardSkeleton: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    overflow: 'hidden',
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  skeletonImage: {
    width: '100%',
  },
  skeletonContent: {
    padding: ESPACAMENTO.md,
    gap: 4,
  },
  skeletonLine: {
    borderRadius: RAIO.xs,
  },
  listSkeleton: {
    gap: ESPACAMENTO.sm,
  },
  listItemSkeleton: {
    flexDirection: 'row',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  listItemContent: {
    flex: 1,
    padding: ESPACAMENTO.md,
    justifyContent: 'center',
    gap: 4,
  },
});