import express from 'express'
import { nanoid } from 'nanoid'
import { db, init } from '../db.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - key
 *         - label
 *       properties:
 *         key:
 *           type: string
 *         label:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Zarządzanie kategoriami
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Pobierz wszystkie kategorie
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista wszystkich kategorii
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

router.get('/', async (req, res) => {
    await init()
    res.json(db.data.categories)
})

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Utwórz nową kategorię
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Nowa kategoria utworzona
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

router.post('/', async (req, res) => {
    await init()
    const newCategory = {
        key: nanoid(),
        label: req.body.label
    }

    db.data.categories.push(newCategory)
    await db.write()
    res.json(newCategory)
})

/**
 * @swagger
 * /api/categories/{key}:
 *   put:
 *     summary: Aktualizuj kategorię
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Kategoria zaktualizowana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 */

router.put('/:key', async (req, res) => {
    await init()
    const category = db.data.categories.find(c => c.key === req.params.key)
    if (!category) {
        return res.status(404).json({ error: 'Kategoria nie znaleziona' })
    }

    db.data.tickets.forEach(ticket => {
        if (ticket.category === category.key) {
            ticket.category = req.body.key
        }
    })

    category.label = req.body.label
    await db.write()
    res.json(category)
})

/**
 * @swagger
 * /api/categories/{key}:
 *   delete:
 *     summary: Usuń kategorię
 *     tags: [Categories]
 *     parameters:
 *       - name: key
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategoria usunięta
 */

router.delete('/:key', async (req, res) => {
    await init()
    const category = db.data.categories.find(c => c.key === req.params.key)
    if (!category) {
        return res.status(404).json({ error: 'Kategoria nie znaleziona' })
    }

    db.data.tickets.forEach(ticket => {
        if (ticket.category === category.key) {
            ticket.category = null
        }
    })

    db.data.categories = db.data.categories.filter(c => c.key !== req.params.key)
    await db.write()
    res.json({ message: 'Kategoria usunięta' })
})

export default router