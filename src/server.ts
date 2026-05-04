import { prisma } from "./app/lib/prisma"
import app from "./app"
import { envVars } from "./app/config/env"
import { seedAdmin } from "./app/scripts/seedAdmin"
import { redisService } from "./app/lib/redis"
const port = envVars.PORT || 4000

const main=async()=>{
    try {
        await prisma.$connect()
        await redisService.connect().catch(console.error)
        console.log("connected to database successfully")
        app.listen(port, () => {
            console.log(`Example app listening on port http://localhost:${port}`)
        })
    } catch (error: any) {
        console.error('Server startup failed:', error.message || error)
        if (error?.stack) console.error(error.stack)
        await prisma.$disconnect()
        process.exit(1)
    }
}
main()

