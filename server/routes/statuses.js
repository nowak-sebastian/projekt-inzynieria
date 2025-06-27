import express from 'express'
import { nanoid } from 'nanoid'
import { db, init } from '../db.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       required:
 *         - key
 *         - label
 *       properties:
 *         key:
 *           type: string
 *           description: Unikatowy identyfikator statusu
 *         label:
 *           type: string
 *           description: Nazwa statusu
 */

/**
 * @swagger
 * tags:
 *   name: Statuses
 *   description: Zarządzanie statusami
 */

/**
 * @swagger
 * /api/statuses:
 *   get:
 *     summary: Pobierz wszystkie statusy
 *     tags: [Statuses]
 *     responses:
 *       200:
 *         description: Lista wszystkich statusów
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 */

router.get('/', async (req, res) => {
    await init()
    res.json(db.data.statuses)
})

/**
 * @swagger
 * /api/statuses:
 *   post:
 *     summary: Utwórz nowy status
 *     tags: [Statuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       200:
 *         description: Nowy status utworzony
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 */

router.post('/', async (req, res) => {
    await init()
    const newStatus = {
        key: nanoid(),
        label: req.body.label
    }

    db.data.statuses.push(newStatus)
    await db.write()
    res.json(newStatus)
})

/**
 * @swagger
 * /api/statuses/{key}:
 *   put:
 *     summary: Aktualizuj status
 *     tags: [Statuses]
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Status'
 *     responses:
 *       200:
 *         description: Status zaktualizowany
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 */

router.put('/:key', async (req, res) => {
    await init()
    const status = db.data.statuses.find(s => s.key === req.params.key)
    if (!status) {
        return res.status(404).json({ error: 'Status not found' })
    }

    db.data.tickets.forEach(ticket => {
        if (ticket.status === status.key) {
            ticket.status = req.body.key
        }
    })

    status.label = req.body.label
    await db.write()
    res.json(status)
})

/**
 * @swagger
 * /api/statuses/{key}:
 *   delete:
 *     summary: Usuń status
 *     tags: [Statuses]
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status usunięty
 */

router.delete('/:key', async (req, res) => {
    await init()
    const status = db.data.statuses.find(s => s.key === req.params.key)
    if (!status) {
        return res.status(404).json({ error: 'Status not found' })
    }
    
    db.data.tickets.forEach(ticket => {
        if (ticket.status === status.key) {
            ticket.status = null
        }
    })

    db.data.statuses = db.data.statuses.filter(s => s.key !== req.params.key)
    await db.write()
    res.json({ message: 'Status deleted' })
})

export default router