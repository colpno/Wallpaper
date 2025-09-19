import { faker } from '@faker-js/faker';

import Container from '~/components/Container.tsx';
import { Gallery, Image } from '~/components/index.ts';

const image = {
  id: faker.database.mongodbObjectId(),
  src: faker.image.urlPicsumPhotos(),
  description: faker.lorem.sentence(),
};

const images = faker.helpers.multiple(
  () => ({
    id: faker.database.mongodbObjectId(),
    src: faker.image.urlPicsumPhotos(),
    description: faker.lorem.sentence(),
    ratio: [16, 9],
  }),
  {
    count: 5,
  }
);

function VisualSearch() {
  return (
    <Container className="flex">
      <div className="px-4 max-h-dvh overflow-y-scroll fixed bottom-0 w-[600px] h-full">
        <Image src={image.src} alt={image.description} className="rounded-xl" />
      </div>
      <div className="ml-[650px]">
        <Gallery images={images} columnCount={3} gap={12} />
      </div>
    </Container>
  );
}

export default VisualSearch;
