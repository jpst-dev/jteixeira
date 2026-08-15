export interface ContatoData {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContatoData, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContato(data: ContatoData): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (data.nome.trim().length < 2) {
    errors.nome = 'Informe seu nome completo.';
  }
  if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Informe um e-mail válido.';
  }
  if (data.mensagem.trim().length < 10) {
    errors.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
