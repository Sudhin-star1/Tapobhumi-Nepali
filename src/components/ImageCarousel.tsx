import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  if (!images.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}
      loop={images.length > 1}
      autoplay={images.length > 1 ? { delay: 3500, disableOnInteraction: false } : false}
      pagination={{ clickable: true }}
      className="w-full h-full"
    >
      {images.map((src) => (
        <SwiperSlide key={src}>
          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

