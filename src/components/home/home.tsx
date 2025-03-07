import { Link } from "react-router-dom";
import img1 from "@src/assets/center.jpg";
import img2 from "@src/assets/anfbbs.png";
import img3 from "@src/assets/bg-gg.jpg";
import img4 from "@src/assets/12.jpg";
import img5 from "@src/assets/an2.jpg";
import img6 from "@src/assets/another.jpg";
import img7 from "@src/assets/front.jpg";
import img8 from "@src/assets/girls.jpg";
import img9 from "@src/assets/hand.jpg";

const Navbar: React.FC = () => {
  return (
    <nav className="flex flex-wrap md:flex-nowrap justify-between items-center p-6 bg-opacity-90">
      <h2 className="text-2xl font-bold text-red-400">Gym Trainer</h2>
      <div className="flex space-x-6 mt-4 md:mt-0">
        <Link to="/register" className="hover:text-red-500">
          Register
        </Link>
        <Link to="/login" className="hover:text-red-500">
          Login
        </Link>
      </div>
    </nav>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/h1_hero.png')" }}
    >
      <div className="absolute inset-0 bg-opacity-50"></div>
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-red-400">
          HI THIS IS RAJ
        </h3>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase">
          Gym Trainer
        </h1>
        <Link
          to=""
          className="mt-6 inline-block bg-red-600 px-6 py-3 text-lg font-semibold rounded-lg hover:bg-red-700"
        >
          My Courses
        </Link>
      </div>
    </section>
  );
};

const Gallery: React.FC = () => {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  return (
    <section className="p-6 md:p-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Gallery ${index + 1}`} className="w-full rounded-lg shadow-lg" />
        ))}
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <div className="text-white min-h-screen overflow-y-auto">
      <Navbar />
      <HeroSection />
      <Gallery />
    </div>
  );
};

export default Home;