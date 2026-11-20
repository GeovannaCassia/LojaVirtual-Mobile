import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';

interface AvisoCatalogoProps {
  mensagem: string;
  onTentarNovamente: () => void;
}

/**
 * Faixa que aparece quando o catálogo não pôde ser atualizado pela API.
 * A loja continua funcionando com os produtos locais, então é só um aviso
 * com a opção de buscar de novo.
 */
export const AvisoCatalogo: React.FC<AvisoCatalogoProps> = ({ mensagem, onTentarNovamente }) => (
  <View style={styles.container}>
    <Ionicons name="cloud-offline-outline" size={20} color={CORES.warning} />
    <Text style={styles.texto}>{mensagem}</Text>
    <TouchableOpacity onPress={onTentarNovamente} activeOpacity={0.8} style={styles.botao}>
      <Text style={styles.botaoTexto}>Tentar de novo</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
    marginHorizontal: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.sm,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.warning,
    backgroundColor: '#FEF3C7',
  },
  texto: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: CORES.textPrimary,
  },
  botao: {
    paddingHorizontal: ESPACAMENTO.sm,
    paddingVertical: ESPACAMENTO.xs,
  },
  botaoTexto: {
    fontSize: 12,
    fontWeight: '700',
    color: CORES.warning,
  },
});
