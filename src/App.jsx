import { useState } from 'react';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ErrorBoundary from './components/ErrorBoundary';
import {
  PLAYER_NAME_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
  SELECTED_AVATAR_STORAGE_KEY,
} from './config';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageProvider } from './i18n/LanguageContext';
import { useLanguage } from './i18n/useLanguage';
import CharactersPage from './pages/CharactersPage';
import EpisodesPage from './pages/EpisodesPage';
import LocationsPage from './pages/LocationsPage';

const isValidProfile = (profile) => (
  typeof profile?.name === 'string'
  && profile.name.trim().length > 0
  && ['rick', 'morty'].includes(profile.version)
);

function AppContent() {
  const { t } = useLanguage();
  const [profile, setProfile] = useLocalStorage(PROFILE_STORAGE_KEY, null);
  const [activeTab, setActiveTab] = useState('characters');
  const [visitedTabs, setVisitedTabs] = useState(() => new Set(['characters']));
  const [focusEpisodeId, setFocusEpisodeId] = useState(null);
  const [favoritesRequestId, setFavoritesRequestId] = useState(0);
  const [charactersRequestId, setCharactersRequestId] = useState(0);

  const markTabAsVisited = (tabId) => {
    setVisitedTabs((currentTabs) => {
      if (currentTabs.has(tabId)) {
        return currentTabs;
      }

      return new Set([...currentTabs, tabId]);
    });
  };

  const handleTabChange = (tabId) => {
    markTabAsVisited(tabId);
    setActiveTab(tabId);
  };

  const resetNavigation = () => {
    setActiveTab('characters');
    setVisitedTabs(new Set(['characters']));
    setFocusEpisodeId(null);
    setFavoritesRequestId(0);
    setCharactersRequestId(0);
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
    setFavoritesRequestId(0);
    setCharactersRequestId((requestId) => requestId + 1);
    handleTabChange('characters');
  };

  const handleShowFavorites = () => {
    setFocusEpisodeId(null);
    setFavoritesRequestId((count) => count + 1);
    setCharactersRequestId((requestId) => requestId + 1);
    handleTabChange('characters');
  };

  if (!isValidProfile(profile)) {
    return (
      <>
        <a className='skip_link' href='#main-content'>{t('common.skipToContent')}</a>
        <WelcomeScreen onEnter={handleEnter} />
      </>
    );
  }

  return (
    <div className='app'>
      <a className='skip_link' href='#main-content'>{t('common.skipToContent')}</a>
      <div className='starfield' aria-hidden='true' />
      <Header
        activeTab={activeTab}
        profile={profile}
        onChangeUser={handleChangeUser}
        onShowFavorites={handleShowFavorites}
        onTabChange={handleTabChange}
      />

      <main id='main-content' className='app_main' tabIndex='-1'>
        {visitedTabs.has('characters') && (
          <div className='app_view' hidden={activeTab !== 'characters'}>
            <CharactersPage
              key={charactersRequestId}
              favoritesRequestId={favoritesRequestId}
              focusEpisodeId={focusEpisodeId}
            />
          </div>
        )}
        {visitedTabs.has('episodes') && (
          <div className='app_view' hidden={activeTab !== 'episodes'}>
            <EpisodesPage onSelectEpisode={handleSelectEpisode} />
          </div>
        )}
        {visitedTabs.has('locations') && (
          <div className='app_view' hidden={activeTab !== 'locations'}>
            <LocationsPage />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppBoundary />
    </LanguageProvider>
  );
}

function AppBoundary() {
  const { t } = useLanguage();

  return (
    <ErrorBoundary
      message={t('common.unexpectedErrorMessage')}
      reloadLabel={t('common.reload')}
      skipLabel={t('common.skipToContent')}
      title={t('common.unexpectedErrorTitle')}
    >
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
