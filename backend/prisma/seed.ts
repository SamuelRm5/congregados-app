import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/entities/user.entity';
import { Song } from '../src/entities/song.entity';
import { Tag } from '../src/entities/tag.entity';

const dataSource = new DataSource({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: [User, Song, Tag],
  synchronize: false,
});

async function main() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const tagRepo = dataSource.getRepository(Tag);
  const songRepo = dataSource.getRepository(Song);

  const passwordHash = await bcrypt.hash('congregados2024', 10);

  let user = await userRepo.findOne({
    where: { email: 'admin@congregados.com' },
  });
  if (!user) {
    user = userRepo.create({
      email: 'admin@congregados.com',
      password: passwordHash,
      name: 'Admin',
    });
    await userRepo.save(user);
  }

  console.log('Seed completed:', user.email);

  let tag = await tagRepo.findOne({ where: { name: 'Adoración' } });
  if (!tag) {
    tag = tagRepo.create({ name: 'Adoración' });
    await tagRepo.save(tag);
  }

  const existingSong = await songRepo.findOne({
    where: { title: 'Sublime Gracia' },
  });
  if (!existingSong) {
    const song = songRepo.create({
      title: 'Sublime Gracia',
      originalKey: 'G',
      bpm: 72,
      content:
        '[INTRO]\n[G]   [D]   [Em]   [C]\n\n[G]Sublime [D]gracia del [Em]Señor\n[C]que a un [G]pecador [D]salvó\n[G]Fui [D]ciego mas [Em]hoy veo yo\n[C]perdido y [G]Él [D]me ha[G]lló\n',
      tags: [tag],
    });
    await songRepo.save(song);
    console.log('Sample song created');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await dataSource.destroy();
  });
