import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export const ModalBase: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  if (!visible) return null;

  const sizes = {
    sm: '80%',
    md: '90%',
    lg: '95%',
    full: '100%',
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View
            style={[
              styles.modalContainer,
              { width: sizes[size], maxHeight: '90%' },
            ]}
          >
            <View style={styles.header}>
              {title && <Text style={styles.title}>{title}</Text>}
              {showCloseButton && (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color={CORES.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACAMENTO.md,
  },
  keyboardView: {
    width: '100%',
  },
  modalContainer: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.xl,
    overflow: 'hidden',
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: ESPACAMENTO.lg,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    maxHeight: '70%',
  },
  contentContainer: {
    padding: ESPACAMENTO.lg,
    gap: ESPACAMENTO.lg,
  },
});