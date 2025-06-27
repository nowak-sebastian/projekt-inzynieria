import { defineStore } from 'pinia'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/CategoryService'

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: []
    }),
    actions: {
        async get() {
            try {
                const response = await getCategories()

                this.categories = response
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        },
        async create(category) {
            try {
                await createCategory(category)

                await this.get()
            } catch (error) {
                console.error('Error creating category:', error)
            }
        },
        async update(category) {
            try {
                await updateCategory(category.key, category)

                await this.get()
            } catch (error) {
                console.error('Error updating category:', error)
            }
        },
        async delete(key) {
            try {
                await deleteCategory(key)

                await this.get()
            } catch (error) {
                console.error('Error deleting category:', error)
            }
        }
    }
})