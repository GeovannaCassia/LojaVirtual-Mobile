import { Alert, Platform } from 'react-native';

export function exibirAlerta(titulo: string, mensagem?: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
    }
    return;
  }

  Alert.alert(titulo, mensagem);
}

export function confirmarAcao(
  titulo: string,
  mensagem: string,
  aoConfirmar: () => void,
  textoConfirmar = 'Confirmar'
) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(mensagem)) {
      aoConfirmar();
    }
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: textoConfirmar, style: 'destructive', onPress: aoConfirmar },
  ]);
}
