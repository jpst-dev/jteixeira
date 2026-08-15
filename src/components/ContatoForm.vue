<script setup lang="ts">
import { reactive, ref } from 'vue';
import { validateContato, type ContatoData } from '../lib/validateContato';

const form = reactive<ContatoData>({ nome: '', email: '', mensagem: '' });
const errors = ref<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle');

async function onSubmit() {
  const result = validateContato(form);
  errors.value = result.errors as Record<string, string>;
  if (!result.valid) return;

  status.value = 'sending';
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: import.meta.env.PUBLIC_WEB3FORMS_KEY,
        name: form.nome,
        email: form.email,
        message: form.mensagem,
      }),
    });
    status.value = response.ok ? 'sent' : 'error';
  } catch {
    status.value = 'error';
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-4 max-w-md">
    <div>
      <input v-model="form.nome" type="text" placeholder="Seu nome" aria-label="Seu nome"
        :aria-describedby="errors.nome ? 'erro-nome' : undefined"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
      <p v-if="errors.nome" id="erro-nome" class="text-red-400 text-sm mt-1">{{ errors.nome }}</p>
    </div>
    <div>
      <input v-model="form.email" type="email" placeholder="Seu e-mail" aria-label="Seu e-mail"
        :aria-describedby="errors.email ? 'erro-email' : undefined"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent" />
      <p v-if="errors.email" id="erro-email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
    </div>
    <div>
      <textarea v-model="form.mensagem" placeholder="Sua mensagem" aria-label="Sua mensagem" rows="4"
        :aria-describedby="errors.mensagem ? 'erro-mensagem' : undefined"
        class="w-full bg-transparent border border-border rounded px-4 py-2 focus:outline-none focus:border-accent"></textarea>
      <p v-if="errors.mensagem" id="erro-mensagem" class="text-red-400 text-sm mt-1">{{ errors.mensagem }}</p>
    </div>
    <button type="submit" :disabled="status === 'sending'"
      class="bg-accent text-bg font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50">
      {{ status === 'sending' ? 'Enviando...' : 'Enviar mensagem' }}
    </button>
    <div aria-live="polite" aria-atomic="true">
      <p v-if="status === 'sent'" class="text-accent text-sm">Mensagem enviada! Obrigado pelo contato.</p>
      <p v-if="status === 'error'" class="text-red-400 text-sm">Algo deu errado — tente novamente ou use o e-mail direto abaixo.</p>
    </div>
  </form>
</template>
