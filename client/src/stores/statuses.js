import { defineStore } from 'pinia'
import { getStatuses, createStatus, updateStatus, deleteStatus } from '@/services/StatusService'

export const useStatusesStore = defineStore('statuses', {
    state: () => ({
        statuses: []
    }),
    actions: {
        async get() {
            try {
                const response = await getStatuses()

                this.statuses = response
            } catch (error) {
                console.error('Error fetching statuses:', error)
            }
        },
        async create(status) {
            try {
                await createStatus(status)

                await this.get();
            } catch (error) {
                console.error('Error creating status:', error)
            }
        },
        async update(status) {
            try {
                await updateStatus(status.key, status)
                
                await this.get();
            } catch (error) {
                console.error('Error updating status:', error)
            }
        },
        async delete(key) {
            try {
                await deleteStatus(key)

                await this.get();
            } catch (error) {
                console.error('Error deleting status:', error)
            }
        }
    }
})
