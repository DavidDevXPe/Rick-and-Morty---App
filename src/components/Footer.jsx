import { Code2, Github, Heart } from 'lucide-react';
import './styles/footer.css';

const rmPortalMark = `${import.meta.env.BASE_URL}rm-portal-mark.png`;

const Footer = () => (
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
                    <p className='footer_subtitle'>Información en tiempo real desde la API oficial</p>
                </div>
            </div>

            <p className='footer_made'>
                Hecho con
                <Heart size={18} fill='currentColor' aria-label='amor' />
                por fans de Rick and Morty
            </p>

            <nav className='footer_links' aria-label='Enlaces del proyecto'>
                <a
                    className='footer_icon_link'
                    href='https://github.com/rickandmortyapi'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='GitHub'
                    title='GitHub'
                >
                    <Github size={23} aria-hidden='true' />
                </a>
                <a
                    className='footer_icon_link footer_icon_link--text'
                    href='https://rickandmortyapi.com'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='API de Rick and Morty'
                >
                    API
                </a>
                <a
                    className='footer_icon_link'
                    href='https://rickandmortyapi.com/documentation'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='Documentación de la API'
                    title='Documentación'
                >
                    <Code2 size={23} aria-hidden='true' />
                </a>
            </nav>
        </div>
    </footer>
);

export default Footer;
