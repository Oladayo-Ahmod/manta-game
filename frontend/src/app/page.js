import { ToastContainer } from 'react-toastify';
import Game from './components/Game';
import ThreeScene from './components/ThreeScene';

export default function Home() {
  return (
    <main>
      <ToastContainer />
      <ThreeScene />
      <div className="relative z-10">
        <Game />
      </div>
    </main>
   
  );
}
