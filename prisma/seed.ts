import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create some sample colleges
  const colleges = [
    {
      name: 'Stanford University',
      location: 'Stanford, CA',
      domain: 'stanford.edu',
    },
    {
      name: 'Massachusetts Institute of Technology',
      location: 'Cambridge, MA',
      domain: 'mit.edu',
    },
    {
      name: 'Harvard University',
      location: 'Cambridge, MA',
      domain: 'harvard.edu',
    },
    {
      name: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      domain: 'berkeley.edu',
    },
    {
      name: 'Carnegie Mellon University',
      location: 'Pittsburgh, PA',
      domain: 'cmu.edu',
    },
  ];

  console.log('Creating colleges...');
  
  for (const college of colleges) {
    const existingCollege = await prisma.college.findFirst({
      where: { name: college.name },
    });

    if (!existingCollege) {
      await prisma.college.create({
        data: college,
      });
      console.log(`Created college: ${college.name}`);
    } else {
      console.log(`College already exists: ${college.name}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });