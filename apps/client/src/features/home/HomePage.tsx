import { cn } from "@repo/ui/lib";
import { FaChevronUp } from "react-icons/fa6";

import { GroupBoards, SearchBySkinTone, VisualSearch } from "@/assets/images";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import Link from "@/components/ui/Link";
import Typography from "@/components/ui/Typography";
import { ROUTES } from "@/constants/common";
import SignupForm from "@/features/auth/components/SignupForm";

import Footer from "./components/Footer";
import Hero from "./components/Hero";

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

          <Link href={ROUTES.SEARCH("bold lip")} button>
            Try now
          </Link>
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

          <Button>See an example</Button>
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

          <Button>Learn more</Button>
        </div>
      </Container>

      <section
        className={cn(
          "relative mb-0 h-screen bg-[url('@/assets/images/fashion-1.jpg')]",
          "before:absolute before:inset-0 before:bg-black/60 before:content-['']"
        )}
      >
        <Button
          variant="icon"
          size="xl"
          className="absolute top-20 left-1/2 -translate-x-1/2 bg-[rgb(156,3,67)] text-2xl"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaChevronUp />
        </Button>

        <Container className="grid h-full grid-cols-2 place-items-center gap-60">
          <Heading variant="h2" className="relative z-2 text-[60px] text-white">
            Sign up to get your ideas
          </Heading>

          <div className="relative size-full">
            <SignupForm onSubmit={console.log} className="absolute top-20 right-0" />
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
