import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle, Image, ImageStyle, ImageSourcePropType } from 'react-native';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface CardProps extends ViewProps {
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  padding?: keyof typeof ESPACAMENTO;
  elevation?: number;
}

export const Cartao: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  elevation = 2,
  ...rest
}) => {
  return (
    <View
      style={[
        styles.card,
        { padding: ESPACAMENTO[padding], elevation, shadowOpacity: elevation > 0 ? 0.08 : 0 },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

interface ImageCardProps {
  source: ImageSourcePropType;
  style?: ViewStyle | ViewStyle[];
  aspectRatio?: number;
  borderRadius?: number;
}

export const CartaoImagem: React.FC<ImageCardProps> = ({
  source,
  style,
  aspectRatio = 1,
  borderRadius = RAIO.md,
}) => {
  return (
    <View style={[styles.imageContainer, { aspectRatio }, style]}>
      <Image
        source={source}
        style={[
          styles.image,
          { borderRadius },
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    borderWidth: 1,
    borderColor: CORES.divider,
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  imageContainer: {
    overflow: 'hidden',
    borderRadius: RAIO.md,
    backgroundColor: CORES.divider,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});