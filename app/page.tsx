import Navigation from "@/components/navigation/Navigation";
import HeroVideo from "@/components/home/hero/HeroVideo";
import CategoryGrid from "@/components/home/explore/CategoryGrid";
import Bento from "@/components/home/bento/Bento";
import SaleGrid from "@/components/home/onSale/OnSale";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="w-full max-w-7xl mx-auto">
            <Navigation/>

            <main className="px-4 ">
                <HeroVideo/>
                <CategoryGrid/>
                <Bento/>
                <SaleGrid/>
                <Footer/>
            </main>
        </div>
    );
}
