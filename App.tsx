import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ProvedorLoja } from './src/contextos/ContextoLoja';
import { ProvedorCarrinho } from './src/contextos/ContextoCarrinho';
import { ProvedorAutenticacao } from './src/contextos/ContextoAutenticacao';
import { ProvedorPedidos } from './src/contextos/ContextoPedidos';
import { ProvedorAviso } from './src/componentes/Aviso';
import { NavegadorPrincipal } from './src/navegacao/NavegadorPrincipal';

export default function App() {
  return (
    <SafeAreaProvider>
      <ProvedorLoja>
        <ProvedorCarrinho>
          <ProvedorAutenticacao>
            <ProvedorPedidos>
              <ProvedorAviso>
                <NavigationContainer>
                  <StatusBar style="dark" />
                  <NavegadorPrincipal />
                </NavigationContainer>
              </ProvedorAviso>
            </ProvedorPedidos>
          </ProvedorAutenticacao>
        </ProvedorCarrinho>
      </ProvedorLoja>
    </SafeAreaProvider>
  );
}
