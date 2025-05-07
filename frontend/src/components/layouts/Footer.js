import React from 'react';

const XIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true" className="footer__social-icon footer__social-icon--x">
    <path d="M1200 24.6L726.6 623.7L1192.2 1202.4H1017.6L646.2 749.7L312.6 1202.4H7.8L507.6 570.6L56.4 24.6H237.6L576.6 442.2L885 24.6H1200ZM978.6 1122.6L395.4 1122.6L978.6 1122.6ZM221.4 104.4L221.4 104.4L221.4 104.4Z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true" className="footer__social-icon footer__social-icon--facebook">
    <path d="M279.14 288l14.22-92.66h-88.91V127.91c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0c-73.22 0-121 44.38-121 124.72v70.62H22.89V288h81.47v224h100.2V288z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" className="footer__social-icon footer__social-icon--instagram">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9 114.9-51.3 114.9-114.9S287.7 141 224.1 141zm0 186c-39.5 0-71.5-32-71.5-71.5s32-71.5 71.5-71.5 71.5 32 71.5 71.5-32 71.5-71.5 71.5zm146.4-194.3c0 14.9-12.1 27-27 27s-27-12.1-27-27 12.1-27 27-27 27 12.1 27 27zm76.1 27.2c-1.7-35.3-9.9-66.7-36.2-92.1C388.7 9.9 357.3 1.7 322 0 285.7-1.7 256.3 0 224 0s-61.7-1.7-98 0C90.7 1.7 59.3 9.9 33.9 36.2 9.9 59.3 1.7 90.7 0 126c-1.7 36.3 0 65.7 0 98s-1.7 61.7 0 98c1.7 35.3 9.9 66.7 36.2 92.1 23.1 23.1 54.5 31.3 89.8 33C162.3 510.3 191.7 512 224 512s61.7 1.7 98 0c35.3-1.7 66.7-9.9 92.1-36.2 23.1-23.1 31.3-54.5 33-89.8 1.7-36.3 0-65.7 0-98s1.7-61.7 0-98zm-48.6 288c-7.8 19.6-22.9 34.7-42.5 42.5-29.4 11.7-99.2 9-132.4 9s-103 .7-132.4-9c-19.6-7.8-34.7-22.9-42.5-42.5-11.7-29.4-9-99.2-9-132.4s-.7-103 9-132.4c7.8-19.6 22.9-34.7 42.5-42.5C120.8 2.7 190.6 0 224 0s103-.7 132.4 9c19.6 7.8 34.7 22.9 42.5 42.5 11.7 29.4 9 99.2 9 132.4s.7 103-9 132.4z"/>
  </svg>
);

const Footer = () => (
  <div className="footer-bg">
    <footer className="footer">
      <div className="footer__body"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          width: '100%',
          maxWidth: 1200,
          margin: '0 auto',
          padding: 0,
        }}
      >
        {/* Social icons always at top on mobile, otherwise in center */}
        <div className="footer__social-links" aria-label="Social media links"
          style={{
            flex: '1 1 100%',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 2,
          }}
        >
          <a
            href="https://twitter.com/eirecraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ÉireCraft on X"
            className="footer__social-link"
          >
            <XIcon />
          </a>
          <a
            href="https://facebook.com/eirecraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ÉireCraft on Facebook"
            className="footer__social-link"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://instagram.com/eirecraft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ÉireCraft on Instagram"
            className="footer__social-link"
          >
            <InstagramIcon />
          </a>
        </div>
        {/* Row for copyright and contact */}
        <div className="footer__row" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          fontSize: '0.97em',
          margin: 0,
          padding: 0,
          flexWrap: 'wrap',
        }}>
          <div className="footer__copyright" style={{
            flex: '0 0 auto',
            textAlign: 'center',
            fontSize: '0.97em',
            margin: 0,
            padding: 0,
            display: 'inline',
          }}>
            © {new Date().getFullYear()} ÉireCraft. All rights reserved.
          </div>
          <span style={{ display: 'inline-block', width: 8 }} />
          <div className="footer__contact" style={{
            flex: '0 0 auto',
            textAlign: 'center',
            fontSize: '0.97em',
            margin: 0,
            padding: 0,
            display: 'inline',
          }}>
            <a href="mailto:info@eirecraft.ie" className="footer__contact-link" style={{ color: '#b0ffd7', textDecoration: 'none' }}>
              info@eirecraft.ie
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
