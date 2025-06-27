import api from '../plugins/api'

export async function getCategories()
{
    const response = await api.get('/categories')
    return response.data
}

export async function createCategory(category)
{
    const response = await api.post('/categories', category)
    return response.data
}

export async function updateCategory(key, category)
{
    const response = await api.put(`/categories/${key}`, category)
    return response.data
}

export async function deleteCategory(key)
{
    const response = await api.delete(`/categories/${key}`)
    return response.data
}