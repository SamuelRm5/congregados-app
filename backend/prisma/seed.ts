import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('congregados2024', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@congregados.com' },
    update: {},
    create: {
      email: 'admin@congregados.com',
      password: passwordHash,
      name: 'Admin',
    },
  });

  console.log('Seed completed:', user.email);

  // Sample song
  const tag = await prisma.tag.upsert({
    where: { name: 'Adoración' },
    update: {},
    create: { name: 'Adoración' },
  });

  await prisma.song.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Sublime Gracia',
      originalKey: 'G',
      bpm: 72,
      content: '[INTRO]\n[G]   [D]   [Em]   [C]\n\n[G]Sublime [D]gracia del [Em]Señor\n[C]que a un [G]pecador [D]salvó\n[G]Fui [D]ciego mas [Em]hoy veo yo\n[C]perdido y [G]Él [D]me ha[G]lló\n',
      tags: { connect: [{ id: tag.id }] },
    },
  });

  console.log('Sample song created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
