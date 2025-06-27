import api from '../plugins/api'

export async function getTickets()
{
    const response = await api.get('/tickets');

    return response.data;
}

export async function getTicket(id)
{
    const response = await api.get(`/tickets/${id}`);

    return response.data;
}

export async function createTicket(data)
{
    const response = await api.post('/tickets', data);

    return response.data;
}

export async function updateTicket(id, data)
{
    const response = await api.put(`/tickets/${id}`, data);

    return response.data;
}

export async function deleteTicket(id)
{
    const response = await api.delete(`/tickets/${id}`);

    return response.data;
}