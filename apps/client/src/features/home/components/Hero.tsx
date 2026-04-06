import { cn } from "@repo/ui/lib";
import { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { TiPinOutline } from "react-icons/ti";
import Slider from "react-slick";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Image from "@/components/ui/Image";

import { heroContents } from "../constants";

function Hero(props: React.ComponentProps<"section">) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const sliderRef = useRef<null | Slider>(null);
  const [showPinIcon, setShowPinIcon] = useState(true);

  const handlePlayButtonClick = () => {
    setIsAutoPlay((prev) => {
      if (prev) sliderRef.current?.slickPause();
      else sliderRef.current?.slickPlay();
      return !prev;
    });
  };

  const handleSlideChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setShowPinIcon(false);
  };

  const handleCardTransitionEnd = (cardIndex: number) => {
    if (currentIndex === cardIndex) {
      setShowPinIcon(true);
    }
  };

  return (
    <Container
      {...props}
      as="section"
      className={cn(
        "relative grid h-150 max-w-6xl grid-cols-2 place-items-center",
        props.className
      )}
      style={
        {
          "--color-1": "rgb(250,95,46)",
          "--color-2": "rgb(146,112,215)",
          "--color-3": "rgb(42,167,136)",
          "--color-4": "rgb(82,106,224)",
          "--color-5": "rgb(200,86,200)",
        } as React.CSSProperties
      }
    >
      {/* Left column */}
      <div>
        <div className="font-extrabold">
          <Heading variant="h2">Find ideas for</Heading>

          <Slider
            ref={sliderRef}
            dots
            vertical
            infinite
            autoplay
            autoplaySpeed={3000}
            fade
            beforeChange={(_, nextIndex) => handleSlideChange(nextIndex)}
            className={cn(
              "-mt-4",
              "[&_.slick-dots]:static! [&_.slick-dots]:mt-2! [&_.slick-dots]:flex!",
              "[&_.slick-dots_button::before]:content-none!",
              "[&_.slick-dots>li]:mx-1! [&_.slick-dots>li]:size-2.5!",
              "[&_.slick-dots_button]:size-2.5! [&_.slick-dots_button]:rounded-full! [&_.slick-dots_button]:bg-secondary!",
              "[&_.slick-dots>li.slick-active:nth-child(1)>button]:bg-(--color-1)!",
              "[&_.slick-dots>li.slick-active:nth-child(2)>button]:bg-(--color-2)!",
              "[&_.slick-dots>li.slick-active:nth-child(3)>button]:bg-(--color-3)!",
              "[&_.slick-dots>li.slick-active:nth-child(4)>button]:bg-(--color-4)!",
              "[&_.slick-dots>li.slick-active:nth-child(5)>button]:bg-(--color-5)!"
            )}
          >
            {heroContents.map((item) => (
              <div key={item.text}>
                <Heading
                  variant="h2"
                  className={cn(
                    currentIndex === 0 && "text-(--color-1)",
                    currentIndex === 1 && "text-(--color-2)",
                    currentIndex === 2 && "text-(--color-3)",
                    currentIndex === 3 && "text-(--color-4)",
                    currentIndex === 4 && "text-(--color-5)"
                  )}
                >
                  {item.text}
                </Heading>
              </div>
            ))}
          </Slider>
        </div>

        <div className="mt-10 flex gap-2">
          <Button>Join Pinterest for free</Button>
          <Button variant="ghost">I already have an account</Button>
        </div>
      </div>

      {/* Right column */}
      <div className="relative w-fit">
        <div className="relative h-[400px] w-[300px]">
          {heroContents.map((item, index) => (
            <Image
              key={item.text}
              src={item.images[0]}
              alt={item.text}
              onTransitionEnd={() => handleCardTransitionEnd(index)}
              loading="eager"
              decoding="sync"
              className={cn(
                "absolute size-full rounded-4xl transition-all duration-900",
                index === currentIndex
                  ? "scale-100 -rotate-5 opacity-100"
                  : "scale-60 rotate-3 opacity-0"
              )}
            />
          ))}
        </div>

        <div className="absolute -right-27 bottom-0 h-[270px] w-[200px]">
          {heroContents.map((item, index) => (
            <Image
              key={item.text}
              src={item.images[1]}
              alt={item.text}
              loading="eager"
              decoding="sync"
              className={cn(
                "absolute size-full rounded-[28px] border-8 border-background transition-all duration-900",
                index === currentIndex
                  ? "scale-100 rotate-15 opacity-100"
                  : "scale-60 -rotate-2 opacity-0"
              )}
            />
          ))}
        </div>

        <div
          className={cn(
            "absolute -top-[30px] right-0 z-2 grid size-20 rotate-5 place-items-center rounded-[28px] transition-all duration-300",
            showPinIcon ? "scale-100 opacity-100" : "scale-80 opacity-0",
            showPinIcon && currentIndex === 0 && "bg-(--color-1)",
            showPinIcon && currentIndex === 1 && "bg-(--color-2)",
            showPinIcon && currentIndex === 2 && "bg-(--color-3)",
            showPinIcon && currentIndex === 3 && "bg-(--color-4)",
            showPinIcon && currentIndex === 4 && "bg-(--color-5)"
          )}
        >
          <TiPinOutline className="size-12 text-white" />
        </div>
      </div>

      {/* Play button */}
      <Button
        variant="icon"
        size="lg"
        className="absolute right-5 bottom-5 bg-secondary text-foreground"
        onClick={handlePlayButtonClick}
      >
        {isAutoPlay ? <FaPause /> : <FaPlay className="ml-1" />}
      </Button>
    </Container>
  );
}

export default Hero;
