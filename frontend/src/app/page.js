import Image from "next/image";
import Game from './components/Game';
import ThreeScene from './components/ThreeScene';

export default function Home() {
  return (
    <main>
      <ThreeScene />
      <div className="relative z-10">
        <Game />
      </div>
    </main>
   
  );
}
