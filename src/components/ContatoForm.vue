<script setup lang="ts">
import { reactive, ref } from 'vue';
import { validateContato, type ContatoData } from '../lib/validateContato';
import type { Lang } from '../i18n/rotas';
import type { Dicionario } from '../i18n/ui';

// Só os textos do form vêm por prop (o dicionário inteiro não vai para o bundle do client).
const props = defineProps<{ lang: Lang; tx: Dicionario['form'] }>();

const form = reactive<ContatoData>({ nome: '', email: '', mensagem: '' });
const errors = ref<Record<string, string>>({});
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle');

async function onSubmit() {
  const result = validateContato(form, props.lang);
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
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <input v-model="form.nome" type="text" :placeholder="props.tx.nome" :aria-label="props.tx.nome"
        :aria-describedby="errors.nome ? 'erro-nome' : undefined"
        class="w-full bg-bg border border-border rounded-xl px-4 py-3 placeholder:text-subtle transition-colors focus:border-accent" />
      <p v-if="errors.nome" id="erro-nome" class="text-red-400 text-sm mt-1">{{ errors.nome }}</p>
    </div>
    <div>
      <input v-model="form.email" type="email" :placeholder="props.tx.email" :aria-label="props.tx.email"
        :aria-describedby="errors.email ? 'erro-email' : undefined"
        class="w-full bg-bg border border-border rounded-xl px-4 py-3 placeholder:text-subtle transition-colors focus:border-accent" />
      <p v-if="errors.email" id="erro-email" class="text-red-400 text-sm mt-1">{{ errors.email }}</p>
    </div>
    <div>
      <textarea v-model="form.mensagem" :placeholder="props.tx.mensagem" :aria-label="props.tx.mensagem" rows="4"
        :aria-describedby="errors.mensagem ? 'erro-mensagem' : undefined"
        class="w-full bg-bg border border-border rounded-xl px-4 py-3 placeholder:text-subtle transition-colors focus:border-accent"></textarea>
      <p v-if="errors.mensagem" id="erro-mensagem" class="text-red-400 text-sm mt-1">{{ errors.mensagem }}</p>
    </div>
    <button type="submit" data-magnetic :disabled="status === 'sending'"
      class="w-full sm:w-auto bg-accent text-on-accent font-semibold px-5 py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50">
      {{ status === 'sending' ? props.tx.enviando : props.tx.enviar }}
    </button>
    <div aria-live="polite" aria-atomic="true">
      <p v-if="status === 'sent'" class="text-accent text-sm">{{ props.tx.enviado }}</p>
      <p v-if="status === 'error'" class="text-red-400 text-sm">{{ props.tx.erro }}</p>
    </div>
  </form>
</template>
