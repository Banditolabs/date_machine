import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const timestamp = Date.now();
  const user1Email = `alice${timestamp}@example.com`;
  const user2Email = `bob${timestamp}@example.com`;

  // Create Alice with an associated account
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice',
      email: user1Email,
      emailVerified: new Date(),
      image: 'https://example.com/alice.png',
      accounts: {
        create: {
          type: 'oauth',
          provider: 'github',
          providerAccountId: `alice-gh-${timestamp}`,
          access_token: 'alice-access-token',
          token_type: 'bearer',
        },
      },
    },
    include: {
      accounts: true,
    },
  });

  // Create Bob with an associated account
  const user2 = await prisma.user.create({
    data: {
      name: 'Bob',
      email: user2Email,
      emailVerified: new Date(),
      image: 'https://example.com/bob.png',
      accounts: {
        create: {
          type: 'oauth',
          provider: 'google',
          providerAccountId: `bob-google-${timestamp}`,
          access_token: 'bob-access-token',
          token_type: 'bearer',
        },
      },
    },
    include: {
      accounts: true,
    },
  });

  console.log(`Created users:
- ${user1.name} (Account: ${user1.accounts[0].provider})
- ${user2.name} (Account: ${user2.accounts[0].provider})`);

  // Optionally, retrieve all users
  const allUsers = await prisma.user.findMany({
    include: {
      accounts: true,
    },
  });

  console.log(`All users with accounts: ${JSON.stringify(allUsers, null, 2)}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
