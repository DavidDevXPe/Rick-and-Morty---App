import { Code2, Github, Heart } from 'lucide-react';
import { useLanguage } from '../i18n/useLanguage';
import './styles/footer.css';

const rmPortalMark = `${import.meta.env.BASE_URL}rm-portal-mark.png`;

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className='footer'>
        <div className='footer_inner'>
            <div className='footer_brand'>
                <img
                    className='footer_logo'
                    src={rmPortalMark}
                    alt=''
                    aria-hidden='true'
                    width='256'
                    height='256'
                    loading='lazy'
                    decoding='async'
                />
                <div>
                    <p className='footer_title'>Rick and Morty API</p>
                    <p className='footer_subtitle'>{t('footer.liveInfo')}</p>
                </div>
            </div>

            <p className='footer_made'>
                {t('footer.madeWith')}
                <Heart size={18} fill='currentColor' aria-label={t('footer.love')} />
                {t('footer.byFans')}
            </p>

            <nav className='footer_links' aria-label={t('footer.links')}>
                <a
                    className='footer_icon_link'
                    href='https://github.com/DavidDevXPe/Rick-and-Morty---App'
                    target='_blank'
                    rel='noreferrer'
                    aria-label={t('footer.projectLabel')}
                    title={t('footer.projectTitle')}
                >
                    <Github size={23} aria-hidden='true' />
                </a>
                <a
                    className='footer_icon_link footer_icon_link--text'
                    href='https://rickandmortyapi.com'
                    target='_blank'
                    rel='noreferrer'
                    aria-label={t('footer.apiLabel')}
                >
                    API
                </a>
                <a
                    className='footer_icon_link'
                    href='https://rickandmortyapi.com/documentation'
                    target='_blank'
                    rel='noreferrer'
                    aria-label={t('footer.docsLabel')}
                    title={t('footer.docsTitle')}
                >
                    <Code2 size={23} aria-hidden='true' />
                </a>
            </nav>
        </div>
        </footer>
    );
};

export default Footer;
