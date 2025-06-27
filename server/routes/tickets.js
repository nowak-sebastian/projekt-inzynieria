import express from 'express'
import { nanoid } from 'nanoid'
import { db, init } from '../db.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - user
 *         - title
 *         - description
 *         - priority
 *         - status
 *         - category
 *       properties:
 *         id:
 *           type: string
 *           description: Unikatowy identyfikator zgłoszenia
 *         user:
 *           type: string
 *           description: Imię i nazwisko użytkownika
 *         title:
 *           type: string
 *           description: Tytuł zgłoszenia
 *         description:
 *           type: string
 *           description: Opis zgłoszenia
 *         priority:
 *           type: string
 *           description: Priorytet zgłoszenia
 *         status:
 *           type: string
 *           description: Status zgłoszenia
 *         category:
 *           type: string
 *           description: Kategoria zgłoszenia
 *         createdAt:
 *           type: string
 *           description: Data utworzenia zgłoszenia
 *         comments:
 *           type: array
 *           description: Lista komentarzy do zgłoszenia
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               author:
 *                 type: string
 *               content:
 *                 type: string
 *               createdAt:
 *                 type: string
 */
/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Zarządzanie zgłoszeniami
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Pobierz wszystkie zgłoszenia
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista wszystkich zgłoszeń
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */

router.get('/', async (req, res) => {
    await init()
    res.json(db.data.tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
})

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Pobierz zgłoszenie po ID
 *     tags: [Tickets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Zgłoszenie znalezione
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Zgłoszenie nie znalezione
 */

router.get('/:id', async (req, res) => {
    await init()
    const ticket = db.data.tickets.find(t => t.id == req.params.id)

    if (!ticket) {
        return res.status(404).json({ error: 'Zgłoszenie nie znalezione' })
    }
    
    // posortuj komentarze po createdAt
    ticket.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(ticket)
})
/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Utwórz nowe zgłoszenie
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zgłoszenie utworzone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 */

router.post('/', async (req, res) => {
    await init()

    const lastId = db.data.tickets.length > 0 ? db.data.tickets[db.data.tickets.length - 1].id : 0

    const ticket = {
        id: lastId + 1,
        ...req.body,
        createdAt: new Date().toISOString(),
        comments: []
    }

    db.data.tickets.push(ticket)
    await db.write()
    res.json(ticket)
})

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Aktualizuj zgłoszenie
 *     tags: [Tickets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *       200:
 *         description: Zgłoszenie zaktualizowane
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Zgłoszenie nie znalezione
 */

router.put('/:id', async (req, res) => {
    await init()
    const ticketIndex = db.data.tickets.findIndex(t => t.id == req.params.id)

    if (ticketIndex === -1) {
        return res.status(404).json({ error: 'Zgłoszenie nie znalezione' })
    }

    const updatedTicket = {
        ...db.data.tickets[ticketIndex],
        ...req.body
    }

    db.data.tickets[ticketIndex] = updatedTicket
    await db.write()
    res.json(updatedTicket)
})

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Usuń zgłoszenie
 *     tags: [Tickets]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Zgłoszenie usunięte
 *       404:
 *         description: Zgłoszenie nie znalezione
 */

router.delete('/:id', async (req, res) => {
    await init()
    const ticketIndex = db.data.tickets.findIndex(t => t.id == req.params.id)

    if (ticketIndex === -1) {
        return res.status(404).json({ error: 'Zgłoszenie nie znalezione' })
    }

    db.data.tickets.splice(ticketIndex, 1)
    await db.write()
    res.json({ message: 'Zgłoszenie zostało usunięte' })
})

export default router