<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{
  links: { href: string; label: string }[];
  cvHref: string;
  idioma: { href: string; lang: string; label: string; aria: string };
  textos: { abrir: string; fechar: string; menu: string; baixarCv: string };
}>();

const open = ref(false);
// O painel só é teleportado no client, evitando conflito de hidratação com o HTML do servidor.
const mounted = ref(false);
// No desktop o botão some (md:hidden); se a tela alargar com o menu aberto, fechamos para não travar a página.
let desktop: MediaQueryList | undefined;
const onDesktop = (event: MediaQueryListEvent) => event.matches && open.value && closeMenu(false);
onMounted(() => {
  mounted.value = true;
  desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', onDesktop);
});
const toggleBtn = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);

function focusables(): HTMLElement[] {
  const inPanel = Array.from(panel.value?.querySelectorAll<HTMLElement>('a, button') ?? []);
  return toggleBtn.value ? [toggleBtn.value, ...inPanel] : inPanel;
}

async function openMenu() {
  open.value = true;
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKeydown);
  await nextTick();
  focusables()[1]?.focus();
}

function closeMenu(returnFocus = true) {
  open.value = false;
  document.body.style.overflow = '';
  document.removeEventListener('keydown', onKeydown);
  if (returnFocus) toggleBtn.value?.focus();
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeMenu();
    return;
  }
  if (event.key !== 'Tab') return;
  // Prende o foco no botão + painel. O painel fica no fim do <body> e o botão no header,
  // então a ordem nativa do Tab não serve: circulamos manualmente.
  event.preventDefault();
  const items = focusables();
  const current = items.indexOf(document.activeElement as HTMLElement);
  const next = (current + (event.shiftKey ? -1 : 1) + items.length) % items.length;
  items[next]?.focus();
}

onBeforeUnmount(() => {
  desktop?.removeEventListener('change', onDesktop);
  closeMenu(false);
});
</script>

<template>
  <button
    ref="toggleBtn"
    type="button"
    class="-mr-2 p-2 text-text"
    :aria-expanded="open"
    aria-controls="mobile-menu"
    :aria-label="open ? textos.fechar : textos.abrir"
    @click="open ? closeMenu() : openMenu()"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <template v-if="open"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></template>
      <template v-else><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></template>
    </svg>
  </button>

  <Teleport v-if="mounted" to="body">
  <div
    v-show="open"
    id="mobile-menu"
    ref="panel"
    class="fixed inset-0 z-40 bg-bg/95 backdrop-blur px-6 pt-24 pb-10 flex flex-col"
  >
    <nav :aria-label="textos.menu">
      <ul class="space-y-2">
        <li v-for="(link, i) in links" :key="link.href">
          <a :href="link.href" class="flex items-baseline gap-3 py-2 text-3xl font-bold tracking-tight" @click="closeMenu(false)">
            <span class="font-mono text-sm text-subtle">0{{ i + 1 }}</span>{{ link.label }}
          </a>
        </li>
      </ul>
    </nav>
    <div class="mt-auto flex gap-3">
      <a :href="cvHref" download class="flex-1 inline-flex justify-center rounded-xl border border-border-strong px-5 py-3 font-semibold">
        {{ textos.baixarCv }}
      </a>
      <a
        :href="idioma.href"
        :hreflang="idioma.lang"
        :lang="idioma.lang"
        :aria-label="idioma.aria"
        class="inline-flex justify-center rounded-xl border border-border-strong px-5 py-3 font-mono font-semibold"
      >
        {{ idioma.label }}
      </a>
    </div>
  </div>
  </Teleport>
</template>
