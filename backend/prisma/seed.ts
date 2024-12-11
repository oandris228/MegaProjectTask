import { faker } from '@faker-js/faker'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient

const materials = ["wood", "metal", "plastic", "other"]

async function main() {
    for (let i = 0; i < 5; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                price: faker.number.int( {min: 1, max: 500}),
                description: faker.commerce.productDescription()
            }
        })
    }
}
main()
    .then(async ()=> {
        await prisma.$disconnect();
    })
    .catch(async (e)=>{
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })