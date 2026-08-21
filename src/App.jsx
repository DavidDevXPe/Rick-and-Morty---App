import { useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import CharactersPage from './pages/CharactersPage';
import EpisodesPage from './pages/EpisodesPage';
import LocationsPage from './pages/LocationsPage';

function App() {
  const [activeTab, setActiveTab] = useState('characters');
  const [focusEpisodeId, setFocusEpisodeId] = useState(null);
  const [favoritesRequestId, setFavoritesRequestId] = useState(0);

  const handleSelectEpisode = (episodeId) => {
    setFocusEpisodeId(episodeId);
    setActiveTab('characters');
  };

  const handleShowFavorites = () => {
    setFavoritesRequestId((count) => count + 1);
    setActiveTab('characters');
  };

  return (
    <div className='app'>
      <div className='starfield' aria-hidden='true' />
      <a className='skip_link' href='#main-content'>Saltar al contenido</a>
      <Header
        activeTab={activeTab}
        onShowFavorites={handleShowFavorites}
        onTabChange={setActiveTab}
      />

      <main id='main-content' className='app_main'>
        {activeTab === 'characters' && (
          <CharactersPage favoritesRequestId={favoritesRequestId} focusEpisodeId={focusEpisodeId} />
        )}
        {activeTab === 'episodes' && (
          <EpisodesPage onSelectEpisode={handleSelectEpisode} />
        )}
        {activeTab === 'locations' && (
          <LocationsPage />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
