<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { Plus, Pencil, Trash, X, Ban, Check } from 'lucide-vue-next'
import { getStatuses, createStatus, updateStatus, deleteStatus } from '@/services/StatusService'
import { useStatusesStore } from '@/stores/statuses'

const current = defineModel({ required: true })

const statusesStore = useStatusesStore()

const data = ref({})
const isEditMode = ref(false)
const isModalOpen = ref(false)

const allStatuses = computed(() => {
    return [
        { key: null, label: 'Wszystkie' },
        ...statusesStore.statuses
    ]
})

function openModal(editMode = false)
{
    data.value = {};
    isEditMode.value = editMode
    isModalOpen.value = true
}

function closeModal()
{
    isModalOpen.value = false
}

function selectStatus(status)
{
    current.value = status.key
}

async function handleSubmit()
{
    try
    {
        if (isEditMode.value)
        {
            await statusesStore.update({
                key: data.value.key,
                label: data.value.label
            })
        }
        else
        {
            await statusesStore.create({
                label: data.value.label
            })
        }

        closeModal()
    }
    catch
    {
        alert('Nie udało się zapisać statusu')
    }
}

function editStatus(status)
{
    openModal(true)
    data.value = Object.assign({}, status);
}

async function handleDeleteStatus(status)
{
    if (confirm('Czy na pewno chcesz usunąć ten status?')) {
        await statusesStore.delete(status.key)

        if (current.value === status.key)
        {
            current.value = null
        }
    }
}

onBeforeMount(async () => {
    await statusesStore.get()
})
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
            <span class="font-medium text-gray-900">
                Statusy
            </span>

            <button class="text-gray-600 hover:bg-gray-100 p-1 rounded-sm" @click="openModal(false)">
                <Plus class="w-4 h-4" />
            </button>
        </div>

        <div class="space-y-2">
            <button
                v-for="status in allStatuses"
                :key="status.key"
                class="w-full flex items-center text-left justify-between px-3 py-2 rounded-lg text-sm transition-colors group"
                :class="[current === status.key
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                ]"
                @click="selectStatus(status)"
            >
                {{ status.label }}

                <div v-if="status.key !== null" class="flex items-center gap-2 group-hover:opacity-100 opacity-0 transition-opacity">
                    <button class="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" @click.stop="editStatus(status)">
                        <Pencil class="w-4 h-4" />
                    </button>
                    
                    <button class="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" @click.stop="handleDeleteStatus(status)">
                        <Trash class="w-4 h-4" />
                    </button>
                </div>
            </button>
        </div>
    </div>

    <div v-show="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">
                        {{ isEditMode ? 'Edytuj status' : 'Utwórz nowy status' }}
                    </h2>

                    <button class="text-gray-400 hover:text-gray-600 text-2xl" @click="closeModal">
                        <X />
                    </button>
                </div>
            </div>

            <div class="p-6">
                <form class="space-y-4">
                    <div>
                        <label for="label" class="block text-sm font-medium text-gray-700 mb-2">
                            Nazwa statusu <span class="text-red-500">*</span>
                        </label>

                        <input
                            v-model="data.label"
                            type="text"
                            id="label"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Wpisz nazwę statusu"
                        />
                    </div>
                </form>

                <div class="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                    <button class="flex gap-2 items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" @click="closeModal">
                        <Ban class="w-4 h-4" />
                        <span>Anuluj</span>
                    </button>

                    <button class="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors" :disabled="data.label === ''" @click="handleSubmit">
                        <Check v-if="isEditMode" class="w-4 h-4" />
                        <Plus v-else class="w-4 h-4" />

                        <span>{{ isEditMode ? 'Zapisz zmiany' : 'Utwórz status' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>