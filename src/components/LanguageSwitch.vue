<template>
  <div class="fixed top-4 right-4 flex items-center gap-2">
    <button
      class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
      :class="currentLang === 'zh' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      @click="switchLanguage('zh')"
    >
      中文
    </button>
    <button
      class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
      :class="currentLang === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      @click="switchLanguage('en')"
    >
      English
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentLanguage, setLanguage } from '../i18n';

const currentLang = ref<'en' | 'zh'>('zh');

onMounted(() => {
  currentLang.value = getCurrentLanguage();
});

const switchLanguage = (lang: 'en' | 'zh') => {
  setLanguage(lang);
  currentLang.value = lang;
};
</script> 