<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, User, Calendar, ArrowRight, Plus, Trash, Pencil } from 'lucide-vue-next'
import Statuses from '../components/Statuses.vue'
import Categories from '../components/Categories.vue'
import { getTickets } from '../services/TicketService'
import { useTicketsStore } from '@/stores/tickets'
import { useCategoriesStore } from '@/stores/categories'
import { useStatusesStore } from '@/stores/statuses'

const ticketsStore = useTicketsStore()
const categoriesStore = useCategoriesStore()
const statusesStore = useStatusesStore()

const search = ref('')

const tickets = computed(() => {
    return ticketsStore.tickets.filter(ticket => {
        let isMatch = true

        if (ticketsStore.selectedStatus && ticket.status !== ticketsStore.selectedStatus) {
            isMatch = false
        }

        if (ticketsStore.selectedCategory && ticket.category !== ticketsStore.selectedCategory) {
            isMatch = false
        }

        if (search.value && !ticket.title.toLowerCase().includes(search.value.toLowerCase())) {
            isMatch = false
        }

        return isMatch
    })
})

function getCategoryLabel(category)
{
    return categoriesStore.categories.find(c => c.key === category)?.label ?? 'Brak kategorii'
}

function getPriorityClass(priority)
{
    switch (priority) {
        case 'critical':
            return 'bg-red-200 text-red-700 border-red-300'
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200'
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'low':
            return 'bg-gray-100 text-gray-800 border-gray-200'
    }
}

function getPriorityLabel(priority)
{
    return ticketsStore.priorities.find(p => p.key === priority)?.label ?? 'Brak priorytetu'
}

function getStatusLabel(status)
{
    return statusesStore.statuses.find(s => s.key === status)?.label ?? 'Brak statusu'
}

async function loadData()
{
    try
    {
        await ticketsStore.get()
    }
    catch
    {
        alert('Nie udało się załadować zgłoszeń')
    }
}

onBeforeMount(async () => {
    await loadData()
})
</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 space-y-4 sticky top-4" :style="{ height: 'fit-content' }">
            <Statuses v-model="ticketsStore.selectedStatus" />
            <Categories v-model="ticketsStore.selectedCategory" />
        </div>

        <div class="col-span-9">
            <div class="bg-white rounded-xl border border-gray-200 p-4 mb-4">
                <div class="relative">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Szukaj zgłoszeń..."
                        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200">
                <div class="p-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">
                        Zgłoszenia ({{ tickets.length }})
                    </h2>
                </div>

                <div class="divide-y divide-gray-200">
                    <RouterLink v-for="ticket in tickets" :key="ticket.id" :to="`/zgloszenie/${ticket.id}`" class="p-6 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-3 mb-2">
                                <span class="font-mono text-sm text-gray-500">
                                    INC-2025-{{ ticket.id }}
                                </span>
                                
                                <span class="px-2 py-1 rounded-full text-xs border" :class="getPriorityClass(ticket.priority)">
                                    {{ getPriorityLabel(ticket.priority) }}
                                </span>

                                <span class="px-2 py-1 bg-gray-100 rounded text-xs">
                                    {{ getStatusLabel(ticket.status) }}
                                </span>
                            </div>

                            <h3 class="text-lg font-medium text-gray-900 mb-2">
                                {{ ticket.title }}
                            </h3>

                            <div class="flex items-center space-x-6 text-sm text-gray-600">
                                <div class="flex items-center space-x-2">
                                    <User class="w-4 h-4" />
                                    <span>Autor: {{ ticket.user }}</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <Calendar class="w-4 h-4" />
                                    <span>Utworzono: {{ new Date(ticket.createdAt).toLocaleString() }}</span>
                                </div>
                                <span class="px-2 py-1 bg-gray-100 rounded text-xs">
                                    {{ getCategoryLabel(ticket.category) }}
                                </span>
                            </div>
                        </div>

                        <ArrowRight class="w-4 h-4 text-gray-400" />
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>