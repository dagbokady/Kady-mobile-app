import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cercles as cerclesApi, profils as profilsApi, relations as relationsApi } from '../api'
import { apiError } from '../api/client'
import type { Photo, Relation } from '../api/types'
import { useAuth } from '../store/auth'
import { useTheme } from '../store/theme'
import { toast } from '../store/toast'

export default function Profil() {
  const me = useAuth((s) => s.me)
  const refreshMe = useAuth((s) => s.refreshMe)
  const logout = useAuth((s) => s.logout)
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  const [edit, setEdit] = useState(false)
  const [prenom, setPrenom] = useState(me?.prenom ?? '')
  const [ville, setVille] = useState(me?.ville ?? '')
  const [bio, setBio] = useState(me?.bio ?? '')
  const [genre, setGenre] = useState(me?.genre ?? '')
  const [interets, setInterets] = useState<string[]>(me?.centres_interet ?? [])
  const [interetInput, setInteretInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [photos, setPhotos] = useState<Photo[]>([])
  const [publicId, setPublicId] = useState('')
  const [addPhotoOpen, setAddPhotoOpen] = useState(false)

  const [cerclesCount, setCerclesCount] = useState(0)
  const [relations, setRelations] = useState<Relation[]>([])

  useEffect(() => {
    profilsApi.photos().then(setPhotos).catch(() => {})
    Promise.all([cerclesApi.list(), relationsApi.list()])
      .then(([cs, rs]) => {
        setCerclesCount(cs.filter((c) => c.rejoint).length)
        setRelations(rs)
      })
      .catch(() => {})
  }, [])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await profilsApi.update({ prenom, ville, bio, genre: genre || undefined, centres_interet: interets })
      await refreshMe()
      setEdit(false)
      toast('Profil enregistré ✓')
    } catch (err) {
      setError(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  function ajouterInteret() {
    const v = interetInput.trim()
    if (v && !interets.includes(v)) setInterets((prev) => [...prev, v])
    setInteretInput('')
  }

  async function ajouterPhoto(e: FormEvent) {
    e.preventDefault()
    if (!publicId.trim()) return
    try {
      const photo = await profilsApi.ajouterPhoto(publicId.trim(), photos.length === 0)
      setPhotos((prev) => [...prev, photo])
      setPublicId('')
      setAddPhotoOpen(false)
      toast('Photo ajoutée ✓')
    } catch (err) {
      toast(apiError(err))
    }
  }

  async function supprimerPhoto(id: string) {
    try {
      await profilsApi.supprimerPhoto(id)
      setPhotos((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      toast(apiError(err))
    }
  }

  function onLogout() {
    logout()
    navigate('/bienvenue')
  }

  const complice = relations.some((r) => r.niveau >= 5)
  const badges = [
    { icon: 'rocket', label: 'Pionnier', grad: 'linear-gradient(135deg,#ff9d5c,#ff6b4a)', locked: false },
    { icon: 'people', label: 'Sociable', grad: 'linear-gradient(135deg,#7be0a0,#2f9ac2)', locked: cerclesCount < 1 },
    { icon: 'flame', label: 'Régulier', grad: 'linear-gradient(135deg,#b07bff,#7a4fd6)', locked: relations.length < 3 },
    { icon: 'diamond', label: 'Complice', grad: 'linear-gradient(135deg,#8fd0ff,#5a7fd6)', locked: !complice },
  ]

  const menu = [
    { icon: 'people', tint: '#5a7fd6', bg: 'rgba(90,127,214,.14)', title: 'Mes relations', sub: `${relations.length} lien${relations.length > 1 ? 's' : ''} actif${relations.length > 1 ? 's' : ''}`, onTap: () => navigate('/messages') },
    { icon: 'options', tint: '#a463ff', bg: 'rgba(164,99,255,.14)', title: 'Préférences', sub: 'Mode, âge, connexion', onTap: () => navigate('/reglages') },
    { icon: 'shield-checkmark', tint: '#43a35a', bg: 'rgba(67,163,90,.14)', title: 'Sécurité & confidentialité', sub: 'Vérification, pause', tag: me?.is_verified ? 'Vérifié+' : undefined, onTap: () => navigate('/reglages') },
    { icon: 'settings', tint: '#ff9d5c', bg: 'rgba(255,157,92,.14)', title: 'Réglages', sub: 'Compte, notifications', onTap: () => navigate('/reglages') },
  ]

  const photoSlots = 6

  return (
    <div className="kwrap kdash" style={{ padding: '34px 28px 70px', animation: 'kfade .3s ease' }}>
      <div>
        {/* Carte profil */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 24, border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)', background: 'var(--card)' }}>
          <div style={{ height: 120, background: 'linear-gradient(120deg,#5a7fd6,#7a4fd6,#2a1c5e)' }} />
          <div style={{ padding: '0 24px 24px', marginTop: -50 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 108, height: 108, borderRadius: 34, padding: 3, background: 'linear-gradient(135deg,#8fd0ff,#ff6aa9,#e02a73)' }}>
                  <div
                    style={{
                      width: '100%', height: '100%', borderRadius: 31, background: 'linear-gradient(160deg,#5a7fd6,#7a4fd6,#2a1c5e)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--card)', position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 40, color: '#fff' }}>
                      {(me?.prenom ?? me?.email ?? '?')[0]?.toUpperCase()}
                    </span>
                    {photos.find((p) => p.is_principale)?.url && (
                      <img
                        src={photos.find((p) => p.is_principale)!.url!}
                        alt=""
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                </div>
                {me?.is_verified && (
                  <div
                    style={{
                      position: 'absolute', bottom: 4, right: 4, width: 28, height: 28, borderRadius: 14, border: '3px solid var(--card)',
                      background: 'linear-gradient(135deg,#3aa0ff,#5a7fd6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <ion-icon name="checkmark" style={{ fontSize: 14, color: '#fff' }} />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 6 }}>
                <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 24 }}>{me?.prenom ?? me?.email}</span>
                  {me?.is_verified && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, background: 'rgba(143,208,255,.16)', border: '1px solid rgba(143,208,255,.4)' }}>
                      <ion-icon name="shield-checkmark" style={{ fontSize: 11, color: '#3aa0ff' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#3aa0ff' }}>Vérifié+</span>
                    </div>
                  )}
                </div>
                <div className="row" style={{ marginTop: 6, gap: 6, flexWrap: 'wrap' }}>
                  {me?.ville && (
                    <>
                      <ion-icon name="location-outline" style={{ fontSize: 14, color: 'rgba(var(--ink),.55)' }} />
                      <span style={{ fontSize: 13.5, color: 'rgba(var(--ink),.55)' }}>{me.ville}</span>
                    </>
                  )}
                  {me?.premium && (
                    <>
                      {me?.ville && <span style={{ color: 'rgba(var(--ink),.4)' }}>·</span>}
                      <ion-icon name="diamond" style={{ fontSize: 12, color: '#8fd0ff' }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#8fd0ff' }}>Premium</span>
                    </>
                  )}
                </div>
              </div>
              <button className="btn btn-soft" type="button" style={{ padding: '11px 18px', borderRadius: 13, flexShrink: 0, fontSize: 13.5 }} onClick={() => setEdit((v) => !v)}>
                <ion-icon name="create-outline" style={{ fontSize: 15 }} />
                {edit ? 'Annuler' : 'Modifier'}
              </button>
            </div>
            {!edit && me?.bio && (
              <div style={{ marginTop: 14, fontSize: 14, lineHeight: '21px', color: 'rgba(var(--ink),.65)', maxWidth: 560 }}>{me.bio}</div>
            )}
          </div>
        </div>

        {error && <div className="error-banner" style={{ marginTop: 16 }}>{error}</div>}

        {edit && (
          <form className="card stack" style={{ marginTop: 18 }} onSubmit={onSave}>
            <strong style={{ fontFamily: 'Sora,sans-serif' }}>Modifier mon profil</strong>
            <div className="field">
              <label>Prénom</label>
              <div className="field-box">
                <ion-icon name="person-outline" />
                <input className="input" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>Ville</label>
              <div className="field-box">
                <ion-icon name="location-outline" />
                <input className="input" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Abidjan" />
              </div>
            </div>
            <div className="field">
              <label>Genre</label>
              <div className="field-box">
                <select className="select" value={genre} onChange={(e) => setGenre(e.target.value)}>
                  <option value="">Préfère ne pas dire</option>
                  <option value="femme">Femme</option>
                  <option value="homme">Homme</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Bio</label>
              <div className="field-box">
                <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Quelques mots sur toi…" />
              </div>
            </div>
            <div className="field">
              <label>Centres d'intérêt</label>
              <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
                {interets.map((i) => (
                  <button key={i} type="button" className="hashtag row" style={{ gap: 6, cursor: 'pointer' }} onClick={() => setInterets((prev) => prev.filter((x) => x !== i))}>
                    #{i} <ion-icon name="close" style={{ fontSize: 12 }} />
                  </button>
                ))}
              </div>
              <div className="row" style={{ marginTop: 6 }}>
                <div className="field-box" style={{ flex: 1 }}>
                  <input
                    className="input"
                    placeholder="Ajouter un centre d'intérêt…"
                    value={interetInput}
                    onChange={(e) => setInteretInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        ajouterInteret()
                      }
                    }}
                  />
                </div>
                <button className="btn btn-ghost btn-sm" type="button" onClick={ajouterInteret}>
                  Ajouter
                </button>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </form>
        )}

        {/* Stats */}
        <div style={{ marginTop: 18, display: 'flex', padding: 6, borderRadius: 18, background: 'var(--card)', border: '1px solid var(--border)', boxShadow: 'var(--cardShadow)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '13px 0' }}>
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 20 }}>{cerclesCount}</span>
            <span style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>Cercles</span>
          </div>
          <div style={{ width: 1, background: 'var(--border)', margin: '8px 0' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '13px 0' }}>
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 800, fontSize: 20 }}>{relations.length}</span>
            <span style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.5)' }}>Relations</span>
          </div>
        </div>

        {/* Badges */}
        <div className="row" style={{ marginTop: 26, gap: 9 }}>
          <ion-icon name="ribbon" style={{ fontSize: 19, color: 'var(--accent)' }} />
          <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Badges</span>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {badges.map((b) => (
            <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, width: 90 }}>
              {b.locked ? (
                <div
                  style={{
                    width: 64, height: 64, borderRadius: 20, background: 'var(--field)', border: '1px dashed rgba(var(--ink),.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6,
                  }}
                >
                  <ion-icon name="lock-closed" style={{ fontSize: 24, color: 'rgba(var(--ink),.5)' }} />
                </div>
              ) : (
                <div
                  style={{
                    width: 64, height: 64, borderRadius: 20, background: b.grad, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', boxShadow: '0 8px 14px rgba(255,170,80,.3)',
                  }}
                >
                  <ion-icon name={b.icon} style={{ fontSize: 28, color: '#fff' }} />
                </div>
              )}
              <span style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(var(--ink),.7)', textAlign: 'center' }}>{b.label}</span>
            </div>
          ))}
        </div>

        {/* Photos */}
        <div className="row between" style={{ marginTop: 26 }}>
          <div className="row" style={{ gap: 9 }}>
            <ion-icon name="image" style={{ fontSize: 19, color: 'var(--accent)' }} />
            <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Mes photos</span>
          </div>
          <span style={{ fontSize: 12.5, color: 'rgba(var(--ink),.4)' }}>{photos.length} / {photoSlots}</span>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(130px,1fr))', gap: 12 }}>
          {photos.map((p) => (
            <div key={p.id} style={{ aspectRatio: '3/4', borderRadius: 16, position: 'relative', overflow: 'hidden', background: 'var(--card2)' }}>
              {p.url ? (
                <img src={p.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ion-icon name="image-outline" style={{ fontSize: 30, color: 'rgba(var(--ink),.3)' }} />
                </div>
              )}
              {p.is_principale && (
                <div style={{ position: 'absolute', top: 8, left: 8, padding: '3px 9px', borderRadius: 99, background: 'rgba(0,0,0,.45)' }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Principale</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => supprimerPhoto(p.id)}
                aria-label="Retirer la photo"
                style={{
                  position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: 13,
                  background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <ion-icon name="close" style={{ fontSize: 14, color: '#fff' }} />
              </button>
            </div>
          ))}
          {photos.length < photoSlots && (
            <button
              type="button"
              onClick={() => setAddPhotoOpen((v) => !v)}
              style={{
                aspectRatio: '3/4', borderRadius: 16, background: 'rgba(255,106,169,.06)', border: '1.5px dashed rgba(255,140,190,.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Ajouter une photo"
            >
              <ion-icon name="add" style={{ fontSize: 26, color: 'var(--accent)' }} />
            </button>
          )}
        </div>
        {addPhotoOpen && (
          <form className="row" style={{ marginTop: 12 }} onSubmit={ajouterPhoto}>
            <div className="field-box" style={{ flex: 1 }}>
              <ion-icon name="cloud-upload-outline" />
              <input className="input" placeholder="Identifiant Cloudinary (public_id)" value={publicId} onChange={(e) => setPublicId(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" type="submit">
              Ajouter
            </button>
          </form>
        )}

        {/* Intérêts */}
        {(me?.centres_interet?.length ?? 0) > 0 && (
          <>
            <div className="row" style={{ marginTop: 26, gap: 9 }}>
              <ion-icon name="heart" style={{ fontSize: 19, color: 'var(--accent)' }} />
              <span style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 18 }}>Centres d'intérêt</span>
            </div>
            <div className="row" style={{ marginTop: 14, flexWrap: 'wrap', gap: 9 }}>
              {me!.centres_interet.map((i) => (
                <div key={i} style={{ padding: '9px 15px', borderRadius: 99, background: 'rgba(214,40,110,.08)', border: '1px solid rgba(214,40,110,.2)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{i}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sidebar */}
      <div className="kdash-side" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 88 }}>
        {menu.map((m) => (
          <button key={m.title} type="button" className="menu-row" onClick={m.onTap}>
            <div className="menu-icon" style={{ background: m.bg }}>
              <ion-icon name={m.icon} style={{ fontSize: 20, color: m.tint }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{m.title}</div>
              <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.45)' }}>{m.sub}</div>
            </div>
            {m.tag ? (
              <div style={{ padding: '4px 9px', borderRadius: 99, background: 'rgba(255,140,190,.14)' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accentDeep)' }}>{m.tag}</span>
              </div>
            ) : (
              <ion-icon name="chevron-forward" style={{ fontSize: 18, color: 'rgba(var(--ink),.35)' }} />
            )}
          </button>
        ))}

        <div className="settings-row" style={{ padding: 15 }}>
          <div className="menu-icon" style={{ background: 'rgba(167,139,250,.2)' }}>
            <ion-icon name="moon-outline" style={{ fontSize: 20, color: '#a78bfa' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Mode sombre</div>
            <div style={{ marginTop: 2, fontSize: 11.5, color: 'rgba(var(--ink),.45)' }}>{theme === 'dark' ? 'Activé' : 'Désactivé'}</div>
          </div>
          <button type="button" className={`toggle${theme === 'dark' ? ' on' : ''}`} onClick={toggle} aria-label="Mode sombre">
            <div className="toggle-knob" />
          </button>
        </div>

        {!me?.premium && (
          <div
            style={{
              position: 'relative', overflow: 'hidden', padding: 18, borderRadius: 18, border: '1px solid rgba(255,140,190,.28)',
              background: 'linear-gradient(135deg,rgba(255,106,169,.18),rgba(255,111,194,.08))',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13 }}>
              <div
                style={{
                  width: 46, height: 46, borderRadius: 14, background: 'var(--brand)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', boxShadow: '0 8px 14px rgba(224,42,115,.5)',
                }}
              >
                <ion-icon name="diamond" style={{ fontSize: 20, color: '#fff' }} />
              </div>
              <div style={{ fontFamily: 'Sora,sans-serif', fontWeight: 700, fontSize: 15 }}>Passez Premium</div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/premium')}
              style={{
                marginTop: 13, width: '100%', padding: 12, borderRadius: 13, background: 'var(--brand)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 7, boxShadow: '0 10px 16px rgba(224,42,115,.45)',
              }}
            >
              <span style={{ fontSize: 13.5, fontWeight: 700, color: '#fff' }}>Découvrir Premium</span>
            </button>
          </div>
        )}

        <button className="btn btn-danger" type="button" style={{ width: '100%', padding: 13, fontSize: 13.5, fontWeight: 600 }} onClick={onLogout}>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
