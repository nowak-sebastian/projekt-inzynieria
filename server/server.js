import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJSDoc from 'swagger-jsdoc'

import ticketsRoutes from './routes/tickets.js'
import statusesRoutes from './routes/statuses.js'
import categoriesRoutes from './routes/categories.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "title",
            version: "0.1.0",
            description:
                "description"
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true
    })
);

// -- Tickets ROUTES --
app.use('/api/tickets', ticketsRoutes)

// -- Statuses ROUTES --
app.use('/api/statuses', statusesRoutes)

// -- Categories ROUTES --
app.use('/api/categories', categoriesRoutes)

app.listen(port, '0.0.0.0', () => {
    console.log(`API running at http://localhost:${port} and available in LAN.`)
})