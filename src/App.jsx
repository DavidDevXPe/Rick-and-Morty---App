import { useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import {
  PLAYER_NAME_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SELECTED_AVATAR_STORAGE_KEY,
} from './config';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageProvider } from './i18n/LanguageContext';
import CharactersPage from './pages/CharactersPage';
import EpisodesPage from './pages/EpisodesPage';
import LocationsPage from './pages/LocationsPage';

const isValidProfile = (profile) => (
  typeof profile?.name === 'string'
  && profile.name.trim().length > 0
  && ['rick', 'morty'].includes(profile.version)
);

function AppContent() {
  const [profile, setProfile] = useLocalStorage(PROFILE_STORAGE_KEY, null);
  const [activeTab, setActiveTab] = useState('characters');
  const [focusEpisodeId, setFocusEpisodeId] = useState(null);
  const [favoritesRequestId, setFavoritesRequestId] = useState(0);

  const resetNavigation = () => {
    setActiveTab('characters');
    setFocusEpisodeId(null);
    setFavoritesRequestId(0);
  };

  const handleEnter = (nextProfile) => {
    setProfile(nextProfile);
    resetNavigation();
  };

  const handleChangeUser = () => {
    try {
      window.localStorage.removeItem(PLAYER_NAME_STORAGE_KEY);
      window.localStorage.removeItem(SELECTED_AVATAR_STORAGE_KEY);
    } catch {
      // Identity storage can be unavailable in private or restricted contexts.
    }

    setProfile(null);
    resetNavigation();
  };

  const handleSelectEpisode = (episodeId) => {
    setFocusEpisodeId(episodeId);
    setActiveTab('characters');
  };

  const handleShowFavorites = () => {
    setFavoritesRequestId((count) => count + 1);
    setActiveTab('characters');
  };

  if (!isValidProfile(profile)) {
    return <WelcomeScreen onEnter={handleEnter} />;
  }

  return (
    <div className='app'>
      <div className='starfield' aria-hidden='true' />
      <Header
        activeTab={activeTab}
        profile={profile}
        onChangeUser={handleChangeUser}
        onShowFavorites={handleShowFavorites}
        onTabChange={setActiveTab}
      />

      <main className='app_main'>
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

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
