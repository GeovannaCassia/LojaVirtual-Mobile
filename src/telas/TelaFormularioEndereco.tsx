import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { Cabecalho } from '../componentes/Cabecalho';
import { CampoTexto } from '../componentes/CampoTexto';
import { Botao } from '../componentes/Botao';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';
import { confirmarAcao } from '../utilitarios/alertas';
import { ParametrosPilhaRaiz, Endereco } from '../tipos';

export const TelaFormularioEndereco: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'FormularioEndereco'>>();
  const { endereco: editingAddress, origemCheckout } = route.params || {};
  const { addAddress, updateAddress, removeAddress, user } = useAutenticacao();

  const isEditing = !!editingAddress;

  const [form, setForm] = useState({
    label: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAddress) {
      setForm({
        label: editingAddress.label,
        street: editingAddress.street,
        number: editingAddress.number,
        complement: editingAddress.complement || '',
        neighborhood: editingAddress.neighborhood,
        city: editingAddress.city,
        state: editingAddress.state,
        zipCode: editingAddress.zipCode,
        isDefault: editingAddress.isDefault,
      });
    } else if (user && user.addresses.length === 0) {
      // First address defaults to true
      setForm((prev) => ({ ...prev, isDefault: true }));
    }
  }, [editingAddress, user]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!form.label.trim()) newErrors.label = 'Rótulo é obrigatório (ex: Casa, Trabalho)';
    if (!form.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!form.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!form.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!form.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!form.state.trim()) newErrors.state = 'Estado é obrigatório';
    if (!form.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
    else if (form.zipCode.replace(/\D/g, '').length !== 8) newErrors.zipCode = 'CEP inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    const addressData = {
      label: form.label.trim(),
      street: form.street.trim(),
      number: form.number.trim(),
      complement: form.complement.trim(),
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim(),
      isDefault: form.isDefault,
    };

    if (isEditing) {
      await updateAddress({ ...editingAddress, ...addressData });
    } else {
      await addAddress(addressData);
    }

    if (origemCheckout) {
      navigation.goBack();
    } else {
      navigation.navigate('ListaEnderecos');
    }
  }, [form, isEditing, editingAddress, addAddress, updateAddress, origemCheckout, navigation]);

  const formatarCEP = (text: string) => {
    const clean = text.replace(/\D/g, '');
    let formatted = clean;
    if (clean.length > 5) formatted = `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
    return formatted;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho title={isEditing ? 'Editar Endereço' : 'Novo Endereço'} showBack />

        <CampoTexto
          label="Rótulo"
          placeholder="Ex: Casa, Trabalho, Apartamento"
          value={form.label}
          onChangeText={(text) => setForm((prev) => ({ ...prev, label: text }))}
          error={errors.label}
          autoCapitalize="words"
          leftIcon="pricetag-outline"
        />

        <CampoTexto
          label="CEP"
          placeholder="00000-000"
          value={form.zipCode}
          onChangeText={(text) => {
            const formatted = formatarCEP(text);
            setForm((prev) => ({ ...prev, zipCode: formatted }));
          }}
          error={errors.zipCode}
          keyboardType="numeric"
          maxLength={9}
          leftIcon="location-outline"
          helperText="Buscaremos o endereço automaticamente"
        />

        <CampoTexto
          label="Rua / Avenida"
          placeholder="Rua das Flores"
          value={form.street}
          onChangeText={(text) => setForm((prev) => ({ ...prev, street: text }))}
          error={errors.street}
          autoCapitalize="words"
          leftIcon="map-outline"
        />

        <CampoTexto
          label="Número"
          placeholder="123"
          value={form.number}
          onChangeText={(text) => setForm((prev) => ({ ...prev, number: text }))}
          error={errors.number}
          keyboardType="numeric"
          leftIcon="pin-outline"
        />

        <CampoTexto
          label="Complemento (opcional)"
          placeholder="Apto 45, Bloco B, Casa 2"
          value={form.complement}
          onChangeText={(text) => setForm((prev) => ({ ...prev, complement: text }))}
          autoCapitalize="words"
          leftIcon="home-outline"
        />

        <CampoTexto
          label="Bairro"
          placeholder="Jardim Primavera"
          value={form.neighborhood}
          onChangeText={(text) => setForm((prev) => ({ ...prev, neighborhood: text }))}
          error={errors.neighborhood}
          autoCapitalize="words"
          leftIcon="map-outline"
        />

        <View style={styles.row}>
          <CampoTexto
            label="Cidade"
            placeholder="São Paulo"
            value={form.city}
            onChangeText={(text) => setForm((prev) => ({ ...prev, city: text }))}
            error={errors.city}
            autoCapitalize="words"
            leftIcon="business-outline"
            style={styles.halfInput}
          />
          <CampoTexto
            label="Estado"
            placeholder="SP"
            value={form.state}
            onChangeText={(text) => setForm((prev) => ({ ...prev, state: text.toUpperCase() }))}
            error={errors.state}
            autoCapitalize="characters"
            maxLength={2}
            leftIcon="flag-outline"
            style={styles.halfInput}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              form.isDefault && styles.checkboxChecked,
            ]}
            onPress={() => setForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
            activeOpacity={0.8}
          >
            {form.isDefault && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            Definir como endereço principal
            {user?.addresses.length === 0 && ' (padrão para primeira compra)'}
          </Text>
        </View>

        <Botao
          title={isEditing ? 'Salvar alterações' : 'Adicionar endereço'}
          iconName={isEditing ? 'checkmark' : 'add-outline'}
          onPress={handleSave}
          size="lg"
          style={styles.saveBtn}
        />

        {isEditing && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              confirmarAcao(
                'Excluir endereço',
                'Tem certeza? Esta ação não pode ser desfeita.',
                () => { void removeAddress(editingAddress!.id); navigation.goBack(); },
                'Excluir'
              );
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteText}>Excluir endereço</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  content: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
    paddingBottom: ESPACAMENTO.xl * 2,
  },
  row: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
  },
  halfInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ESPACAMENTO.md,
    paddingHorizontal: ESPACAMENTO.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: CORES.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ESPACAMENTO.sm,
  },
  checkboxChecked: {
    backgroundColor: CORES.primary,
    borderColor: CORES.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: CORES.textPrimary,
    flex: 1,
  },
  saveBtn: {
    marginTop: ESPACAMENTO.md,
  },
  deleteBtn: {
    marginTop: ESPACAMENTO.md,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.danger,
    textAlign: 'center',
  },
});