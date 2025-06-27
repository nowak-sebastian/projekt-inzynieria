import { defineStore } from 'pinia'
import { getTickets, createTicket, updateTicket, deleteTicket } from '@/services/TicketService'

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        tickets: [],
        selectedStatus: null,
        selectedCategory: null,
        priorities: [
            {
                key: 'low',
                label: 'Niski'
            },
            {
                key: 'medium',
                label: 'Średni'
            },
            {
                key: 'high',
                label: 'Wysoki'
            },
            {
                key: 'critical',
                label: 'Krytyczny'
            }
        ]
    }),
    actions: {
        async get() {
            const response = await getTickets()
            this.tickets = response
        },
        async create(ticket) {
            await createTicket(ticket)
            await this.get()
        },
        async update(ticket) {
            await updateTicket(ticket.id, ticket)
            await this.get()
        },
        async delete(ticket) {
            await deleteTicket(ticket.id)
            await this.get()
        }
    }
})