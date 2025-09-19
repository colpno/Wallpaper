import { faker } from '@faker-js/faker';

import { Gallery } from '~/components/index.ts';
import { Image } from '~/types/index.ts';

const images = faker.helpers.multiple<Image>(
  () => ({
    id: faker.database.mongodbObjectId(),
    src: faker.image.urlPicsumPhotos(),
    description: faker.lorem.sentence(),
  }),
  {
    count: 1,
  }
);

function HomePage() {
  return (
    <div>
      <Gallery images={images} columnCount={4} gap={5} />
    </div>
  );
}

export default HomePage;
