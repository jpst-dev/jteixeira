import { describe, it, expect } from 'vitest';
import { validateContato } from './validateContato';

describe('validateContato', () => {
  it('passes with valid data', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'ana@example.com', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('fails when nome is too short', () => {
    const result = validateContato({ nome: 'A', email: 'ana@example.com', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(false);
    expect(result.errors.nome).toBeDefined();
  });

  it('fails with invalid email', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'nao-e-email', mensagem: 'Gostaria de conversar sobre uma vaga.' });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('fails when mensagem is too short', () => {
    const result = validateContato({ nome: 'Ana Silva', email: 'ana@example.com', mensagem: 'Oi' });
    expect(result.valid).toBe(false);
    expect(result.errors.mensagem).toBeDefined();
  });

  it('reports multiple errors at once', () => {
    const result = validateContato({ nome: '', email: '', mensagem: '' });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(['nome', 'email', 'mensagem']);
  });
});
