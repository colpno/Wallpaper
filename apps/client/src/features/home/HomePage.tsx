import { GroupBoards, SearchBySkinTone, VisualSearch } from "@/assets/images";
import Dialog from "@/components/dialogs/Dialog";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Typography from "@/components/ui/Typography";

import AuthForm from "../auth/components/AuthForm";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import RegisterSection from "./components/RegisterSection";

function HomePage() {
  return (
    <div className="space-y-25">
      <Hero className="mb-20" />

      <section className="space-y-3 bg-[linear-gradient(to_bottom,rgb(246,246,243),transparent)] px-12 pt-25 *:text-center">
        <Heading variant="h2">Bring your favorite ideas to life</Heading>
        <Typography size="lg" className="mx-auto max-w-[700px]">
          With Pinterest, you can unlock tools that spark your creativity and help you find more
          inspiration.
        </Typography>
      </section>

      <Container as="section" className="grid grid-cols-2 items-center">
        <div className="place-self-end">
          <Image
            src={SearchBySkinTone}
            alt="Search by skin tone"
            className="size-[550px] rounded-4xl"
          />
        </div>

        <div className="ml-20 space-y-5">
          <Heading variant="h2" className="leading-9.5">
            Search by skin tone
          </Heading>

          <Typography size="lg">
            {" "}
            Search with skin tone ranges for beauty ideas that represent you
          </Typography>

          <HomePageAuthForm />
        </div>
      </Container>

      <Container as="section" className="grid grid-cols-2 items-center">
        <div className="mr-20 space-y-5">
          <Heading variant="h2" className="leading-9.5">
            Collaborate with group boards
          </Heading>

          <Typography size="lg">
            Visualize your ideas with others, using a Pinterest account
          </Typography>

          <HomePageAuthForm />
        </div>

        <div>
          <Image
            src={GroupBoards}
            alt="Collaborate with group boards"
            className="size-[550px] rounded-4xl"
          />
        </div>
      </Container>

      <Container as="section" className="grid grid-cols-2 items-center">
        <div className="place-self-end">
          <Image
            src={VisualSearch}
            alt="Search visually with images"
            className="size-[550px] rounded-4xl"
          />
        </div>

        <div className="ml-20 space-y-5">
          <Heading variant="h2" className="leading-9.5">
            Search visually with images
          </Heading>

          <Typography size="lg">
            Search objects within an image to find more styles you’ll love
          </Typography>

          <HomePageAuthForm />
        </div>
      </Container>

      <RegisterSection />

      <Footer />
    </div>
  );
}

function HomePageAuthForm() {
  return (
    <Dialog
      showFooter={false}
      showCloseButton
      trigger={<Button>Join Pinterest</Button>}
      slotProps={{ trigger: { asChild: true } }}
      className="rounded-4xl"
    >
      <Image src="/favicon.svg" className="m-[8px_auto_6px] size-10" />

      <AuthForm className="py-0" />
    </Dialog>
  );
}

export default HomePage;
