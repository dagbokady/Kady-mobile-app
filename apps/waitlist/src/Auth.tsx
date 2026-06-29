// src/Auth.tsx — flux d'authentification web KADY (design split KADY Web).
// Login + Register + Welcome, câblés au backend FastAPI.
import { useEffect, useState } from 'react';
import { auth, getVilles, tokens, type Me } from './api';

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo'];
const go = (hash: string) => { window.location.hash = hash; };

function Art({ title, sub }: { title: string; sub: string }) {
    return (
        <div className="art">
            <div className="art-blob" />
            <div className="art-top">
                <svg width="34" height="22" viewBox="0 0 132 82" fill="none" aria-hidden>
                    <defs><linearGradient id="kgla" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffe1ec" /><stop offset="1" stopColor="#ff5f9e" /></linearGradient></defs>
                    <circle cx="86" cy="41" r="27" stroke="url(#kgla)" strokeWidth="13.5" /><circle cx="46" cy="41" r="27" stroke="url(#kgla)" strokeWidth="13.5" />
                    <path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#kgla)" strokeWidth="13.5" strokeLinecap="round" />
                </svg>
                <span className="wordmark light">KADY</span>
            </div>
            <div className="art-mid"><h1>{title}</h1><p>{sub}</p></div>
            <div className="art-stat">
                <div className="art-stat-ic">👥</div>
                <div><div className="art-stat-t">+12 000 cercles actifs</div><div className="art-stat-s">à Abidjan et partout en Côte d'Ivoire</div></div>
            </div>
        </div>
    );
}

export function Login() {
    const [email, setEmail] = useState('');
    const [mdp, setMdp] = useState('');
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setErr(''); setBusy(true);
        try { await auth.login(email.trim().toLowerCase(), mdp); go('#welcome'); }
        catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
    };
    return (
        <div className="split">
            <Art title="Les vraies rencontres commencent dans un cercle." sub="Retrouve tes cercles, tes conversations et les liens que tu construis, à ton rythme." />
            <div className="panel">
                <form className="panel-inner" onSubmit={submit}>
                    <h2>Content de te revoir</h2>
                    <p className="panel-sub">Connecte-toi pour retrouver tes cercles.</p>
                    <div className="form">
                        <label className="field"><span className="field-label">Email</span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@email.com" /></label>
                        <label className="field"><span className="field-label">Mot de passe</span>
                            <input type="password" value={mdp} onChange={(e) => setMdp(e.target.value)} placeholder="••••••••" /></label>
                        {err && <div className="error">{err}</div>}
                        <button className="cta" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter →'}</button>
                        <p className="legal">Pas encore de compte ? <a className="link" href="#register">Créer un compte</a></p>
                        <p className="legal"><a className="link" href="#">← Retour à la liste d'attente</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function Register() {
    const [villes, setVilles] = useState<string[]>([]);
    useEffect(() => { getVilles().then(setVilles); }, []);
    const [f, setF] = useState({ prenom: '', email: '', mdp: '', naissance: '', genre: '', ville: '' });
    const [interets, setInterets] = useState<string[]>([]);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
    const toggle = (i: string) => setInterets((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setErr('');
        if (!f.prenom.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return setErr('Prénom et email valides requis.');
        if (f.mdp.length < 8) return setErr('Mot de passe : 8 caractères minimum.');
        if (!f.naissance) return setErr('Indique ta date de naissance.');
        setBusy(true);
        try {
            await auth.register({ email: f.email.trim().toLowerCase(), password: f.mdp, prenom: f.prenom.trim(),
                date_naissance: f.naissance, genre: f.genre || null, ville: f.ville || null, centres_interet: interets });
            go('#welcome');
        } catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
    };
    return (
        <div className="split">
            <Art title="Rejoins une communauté qui te ressemble." sub="Crée ton compte : la personnalité passe avant l'apparence, la confiance se construit dans les Cercles." />
            <div className="panel">
                <form className="panel-inner" onSubmit={submit}>
                    <h2>Crée ton compte</h2>
                    <p className="panel-sub">Réservé aux 18 ans et plus.</p>
                    <div className="form">
                        <div className="row">
                            <label className="field"><span className="field-label">Prénom</span><input value={f.prenom} onChange={set('prenom')} placeholder="Awa" /></label>
                            <label className="field"><span className="field-label">Ville</span>
                                <select className={f.ville ? '' : 'empty'} value={f.ville} onChange={set('ville')}>
                                    <option value="">Choisis ta ville…</option>{villes.map((v) => <option key={v} value={v}>{v}</option>)}
                                </select></label>
                        </div>
                        <label className="field"><span className="field-label">Email</span><input type="email" value={f.email} onChange={set('email')} placeholder="awa@email.ci" /></label>
                        <div className="row">
                            <label className="field"><span className="field-label">Mot de passe</span><input type="password" value={f.mdp} onChange={set('mdp')} placeholder="8 caractères min." /></label>
                            <label className="field"><span className="field-label">Naissance</span><input type="date" value={f.naissance} onChange={set('naissance')} /></label>
                        </div>
                        <label className="field"><span className="field-label">Tu es…</span>
                            <div className="chips">{[['femme', 'Une femme'], ['homme', 'Un homme']].map(([g, l]) => (
                                <button type="button" key={g} className={'chip' + (f.genre === g ? ' on' : '')} onClick={() => setF((p) => ({ ...p, genre: g }))}>{l}</button>))}
                            </div></label>
                        <label className="field"><span className="field-label">Centres d'intérêt</span>
                            <div className="chips wrap">{INTERETS.map((i) => <button type="button" key={i} className={'chip' + (interets.includes(i) ? ' on' : '')} onClick={() => toggle(i)}>{i}</button>)}</div></label>
                        {err && <div className="error">{err}</div>}
                        <button className="cta" disabled={busy}>{busy ? 'Création…' : 'Créer mon compte →'}</button>
                        <p className="legal">Déjà inscrit·e ? <a className="link" href="#login">Se connecter</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export function Welcome() {
    const [me, setMe] = useState<Me | null>(null);
    const [err, setErr] = useState(false);
    useEffect(() => { auth.me().then(setMe).catch(() => setErr(true)); }, []);
    const logout = () => { tokens.clear(); go(''); };
    if (err) return <div className="web center"><div className="card success"><h1 className="succ-h">Session expirée</h1><p className="panel-sub">Reconnecte-toi.</p><a className="cta" href="#login" style={{ marginTop: 18 }}>Se connecter</a></div></div>;
    return (
        <div className="web center">
            <div className="card success pop">
                <div className="badge">✨</div>
                <h1 className="succ-h">Bienvenue{me?.prenom ? `, ${me.prenom}` : ''} 👋</h1>
                <p className="panel-sub">Ton compte KADY est actif. L'expérience complète (Cercles, messages, niveaux)
                    arrive très bientôt sur le web — en attendant, retrouve-la sur l'app mobile.</p>
                <div className="stats">
                    <div className="stat"><span className="stat-num">{me?.premium ? 'Premium' : 'Gratuit'}</span><span className="stat-label">ton plan</span></div>
                    <div className="stat"><span className="stat-num">✓</span><span className="stat-label">compte vérifié côté serveur</span></div>
                </div>
                <button className="cta" onClick={logout} style={{ marginTop: 6 }}>Se déconnecter</button>
            </div>
        </div>
    );
}
