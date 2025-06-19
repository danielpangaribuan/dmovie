import './index.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#1b1b1b] flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<DetailPage />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;