import { Header } from "../components/header/header";
import React from "react";
import { TopBanners } from "./components/top-banners";
import { InfoSection } from "./components/info-section";
import { CategorySwiper } from "./components/category-swiper";
import { ReviewSection } from "./components/review/reviews-section";
import { BottomBanners } from "./components/bottom-banners";
import Footer from "../components/footer/footer";

export default function Page() {
  return (
    <div>
      <Header />
      <TopBanners />
      <InfoSection />
      <CategorySwiper />
      <ReviewSection />
      <BottomBanners />
      <Footer />
    </div>
  );
}
