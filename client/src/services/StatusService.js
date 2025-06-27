import api from '../plugins/api'

export async function getStatuses()
{
    const response = await api.get('/statuses')
    
    return response.data
}

export async function createStatus(status)
{
    const response = await api.post('/statuses', status)
    
    return response.data
}

export async function updateStatus(key, status)
{
    const response = await api.put(`/statuses/${key}`, status)
    
    return response.data
}

export async function deleteStatus(key)
{
    const response = await api.delete(`/statuses/${key}`)
    
    return response.data
}