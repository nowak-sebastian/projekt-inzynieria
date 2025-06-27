<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouterLink } from 'vue-router';
import { ArrowLeft, User, Calendar, MessageSquare, Send, Trash, Pencil, Save, X } from 'lucide-vue-next'
import { getTicket, updateTicket, deleteTicket } from '@/services/TicketService'
import { useCategoriesStore } from '@/stores/categories'
import { useStatusesStore } from '@/stores/statuses'
import { useTicketsStore } from '@/stores/tickets'

const route = useRoute()
const router = useRouter()
const ticketId = route.params.id

const ticket = ref(null)
const isLoading = ref(false)
const isEditing = ref(false)
const newComment = ref('')
const commentAuthor = ref('')

const categoriesStore = useCategoriesStore()
const statusesStore = useStatusesStore()
const ticketsStore = useTicketsStore()

const editedTicket = ref({})

onBeforeMount(async () => {
    await Promise.all([
        categoriesStore.get(),
        statusesStore.get()
    ])
    
    ticket.value = await getTicket(ticketId)
    editedTicket.value = { ...ticket.value }
})

function getCategoryLabel(category) {
    return categoriesStore.categories.find(c => c.key === category)?.label ?? 'Brak kategorii'
}

function getStatusLabel(status) {
    return statusesStore.statuses.find(s => s.key === status)?.label ?? 'Brak statusu'
}

function getPriorityClass(priority) {
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

function getPriorityLabel(priority) {
    return ticketsStore.priorities.find(p => p.key === priority)?.label ?? 'Brak priorytetu'
}

function startEditing() {
    isEditing.value = true
    editedTicket.value = { ...ticket.value }
}

function cancelEditing() {
    isEditing.value = false
    editedTicket.value = { ...ticket.value }
}

async function saveChanges() {
    try {
        isLoading.value = true
        await updateTicket(ticketId, editedTicket.value)
        ticket.value = { ...editedTicket.value }
        isEditing.value = false
    } catch (error) {
        alert('Nie udało się zapisać zmian')
    } finally {
        isLoading.value = false
    }
}

async function deleteTicketHandler() {
    if (confirm('Czy na pewno chcesz usunąć to zgłoszenie?')) {
        try {
            await deleteTicket(ticketId)
            router.push('/')
        } catch (error) {
            alert('Nie udało się usunąć zgłoszenia')
        }
    }
}

async function addComment() {
    if (!newComment.value.trim() || !commentAuthor.value.trim()) {
        alert('Proszę wypełnić wszystkie pola komentarza')
        return
    }

    const comment = {
        id: Date.now().toString(),
        author: commentAuthor.value,
        content: newComment.value,
        createdAt: new Date().toISOString()
    }

    const updatedTicket = {
        ...ticket.value,
        comments: [comment, ...(ticket.value.comments || [])]
    }

    try {
        await updateTicket(ticketId, updatedTicket)
        ticket.value = updatedTicket
        newComment.value = ''
        commentAuthor.value = ''
    } catch (error) {
        alert('Nie udało się dodać komentarza')
    }
}

function deleteComment(commentId) {
    if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
        const updatedComments = ticket.value.comments.filter(c => c.id !== commentId)
        const updatedTicket = {
            ...ticket.value,
            comments: updatedComments
        }

        updateTicket(ticketId, updatedTicket)
            .then(() => {
                ticket.value = updatedTicket
            })
            .catch(() => {
                alert('Nie udało się usunąć komentarza')
            })
    }
}
</script>

<template>
    <div class="mb-4">
        <RouterLink to="/" class="inline-flex bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300 transition-colors">
            <ArrowLeft class="w-4 h-4" />
            Wróć do listy
        </RouterLink>
    </div>

    <div v-if="ticket" class="space-y-6">
        <!-- Header with ticket info -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="flex items-start justify-between mb-4">
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

                    <h1 class="text-2xl font-bold text-gray-900 mb-2">
                        {{ ticket.title }}
                    </h1>

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

                <div class="flex items-center space-x-2">
                    <button 
                        v-if="!isEditing"
                        @click="startEditing"
                        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Pencil class="w-4 h-4" />
                        Edytuj
                    </button>
                    
                    <button 
                        v-if="isEditing"
                        @click="cancelEditing"
                        class="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <X class="w-4 h-4" />
                        Anuluj
                    </button>
                    
                    <button 
                        v-if="isEditing"
                        @click="saveChanges"
                        :disabled="isLoading"
                        class="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save class="w-4 h-4" />
                        {{ isLoading ? 'Zapisywanie...' : 'Zapisz' }}
                    </button>
                    
                    <button 
                        @click="deleteTicketHandler"
                        class="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash class="w-4 h-4" />
                        Usuń
                    </button>
                </div>
            </div>

            <!-- Description -->
            <div class="border-t border-gray-200 pt-4">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Opis</h3>
                <div v-if="!isEditing" class="text-gray-700 whitespace-pre-wrap">
                    {{ ticket.description }}
                </div>
                <textarea 
                    v-else
                    v-model="editedTicket.description"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Opis zgłoszenia..."
                ></textarea>
            </div>
        </div>

        <!-- Edit form -->
        <div v-if="isEditing" class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Edytuj zgłoszenie</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tytuł <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="editedTicket.title"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tytuł zgłoszenia"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Autor <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="editedTicket.user"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Imię i nazwisko"
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kategoria <span class="text-red-500">*</span>
                    </label>
                    <select
                        v-model="editedTicket.category"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Wybierz kategorię</option>
                        <option v-for="category in categoriesStore.categories" :key="category.key" :value="category.key">
                            {{ category.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status <span class="text-red-500">*</span>
                    </label>
                    <select
                        v-model="editedTicket.status"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Wybierz status</option>
                        <option v-for="status in statusesStore.statuses" :key="status.key" :value="status.key">
                            {{ status.label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Priorytet <span class="text-red-500">*</span>
                    </label>
                    <select
                        v-model="editedTicket.priority"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Wybierz priorytet</option>
                        <option v-for="priority in ticketsStore.priorities" :key="priority.key" :value="priority.key">
                            {{ priority.label }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Comments section -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare class="w-5 h-5" />
                Komentarze ({{ (ticket.comments || []).length }})
            </h3>

            <!-- Add comment form -->
            <div class="border border-gray-200 rounded-lg p-4 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Autor <span class="text-red-500">*</span>
                        </label>
                        <input
                            v-model="commentAuthor"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Twoje imię"
                        />
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Komentarz <span class="text-red-500">*</span>
                    </label>
                    <textarea
                        v-model="newComment"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        placeholder="Napisz komentarz..."
                    ></textarea>
                </div>

                <button
                    @click="addComment"
                    :disabled="!newComment.trim() || !commentAuthor.trim()"
                    class="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    <Send class="w-4 h-4" />
                    Dodaj komentarz
                </button>
            </div>

            <!-- Comments list -->
            <div v-if="ticket.comments && ticket.comments.length > 0" class="space-y-4">
                <div 
                    v-for="comment in ticket.comments" 
                    :key="comment.id"
                    class="border border-gray-200 rounded-lg p-4"
                >
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center space-x-2">
                            <span class="font-medium text-gray-900">{{ comment.author }}</span>
                            <span class="text-sm text-gray-500">
                                {{ new Date(comment.createdAt).toLocaleString() }}
                            </span>
                        </div>
                        
                        <button
                            @click="deleteComment(comment.id)"
                            class="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <Trash class="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div class="text-gray-700 whitespace-pre-wrap">
                        {{ comment.content }}
                    </div>
                </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
                Brak komentarzy. Bądź pierwszym, który doda komentarz!
            </div>
        </div>
    </div>

    <div v-else class="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div class="text-gray-500">Ładowanie zgłoszenia...</div>
    </div>
</template>