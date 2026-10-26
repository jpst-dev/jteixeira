import type { Lang } from '../i18n/rotas';

export interface ContatoData {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContatoData, string>>;
}

const MENSAGENS: Record<Lang, Record<keyof ContatoData, string>> = {
  pt: {
    nome: 'Informe seu nome completo.',
    email: 'Informe um e-mail válido.',
    mensagem: 'Escreva uma mensagem com pelo menos 10 caracteres.',
  },
  en: {
    nome: 'Please enter your full name.',
    email: 'Please enter a valid email.',
    mensagem: 'Write a message with at least 10 characters.',
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContato(data: ContatoData, lang: Lang = 'pt'): ValidationResult {
  const msg = MENSAGENS[lang];
  const errors: ValidationResult['errors'] = {};

  if (data.nome.trim().length < 2) {
    errors.nome = msg.nome;
  }
  if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = msg.email;
  }
  if (data.mensagem.trim().length < 10) {
    errors.mensagem = msg.mensagem;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
