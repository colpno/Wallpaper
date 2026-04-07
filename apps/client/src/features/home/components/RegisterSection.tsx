import { cn } from "@repo/ui/lib";
import { FaChevronUp } from "react-icons/fa6";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";
import AuthForm from "@/features/auth/components/AuthForm";

import { dishImages } from "../constants";

function RegisterSection(props: React.ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn(
        "relative mb-0 h-screen overflow-hidden before:absolute before:inset-0 before:z-2 before:bg-black/60 before:content-['']",
        props.className
      )}
    >
      <Button
        variant="icon"
        size="xl"
        className="absolute top-20 left-1/2 z-3 -translate-x-1/2 bg-[rgb(156,3,67)] text-2xl"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <FaChevronUp />
      </Button>

      <Container className="relative z-3 grid h-full grid-cols-2 place-items-center gap-60">
        <Heading variant="h2" className="text-[60px] text-white">
          Sign up to get your ideas
        </Heading>

        <div className="relative size-full">
          <AuthForm className="absolute top-20 right-0 py-8" />
        </div>
      </Container>

      <div
        className={cn(
          "absolute top-0 left-1/2 z-1 grid w-[1750px] -translate-x-1/2 grid-cols-7 gap-x-2",
          "*:nth-[2]:-translate-y-40",
          "*:nth-[3]:-translate-y-60",
          "*:nth-[4]:-translate-y-100",
          "*:nth-[5]:-translate-y-60",
          "*:nth-[6]:-translate-y-40"
        )}
      >
        {dishImages.map((imagesColumn, index) => (
          <div key={`image-dish-column-${index}`} className="space-y-4">
            {imagesColumn.map((link) => (
              <Image key={link} src={link} className="h-[350px] w-[236px] rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default RegisterSection;
