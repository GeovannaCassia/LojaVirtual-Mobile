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
import { CORES, ESPACAMENTO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaLogin: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'Login'>>();
  const { login } = useAutenticacao();
  const redirecionarParaCheckout = route.params?.redirecionarParaCheckout ?? false;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email, password]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (redirecionarParaCheckout) {
        navigation.replace('FinalizarCompra');
      } else {
        navigation.goBack();
      }
    } else {
      exibirAlerta('Erro', result.message || 'Falha ao fazer login');
    }
  }, [email, password, login, navigation, redirecionarParaCheckout, validateForm]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 56}
    >
      <View style={styles.scrollView}>
        <Cabecalho title="Entrar" showBack />

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
            <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitleText}>
              Faça login para acessar sua conta
            </Text>
          </View>

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
            autoComplete="password"
            leftIcon="lock-closed-outline"
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword((visible) => !visible)}
          />

          <TouchableOpacity
            style={styles.forgotPasswordBtn}
            onPress={() => navigation.navigate('RecuperarSenha')}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
          </TouchableOpacity>

          <Botao
            title="Entrar"
            iconName="log-in-outline"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.loginBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Botao
            title="Continuar com Google"
            variant="outline"
            iconName="logo-google"
            onPress={() => exibirAlerta('Em breve', 'Login social em desenvolvimento')}
            size="lg"
            style={styles.socialBtn}
          />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não tem conta?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cadastro', { redirecionarParaCheckout })}
              activeOpacity={0.7}
            >
              <Text style={styles.registerLink}>Cadastre-se</Text>
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
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginTop: ESPACAMENTO.xs,
    marginBottom: ESPACAMENTO.md,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.primary,
  },
  loginBtn: {
    marginBottom: ESPACAMENTO.lg,
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
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: ESPACAMENTO.lg,
  },
  registerText: {
    fontSize: 14,
    color: CORES.textSecondary,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: CORES.primary,
  },
});