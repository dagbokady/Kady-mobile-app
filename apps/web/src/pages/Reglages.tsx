import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { securite } from '../api'
import { apiError } from '../api/client'
import { useAuth } from '../store/auth'
import { useTheme } from '../store/theme'
import { toast } from '../store/toast'

const MODES = [
  ['rencontre', 'Rencontre'],
  ['amitie', 'Amitié'],
  ['tout', 'Les deux'],
] as const

export default function Reglages() {
  const me = useAuth((s) => s.me)
  const refreshMe = useAuth((s) => s.refreshMe)
  const logout = useAuth((s) => s.logout)
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const [prefMode, setPrefMode] = useState(localStorage.getItem('kady.pref_mode') ?? 'rencontre')
  const [pause, setPause] = useState(me?.en_pause ?? false)
  const [pauseBusy, setPauseBusy] = useState(false)
  const [push, setPush] = useState(localStorage.getItem('kady.push') !== 'off')

  const ageMin = localStorage.getItem('kady.age_min') ?? '24'
  const ageMax = localStorage.getItem('kady.age_max') ?? '38'

  function changerMode(v: string) {
    setPrefMode(v)
    localStorage.setItem('kady.pref_mode', v)
  }

  async function togglePause() {
    const next = !pause
    setPauseBusy(true)
    try {
      await securite.pause(next)
      setPause(next)
      await refreshMe()
      toast(next ? 'Pause relationnelle activée — profil masqué' : 'Pause désactivée, te revoilà ✓')
    } catch (err) {
      toast(apiError(err))
    } finally {
      setPauseBusy(false)
    }
  }

  function togglePush() {
    const next = !push
    setPush(next)
    localStorage.setItem('kady.push', next ? 'on' : 'off')
  }

  function onLogout() {
    logout()
    navigate('/bienvenue')
  }

  return (
    <div className="kwrap" style={{ maxWidth: 680, padding: '34px 28px 70px', animation: 'kfade .3s ease' }}>
      <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 30, letterSpacing: '-.5px' }}>Réglages</div>
      <div className="subtitle" style={{ marginTop: 6 }}>Gère ton compte, tes préférences et ta confidentialité.</div>

      <div style={{ marginTop: 26, fontSize: 12, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)' }}>
        Préférences de connexion
      </div>
      <div style={{ marginTop: 12, padding: 20, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Type de connexion</div>
        <div className="row" style={{ gap: 9 }}>
          {MODES.map(([v, l]) => (
            <button
              key={v}
              type="button"
              className={`opt${prefMode === v ? ' active' : ''}`}
              style={{ flex: 1, justifyContent: 'center', padding: 11, fontSize: 13.5 }}
              onClick={() => changerMode(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 14, background: 'var(--field)', border: '1px solid var(--border)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(214,40,110,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ion-icon name="lock-closed" style={{ fontSize: 18, color: 'var(--accent)' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>Tranche d'âge · {ageMin} – {ageMax} ans</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>
              Définie à l'inscription — ce choix n'est plus modifiable.
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 26, fontSize: 12, fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)' }}>
        Compte
      </div>
      <div className="stack" style={{ marginTop: 12, gap: 12 }}>
        <div className="settings-row">
          <div className="menu-icon" style={{ background: 'rgba(255,111,168,.16)' }}>
            <ion-icon name="pause-circle-outline" style={{ fontSize: 21, color: '#ff6fa8' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Pause relationnelle</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>
              {pause ? 'Activée — profil masqué, plus de nouveaux DM' : 'Désactivée'}
            </div>
          </div>
          <button type="button" className={`toggle${pause ? ' on' : ''}`} onClick={togglePause} disabled={pauseBusy} aria-label="Pause relationnelle">
            <div className="toggle-knob" />
          </button>
        </div>

        <div className="settings-row">
          <div className="menu-icon" style={{ background: 'rgba(90,127,214,.16)' }}>
            <ion-icon name="notifications-outline" style={{ fontSize: 21, color: '#5a7fd6' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Notifications push</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>{push ? 'Activées' : 'Désactivées'}</div>
          </div>
          <button type="button" className={`toggle${push ? ' on' : ''}`} onClick={togglePush} aria-label="Notifications push">
            <div className="toggle-knob" />
          </button>
        </div>

        <div className="settings-row">
          <div className="menu-icon" style={{ background: 'rgba(167,139,250,.2)' }}>
            <ion-icon name="moon-outline" style={{ fontSize: 21, color: '#a78bfa' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Mode sombre</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>{theme === 'dark' ? 'Activé' : 'Désactivé'}</div>
          </div>
          <button type="button" className={`toggle${theme === 'dark' ? ' on' : ''}`} onClick={toggle} aria-label="Mode sombre">
            <div className="toggle-knob" />
          </button>
        </div>

        <button type="button" className="settings-row" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => navigate('/a-propos')}>
          <div className="menu-icon" style={{ background: 'rgba(67,163,90,.14)' }}>
            <ion-icon name="help-circle-outline" style={{ fontSize: 21, color: '#43a35a' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>À propos de KADY</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>Notre mission, la sécurité</div>
          </div>
          <ion-icon name="chevron-forward" style={{ fontSize: 18, color: 'rgba(var(--ink),.35)' }} />
        </button>
      </div>

      <button className="btn btn-danger" type="button" style={{ marginTop: 16, width: '100%', padding: 14, fontSize: 13.5, fontWeight: 600 }} onClick={onLogout}>
        Se déconnecter
      </button>
    </div>
  )
}
