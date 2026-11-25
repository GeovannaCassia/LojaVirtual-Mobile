import { ItemCarrinho } from '../tipos';
import { LIMITE_FRETE_GRATIS } from './formatadores';

const FRETE_BASE = 19.9;

export interface TotaisCarrinho {
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

export function calcularTotaisCarrinho(items: ItemCarrinho[]): TotaisCarrinho {
  const itemCount = items.reduce((soma, item) => soma + item.quantity, 0);
  const subtotal = items.reduce((soma, item) => soma + item.price * item.quantity, 0);

  // Sem itens não faz sentido cobrar entrega.
  if (itemCount === 0) {
    return { itemCount, subtotal, shipping: 0, total: subtotal };
  }

  const shipping = subtotal >= LIMITE_FRETE_GRATIS ? 0 : FRETE_BASE;

  return { itemCount, subtotal, shipping, total: subtotal + shipping };
}
