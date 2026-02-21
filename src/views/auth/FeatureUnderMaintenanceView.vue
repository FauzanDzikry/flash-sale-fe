<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import logo from '@/assets/logo.png'
import logoWhite from '@/assets/logo-white.png'

const theme = useThemeStore()
const logoSrc = computed(() => (theme.isDark ? logoWhite : logo))
</script>

<template>
  <div class="maintenance-page">
    <div class="maintenance-page__bg" />
    <header class="maintenance-page__header">
      <RouterLink to="/login" class="maintenance-page__brand">
        <img :src="logoSrc" alt="Flash Sale" class="maintenance-page__logo" />
      </RouterLink>
    </header>

    <div class="maintenance-page__grid">
      <section class="maintenance-page__content fade-in">
        <h1 class="maintenance-page__title">
          <span class="maintenance-page__title-line">Feature under</span>
          <span class="maintenance-page__title-line maintenance-page__title-line--large">maintenance</span>
        </h1>
        <p class="maintenance-page__text">
          We're working hard to improve your experience. This feature is temporarily unavailable.
          Please try again later or contact support if you need assistance.
        </p>
        <RouterLink to="/login" class="maintenance-page__btn">
          <svg class="maintenance-page__btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l4-4m-4 4l4 4" />
          </svg>
          Back to login
        </RouterLink>
      </section>

      <aside class="maintenance-page__illustration fade-in fade-in-delay-1" aria-hidden="true">
        <svg
          class="maintenance-page__svg"
          viewBox="0 0 400 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Crane -->
          <g class="maintenance-illustration__crane">
            <rect x="40" y="120" width="12" height="140" fill="#9CA3AF" rx="2" />
            <rect x="28" y="100" width="36" height="28" fill="#FCD34D" rx="2" />
            <line x1="52" y1="120" x2="52" y2="100" stroke="#9CA3AF" stroke-width="4" />
            <line x1="52" y1="80" x2="52" y2="100" stroke="#6B7280" stroke-width="3" />
            <rect x="44" y="70" width="16" height="14" fill="#9CA3AF" rx="1" />
          </g>

          <!-- Browser window -->
          <g class="maintenance-illustration__browser">
            <rect x="120" y="60" width="240" height="200" rx="12" fill="#E0F2FE" stroke="#BAE6FD" stroke-width="2" />
            <!-- Browser controls -->
            <circle cx="138" cy="78" r="4" fill="#94A3B8" />
            <circle cx="150" cy="78" r="4" fill="#94A3B8" />
            <circle cx="162" cy="78" r="4" fill="#94A3B8" />
            <!-- Content area -->
            <rect x="132" y="95" width="50" height="50" rx="8" fill="white" opacity="0.9" />
            <rect x="142" y="105" width="30" height="30" fill="#CBD5E1" rx="4" />
            <!-- Lines / progress -->
            <rect x="132" y="158" width="216" height="8" rx="4" fill="#E2E8F0" />
            <rect x="132" y="172" width="180" height="8" rx="4" fill="#E2E8F0" />
            <rect x="132" y="186" width="140" height="8" rx="4" fill="#5EEAD4" />
            <rect x="132" y="200" width="100" height="8" rx="4" fill="#5EEAD4" />
            <!-- Large gear -->
            <g transform="translate(260, 130)">
              <circle cx="0" cy="0" r="28" fill="#94A3B8" opacity="0.95" />
              <circle cx="0" cy="0" r="10" fill="#E0F2FE" />
              <rect x="-3" y="-28" width="6" height="12" fill="#64748B" rx="1" />
              <rect x="-3" y="16" width="6" height="12" fill="#64748B" rx="1" />
              <rect x="-28" y="-3" width="12" height="6" fill="#64748B" rx="1" />
              <rect x="16" y="-3" width="12" height="6" fill="#64748B" rx="1" />
              <rect x="-20" y="-20" width="8" height="8" fill="#64748B" rx="1" transform="rotate(45 0 0)" />
              <rect x="12" y="-20" width="8" height="8" fill="#64748B" rx="1" transform="rotate(-45 0 0)" />
              <rect x="-20" y="12" width="8" height="8" fill="#64748B" rx="1" transform="rotate(-45 0 0)" />
              <rect x="12" y="12" width="8" height="8" fill="#64748B" rx="1" transform="rotate(45 0 0)" />
            </g>
            <!-- Small gear -->
            <g transform="translate(318, 175)">
              <circle cx="0" cy="0" r="16" fill="#94A3B8" opacity="0.9" />
              <circle cx="0" cy="0" r="5" fill="#E0F2FE" />
              <rect x="-2" y="-10" width="4" height="20" fill="#64748B" rx="1" />
              <rect x="-10" y="-2" width="20" height="4" fill="#64748B" rx="1" />
              <rect x="-7" y="-7" width="4" height="4" fill="#64748B" transform="rotate(45 0 0)" />
              <rect x="-7" y="3" width="4" height="4" fill="#64748B" transform="rotate(-45 0 0)" />
              <rect x="3" y="-7" width="4" height="4" fill="#64748B" transform="rotate(45 0 0)" />
              <rect x="3" y="3" width="4" height="4" fill="#64748B" transform="rotate(-45 0 0)" />
            </g>
            <!-- User bar (bottom right) -->
            <rect x="280" y="228" width="60" height="24" rx="6" fill="#BAE6FD" />
            <circle cx="298" cy="240" r="6" fill="#94A3B8" />
          </g>

          <!-- Character left (male - blue shirt) -->
          <g class="maintenance-illustration__person maintenance-illustration__person--left">
            <ellipse cx="155" cy="268" rx="22" ry="8" fill="#6B7280" />
            <path
              d="M140 268v-48c0-4 6-8 15-8s15 4 15 8v48M155 220c-2 0-4 2-4 6v42M155 220c2 0 4 2 4 6v42"
              stroke="#3B82F6"
              stroke-width="14"
              fill="none"
              stroke-linecap="round"
            />
            <path d="M155 172c-8 0-14 4-14 12v36h28v-36c0-8-6-12-14-12z" fill="#3B82F6" />
            <circle cx="155" cy="158" r="14" fill="#FCD5B0" />
            <path d="M148 155l4 6 8-10" stroke="#3B82F6" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </g>

          <!-- Character right (female - pink blouse) -->
          <g class="maintenance-illustration__person maintenance-illustration__person--right">
            <ellipse cx="305" cy="278" rx="20" ry="8" fill="#6B7280" />
            <path
              d="M292 278v-42c0-4 5-8 13-8s13 4 13 8v42M305 236c-2 0-3 2-3 5v37M305 236c2 0 3 2 3 5v37"
              stroke="#EC4899"
              stroke-width="12"
              fill="none"
              stroke-linecap="round"
            />
            <path d="M305 198c-6 0-11 4-11 10v28h22v-28c0-6-5-10-11-10z" fill="#EC4899" />
            <circle cx="305" cy="185" r="12" fill="#FCD5B0" />
            <path d="M293 268l6 10h12l6-10" fill="#92400E" opacity="0.9" />
          </g>
        </svg>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.maintenance-page__bg {
  position: absolute;
  inset: 0;
  background: #ffffff;
  z-index: 0;
}

.dark .maintenance-page__bg {
  background: #0f172a;
}

.maintenance-page__header {
  position: relative;
  z-index: 1;
  padding: 1.25rem 1.5rem;
}

.maintenance-page__brand {
  display: inline-block;
  text-decoration: none;
}

.maintenance-page__logo {
  display: block;
  height: 2.5rem;
  width: auto;
  object-fit: contain;
}

.maintenance-page__grid {
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  justify-items: center;
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

@media (min-width: 768px) {
  .maintenance-page__grid {
    grid-template-columns: 1fr 1fr;
    padding: 3rem 2rem 4rem;
  }

  .maintenance-page__content {
    justify-self: end;
    max-width: 22rem;
    text-align: left;
  }

  .maintenance-page__illustration {
    justify-self: start;
    max-width: 28rem;
  }
}

.maintenance-page__content {
  text-align: center;
}

.maintenance-page__title {
  margin: 0 0 1rem;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #374151;
}

.dark .maintenance-page__title {
  color: #e2e8f0;
}

.maintenance-page__title-line {
  display: block;
}

.maintenance-page__title-line--large {
  font-size: 2.5rem;
  margin-top: 0.125rem;
}

.maintenance-page__text {
  margin: 0 0 1.75rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #6b7280;
}

.dark .maintenance-page__text {
  color: #94a3b8;
}

.maintenance-page__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: #4285f4;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.15s ease;
  box-shadow: 0 1px 3px rgba(66, 133, 244, 0.3);
}

.maintenance-page__btn:hover {
  background: #3367d6;
  transform: translateY(-1px);
}

.maintenance-page__btn:focus-visible {
  outline: 2px solid #4285f4;
  outline-offset: 2px;
}

.maintenance-page__btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.maintenance-page__illustration {
  width: 100%;
  max-width: 20rem;
}

.maintenance-page__svg {
  width: 100%;
  height: auto;
}

.dark .maintenance-illustration__browser rect:first-of-type {
  fill: #1e293b;
  stroke: #334155;
}

.dark .maintenance-illustration__browser circle[fill="#E0F2FE"],
.dark .maintenance-illustration__browser rect[fill="#E0F2FE"] {
  fill: #334155;
}
</style>
