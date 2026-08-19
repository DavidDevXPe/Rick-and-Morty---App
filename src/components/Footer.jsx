import portalLogo from '../assets/portal-logo.svg';
import './styles/footer.css';

const Footer = () => (
    <footer className='footer'>
        <div className='footer_inner'>
            <div className='footer_brand'>
                <img className='footer_logo' src={portalLogo} alt='' width='32' height='32' />
                <div>
                    <p className='footer_title'>Rick and Morty API</p>
                    <p className='footer_subtitle'>Información en tiempo real desde la API oficial</p>
                </div>
            </div>

            <p className='footer_made'>Hecho con 💚 por fans de Rick and Morty</p>

            <div className='footer_links'>
                <a
                    className='footer_icon_link'
                    href='https://github.com/rickandmortyapi'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='GitHub'
                >
                    GitHub
                </a>
                <a
                    className='footer_icon_link'
                    href='https://rickandmortyapi.com'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='API'
                >
                    API
                </a>
                <a
                    className='footer_icon_link'
                    href='https://rickandmortyapi.com/documentation'
                    target='_blank'
                    rel='noreferrer'
                    aria-label='Documentación'
                >
                    {'</>'}
                </a>
            </div>
        </div>
    </footer>
);

export default Footer;
