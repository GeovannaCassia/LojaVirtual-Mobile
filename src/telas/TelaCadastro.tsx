import React, { useState, useCallback } from 'react';
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
import { exibirAlerta } from '../utilitarios/alertas';
import { Cabecalho } from '../componentes/Cabecalho';
import { CampoTexto } from '../componentes/CampoTexto';
import { Botao } from '../componentes/Botao';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaCadastro: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'Cadastro'>>();
  const { register } = useAutenticacao();
  const redirecionarParaCheckout = route.params?.redirecionarParaCheckout ?? false;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    termos?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      termos?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme a senha';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!aceitouTermos) {
      newErrors.termos = 'É necessário aceitar os termos para continuar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, password, confirmPassword, aceitouTermos]);

  const handleRegister = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      if (redirecionarParaCheckout) {
        navigation.replace('FinalizarCompra');
      } else {
        navigation.goBack();
      }
    } else {
      exibirAlerta('Erro', result.message || 'Falha ao cadastrar');
    }
  }, [name, email, password, register, navigation, redirecionarParaCheckout, validateForm]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 56}
    >
      <View style={styles.scrollView}>
        <Cabecalho title="Cadastrar" showBack />

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="storefront-outline" size={48} color={CORES.primary} />
            </View>
            <Text style={styles.welcomeText}>Crie sua conta</Text>
            <Text style={styles.subtitleText}>
              Junte-se a nós e aproveite as melhores ofertas
            </Text>
          </View>

          <CampoTexto
            label="Nome completo"
            placeholder="João da Silva"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
            autoComplete="name"
            leftIcon="person-outline"
          />

          <CampoTexto
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            leftIcon="mail-outline"
          />

          <CampoTexto
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword((visible) => !visible)}
            helperText="Mínimo 6 caracteres"
          />

          <CampoTexto
            label="Confirmar senha"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoComplete="new-password"
            leftIcon="lock-closed-outline"
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword((visible) => !visible)}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.consentRow}
              onPress={() => {
                setAceitouTermos((aceito) => !aceito);
                setErrors((current) => ({ ...current, termos: undefined }));
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={aceitouTermos ? 'checkbox' : 'square-outline'}
                size={22}
                color={aceitouTermos ? CORES.primary : CORES.textMuted}
              />
              <Text style={styles.termsText}>
                Li e aceito os{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => exibirAlerta('Termos de Uso', 'Este é um app demonstrativo. Nenhum pagamento real é processado.')}
                >
                  Termos de Uso
                </Text>
                {' '}e a{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => exibirAlerta('Política de Privacidade', 'Os dados ficam apenas neste dispositivo. Nenhuma informação é enviada para servidores.')}
                >
                  Política de Privacidade
                </Text>
                .
              </Text>
            </TouchableOpacity>
            {errors.termos && <Text style={styles.termsError}>{errors.termos}</Text>}
          </View>

          <Botao
            title="Criar conta"
            iconName="person-add-outline"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={styles.registerBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Botao
            title="Cadastrar com Google"
            variant="outline"
            iconName="logo-google"
            onPress={() => exibirAlerta('Em breve', 'Cadastro social em desenvolvimento')}
            size="lg"
            style={styles.socialBtn}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem conta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login', { redirecionarParaCheckout })}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLink}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: ESPACAMENTO.xl,
    marginTop: ESPACAMENTO.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: CORES.textPrimary,
    letterSpacing: -0.5,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: ESPACAMENTO.md,
  },
  subtitleText: {
    fontSize: 14,
    color: CORES.textSecondary,
    marginTop: ESPACAMENTO.xs,
  },
  registerBtn: {
    marginBottom: ESPACAMENTO.lg,
  },
  termsContainer: {
    marginBottom: ESPACAMENTO.lg,
    paddingHorizontal: ESPACAMENTO.xs,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACAMENTO.sm,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: CORES.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: CORES.primary,
    fontWeight: '600',
  },
  termsError: {
    fontSize: 12,
    color: CORES.danger,
    marginTop: ESPACAMENTO.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: CORES.divider,
  },
  dividerText: {
    fontSize: 13,
    color: CORES.textMuted,
  },
  socialBtn: {
    marginBottom: ESPACAMENTO.lg,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  loginText: {
    fontSize: 14,
    color: CORES.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: CORES.primary,
  },
});