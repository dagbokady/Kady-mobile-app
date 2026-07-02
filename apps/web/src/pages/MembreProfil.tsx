import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { cercles as cerclesApi, decouverte as decouverteApi, dm, relations as relationsApi } from '../api'
import { apiError } from '../api/client'
import type { DecouverteEtat, Relation } from '../api/types'
import { labelNiveau } from '../niveauLabels'
import { avatarGrad, modeColor, modeLabel } from '../visuals'
import { toast } from '../store/toast'

const CHAMP_ICONS: Record<string, string> = {
  ville: 'location-outline',
  job: 'briefcase-outline',
  profession: 'briefcase-outline',
  etudes: 'school-outline',
  musique: 'musical-notes-outline',
  sport: 'barbell-outline',
  film: 'film-outline',
  langue: 'language-outline',
  langues: 'language-outline',
}

export default function MembreProfil() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [relation, setRelation] = useState<Relation | null>(null)
  const [cercleNom, setCercleNom] = useState('')
  const [etat, setEtat] = useState<DecouverteEtat | null>(null)
  const [openChamp, setOpenChamp] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    Promise.all([relationsApi.list(), decouverteApi.etat(id)])
      .then(async ([rels, e]) => {
        if (cancelled) return
        const rel = rels.find((r) => r.autre_id === id) ?? null
        setRelation(rel)
        setEtat(e)
        if (rel?.cercle_origine_id) {
          try {
            const c = await cerclesApi.get(rel.cercle_origine_id)
            if (!cancelled) setCercleNom(c.nom)
          } catch {
            /* cercle inaccessible */
          }
        }
      })
      .catch((err) => !cancelled && setError(apiError(err)))
    return () => {
      cancelled = true
    }
  }, [id])

  async function deviner(champ: string, valeur: string) {
    if (!id) return
    setOpenChamp(null)
    try {
      const res = await decouverteApi.deviner(id, champ, valeur)
      const fresh = await decouverteApi.etat(id)
      setEtat(fresh)
      if (res.correct) toast('Bien vu ! +10 points de découverte 🎉')
      else toast('Pas encore… continue la conversation 💬')
    } catch (err) {
      toast(apiError(err))
    }
  }

  async function envoyerMessage() {
    if (!relation) return
    setBusy(true)
    try {
      const conv = await dm.ouvrir(relation.id)
      navigate(`/messages/${conv.id}`)
    } catch (err) {
      toast(apiError(err))
    } finally {
      setBusy(false)
    }
  }

  if (!etat) return <p className="empty">{error || 'Chargement…'}</p>

  const prenom = relation?.prenom ?? 'Membre'
  const grad = avatarGrad(id)
  const pct = etat.total > 0 ? Math.round((etat.decouverts / etat.total) * 100) : 0
  const niveau = relation?.niveau ?? 1
  const mode = relation?.mode ?? 'rencontre'

  return (
    <div style={{ animation: 'kfade .3s ease' }}>
      {/* Cover pleine largeur */}
      <div style={{ position: 'relative', height: 230, background: grad, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,6,20,.4),rgba(10,6,20,.18) 45%,rgba(10,6,20,.55))' }} />
        <div className="kwrap" style={{ position: 'relative', paddingTop: 20 }}>
          <button type="button" className="glass-chip" onClick={() => navigate(-1)}>
            <ion-icon name="chevron-back" style={{ fontSize: 18 }} />
            Retour
          </button>
        </div>
      </div>

      <div className="kwrap kdash" style={{ padding: '0 28px 70px', marginTop: -60 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, position: 'relative', zIndex: 3 }}>
            <div
              style={{
                width: 120, height: 120, borderRadius: 34, padding: 3, flexShrink: 0,
                background: 'linear-gradient(135deg,#8fd0ff,#ff6aa9,#e02a73)', boxShadow: '0 16px 32px rgba(20,12,40,.35)',
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: 31, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 44, color: '#fff' }}>{prenom[0]?.toUpperCase()}</span>
              </div>
            </div>
            <div style={{ paddingBottom: 8, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 28 }}>{prenom}</div>
              <div className="row" style={{ marginTop: 5, gap: 8, flexWrap: 'wrap' }}>
                {relation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 99, background: 'rgba(255,111,168,.14)' }}>
                    <ion-icon name={mode === 'amitie' ? 'people' : 'heart'} style={{ fontSize: 11, color: modeColor(mode) }} />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: modeColor(mode) }}>{modeLabel(mode)}</span>
                  </div>
                )}
                {cercleNom && <span style={{ fontSize: 13, color: 'rgba(var(--ink),.55)' }}>Cercle partagé · {cercleNom}</span>}
              </div>
            </div>
          </div>

          {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

          {relation && (
            <div
              style={{
                marginTop: 22, padding: 18, borderRadius: 18, border: '1px solid rgba(255,140,190,.22)',
                background: 'linear-gradient(135deg,rgba(255,106,169,.1),rgba(143,157,255,.05))',
              }}
            >
              <div className="row between" style={{ marginBottom: 9 }}>
                <div className="row" style={{ gap: 7 }}>
                  <ion-icon name="heart" style={{ fontSize: 14, color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13.5, fontWeight: 700 }}>{labelNiveau(mode, niveau)}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(var(--ink),.5)' }}>Niveau {niveau}/5</span>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: i < niveau ? 'var(--brand)' : 'rgba(var(--ink),.12)' }} />
                ))}
              </div>
            </div>
          )}

          <div className="row between" style={{ marginTop: 26, marginBottom: 6 }}>
            <div className="row" style={{ gap: 9 }}>
              <ion-icon name="sparkles" style={{ fontSize: 19, color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>À découvrir</span>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent)' }}>
              {pct}% · {etat.decouverts} / {etat.total} révélés
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(var(--ink),.5)', marginBottom: 14 }}>
            Devine pour révéler — ou laisse vos conversations dévoiler {prenom} petit à petit.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
            {etat.champs.map((c) => {
              const icon = CHAMP_ICONS[c.champ] ?? 'help-circle-outline'
              const open = openChamp === c.champ
              return (
                <div key={c.champ} style={{ borderRadius: 16, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)', overflow: 'hidden' }}>
                  {c.revele ? (
                    <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(67,163,90,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <ion-icon name={icon} style={{ fontSize: 19, color: '#43a35a' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)' }}>{c.label}</div>
                        <div style={{ marginTop: 2, fontSize: 14.5, fontWeight: 700 }}>{c.valeur}</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setOpenChamp(open ? null : c.champ)}
                        style={{ width: '100%', padding: 14, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--field)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ion-icon name="lock-closed" style={{ fontSize: 17, color: 'rgba(var(--ink),.4)' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', color: 'rgba(var(--ink),.45)' }}>{c.label}</div>
                          <div style={{ marginTop: 2, fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>Deviner ?</div>
                        </div>
                        <ion-icon name={open ? 'chevron-up' : 'chevron-down'} style={{ fontSize: 18, color: 'rgba(var(--ink),.35)' }} />
                      </button>
                      {open && (
                        <div style={{ padding: '0 14px 14px', display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                          {(c.options ?? []).map((o) => (
                            <button
                              key={o}
                              type="button"
                              onClick={() => deviner(c.champ, o)}
                              style={{
                                padding: '8px 13px', borderRadius: 10, background: 'var(--field)', border: '1px solid var(--border)',
                                fontSize: 12.5, fontWeight: 600, color: 'var(--text)',
                              }}
                            >
                              {o}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
            {etat.champs.length === 0 && <p className="subtitle">Rien à découvrir pour l'instant.</p>}
          </div>
        </div>

        <div className="kdash-side" style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88, marginTop: 60 }}>
          {relation?.dm_ouvert ? (
            <button className="btn btn-primary" type="button" style={{ width: '100%', padding: 15 }} onClick={envoyerMessage} disabled={busy}>
              <ion-icon name="chatbubble-ellipses" style={{ fontSize: 18 }} />
              {busy ? 'Ouverture…' : 'Envoyer un message'}
            </button>
          ) : (
            <div style={{ padding: 16, borderRadius: 16, background: 'var(--field)', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <ion-icon name="lock-closed" style={{ fontSize: 14, color: 'rgba(var(--ink),.4)', marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, lineHeight: '18px', color: 'rgba(var(--ink),.55)' }}>
                Faites grandir ce lien dans le cercle pour débloquer les messages privés.
              </span>
            </div>
          )}
          <div style={{ padding: 16, borderRadius: 16, background: 'var(--field)', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
            <ion-icon name="lock-closed" style={{ fontSize: 14, color: 'rgba(var(--ink),.4)', marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 12, lineHeight: '18px', color: 'rgba(var(--ink),.55)' }}>
              Les photos et infos se débloquent à mesure que votre lien progresse.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
