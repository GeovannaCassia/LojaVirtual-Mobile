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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { exibirAlerta } from '../utilitarios/alertas';
import { Cabecalho } from '../componentes/Cabecalho';
import { CampoTexto } from '../componentes/CampoTexto';
import { Botao } from '../componentes/Botao';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaRecuperarSenha: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { forgotPassword } = useAutenticacao();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: { email?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'E-mail inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSent(true);
    } else {
      exibirAlerta('Erro', result.message || 'Falha ao enviar e-mail');
    }
  }, [email, forgotPassword, validateForm]);

  const handleResend = useCallback(async () => {
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      exibirAlerta('E-mail reenviado', `Enviamos um novo link para ${email}.`);
    } else {
      exibirAlerta('Erro', result.message || 'Falha ao reenviar e-mail');
    }
  }, [email, forgotPassword]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 56}
    >
      <View style={styles.scrollView}>
        <Cabecalho title="Recuperar Senha" showBack />

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
              <Ionicons name="lock-closed-outline" size={48} color={CORES.primary} />
            </View>
            {sent ? (
              <>
                <Text style={styles.successTitle}>E-mail enviado!</Text>
                <Text style={styles.successText}>
                  Enviamos um link de recuperação para{' '}
                  <Text style={styles.emailHighlight}>{email}</Text>.
                  Verifique sua caixa de entrada e spam.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.welcomeText}>Recuperar senha</Text>
                <Text style={styles.subtitleText}>
                  Digite seu e-mail para receber o link de redefinição
                </Text>
              </>
            )}
          </View>

          {!sent && (
            <>
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

              <Botao
                title="Enviar link de recuperação"
                iconName="send-outline"
                onPress={handleSubmit}
                loading={loading}
                size="lg"
                style={styles.submitBtn}
              />
            </>
          )}

          {sent && (
            <>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>não recebeu?</Text>
                <View style={styles.dividerLine} />
              </View>

              <Botao
                title="Reenviar e-mail"
                variant="outline"
                iconName="refresh-outline"
                onPress={handleResend}
                loading={loading}
                size="lg"
                style={styles.resendBtn}
              />

              <TouchableOpacity
                style={styles.backToLoginBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.backToLoginText}>Voltar para login</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.helpNotice}>
            <Ionicons name="help-circle-outline" size={16} color={CORES.textMuted} />
            <Text style={styles.helpText}>
              Se não encontrar o e-mail, verifique a pasta de spam ou lixo eletrônico.
            </Text>
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
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: CORES.success,
    marginTop: ESPACAMENTO.md,
  },
  successText: {
    fontSize: 14,
    color: CORES.textSecondary,
    textAlign: 'center',
    marginTop: ESPACAMENTO.sm,
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  submitBtn: {
    marginBottom: ESPACAMENTO.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.md,
    marginVertical: ESPACAMENTO.lg,
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
  resendBtn: {
    marginBottom: ESPACAMENTO.md,
  },
  backToLoginBtn: {
    marginTop: ESPACAMENTO.md,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.primary,
    textAlign: 'center',
  },
  helpNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: ESPACAMENTO.xs,
    marginTop: ESPACAMENTO.xl,
    paddingHorizontal: ESPACAMENTO.md,
  },
  helpText: {
    fontSize: 12,
    color: CORES.textMuted,
    maxWidth: '85%',
    lineHeight: 18,
  },
});