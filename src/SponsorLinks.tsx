import './confirmed-sponsors.css';

// Based on the organizer's supplied sponsorship tracker.
// Pending terms/date confirmations and declined sponsorships are excluded.
const sponsors = [
  { name: 'CodeCrafters', url: 'https://codecrafters.io/', logo: 'codecrafters.svg', partner: false },
  { name: 'Formaloo', url: 'https://www.formaloo.com/', logo: 'formaloo.png', partner: false },
  { name: 'Scrimba', url: 'https://scrimba.com/', logo: 'scrimba.png', partner: false },
  { name: 'Agentboxd', url: 'https://agentboxd.com/', logo: 'agentboxd.svg', partner: false },
  { name: '.xyz', url: 'https://gen.xyz/', logo: 'xyz.svg', partner: false },
  { name: 'SSOJet', url: 'https://ssojet.com/', logo: 'ssojet.svg', partner: false },
  { name: 'Praksha', url: 'https://www.praksha.app/', logo: 'praksha.png', partner: true },
  { name: 'MojoAuth', url: 'https://mojoauth.com/', logo: 'mojoauth.png', partner: false },
];
export function SponsorLinks({ compact = false }: { compact?: boolean }) {
  return <>{sponsors.map(sponsor => (
    <a key={sponsor.name} className="confirmed-sponsor" href={sponsor.url}
      target="_blank" rel="noopener noreferrer"
      aria-label={`${sponsor.name}${sponsor.partner ? ', community partner' : ''} (opens in a new tab)`}>
      {sponsor.logo && <img src={`${import.meta.env.BASE_URL}sponsors/${sponsor.logo}?v=2`}
        alt="" width="44" height="44" loading="lazy" decoding="async" />}
      <span>{sponsor.name}{sponsor.partner && !compact && <small>Community partner</small>}</span>
    </a>
  ))}</>;
}
