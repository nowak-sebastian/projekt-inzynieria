<script setup>
import { ref, computed } from 'vue'
import { X, Plus, Ban } from 'lucide-vue-next'
import { createTicket } from '../services/TicketService'
import { useCategoriesStore } from '@/stores/categories'
import { useTicketsStore } from '@/stores/tickets'
import { useStatusesStore } from '@/stores/statuses'

const categoriesStore = useCategoriesStore()
const ticketsStore = useTicketsStore()
const statusesStore = useStatusesStore()

const isVisible = defineModel({ required: true });

const isLoading = ref(false)
const data = ref({
    category: '',
    priority: '',
    status: ''
})

const formCorrect = computed(() => {
    return Object.values({
        title: data.value.title,
        user: data.value.user,
        category: data.value.category,
        priority: data.value.priority,
        status: data.value.status,
        description: data.value.description,
    }).every(value => typeof value === 'string' && value.trim() !== '');
});


async function handleSubmit()
{
    try
    {
        isLoading.value = true

        await ticketsStore.create(data.value)

        data.value = {
            category: '',
            priority: ''
        }
        isVisible.value = false
    }
    catch
    {
        alert('Wystąpił błąd podczas dodawania zgłoszenia')
    }
    finally
    {
        isLoading.value = false
    }
}

function closeModal()
{
    isVisible.value = false
}
</script>

<template>
    <div v-show="isVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">
                        Dodaj nowe zgłoszenie
                    </h2>

                    <button class="text-gray-400 hover:text-gray-600 text-2xl" @click="closeModal">
                        <X />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <form class="space-y-4">
                    <div>
                        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                            Tytuł zgłoszenia <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="data.title"
                            type="text"
                            id="title"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Wpisz tytuł zgłoszenia"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                Zgłaszający <span class="text-red-500">*</span>
                            </label>

                            <input
                                v-model="data.user"
                                placeholder="Wpisz imię i nazwisko"
                                type="text"
                                id="name"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                                Status <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="data.status"
                                id="status"
                                placeholder="Wybierz status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Wybierz status</option>
                                <option v-for="status in statusesStore.statuses" :key="status.key" :value="status.key">
                                    {{ status.label }}
                                </option>
                            </select>
                        </div>

                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
                                Priorytet <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="data.priority"
                                id="priority"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Wybierz priorytet</option>
                                <option v-for="priority in ticketsStore.priorities" :key="priority.key" :value="priority.key">
                                    {{ priority.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                                Kategoria <span class="text-red-500">*</span>
                            </label>

                            <select
                                v-model="data.category"
                                id="category"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Wybierz kategorię</option>
                                <option v-for="category in categoriesStore.categories" :key="category.key" :value="category.key">
                                    {{ category.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                            Opis zgłoszenia <span class="text-red-500">*</span>
                        </label>

                        <textarea
                            v-model="data.description"
                            id="description"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Wpisz opis zgłoszenia"
                            rows="8"
                        ></textarea>
                    </div>
                </form>

                <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button class="flex gap-2 items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" @click="closeModal">
                        <Ban class="w-4 h-4" />
                        <span>Anuluj</span>
                    </button>

                    <button class="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors" :disabled="isLoading || !formCorrect" @click="handleSubmit">
                        <Plus class="w-4 h-4" />
                        <span>Dodaj zgłoszenie</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>