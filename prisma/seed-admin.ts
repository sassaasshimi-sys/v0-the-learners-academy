import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@learnersacademy.com'
  const adminPassword = 'AdminSecure2026!'
  const adminName = 'Academy Admin'

  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } })

  if (existing) {
    console.log('Admin already exists.')
    return
  }

  const admin = await prisma.admin.create({
    data: {
      email: adminEmail,
      password: adminPassword,
      name: adminName,
      role: 'admin'
    }
  })

  console.log('Successfully created initial administrator:', admin.email)
}

main()
  .catch(e => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
