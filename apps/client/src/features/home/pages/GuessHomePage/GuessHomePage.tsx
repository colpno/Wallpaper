import { GroupBoards, SearchBySkinTone, VisualSearch } from "@/assets/images";
import RegisterDialogForm from "@/components/common/RegisterDialogForm";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";

import Footer from "./components/Footer";
import Hero from "./components/Hero";
import HomeSignup from "./components/HomeSignup";

function GuessHomePage() {
  return (
    <div className="space-y-25">
      <Hero className="mb-20" />

      <section className="space-y-3 bg-[linear-gradient(to_bottom,rgb(246,246,243),transparent)] px-12 pt-25 *:text-center">
        <Heading variant="h2">Bring your favorite ideas to life</Heading>
        <Typography size="lg" className="mx-auto max-w-175">
          With Pinterest, you can unlock tools that spark your creativity and help you find more
          inspiration.
        </Typography>
      </section>

      <Container as="section" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-0">
        <div className="place-self-end">
          <Image
            src={SearchBySkinTone}
            alt="Search by skin tone"
            className="aspect-square size-full max-h-137.5 max-w-137.5 rounded-4xl"
          />
        </div>

        <div className="space-y-5 lg:ml-20">
          <Heading variant="h2" className="leading-9.5 not-lg:text-center">
            Search by skin tone
          </Heading>

          <Typography size="lg" className="not-lg:text-center">
            Search with skin tone ranges for beauty ideas that represent you
          </Typography>

          <HomePageAuthForm />
        </div>
      </Container>

      <Container as="section" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-0">
        <div className="space-y-5 not-lg:order-2 lg:mr-20">
          <Heading variant="h2" className="leading-9.5 not-lg:text-center">
            Collaborate with group boards
          </Heading>

          <Typography size="lg" className="not-lg:text-center">
            Visualize your ideas with others, using a Pinterest account
          </Typography>

          <HomePageAuthForm />
        </div>

        <div>
          <Image
            src={GroupBoards}
            alt="Collaborate with group boards"
            className="aspect-square size-full max-h-137.5 max-w-137.5 rounded-4xl"
          />
        </div>
      </Container>

      <Container as="section" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-0">
        <div className="place-self-end">
          <Image
            src={VisualSearch}
            alt="Search visually with images"
            className="aspect-square size-full max-h-137.5 max-w-137.5 rounded-4xl"
          />
        </div>

        <div className="space-y-5 lg:ml-20">
          <Heading variant="h2" className="leading-9.5 not-lg:text-center">
            Search visually with images
          </Heading>

          <Typography size="lg" className="not-lg:text-center">
            Search objects within an image to find more styles you’ll love
          </Typography>

          <HomePageAuthForm />
        </div>
      </Container>

      <HomeSignup />

      <Footer />
    </div>
  );
}

function HomePageAuthForm() {
  return (
    <RegisterDialogForm
      trigger={<Button>Join Pinterest</Button>}
      slotProps={{
        trigger: {
          className: "not-lg:mx-auto not-lg:flex!",
        },
      }}
    />
  );
}

export default GuessHomePage;
