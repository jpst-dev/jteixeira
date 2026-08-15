<script setup lang="ts">
import { ref, computed } from 'vue';
import { filterProjetos, type ProjetoResumo } from '../lib/filterProjetos';

const props = defineProps<{ projetos: ProjetoResumo[] }>();

const query = ref('');
const filtrados = computed(() => filterProjetos(props.projetos, query.value));
</script>

<template>
  <div>
    <input
      v-model="query"
      type="text"
      placeholder="Filtrar por nome, stack ou descrição..."
      class="w-full mb-8 bg-transparent border border-border rounded px-4 py-2 font-mono text-sm placeholder:text-muted focus:outline-none focus:border-accent"
    />
    <p v-if="filtrados.length === 0" class="text-muted font-mono text-sm">Nenhum projeto encontrado.</p>
    <div class="grid sm:grid-cols-2 gap-4">
      <a
        v-for="projeto in filtrados"
        :key="projeto.id"
        :href="`/projetos/${projeto.id}/`"
        class="block border border-border rounded-lg p-5 hover:border-accent transition-colors"
      >
        <h3 class="font-semibold text-lg mb-2">{{ projeto.titulo }}</h3>
        <p class="text-muted text-sm mb-4">{{ projeto.resumo }}</p>
        <ul class="flex flex-wrap gap-2 font-mono text-xs">
          <li v-for="tech in projeto.stack" :key="tech" class="border border-border rounded px-2 py-0.5 text-muted">
            {{ tech }}
          </li>
        </ul>
      </a>
    </div>
  </div>
</template>
