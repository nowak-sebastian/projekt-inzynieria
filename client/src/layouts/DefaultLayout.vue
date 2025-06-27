<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import NewTicketModal from '../components/NewTicketModal.vue'

const isNewTicketModalVisible = ref(false)

function openNewTicketModal()
{
    isNewTicketModalVisible.value = true
}
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <div class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-900">Service Desk</h1>
                        <p class="text-sm text-gray-600 mt-1">Zarządzanie zgłoszeniami serwisowymi</p>
                    </div>
                    <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors" @click="openNewTicketModal">
                        <Plus class="w-4 h-4" />
                        <span>Nowe zgłoszenie</span>
                    </button>
                </div>
            </div>
        </div>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <router-view />
        </main>

        <NewTicketModal v-model="isNewTicketModalVisible" />
    </div>
</template>