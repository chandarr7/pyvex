/* Tone Analyzer — upload an image OR describe skin tone, get a curated
   palette of flattering clothing colors. Calls window.claude.complete. */

const SAMPLE_SUGGESTIONS = [
  'Warm olive, sun-kissed, dark brown hair',
  'Cool porcelain, pink undertone, ash blonde',
  'Deep ebony, neutral undertone, dark eyes',
  'Medium golden, freckles, auburn hair',
];

const SkinToneAnalyzer = () => {
  const [mode, setMode] = React.useState('describe'); // 'describe' | 'upload'
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState(null);
  const [imageHint, setImageHint] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [palette, setPalette] = React.useState(null);
  const [summary, setSummary] = React.useState('');
  const [error, setError] = React.useState('');
  const fileRef = React.useRef(null);

  const onFile = (file) => {
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setError('');
    setPalette(null);
    setSummary('');

    let prompt = '';
    if (mode === 'describe') {
      if (!description.trim()) { setError('Describe your skin tone first.'); return; }
      prompt = `You are PYVEX, an AI personal stylist with editorial taste (Prada, The Row, Bottega).
A user has described their complexion as: "${description.trim()}".

Return a JSON object with this exact shape, no markdown, no commentary:
{
  "summary": "<one editorial sentence describing their tonal direction, 14 words max>",
  "undertone": "<warm | cool | neutral | olive>",
  "colors": [
    {"name":"<color name>","hex":"#RRGGBB","note":"<8-12 word editorial reason this flatters them>"},
    ... 8 entries total
  ]
}

Curate 8 clothing colors that flatter this person. Mix neutrals and accents. Names should be editorial (e.g. "Storm Olive", "Bone", "Cardinal", "Slate Rose"), not generic. Hex codes must be real, distinct, and actually flatter the described complexion.`;
    } else {
      if (!imageUrl) { setError('Upload a photo first.'); return; }
      // Vision isn't available — we ask the user for a quick hint
      const hint = imageHint.trim() || 'medium tan with neutral undertone';
      prompt = `You are PYVEX, an AI personal stylist with editorial taste.
A user uploaded a photo. They describe their complexion as: "${hint}".

Return a JSON object with this exact shape, no markdown, no commentary:
{
  "summary": "<one editorial sentence describing their tonal direction, 14 words max>",
  "undertone": "<warm | cool | neutral | olive>",
  "colors": [
    {"name":"<color name>","hex":"#RRGGBB","note":"<8-12 word editorial reason this flatters them>"},
    ... 8 entries total
  ]
}

Curate 8 clothing colors that flatter this person. Mix neutrals and accents. Names editorial, hex codes real and distinct.`;
    }

    try {
      setLoading(true);
      const raw = await window.claude.complete(prompt);
      // strip code fences if any
      const json = raw.replace(/^```json\s*|\s*```$/g, '').trim();
      const data = JSON.parse(json);
      setSummary(data.summary || '');
      setPalette(data);
    } catch (e) {
      setError('Couldn\u2019t parse the AI response. Try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="analyzer" style={{ paddingTop: 'clamp(64px, 10vw, 128px)' }}>
      <div className="container">
        <div style={{ marginBottom: 56, maxWidth: 760 }}>
          <Eyebrow>· TONE ANALYZER</Eyebrow>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.05, letterSpacing: '-0.02em',
            margin: '20px 0 16px', color: 'var(--fg-1)',
          }}>
            Find the colors that <em style={{ fontStyle: 'italic' }}>belong to you</em>.
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 17, lineHeight: 1.5, color: 'var(--fg-2)', margin: 0, maxWidth: 520 }}>
            Upload a photo or describe your complexion. We return eight clothing colors engineered for your skin, with editorial notes on why they work.
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 24,
          alignItems: 'stretch',
        }}>
          {/* INPUT PANEL */}
          <div className="card-editorial" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
            {/* mode tabs */}
            <div style={{
              display: 'inline-flex', padding: 4, gap: 4,
              background: 'var(--bg-elev-2)',
              border: '1px solid var(--border)',
              borderRadius: 999, marginBottom: 24, alignSelf: 'flex-start',
            }}>
              {[
                { k: 'describe', label: 'Describe' },
                { k: 'upload',   label: 'Upload' },
              ].map(t => (
                <button key={t.k} onClick={() => setMode(t.k)} style={{
                  fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500,
                  padding: '8px 18px', borderRadius: 999,
                  background: mode === t.k ? 'var(--accent)' : 'transparent',
                  color: mode === t.k ? 'var(--obsidian)' : 'var(--fg-2)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 300ms cubic-bezier(0.2,0.8,0.2,1)',
                }}>{t.label}</button>
              ))}
            </div>

            {mode === 'describe' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: 12 }}>YOUR COMPLEXION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Warm olive · sun-kissed · dark brown hair, brown eyes"
                  rows={4}
                  style={{
                    width: '100%', background: 'transparent',
                    border: 'none', borderBottom: '1px solid var(--border-strong)',
                    color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.5,
                    padding: '8px 0', outline: 'none', resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {/* suggestion chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
                  {SAMPLE_SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => setDescription(s)} style={{
                      fontFamily: 'var(--font-ui)', fontSize: 11,
                      padding: '6px 12px', borderRadius: 999,
                      background: 'transparent', color: 'var(--fg-2)',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.2,0.8,0.2,1)',
                    }} onMouseEnter={(e) => e.currentTarget.style.borderColor='rgba(70,243,168,0.4)'} onMouseLeave={(e) => e.currentTarget.style.borderColor='var(--border)'}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'upload' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  onClick={() => fileRef.current && fileRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(70,243,168,0.5)'; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--border-strong)'; onFile(e.dataTransfer.files && e.dataTransfer.files[0]); }}
                  style={{
                    border: '1px dashed var(--border-strong)',
                    borderRadius: 16, padding: imageUrl ? 0 : 32,
                    aspectRatio: imageUrl ? 'auto' : '4 / 3',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'border-color 300ms',
                    position: 'relative', overflow: 'hidden',
                    background: imageUrl ? 'transparent' : 'rgba(242,239,232,0.02)',
                  }}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="upload" style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: 260, borderRadius: 16 }}/>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'var(--fg-2)' }}>
                      <div style={{ color: 'var(--accent)', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                        <Icon name="camera" size={32}/>
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--fg-1)', marginBottom: 6 }}>Drop a portrait</div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>or click to upload · jpg, png, webp</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onFile(e.target.files && e.target.files[0])}/>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)', margin: '20px 0 8px' }}>A QUICK HINT</label>
                <input
                  value={imageHint}
                  onChange={(e) => setImageHint(e.target.value)}
                  placeholder="medium golden, neutral undertone"
                  style={{
                    width: '100%', background: 'transparent',
                    border: 'none', borderBottom: '1px solid var(--border-strong)',
                    color: 'var(--fg-1)', fontFamily: 'var(--font-ui)', fontSize: 15,
                    padding: '8px 0', outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            )}

            <button
              className="btn-primary"
              onClick={analyze}
              disabled={loading}
              style={{ marginTop: 28, width: '100%', opacity: loading ? 0.6 : 1, position: 'relative' }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'flex', gap: 3 }}>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite' }}/>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.2s' }}/>
                    <span style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--obsidian)', animation: 'pulse-soft 1.2s ease-in-out infinite 0.4s' }}/>
                  </span>
                  Analyzing
                </span>
              ) : 'Analyze My Tone'}
            </button>
            {error && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff7a7a', marginTop: 12 }}>{error}</div>
            )}
          </div>

          {/* RESULT PANEL */}
          <div style={{
            background: 'var(--bg-elev-1)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: 28, position: 'relative', overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(242,239,232,0.06)',
            minHeight: 460,
          }}>
            {/* ambient glow */}
            {palette && (
              <div style={{
                position: 'absolute', right: -60, top: -60,
                width: 240, height: 240, borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(70,243,168,0.25), transparent 70%)',
                filter: 'blur(40px)', pointerEvents: 'none',
              }}/>
            )}

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>YOUR PALETTE</div>
                {palette && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px rgba(70,243,168,0.7)' }}/>
                    {(palette.undertone || '').toUpperCase()}
                  </div>
                )}
              </div>

              {!palette && !loading && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--fg-3)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 28, opacity: 0.4 }}>
                    {['#2A2722','#A89784','#46524C','#0F2820','#D9C9B3','#3F4A45','#7A6657','#1A211E'].map((c,i) => (
                      <div key={i} style={{ width: 56, height: 56, borderRadius: 12, background: c, border: '1px solid rgba(242,239,232,0.06)' }}/>
                    ))}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--fg-2)', maxWidth: 320 }}>Eight colors, calibrated to you.</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>Describe or upload to begin.</div>
                </div>
              )}

              {loading && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ position: 'relative', width: 56, height: 56, borderRadius: 999, border: '1px solid rgba(242,239,232,0.18)', animation: 'spin-slow 1.6s linear infinite' }}>
                    <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: 999, background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}/>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--fg-1)', marginTop: 20 }}>Reading your tonal field</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--fg-3)', marginTop: 8 }}>14M FRAMES · 4S</div>
                </div>
              )}

              {palette && (
                <div style={{ marginTop: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {summary && (
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 400, fontStyle: 'italic',
                      fontSize: 20, lineHeight: 1.3, color: 'var(--fg-1)',
                      margin: '0 0 22px', letterSpacing: '-0.01em',
                    }}>
                      &ldquo;{summary}&rdquo;
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {(palette.colors || []).map((c, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: 10, borderRadius: 12,
                        background: 'rgba(242,239,232,0.02)',
                        border: '1px solid var(--border)',
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: c.hex, flexShrink: 0,
                          border: '1px solid rgba(242,239,232,0.12)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                        }}/>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-3)', flexShrink: 0 }}>{c.hex}</span>
                          </div>
                          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-2)', lineHeight: 1.35, marginTop: 2 }}>{c.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Object.assign(window, { SkinToneAnalyzer });
