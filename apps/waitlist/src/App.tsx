// src/App.tsx — version web publique de KADY (waitlist).
// Layout « split » du design KADY Web : panneau art dégradé + panneau clair.
import { useEffect, useMemo, useRef, useState } from 'react';
import { getVilles, inscrireWaitlist, tokens, type WaitlistResult } from './api';
import { Login, Register, Welcome } from './Auth';

function useHash() {
    const [h, setH] = useState(window.location.hash);
    useEffect(() => {
        const on = () => setH(window.location.hash);
        window.addEventListener('hashchange', on);
        return () => window.removeEventListener('hashchange', on);
    }, []);
    return h;
}

const INTERETS = ['Musique', 'Sport', 'Cuisine', 'Cinéma', 'Voyage', 'Lecture', 'Mode', 'Tech', 'Foi', 'Entrepreneuriat', 'Danse', 'Jeux vidéo'];
const FEATURES = ['Les Cercles', 'Mode Rencontre', 'Mode Amitié', 'Vérification des profils', 'Carnet personnel', 'Carte des relations'];
const ETAPES = [
    { n: '01', t: 'Rejoins un Cercle', d: 'Des groupes de 6 à 10 personnes autour d\'une passion. Pas de swipe : tu entres par ce qui te ressemble.', i: '◉' },
    { n: '02', t: 'La confiance grandit', d: 'Tu échanges dans le Cercle. Photos, audio et vidéo se débloquent au fil des niveaux.', i: '✦' },
    { n: '03', t: 'Le privé se mérite', d: 'Aucun message privé sans Cercle partagé. La personnalité avant l\'apparence.', i: '✉' },
];
const NIVEAUX = ['L\'Inconnu', 'La Connaissance', 'L\'Ami(e)', 'La Confiance', 'L\'Intimité'];
const PILIERS = [
    { i: '🛡️', t: 'Profils vérifiés', d: 'Selfie vivant + correspondance photo. Les vrais visages, les vraies personnes.' },
    { i: '🔒', t: 'Coordonnées masquées', d: 'Numéros et liens filtrés tant que la confiance n\'est pas là.' },
    { i: '🇨🇮', t: 'Pensé pour la Côte d\'Ivoire', d: 'Mobile money, villes locales, une communauté bienveillante.' },
];

function vagueDepuisRang(r: number) {
    if (r <= 100) return { label: 'Vague 1 · pionniers', semaines: 0 };
    if (r <= 400) return { label: 'Vague 2', semaines: 3 };
    if (r <= 1400) return { label: 'Vague 3', semaines: 6 };
    return { label: 'Ouverture publique', semaines: 10 };
}
const dateEstimee = (s: number) => { const d = new Date(); d.setDate(d.getDate() + s * 7); return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); };
const refDepuisUrl = () => new URLSearchParams(window.location.search).get('ref') ?? '';

function useReveal<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const [vu, setVu] = useState(false);
    useEffect(() => {
        const el = ref.current; if (!el) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setVu(true), { threshold: 0.16 });
        io.observe(el); return () => io.disconnect();
    }, []);
    return { ref, cls: vu ? 'reveal in' : 'reveal' };
}

export default function App() {
    const hash = useHash();
    if (hash === '#login') return <Login />;
    if (hash === '#register') return <Register />;
    if (hash === '#welcome') return <Welcome />;
    return <Landing />;
}

function Landing() {
    const [villes, setVilles] = useState<string[]>([]);
    useEffect(() => { getVilles().then(setVilles); }, []);
    // Si une session web existe déjà, propose d'accéder à l'espace.
    const dejaConnecte = !!tokens.get();

    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [genre, setGenre] = useState('');
    const [ville, setVille] = useState('');
    const [interets, setInterets] = useState<string[]>([]);
    const [feature, setFeature] = useState('');
    const [parrain] = useState(refDepuisUrl());
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState('');
    const [result, setResult] = useState<WaitlistResult | null>(null);
    const [copie, setCopie] = useState(false);

    const stepR = useReveal<HTMLElement>();
    const pilR = useReveal<HTMLElement>();

    const toggle = (i: string) => setInterets((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
    const valide = prenom.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setErr('');
        if (!valide) { setErr('Indique au moins un prénom et un email valide.'); return; }
        setBusy(true);
        try {
            setResult(await inscrireWaitlist({
                prenom: prenom.trim(), email: email.trim().toLowerCase(), genre: genre || null,
                ville: ville || null, centres_interet: interets, fonctionnalite_preferee: feature || null, parraine_par: parrain || null,
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
    };

    const lien = useMemo(() => (result ? `${window.location.origin}/?ref=${result.code_parrainage}` : ''), [result]);
    const copier = async () => { await navigator.clipboard.writeText(lien); setCopie(true); setTimeout(() => setCopie(false), 1800); };

    if (result) return <Success result={result} lien={lien} copie={copie} onCopier={copier} />;

    return (
        <div className="web">
            {/* HERO SPLIT */}
            <section id="top" className="split">
                <div className="art">
                    <div className="art-blob" />
                    <div className="art-top"><LogoArt /><span className="wordmark light">KADY</span></div>
                    <div className="art-mid">
                        <span className="art-eyebrow">Accès anticipé · Côte d'Ivoire</span>
                        <h1>Les vraies rencontres commencent dans un cercle.</h1>
                        <p>L'app ivoirienne de rencontres sérieuses : on se découvre d'abord dans des
                           Cercles thématiques, avant le moindre message privé.</p>
                        <div className="art-links">
                            {dejaConnecte
                                ? <a href="#welcome" className="art-link primary">Accéder à mon espace →</a>
                                : <a href="#login" className="art-link">Déjà membre ? <b>Se connecter</b></a>}
                            <a href="#register" className="art-link">Créer un compte</a>
                        </div>
                    </div>
                    <div className="art-stat">
                        <div className="art-stat-ic">🚀</div>
                        <div>
                            <div className="art-stat-t">Lancement par vagues</div>
                            <div className="art-stat-s">Les premiers inscrits passent en priorité</div>
                        </div>
                    </div>
                </div>

                <div id="rejoindre" className="panel">
                    <div className="panel-inner">
                        <h2>Rejoins la liste d'attente</h2>
                        <p className="panel-sub">Réserve ta place et fais monter ton rang en parrainant.</p>
                        {parrain && <div className="ref-note">🎁 Invité·e avec le code <b>{parrain}</b></div>}
                        <form onSubmit={submit} className="form">
                            <div className="row">
                                <Field label="Prénom"><input value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Awa" /></Field>
                                <Field label="Ville">
                                    <select value={ville} onChange={(e) => setVille(e.target.value)} className={ville ? '' : 'empty'}>
                                        <option value="">Choisis ta ville…</option>
                                        {villes.map((v) => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </Field>
                            </div>
                            <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="awa@email.ci" /></Field>
                            <Field label="Tu es…">
                                <div className="chips">
                                    {[['femme', 'Une femme'], ['homme', 'Un homme']].map(([g, l]) => (
                                        <button type="button" key={g} className={'chip' + (genre === g ? ' on' : '')} onClick={() => setGenre(g)}>{l}</button>
                                    ))}
                                </div>
                            </Field>
                            <Field label="Centres d'intérêt">
                                <div className="chips wrap">{INTERETS.map((i) => <button type="button" key={i} className={'chip' + (interets.includes(i) ? ' on' : '')} onClick={() => toggle(i)}>{i}</button>)}</div>
                            </Field>
                            <Field label="La fonctionnalité qui t'attire le plus">
                                <div className="chips wrap">{FEATURES.map((f) => <button type="button" key={f} className={'chip' + (feature === f ? ' on' : '')} onClick={() => setFeature(f)}>{f}</button>)}</div>
                            </Field>
                            {err && <div className="error">{err}</div>}
                            <button type="submit" className="cta" disabled={busy || !valide}>{busy ? 'Inscription…' : 'Rejoindre la liste d\'attente'}</button>
                            <p className="legal">Pas de spam. Désinscription à tout moment.</p>
                        </form>
                    </div>
                </div>
            </section>

            {/* COMMENT ÇA MARCHE */}
            <section ref={stepR.ref} className={'block ' + stepR.cls}>
                <h2 className="block-h">Comment ça marche</h2>
                <p className="block-sub">Trois étapes, une promesse : la confiance avant tout.</p>
                <div className="steps">
                    {ETAPES.map((s, i) => (
                        <div key={s.n} className="step" style={{ ['--i' as any]: i }}>
                            <div className="step-ic">{s.i}</div>
                            <span className="step-n">{s.n}</span>
                            <h3>{s.t}</h3><p>{s.d}</p>
                        </div>
                    ))}
                </div>
                <div className="ladder">
                    <span className="ladder-cap">La progression du Mode Rencontre</span>
                    <div className="rungs">{NIVEAUX.map((n, i) => <div key={n} className="rung" style={{ ['--i' as any]: i }}><span className="dot" />{n}</div>)}</div>
                </div>
            </section>

            <section ref={pilR.ref} className={'block ' + pilR.cls}>
                <div className="piliers">
                    {PILIERS.map((p, i) => (
                        <div key={p.t} className="pilier" style={{ ['--i' as any]: i }}><div className="pilier-ic">{p.i}</div><h3>{p.t}</h3><p>{p.d}</p></div>
                    ))}
                </div>
                <a href="#rejoindre" className="cta center-cta">Réserver ma place →</a>
            </section>

            <footer className="foot">Fait avec ❤ à Abidjan · KADY {new Date().getFullYear()}</footer>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <label className="field"><span className="field-label">{label}</span>{children}</label>;
}

function Success({ result, lien, copie, onCopier }: { result: WaitlistResult; lien: string; copie: boolean; onCopier: () => void }) {
    const rang = result.rang ?? 0; const v = vagueDepuisRang(rang);
    return (
        <div className="web center">
            <div className="card success pop">
                <div className="badge">🎉</div>
                <span className="art-eyebrow dark">Tu es sur la liste</span>
                <h1 className="succ-h">Bienvenue dans l'aventure KADY.</h1>
                <div className="stats">
                    <div className="stat"><span className="stat-num">#{rang}</span><span className="stat-label">ton rang</span></div>
                    <div className="stat"><span className="stat-num">{v.label}</span><span className="stat-label">accès estimé · {dateEstimee(v.semaines)}</span></div>
                </div>
                <div className="referral">
                    <div className="referral-head">Fais grimper ton rang</div>
                    <p>Chaque ami·e inscrit·e avec ton lien te fait remonter dans la file.</p>
                    <div className="code-row"><code>{result.code_parrainage}</code><button className="copy" onClick={onCopier}>{copie ? 'Copié ✓' : 'Copier le lien'}</button></div>
                    <div className="link-preview">{lien}</div>
                </div>
                <p className="legal">On t'écrira à l'ouverture de ta vague. À très vite 💫</p>
            </div>
        </div>
    );
}

function LogoArt() {
    return (
        <svg width="34" height="22" viewBox="0 0 132 82" fill="none" aria-hidden>
            <defs><linearGradient id="kgla" x1="14" y1="6" x2="120" y2="78" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffe1ec" /><stop offset="1" stopColor="#ff5f9e" /></linearGradient></defs>
            <circle cx="86" cy="41" r="27" stroke="url(#kgla)" strokeWidth="13.5" /><circle cx="46" cy="41" r="27" stroke="url(#kgla)" strokeWidth="13.5" />
            <path d="M66 58.9 A27 27 0 0 0 80 66.4" stroke="url(#kgla)" strokeWidth="13.5" strokeLinecap="round" />
        </svg>
    );
}
