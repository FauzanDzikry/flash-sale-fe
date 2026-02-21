<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)]">
    <section class="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-md sm:p-10">
        <h1 class="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          Welcome, {{ auth.currentUser?.name ?? 'User' }}
        </h1>
        <p class="mt-3 text-slate-600">
          Limited-time deals. Browse and grab the best offers.
        </p>
      </div>
    </section>
  </div>
</template>
