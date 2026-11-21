// get a hobby · kursus hobi interaktif dengan akun bareng get a skill
(() => {
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const hal = $('#hal')
  const MATERI = window.MATERI || {}

  // ---------- simpanan ----------
  const KUNCI = 'gah'
  let S = {}
  try { S = JSON.parse(localStorage.getItem(KUNCI) || '{}') || {} } catch (e) { S = {} }
  const rapi = () => { S.tant = S.tant || {}; S.selesai = S.selesai || {}; S.omc = S.omc || {}; S.harian = S.harian || {} }
  rapi()
  let jadwal = () => {}
  const simpan = () => { try { localStorage.setItem(KUNCI, JSON.stringify(S)) } catch (e) {} jadwal() }

  // ---------- akun (Supabase, sesi dipakai bareng get a skill) ----------
  const SB_URL = 'https://wtfshyfgcrglknogjgfb.supabase.co'
  const SB_KEY = 'sb_publishable_-vUvZe04JtPTTGfF6LEY6A_y0l1n_Ff'
  let sb = null, user = null, timer = null
  try { if (window.self === window.top && window.supabase && window.supabase.createClient) sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, storageKey: 'gas2-auth' } }) } catch (e) { sb = null }
  const kirim = async () => { clearTimeout(timer); if (!sb || !user) return; try { await sb.from('progres_hobi').upsert({ user_id: user.id, data: S, diperbarui: new Date().toISOString() }) } catch (e) {} }
  jadwal = () => { if (sb && user) { clearTimeout(timer); timer = setTimeout(kirim, 1200) } }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') kirim() })
  const gabung = (a, b) => { // gabungin progres: yang udah selesai di salah satu tetap selesai
    const o = JSON.parse(JSON.stringify(a || {}))
    ;['tant', 'selesai'].forEach(k => { o[k] = o[k] || {}; Object.entries((b || {})[k] || {}).forEach(([h, v]) => {
      if (Array.isArray(v)) { o[k][h] = o[k][h] || []; v.forEach((x, i) => { if (x) o[k][h][i] = true }) }
      else { o[k][h] = Object.assign({}, o[k][h] || {}, Object.fromEntries(Object.entries(v || {}).filter(([, x]) => x))) } }) })
    o.omc = o.omc || {}; Object.entries((b || {}).omc || {}).forEach(([p, n]) => { o.omc[p] = Math.max(o.omc[p] || 0, n) })
    o.harian = o.harian || {}; Object.entries((b || {}).harian || {}).forEach(([h, hari]) => { o.harian[h] = o.harian[h] || {}; Object.entries(hari || {}).forEach(([d, n]) => { o.harian[h][d] = Math.max(o.harian[h][d] || 0, n) }) })
    if (!o.kuis && b && b.kuis) o.kuis = b.kuis
    return o
  }
  const tarik = async u => {
    user = u
    const { data: row, error } = await sb.from('progres_hobi').select('data').eq('user_id', u.id).maybeSingle()
    if (error) throw new Error('Gagal ngambil progres dari server. Cek koneksi terus coba lagi.')
    S = gabung(S, row && row.data); rapi(); simpan(); await kirim()
  }
  const pesanError = e => {
    const m = (e && e.message) || String(e)
    if (/invalid login/i.test(m)) return 'Email atau kata sandi salah.'
    if (/already (registered|exists)/i.test(m)) return 'Email ini udah terdaftar. Coba masuk.'
    if (/not confirmed/i.test(m)) return 'Email belum dikonfirmasi. Buka email dari Supabase (cek folder spam juga), klik link-nya, terus masuk lagi.'
    if (/rate limit|too many|security purposes/i.test(m)) return 'Lagi kebanyakan percobaan. Tunggu sebentar, terus coba lagi.'
    if (/password/i.test(m)) return 'Kata sandi minimal 6 karakter.'
    if (/fetch|network|load failed/i.test(m)) return 'Koneksi ke server bermasalah. Cek internet terus coba lagi.'
    return m
  }
  const siap = (async () => { if (!sb) return; try { const { data } = await sb.auth.getSession(); const u = data && data.session && data.session.user; if (u) await tarik(u) } catch (e) {} })()
  const tombolAkun = () => {
    const b = $('#akun-btn'); if (!b) return
    if (!sb) { b.hidden = true; return }
    b.hidden = false
    if (user) { const n = ((user.user_metadata || {}).nama || user.email || '?').trim(); b.textContent = n[0].toUpperCase(); b.className = 'akun-bulet'; b.href = '#akun'; b.setAttribute('aria-label', 'Akun ' + n) }
    else { b.textContent = 'Masuk'; b.className = 'btn utama kecil-btn'; b.href = '#masuk'; b.setAttribute('aria-label', 'Masuk') }
  }

  // ---------- tema ----------
  const pasangTema = t => { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme') }
  try { pasangTema(localStorage.getItem('gah-tema')) } catch (e) {}
  $('#tema').onclick = () => {
    const r = document.documentElement, gelap = r.getAttribute('data-theme') === 'dark' || (!r.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches)
    const t = gelap ? 'light' : 'dark'; pasangTema(t); try { localStorage.setItem('gah-tema', t) } catch (e) {}
  }

  // ---------- audio ----------
  let AC = null
  const ac = () => { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state !== 'running') AC.resume(); return AC }
  // iPhone: suara Web Audio dibisuin kalau HP mode senyap, dan audio baru kebuka lewat sentuhan (touchend/click).
  // Jadi di sentuhan pertama: minta sesi audio "playback", puter audio senyap lewat elemen <audio>, terus bunyiin buffer kosong.
  const SENYAP = (() => { // WAV 8-bit 8 kHz, 0,2 detik hening
    const n = 1600, b = new Uint8Array(44 + n), v = new DataView(b.buffer), tulis = (o, s) => [...s].forEach((c, i) => b[o + i] = c.charCodeAt(0))
    tulis(0, 'RIFF'); v.setUint32(4, 36 + n, true); tulis(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true)
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); tulis(36, 'data'); v.setUint32(40, n, true); b.fill(128, 44)
    try { return URL.createObjectURL(new Blob([b], { type: 'audio/wav' })) } catch (e) { return '' }
  })()
  let terbuka = false
  const bukaAudio = () => {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback' } catch (e) {}
    try { const a = ac(); const b = a.createBuffer(1, 1, 22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(0); a.resume() } catch (e) {}
    if (!terbuka) { terbuka = true; try { const el = new Audio(SENYAP); el.setAttribute('playsinline', ''); el.loop = true; el.volume = 0.01; el.play().catch(() => { terbuka = false }) } catch (e) { terbuka = false } }
  }
  ;['touchend', 'click', 'keydown', 'pointerup'].forEach(t => document.addEventListener(t, bukaAudio, { capture: true, passive: true }))
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && AC && AC.state !== 'running') AC.resume() })
  const hz = m => 440 * Math.pow(2, (m - 69) / 12)
  function petik(f, tunda = 0, vol = 0.32) {
    const a = ac(), sr = a.sampleRate, len = Math.floor(sr * 1.5), buf = a.createBuffer(1, len, sr), d = buf.getChannelData(0)
    const N = Math.max(2, Math.round(sr / f)), line = new Float32Array(N)
    for (let i = 0; i < N; i++) line[i] = Math.random() * 2 - 1
    let ix = 0
    for (let i = 0; i < len; i++) { const v = line[ix], n = line[(ix + 1) % N]; line[ix] = 0.497 * (v + n); d[i] = v; ix = (ix + 1) % N }
    const s = a.createBufferSource(), g = a.createGain(); s.buffer = buf; g.gain.value = vol
    s.connect(g).connect(a.destination); s.start(a.currentTime + tunda)
  }
  function tutsSuara(m, vol = 0.3) {
    const a = ac(), t = a.currentTime, g = a.createGain(), f = hz(m)
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(vol * 0.4, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 1.4)
    ;[[f, 'triangle', 1], [f * 2, 'sine', 0.25], [f * 3, 'sine', 0.08]].forEach(([fr, ty, v]) => { const o = a.createOscillator(), og = a.createGain(); o.type = ty; o.frequency.value = fr; og.gain.value = v; o.connect(og).connect(g); o.start(t); o.stop(t + 1.5) })
    g.connect(a.destination)
  }
  const klik = (tinggi = false) => { const a = ac(), o = a.createOscillator(), g = a.createGain(), t = a.currentTime; o.frequency.value = tinggi ? 1500 : 1000; g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.06) }
  let derauBuf = null
  const derau = () => { const a = ac(); if (!derauBuf) { derauBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = derauBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 } const s = a.createBufferSource(); s.buffer = derauBuf; return s }
  const DRUM = {
    kick(t) { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14); g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.42); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.45) },
    snare(t) { const a = ac(), n = derau(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = 1200; g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2); n.connect(f).connect(g).connect(a.destination); n.start(t); n.stop(t + 0.22)
      const o = a.createOscillator(), og = a.createGain(); o.type = 'triangle'; o.frequency.value = 185; og.gain.setValueAtTime(0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.connect(og).connect(a.destination); o.start(t); o.stop(t + 0.12) },
    hat(t) { const a = ac(), n = derau(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); n.connect(f).connect(g).connect(a.destination); n.start(t); n.stop(t + 0.06) },
    tom(t) { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.25); g.gain.setValueAtTime(0.8, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.36) }
  }

  // ---------- ikon dan data hobi ----------
  const IK = {
    catur: '<path d="M9 21h6M8 18h8l-1-4h-6zM10 14l-1-5h6l-1 5M10 9a2 2 0 1 1 4 0"/>',
    gitar: '<path d="M19 3l2 2-6.5 6.5M14.5 11.5l-1-1M10 9.5c-2.5-1-5 0-5.5 2.5-.4 2 .8 3.4.6 5.1-.2 1.7 1.2 3.4 3.4 2.4 1.7-.8 2.6-2.6 4.6-2.4 2.5.2 3.7-1.6 2.9-4-.6-1.8-2.6-2.6-4.4-3.4z"/><circle cx="10.5" cy="14.5" r="1.4"/>',
    piano: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v8M13 5v8M8 13v6M13 13v6M18 5v8"/>',
    drum: '<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v6c0 1.7 3.6 3 8 3s8-1.3 8-3V9M8 3l3 5M16 3l-3 5"/>',
    gambar: '<path d="M4 20l1.5-5L16 4.5a2.1 2.1 0 0 1 3 3L8.5 18z"/><path d="M14 7l3 3"/>',
    foto: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    cek: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  }
  const ikon = (k, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IK[k]}</svg>`
  const HOBI = [
    { id: 'catur', nama: 'Catur', ring: 'Dari cara jalan bidak sampai pembukaan, jebakan, dan taktik. Bisa main di mana aja.', modal: 'Gratis (aplikasi) sampai Rp 100 ribuan buat papan', alat: 'Papan catur atau aplikasi', waktu: '10 sampai 30 menit sehari', cocok: 'Yang suka mikir dan nyusun rencana',
      tant: ['Selesaiin bab Dasar permainan', 'Hafalin 4 prinsip pembukaan', 'Main 1 game lawan aplikasi pakai Italia atau London', 'Pelajari 3 jebakan pembukaan', 'Selesaiin semua puzzle taktik', 'Selesaiin semua puzzle pola skakmat', 'Main 3 game, catat 1 kesalahan tiap game'] },
    { id: 'gitar', nama: 'Gitar', ring: 'Kunci dasar, ganti kunci, dan pola genjreng ala kursus pemula.', modal: 'Kisaran Rp 500 ribu sampai Rp 1,5 juta (gitar akustik pemula)', alat: 'Gitar akustik dan pick', waktu: '15 sampai 30 menit sehari', cocok: 'Yang suka nyanyi dan nongkrong bareng',
      tant: ['Hafalin nama 6 senar', 'Bisa main A, D, dan E', 'Latihan 1 menit A ke D, catat skor', 'Genjreng 4 bawah rapi selama 2 menit', 'Tambah Am, Em, dan Dm', 'Pola D DU UDU pakai kunci G', 'Mainin progresi C, G, Am, F'] },
    { id: 'piano', nama: 'Piano', ring: 'Nomor jari, posisi C, baca not, sampai akor dasar.', modal: 'Kisaran Rp 1 juta sampai Rp 3 juta (keyboard 61 tuts)', alat: 'Keyboard atau piano digital', waktu: '15 sampai 30 menit sehari', cocok: 'Yang sabar dan suka musik',
      tant: ['Temuin semua C di keyboard', 'Hafalin nomor jari 1 sampai 5', 'Mainin Bintang Kecil', 'Baca 10 not berturut-turut tanpa salah', 'Mainin Ode to Joy sampai habis', 'Mainin akor C, F, G, Am', 'Mainin tangga nada C pakai jempol nyelip'] },
    { id: 'drum', nama: 'Drum', ring: 'Grip, rudimen, beat rock, dan fill pertama.', modal: 'Rp 50 ribuan (stik dan practice pad) sampai jutaan (drum elektrik)', alat: 'Stik, practice pad, atau aplikasi', waktu: '15 sampai 30 menit sehari', cocok: 'Yang energik dan suka ritme',
      tant: ['Kenalan bagian drum set', 'Latih grip di meja 5 menit', 'Single stroke 20 kali tanpa salah', 'Paradiddle 2 putaran tanpa salah', 'Mainin beat rock dasar di meja', 'Bikin fill sendiri di sequencer', 'Gabungin 3 birama beat + 1 birama fill'] },
    { id: 'gambar', nama: 'Menggambar', ring: 'Garis, elips, perspektif, dan gelap terang ala Drawabox.', modal: 'Hampir gratis (kertas dan pulpen)', alat: 'Pulpen, pensil, kertas, atau aplikasi', waktu: '10 sampai 20 menit sehari', cocok: 'Yang suka visual dan tenang',
      tant: ['Satu halaman garis pakai metode ghosting', 'Satu halaman lingkaran dan elips', 'Gambar 5 kotak perspektif 2 titik', 'Bikin skala value 5 kotak', 'Gambar 3 tema acak 60 detik', 'Gambar gelas di meja pakai elips', 'Bandingin gambar hari 1 dan hari 7'] },
    { id: 'foto', nama: 'Fotografi', ring: 'Exposure, white balance, komposisi, dan cahaya. Cukup pakai HP.', modal: 'Gratis pakai HP (mode pro) sampai jutaan buat kamera', alat: 'HP dengan mode pro atau kamera', waktu: '15 sampai 30 menit sehari', cocok: 'Yang suka jalan-jalan dan ngeliat detail',
      tant: ['Selesaiin semua misi simulator exposure', 'Foto 5 benda pakai mode pro HP', 'Bikin kertas putih keliatan netral di simulator WB', 'Foto 3 objek pakai aturan sepertiga', 'Foto pakai garis pemandu', 'Foto pas golden hour', 'Pilih 3 foto terbaik minggu ini'] }
  ]
  const byId = id => HOBI.find(h => h.id === id)
  const semuaPel = id => (MATERI[id] || []).flatMap(b => b.pel.map(p => ({ ...p, bab: b.bab })))
  const nSelesai = id => semuaPel(id).filter(p => (S.selesai[id] || {})[p.id]).length
  const nTant = id => (S.tant[id] || []).filter(Boolean).length

  // ---------- kuis harian ----------
  // 5 soal per hari dari bank (kuis-harian.js) + soal kuis di tiap pelajaran. Urutan diacak pakai benih per hobi,
  // tiap hari ngambil 5 soal berikutnya, jadi beda dari kemarin dan baru ngulang setelah semua kebagian.
  const N_HARIAN = 5
  const hariIni = () => { const n = new Date(); return Math.floor((n.getTime() - n.getTimezoneOffset() * 60000) / 86400000) }
  const benih = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) } return h >>> 0 }
  const acakBenih = (arr, seed) => { const a = arr.slice(); let x = seed || 1; const r = () => { x = (x + 0x6D2B79F5) | 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
  const kolamSoal = id => [...((window.BANK || {})[id] || []), ...semuaPel(id).flatMap(p => p.alat && p.alat.t === 'kuis' ? p.alat.soal : [])]
  const soalHari = (id, d = hariIni()) => { const k = acakBenih(kolamSoal(id), benih(id)); if (!k.length) return []; return Array.from({ length: Math.min(N_HARIAN, k.length) }, (_, i) => k[(d * N_HARIAN + i) % k.length]) }
  const skorHari = (id, d = hariIni()) => (S.harian[id] || {})[d]
  const streakHarian = id => { let d = hariIni(); if (skorHari(id, d) === undefined) d--; let n = 0; while (skorHari(id, d) !== undefined) { n++; d-- } return n }

  // ---------- router ----------
  let bersih = []
  const tambahBersih = f => bersih.push(f)
  const sapu = () => { bersih.forEach(f => { try { f() } catch (e) {} }); bersih = [] }
  let balikKe = '#beranda'
  function render() {
    sapu(); tombolAkun()
    const h = (location.hash || '#beranda').slice(1)
    const [a, ...b] = h.split('-'), sisa = b.join('-')
    if (h === 'kuis') kuis()
    else if (h === 'masuk') halMasuk()
    else if (h === 'akun') halAkun()
    else if (byId(a)) halHobi(byId(a), sisa)
    else beranda()
    window.scrollTo(0, 0)
  }
  addEventListener('hashchange', render)

  // ---------- beranda ----------
  function beranda() {
    hal.innerHTML = `
      <section class="hero">
        <div>
          <span class="label">Buat siapa aja yang mau mulai</span>
          <h1 style="margin-top:10px">Hobi baru, <em>langsung dicoba.</em></h1>
          <p class="lead">Materi disusun ngikutin kursus pemula yang beneran, dan tiap pelajaran ada yang bisa langsung dicoba. Catur, gitar, piano, drum, menggambar, fotografi.</p>
          <div class="aksi"><a class="btn merek" href="#kuis">Cari hobi yang cocok</a><a class="btn garis" href="#daftar">Liat semua hobi</a></div>
          ${sb && !user ? '<p class="kecil redup" style="margin-top:12px"><a href="#masuk">Masuk</a> biar progres kesimpen di semua perangkat. Akun get a skill bisa langsung dipakai.</p>' : ''}
        </div>
        <div class="kartu hero-demo">
          <span class="label">Coba sekarang · pencet tutsnya</span>
          <div id="demo-piano"></div>
          <p class="kecil redup" style="margin-top:8px">Di laptop bisa pakai keyboard: A S D F G H J K.</p>
        </div>
      </section>
      <div class="sek-judul" id="daftar"><h2>6 hobi, ${HOBI.reduce((n, h) => n + semuaPel(h.id).length, 0)} pelajaran</h2><span class="redup kecil">Tiap hobi ada materi, mainan interaktif, dan tantangan 7 hari</span></div>
      <div class="grid-hobi">${HOBI.map(h => { const t = semuaPel(h.id).length, s = nSelesai(h.id); return `
        <a class="kartu k-hobi" href="#${h.id}">
          <span class="ikon">${ikon(h.id)}</span>
          <h3>${h.nama}</h3>
          <p>${h.ring}</p>
          <div class="meta"><span>${t} pelajaran</span><span>${skorHari(h.id) !== undefined ? 'kuis hari ini ✓' : 'kuis hari ini belum'}</span></div>
          <div><div class="kecil redup" style="margin-bottom:4px">Materi ${s}/${t}</div><div class="prog"><i style="width:${t ? s / t * 100 : 0}%"></i></div></div>
        </a>` }).join('')}
      </div>`
    piano($('#demo-piano'), 60, 72, null)
    $('a[href="#daftar"]').onclick = e => { e.preventDefault(); $('#daftar').scrollIntoView({ behavior: 'smooth' }) }
  }

  // ---------- masuk dan akun ----------
  function halMasuk() {
    if (!sb) { hal.innerHTML = '<div class="kuis"><h1>Login ga tersedia di sini</h1><p class="redup" style="margin-top:8px">Halaman ini dibuka di dalam pratinjau, jadi koneksi ke server diblok. Progres tetap kesimpen di perangkat ini.</p></div>'; return }
    if (user) { location.hash = 'akun'; return }
    let mode = 'masuk'
    const tampil = () => {
      hal.innerHTML = `<div class="kuis kartu pad" style="max-width:440px">
        <div class="tab-baris"><button class="chip" data-m="masuk" aria-pressed="${mode === 'masuk'}">Masuk</button><button class="chip" data-m="daftar" aria-pressed="${mode === 'daftar'}">Daftar</button></div>
        <h1 style="font-size:26px">${mode === 'masuk' ? 'Masuk ke akun kamu' : 'Bikin akun baru'}</h1>
        <p class="redup kecil" style="margin:6px 0 14px">Satu akun buat get a hobby dan get a skill. Progres kesimpen di semua perangkat.</p>
        <form id="f-akun" class="form">
          ${mode === 'daftar' ? '<label>Nama panggilan<input id="f-nama" autocomplete="nickname" required></label>' : ''}
          <label>Email<input id="f-email" type="email" autocomplete="email" required></label>
          <label>Kata sandi<input id="f-pass" type="password" autocomplete="${mode === 'masuk' ? 'current-password' : 'new-password'}" minlength="6" required></label>
          <button class="btn merek" type="submit" id="f-kirim">${mode === 'masuk' ? 'Masuk' : 'Daftar'}</button>
          <div class="pesan" id="f-pesan"></div>
        </form></div>`
      $$('.tab-baris .chip').forEach(b => b.onclick = () => { mode = b.dataset.m; tampil() })
      $('#f-akun').onsubmit = async e => {
        e.preventDefault()
        const p = $('#f-pesan'), btn = $('#f-kirim'), email = $('#f-email').value.trim().toLowerCase(), pass = $('#f-pass').value
        p.className = 'pesan'; p.textContent = ''; btn.disabled = true
        try {
          if (mode === 'masuk') { const { data, error } = await sb.auth.signInWithPassword({ email, password: pass }); if (error) throw error; await tarik(data.user); location.hash = balikKe.slice(1) || 'beranda' }
          else {
            const nama = $('#f-nama').value.trim(); if (!nama) throw new Error('Nama belum diisi')
            const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: { nama }, emailRedirectTo: location.origin + location.pathname } })
            if (error) throw error
            if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) throw new Error('Email ini udah terdaftar. Coba masuk.')
            if (!data.session) { p.className = 'pesan ok'; p.textContent = 'Akun dibikin. Cek email buat konfirmasi (folder spam juga), terus masuk.'; btn.disabled = false; return }
            await tarik(data.user); location.hash = balikKe.slice(1) || 'beranda'
          }
        } catch (err) { p.className = 'pesan salah'; p.textContent = pesanError(err); btn.disabled = false }
      }
    }
    tampil()
  }
  function halAkun() {
    if (!user) { location.hash = 'masuk'; return }
    const nama = (user.user_metadata || {}).nama
    hal.innerHTML = `<div class="kuis kartu pad" style="max-width:520px"><span class="label">Akun</span><h1 style="font-size:28px;margin-top:6px">${nama ? 'Halo, ' + esc(nama) : 'Akun kamu'}</h1><p class="redup" style="margin-top:4px">${esc(user.email || '')}</p>
      <div class="grid-ringkas">${HOBI.map(h => `<a class="ringkas" href="#${h.id}"><b>${h.nama}</b><span>${nSelesai(h.id)}/${semuaPel(h.id).length} materi · ${nTant(h.id)}/7 tantangan</span></a>`).join('')}</div>
      <button class="btn garis" id="keluar" style="margin-top:16px">Keluar</button></div>`
    $('#keluar').onclick = async () => { await kirim(); try { await sb.auth.signOut() } catch (e) {} user = null; location.hash = 'beranda' }
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

  // ---------- kuis cari hobi ----------
  const SOAL = [
    ['Kamu paling suka yang mana?', [['Mikir dan nyusun strategi', { catur: 3 }], ['Bikin suara atau musik', { gitar: 2, piano: 2, drum: 2 }], ['Bikin sesuatu yang bisa diliat', { gambar: 3, foto: 3 }]]],
    ['Modal awal yang siap kamu keluarin?', [['Hampir gratis', { catur: 2, gambar: 2, foto: 1 }], ['Sampai sekitar Rp 1 juta', { gitar: 2, gambar: 1, foto: 1 }], ['Bebas, yang penting seru', { piano: 2, drum: 2, foto: 1 }]]],
    ['Suasana yang kamu suka?', [['Tenang dan fokus', { catur: 2, gambar: 2, piano: 1 }], ['Rame dan energik', { drum: 3, gitar: 1 }]]],
    ['Lebih sering di mana?', [['Di rumah', { piano: 1, gambar: 1, catur: 1, drum: 1 }], ['Keluar rumah', { foto: 3, gitar: 1 }]]],
    ['Mau hobi yang bisa dinikmati bareng orang lain?', [['Iya, biar rame', { catur: 1, gitar: 2, drum: 1 }], ['Sendiri aja', { gambar: 1, piano: 1, foto: 1 }]]]
  ]
  function kuis() {
    let i = 0; const skor = {}
    const tampil = () => {
      if (i >= SOAL.length) return hasil()
      const [t, ops] = SOAL[i]
      hal.innerHTML = `<div class="kuis"><div class="langkah">${SOAL.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
        <span class="label">Pertanyaan ${i + 1} dari ${SOAL.length}</span><h1 style="margin-top:8px">${t}</h1>
        <div class="opsi">${ops.map(([o], k) => `<button data-k="${k}">${o}</button>`).join('')}</div></div>`
      $$('.opsi button').forEach(b => b.onclick = () => { Object.entries(ops[+b.dataset.k][1]).forEach(([h, v]) => skor[h] = (skor[h] || 0) + v); i++; tampil() })
    }
    const hasil = () => {
      const urut = HOBI.map(h => [h, skor[h.id] || 0]).sort((a, b) => b[1] - a[1]), [top, ...lain] = urut
      S.kuis = top[0].id; simpan()
      hal.innerHTML = `<div class="kuis"><span class="label">Hasil kuis</span>
        <h1 style="margin-top:8px">Coba <span style="color:var(--merek)">${top[0].nama.toLowerCase()}</span> dulu.</h1>
        <p class="redup" style="margin-top:8px">${top[0].ring} Cocok buat ${top[0].cocok.toLowerCase()}.</p>
        <div class="aksi" style="margin-top:16px"><a class="btn merek" href="#${top[0].id}">Mulai belajar ${top[0].nama.toLowerCase()}</a><a class="btn garis" href="#kuis" id="ulang">Ulang kuis</a></div>
        <div class="sek-judul"><h2 style="font-size:19px">Alternatif lain</h2></div>
        <div class="grid-hobi">${lain.slice(0, 2).map(([h]) => `<a class="kartu k-hobi" href="#${h.id}"><span class="ikon">${ikon(h.id)}</span><h3>${h.nama}</h3><p>${h.ring}</p></a>`).join('')}</div></div>`
      $('#ulang').onclick = e => { e.preventDefault(); kuis() }
    }
    tampil()
  }

  // ---------- halaman hobi ----------
  function halHobi(h, sisa) {
    balikKe = location.hash
    const pel = semuaPel(h.id), t = S.tant[h.id] || []
    const modeMain = sisa === 'main', lesIx = pel.findIndex(p => p.id === sisa)
    const sel = S.selesai[h.id] || {}
    const lanjut = pel.find(p => !sel[p.id]) || pel[0]
    hal.innerHTML = `
      <a class="balik" href="#beranda">← Semua hobi</a>
      <div class="h-atas"><div><span class="label">${ikon(h.id, 16)} Hobi</span><h1 style="margin-top:6px">${h.nama}</h1><p>${h.ring}</p></div></div>
      <div class="tab-baris" style="margin-bottom:14px"><a class="chip" href="#${h.id}" aria-pressed="${!modeMain}">Materi</a><a class="chip" href="#${h.id}-main" aria-pressed="${modeMain}">Main bebas</a></div>
      ${sb && !user ? `<div class="banner kecil"><span>Progres kamu baru kesimpen di perangkat ini.</span> <a href="#masuk">Masuk biar kesimpen di akun</a></div>` : ''}
      <div class="lay-hobi">
        <section class="kartu pad main" id="kiri"></section>
        <div style="display:grid;gap:14px">
          <section class="kartu pad harian-kartu"><span class="label">Kuis harian</span>
            <h3 style="margin:6px 0 4px">${skorHari(h.id) !== undefined ? `Hari ini: ${skorHari(h.id)}/${N_HARIAN}` : `${N_HARIAN} soal baru hari ini`}</h3>
            <p class="kecil redup">${streakHarian(h.id) ? `Streak ${streakHarian(h.id)} hari berturut-turut. ` : ''}Soalnya ganti tiap hari, beda dari kemarin.</p>
            <a class="btn ${skorHari(h.id) !== undefined ? 'garis' : 'merek'} kecil-btn" href="#${h.id}-harian" style="margin-top:10px">${skorHari(h.id) !== undefined ? 'Liat atau ulang' : 'Kerjain sekarang'}</a></section>
          <section class="kartu pad tant"><h3>Progres</h3><div class="kecil redup">Materi ${nSelesai(h.id)} dari ${pel.length}</div><div class="pbar"><i style="width:${pel.length ? nSelesai(h.id) / pel.length * 100 : 0}%"></i></div>
            <div class="kecil redup" id="tant-info"></div><div class="pbar"><i id="tant-bar"></i></div>
            <h3 style="margin-top:6px">Tantangan 7 hari</h3>
            <ol>${h.tant.map((x, k) => `<li class="${t[k] ? 'selesai' : ''}"><label><input type="checkbox" data-k="${k}" ${t[k] ? 'checked' : ''}><span><span class="hari">Hari ${k + 1}</span>${x}</span></label></li>`).join('')}</ol>
          </section>
          <section class="kartu pad info"><h3>Sebelum mulai</h3><dl><dt>Modal</dt><dd>${h.modal}</dd><dt>Alat</dt><dd>${h.alat}</dd><dt>Waktu</dt><dd>${h.waktu}</dd><dt>Cocok buat</dt><dd>${h.cocok}</dd></dl></section>
        </div>
      </div>`
    const segarTant = () => { const n = nTant(h.id); $('#tant-info').textContent = n === 7 ? 'Tantangan 7 hari beres. Keren!' : `Tantangan ${n} dari 7 hari`; $('#tant-bar').style.width = n / 7 * 100 + '%' }
    $$('.tant input').forEach(c => c.onchange = () => { S.tant[h.id] = S.tant[h.id] || []; S.tant[h.id][+c.dataset.k] = c.checked; simpan(); c.closest('li').classList.toggle('selesai', c.checked); segarTant() })
    segarTant()
    const kiri = $('#kiri')
    if (modeMain) { kiri.innerHTML = '<h3>Main bebas</h3><div id="alat"></div>'; MAIN[h.id]($('#alat')); return }
    if (sisa === 'harian') {
      const tgl = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
      kiri.innerHTML = `<a class="balik" href="#${h.id}">← Daftar materi</a><span class="label">Kuis harian · ${tgl}</span><h2 class="judul-pel">${N_HARIAN} soal ${h.nama.toLowerCase()} hari ini</h2><p class="redup kecil">Soal diambil dari semua materi ${h.nama.toLowerCase()}. Besok ganti soal baru.</p><div id="alat" class="alat-pel"></div>`
      ALAT.kuis($('#alat'), { soal: soalHari(h.id), selesai: (b, n) => { S.harian[h.id] = S.harian[h.id] || {}; S.harian[h.id][hariIni()] = Math.max(skorHari(h.id) || 0, b); simpan() } })
      return
    }
    if (lesIx < 0) {
      kiri.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px"><h3 style="margin:0">Daftar materi</h3>${lanjut ? `<a class="btn merek kecil-btn" href="#${h.id}-${lanjut.id}">${nSelesai(h.id) ? 'Lanjut belajar' : 'Mulai belajar'}</a>` : ''}</div>
        ${(MATERI[h.id] || []).map((b, i) => `<div class="bab"><div class="bab-judul"><span class="label">Bab ${i + 1}</span><b>${b.bab}</b></div>
          ${b.pel.map(p => `<a class="pel ${sel[p.id] ? 'udah' : ''}" href="#${h.id}-${p.id}"><span class="cek">${sel[p.id] ? ikon('cek', 14) : ''}</span><span>${p.judul}</span></a>`).join('')}</div>`).join('')}`
      return
    }
    const p = pel[lesIx], prev = pel[lesIx - 1], next = pel[lesIx + 1]
    kiri.innerHTML = `<a class="balik" href="#${h.id}">← Daftar materi</a>
      <span class="label">${p.bab} · ${lesIx + 1}/${pel.length}</span><h2 class="judul-pel">${p.judul}</h2>
      <div class="isi-pel">${p.isi.map(x => `<p>${x}</p>`).join('')}</div>
      <div id="alat" class="alat-pel"></div>
      <div class="nav-pel">${prev ? `<a class="btn garis kecil-btn" href="#${h.id}-${prev.id}">← Sebelumnya</a>` : '<span></span>'}
        <button class="btn ${sel[p.id] ? 'garis' : 'merek'} kecil-btn" id="tandai">${sel[p.id] ? 'Udah selesai ✓' : (next ? 'Selesai, lanjut →' : 'Selesai')}</button></div>`
    $('#tandai').onclick = () => { S.selesai[h.id] = S.selesai[h.id] || {}; S.selesai[h.id][p.id] = true; simpan(); location.hash = next ? `${h.id}-${next.id}` : h.id }
    if (p.alat && ALAT[p.alat.t]) ALAT[p.alat.t]($('#alat'), p.alat)
  }
  const tabs = (el, daftar, pilih) => {
    el.innerHTML = `<div class="tab-baris">${daftar.map((d, k) => `<button class="chip" data-k="${k}" aria-pressed="${k === 0}">${d}</button>`).join('')}</div><div class="isi-tab"></div>`
    const isi = $('.isi-tab', el)
    $$('.tab-baris .chip', el).forEach(b => b.onclick = () => { $$('.tab-baris .chip', el).forEach(x => x.setAttribute('aria-pressed', x === b)); sapu(); pilih(+b.dataset.k, isi) })
    pilih(0, isi)
  }
  const chipPilih = (el, id, opsi, awal, onPilih, label = x => x) => {
    el.insertAdjacentHTML('beforeend', `<div class="tab-baris" id="${id}">${opsi.map(o => `<button class="chip" data-v="${o}" aria-pressed="${o === awal}">${label(o)}</button>`).join('')}</div>`)
    $$(`#${id} .chip`, el).forEach(b => b.onclick = () => { $$(`#${id} .chip`, el).forEach(x => x.setAttribute('aria-pressed', x === b)); onPilih(b.dataset.v) })
  }
  const pesanDi = (el, t, kls) => { el.textContent = t; el.className = 'pesan ' + (kls || '') }

  // ================= ALAT (mainan per pelajaran) =================
  const ALAT = {}

  ALAT.kuis = (el, { soal, selesai }) => {
    let i = 0, benar = 0
    const tampil = () => {
      if (i >= soal.length) { if (selesai) selesai(benar, soal.length); el.innerHTML = `<div class="kuis-kecil"><b>Skor ${benar}/${soal.length}.</b> ${benar === soal.length ? 'Sempurna!' : 'Baca lagi bagian yang salah, terus ulang.'} <button class="btn garis kecil-btn" id="kz-ulang">Ulang</button></div>`; $('#kz-ulang', el).onclick = () => { i = 0; benar = 0; tampil() }; return }
      const asli = soal[i], urut = asli.ops.map((_, k) => k).sort(() => Math.random() - 0.5) // acak urutan pilihan biar jawaban ga selalu di posisi sama
      const s = { ...asli, ops: urut.map(k => asli.ops[k]), b: urut.indexOf(asli.b) }
      el.innerHTML = `<div class="kuis-kecil"><span class="label">Cek pemahaman ${i + 1}/${soal.length}</span><p style="font-weight:700;margin:6px 0 10px">${s.q}</p><div class="opsi">${s.ops.map((o, k) => `<button data-k="${k}">${o}</button>`).join('')}</div><div class="pesan" id="kz-p"></div></div>`
      $$('.opsi button', el).forEach(b => b.onclick = () => {
        const k = +b.dataset.k, ok = k === s.b; if (ok) benar++
        $$('.opsi button', el).forEach(x => { x.disabled = true; if (+x.dataset.k === s.b) x.classList.add('benar'); else if (x === b) x.classList.add('salah') })
        pesanDi($('#kz-p', el), (ok ? 'Bener. ' : 'Kurang tepat. ') + s.k, ok ? 'ok' : 'salah')
        setTimeout(() => { i++; tampil() }, 1600)
      })
    }
    tampil()
  }

  // ---------- catur ----------
  const GLIF = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
  const NAMA_B = { k: 'Raja', q: 'Ratu', r: 'Benteng', b: 'Gajah', n: 'Kuda', p: 'Pion' }
  const CARA = { k: 'Raja jalan 1 kotak ke segala arah.', q: 'Ratu paling kuat: lurus dan miring sejauh apa pun.', r: 'Benteng jalan lurus, maju mundur atau ke samping, sejauh apa pun.', b: 'Gajah jalan miring sejauh apa pun, jadi selalu di warna kotak yang sama.', n: 'Kuda jalan bentuk L: 2 kotak lurus lalu 1 ke samping. Satu-satunya yang bisa loncatin bidak lain.', p: 'Pion maju 1 kotak (2 kotak di langkah pertama), tapi makannya miring.' }
  const KOL = 'abcdefgh'
  const sq = (c, r) => KOL[c] + (r + 1)
  const pos = s => [KOL.indexOf(s[0]), +s[1] - 1]
  const awalCatur = () => { const p = {}, bel = 'rnbqkbnr'; for (let c = 0; c < 8; c++) { p[sq(c, 0)] = { t: bel[c], w: true }; p[sq(c, 1)] = { t: 'p', w: true }; p[sq(c, 6)] = { t: 'p', w: false }; p[sq(c, 7)] = { t: bel[c], w: false } } return p }
  const terapkan = (papan, uci) => {
    const a = uci.slice(0, 2), b = uci.slice(2, 4), bd = papan[a]; if (!bd) return
    papan[b] = bd; delete papan[a]
    if (bd.t === 'k' && Math.abs(pos(a)[0] - pos(b)[0]) === 2) { const r = a[1], kanan = b[0] === 'g'; const ra = (kanan ? 'h' : 'a') + r, rb = (kanan ? 'f' : 'd') + r; papan[rb] = papan[ra]; delete papan[ra] }
  }
  function langkah(papan, dari) {
    const [c, r] = pos(dari), bd = papan[dari], hasil = []
    const isi = s => papan[s], lawan = s => papan[s] && papan[s].w !== bd.w, dlm = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8
    const geser = arah => arah.forEach(([dx, dy]) => { let x = c + dx, y = r + dy; while (dlm(x, y)) { const s = sq(x, y); if (isi(s)) { if (lawan(s)) hasil.push(s); break } hasil.push(s); x += dx; y += dy } })
    const lompat = arah => arah.forEach(([dx, dy]) => { const x = c + dx, y = r + dy; if (dlm(x, y)) { const s = sq(x, y); if (!isi(s) || lawan(s)) hasil.push(s) } })
    const L = [[1, 0], [-1, 0], [0, 1], [0, -1]], D = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    if (bd.t === 'r') geser(L); if (bd.t === 'b') geser(D); if (bd.t === 'q') geser([...L, ...D])
    if (bd.t === 'k') { lompat([...L, ...D]); const br = bd.w ? '1' : '8'; if (dari === 'e' + br) { const rk = papan['h' + br]; if (rk && rk.t === 'r' && !isi('f' + br) && !isi('g' + br)) hasil.push('g' + br); const rq = papan['a' + br]; if (rq && rq.t === 'r' && !isi('b' + br) && !isi('c' + br) && !isi('d' + br)) hasil.push('c' + br) } }
    if (bd.t === 'n') lompat([[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]])
    if (bd.t === 'p') { const m = bd.w ? 1 : -1; if (dlm(c, r + m) && !isi(sq(c, r + m))) { hasil.push(sq(c, r + m)); const aw = bd.w ? 1 : 6; if (r === aw && !isi(sq(c, r + 2 * m))) hasil.push(sq(c, r + 2 * m)) }
      ;[-1, 1].forEach(dx => { if (dlm(c + dx, r + m) && lawan(sq(c + dx, r + m))) hasil.push(sq(c + dx, r + m)) }) }
    return hasil
  }
  function gambarPapan(el, papan, pilih, bisa, klikKotak, akhir = []) {
    let h = ''
    for (let r = 7; r >= 0; r--) for (let c = 0; c < 8; c++) {
      const s = sq(c, r), bd = papan[s], gl = (c + r) % 2 === 0
      h += `<button class="ptk ${gl ? 'gl' : ''} ${s === pilih ? 'pilih' : ''} ${akhir.includes(s) ? 'akhir' : ''} ${bisa.includes(s) ? 'bisa' + (bd ? ' makan' : '') : ''}" data-s="${s}" aria-label="${s}${bd ? ' ' + NAMA_B[bd.t] + (bd.w ? ' putih' : ' hitam') : ''}">${bd ? `<span class="${bd.w ? 'bidak-p' : 'bidak-h'}">${GLIF[bd.t]}&#xFE0E;</span>` : ''}${c === 0 ? `<span class="koord">${r + 1}</span>` : ''}${r === 0 ? `<span class="koord kf">${KOL[c]}</span>` : ''}</button>`
    }
    el.innerHTML = `<div class="papan">${h}</div>`
    if (klikKotak) $$('.ptk', el).forEach(b => b.onclick = () => klikKotak(b.dataset.s))
  }
  ALAT.bidak = el => {
    let tipe = 'n', papan, pilih = null
    el.innerHTML = '<div id="bd-chip"></div><div id="pp"></div><p class="kecil" id="cara" style="margin-top:10px"></p><p class="kecil redup">Pencet titik buat jalanin bidaknya. Bidak hitam bisa dimakan.</p>'
    const atur = () => { papan = {}; if (tipe === 'p') { papan.d2 = { t: 'p', w: true }; papan.e3 = { t: 'p', w: false } } else { papan.d4 = { t: tipe, w: true }; papan.f6 = { t: 'p', w: false } }; pilih = tipe === 'p' ? 'd2' : 'd4'; gambar() }
    const gambar = () => { $('#cara', el).textContent = CARA[tipe]; gambarPapan($('#pp', el), papan, pilih, pilih && papan[pilih] && papan[pilih].w ? langkah(papan, pilih).filter(s => !(papan[pilih].t === 'k' && /[gc][18]/.test(s) && Math.abs(pos(s)[0] - pos(pilih)[0]) === 2)) : [], s => {
      if (pilih && langkah(papan, pilih).includes(s)) { papan[s] = papan[pilih]; delete papan[pilih]; pilih = s; petik(hz(64), 0, 0.12) } else if (papan[s] && papan[s].w) pilih = s; else pilih = null
      gambar() }) }
    chipPilih($('#bd-chip', el), 'bidak', Object.keys(NAMA_B), tipe, v => { tipe = v; atur() }, t => `${GLIF[t]}&#xFE0E; ${NAMA_B[t]}`)
    atur()
  }
  const BUKA = {
    italia: { nama: 'Italia', sisi: 'w', ide: 'Gajah c4 ngincar f7, pion c3 dan d4 ngerebut tengah.', l: [['e2e4', 'e4', 'Rebut tengah, buka jalan gajah dan ratu.'], ['e7e5', 'e5', 'Hitam ikut rebut tengah.'], ['g1f3', 'Nf3', 'Kuda keluar sambil nyerang pion e5.'], ['b8c6', 'Nc6', 'Kuda hitam jagain e5.'], ['f1c4', 'Bc4', 'Gajah ngincar f7, titik lemah hitam.'], ['f8c5', 'Bc5', 'Hitam bales ngincar f2.'], ['c2c3', 'c3', 'Siapin d4 buat nguasain tengah.'], ['g8f6', 'Nf6', 'Kembangin kuda, serang e4.'], ['d2d4', 'd4', 'Putih nyerang tengah dan siap rokade.']] },
    ruy: { nama: 'Ruy Lopez', sisi: 'w', ide: 'Gajah b5 neken kuda yang jagain e5, tekanan pelan tapi lama.', l: [['e2e4', 'e4', 'Rebut tengah.'], ['e7e5', 'e5', ''], ['g1f3', 'Nf3', 'Serang e5.'], ['b8c6', 'Nc6', 'Jaga e5.'], ['f1b5', 'Bb5', 'Neken kuda yang jagain e5. Ini ciri Ruy Lopez.'], ['a7a6', 'a6', 'Hitam "nanya" ke gajah: mundur atau tukar?'], ['b5a4', 'Ba4', 'Gajah mundur, tetap neken kuda.'], ['g8f6', 'Nf6', 'Kembangin kuda, serang e4.'], ['e1g1', 'O-O', 'Rokade: raja aman, benteng ke tengah.'], ['f8e7', 'Be7', 'Hitam siap rokade juga.']] },
    sisilia: { nama: 'Sisilia', sisi: 'b', ide: 'Hitam ngelawan tengah dari sayap. Posisi ga simetris dan tajam.', l: [['e2e4', 'e4', ''], ['c7c5', 'c5', 'Sisilia: kontrol d4 dari pinggir.'], ['g1f3', 'Nf3', ''], ['d7d6', 'd6', 'Jaga e5, buka jalan gajah c8.'], ['d2d4', 'd4', 'Putih buka tengah.'], ['c5d4', 'cxd4', 'Tukar pion sayap sama pion tengah putih.'], ['f3d4', 'Nxd4', 'Kuda putih ambil balik di tengah.'], ['g8f6', 'Nf6', 'Serang e4.'], ['b1c3', 'Nc3', 'Jaga e4.'], ['a7a6', 'a6', 'Varian Najdorf: jaga b5 dan siapin e5 atau b5.']] },
    prancis: { nama: 'Prancis', sisi: 'b', ide: 'Pion e6 dan d5 bikin tengah kokoh, imbalannya gajah c8 agak kekunci.', l: [['e2e4', 'e4', ''], ['e7e6', 'e6', 'Siapin d5 dengan aman.'], ['d2d4', 'd4', ''], ['d7d5', 'd5', 'Tantang e4 langsung.'], ['b1c3', 'Nc3', 'Jaga e4.'], ['g8f6', 'Nf6', 'Tambah tekanan ke e4.']] },
    caro: { nama: 'Caro-Kann', sisi: 'b', ide: 'Mirip Prancis, tapi gajah c8 bisa keluar duluan.', l: [['e2e4', 'e4', ''], ['c7c6', 'c6', 'Siapin d5 tanpa ngunci gajah c8.'], ['d2d4', 'd4', ''], ['d7d5', 'd5', ''], ['b1c3', 'Nc3', ''], ['d5e4', 'dxe4', 'Tukar di tengah.'], ['c3e4', 'Nxe4', ''], ['c8f5', 'Bf5', 'Gajah keluar sambil nyerang kuda.']] },
    gambit: { nama: 'Gambit Menteri', sisi: 'w', ide: 'Tawarin pion c4 buat narik pion d5 hitam keluar dari tengah.', l: [['d2d4', 'd4', ''], ['d7d5', 'd5', ''], ['c2c4', 'c4', 'Gambit: tawarin pion c4.'], ['e7e6', 'e6', 'Hitam nolak, jaga d5 pakai e6.'], ['b1c3', 'Nc3', 'Tambah tekanan ke d5.'], ['g8f6', 'Nf6', ''], ['c1g5', 'Bg5', 'Pin kuda f6 ke ratu.'], ['f8e7', 'Be7', 'Lepas pin, siap rokade.']] },
    london: { nama: 'London', sisi: 'w', ide: 'Susunan hampir selalu sama, gampang diinget: d4, Bf4, e3, Nf3, c3, Nbd2.', l: [['d2d4', 'd4', ''], ['d7d5', 'd5', ''], ['c1f4', 'Bf4', 'Ciri khas London: gajah keluar sebelum e3.'], ['g8f6', 'Nf6', ''], ['e2e3', 'e3', 'Bangun pondasi pion.'], ['e7e6', 'e6', ''], ['g1f3', 'Nf3', ''], ['c7c5', 'c5', 'Hitam nantang tengah.'], ['c2c3', 'c3', 'Kokohin d4.'], ['b8c6', 'Nc6', ''], ['b1d2', 'Nbd2', 'Susunan London lengkap. Tinggal Bd3 dan rokade.']] },
    skolar: { nama: 'Skolar mate', sisi: 'w', ide: 'Ratu dan gajah ngincar f7. Jangan diandelin, lawan yang ngerti gampang nangkis.', l: [['e2e4', 'e4', ''], ['e7e5', 'e5', ''], ['f1c4', 'Bc4', 'Gajah ngincar f7.'], ['b8c6', 'Nc6', ''], ['d1h5', 'Qh5', 'Ratu ikut ngincar f7. Ancaman: Qxf7#.'], ['g8f6', 'Nf6??', 'Kesalahan! Hitam nyerang ratu tapi lupa f7.'], ['h5f7', 'Qxf7#', 'Skakmat. f7 cuma dijaga raja, dan ratu dilindungin gajah c4.']] },
    nangkis: { nama: 'Nangkis Skolar', sisi: 'b', ide: 'Cara aman lolos dari ancaman Qxf7.', l: [['e2e4', 'e4', ''], ['e7e5', 'e5', ''], ['f1c4', 'Bc4', ''], ['b8c6', 'Nc6', ''], ['d1h5', 'Qh5', 'Ancaman Qxf7#.'], ['g7g6', 'g6!', 'Usir ratu sambil nutup jalur ke f7.'], ['h5f3', 'Qf3', 'Ratu ngincar f7 lagi.'], ['g8f6', 'Nf6!', 'Kuda nutup jalur ratu. Hitam aman, ratu putih keluar terlalu cepat.']] },
    fool: { nama: 'Fool’s mate', sisi: 'b', ide: 'Skakmat paling cepat: 2 langkah.', l: [['f2f3', 'f3?', 'Ngebuka diagonal e1-h4.'], ['e7e5', 'e5', ''], ['g2g4', 'g4??', 'Diagonal raja kebuka lebar.'], ['d8h4', 'Qh4#', 'Skakmat dalam 2 langkah.']] },
    legal: { nama: 'Jebakan Légal', sisi: 'w', ide: 'Putih "ngorbanin" ratu, hitam serakah, langsung skakmat.', l: [['e2e4', 'e4', ''], ['e7e5', 'e5', ''], ['g1f3', 'Nf3', ''], ['d7d6', 'd6', ''], ['f1c4', 'Bc4', ''], ['c8g4', 'Bg4', 'Pin kuda f3 ke ratu.'], ['b1c3', 'Nc3', ''], ['g7g6', 'g6?', 'Langkah pelan, putih punya trik.'], ['f3e5', 'Nxe5!', 'Kuda kabur dari pin dan "ngorbanin" ratu!'], ['g4d1', 'Bxd1??', 'Serakah. Harusnya dxe5, rugi cuma pion.'], ['c4f7', 'Bxf7+', 'Skak, raja harus ke e7.'], ['e8e7', 'Ke7', ''], ['c3d5', 'Nd5#', 'Skakmat pakai 3 bidak ringan.']] },
    blackburne: { nama: 'Blackburne Shilling', sisi: 'b', ide: 'Hitam pura-pura ngasih pion e5. Kalau putih serakah, rajanya kena.', l: [['e2e4', 'e4', ''], ['e7e5', 'e5', ''], ['g1f3', 'Nf3', ''], ['b8c6', 'Nc6', ''], ['f1c4', 'Bc4', ''], ['c6d4', 'Nd4!?', 'Keliatan kayak blunder, ninggalin e5.'], ['f3e5', 'Nxe5?', 'Putih serakah makan e5.'], ['d8g5', 'Qg5!', 'Serang kuda e5 dan pion g2 sekaligus.'], ['e5f7', 'Nxf7??', 'Putih makin serakah.'], ['g5g2', 'Qxg2', 'Serang benteng h1.'], ['h1f1', 'Rf1', ''], ['g2e4', 'Qxe4+', 'Skak.'], ['c4e2', 'Be2', 'Gajah nutup skak, tapi sekarang kepaku ke raja.'], ['d4f3', 'Nf3#', 'Skakmat. Gajah e2 ga bisa makan karena kepaku.']] },
    englund: { nama: 'Jebakan Englund', sisi: 'b', ide: 'Hukuman buat putih yang ninggalin pion b2 dan baris belakang.', l: [['d2d4', 'd4', ''], ['e7e5', 'e5?!', 'Gambit Englund.'], ['d4e5', 'dxe5', ''], ['b8c6', 'Nc6', ''], ['g1f3', 'Nf3', ''], ['d8e7', 'Qe7', 'Siapin serangan ke e5 dan b2.'], ['c1f4', 'Bf4?', 'Jaga e5, tapi ninggalin b2.'], ['e7b4', 'Qb4+', 'Skak sekaligus serang b2.'], ['f4d2', 'Bd2', ''], ['b4b2', 'Qxb2', 'Serang benteng a1.'], ['d2c3', 'Bc3?', 'Putih nyerang ratu, tapi...'], ['f8b4', 'Bb4!', ''], ['d1d2', 'Qd2', ''], ['b4c3', 'Bxc3', ''], ['d2c3', 'Qxc3', ''], ['b2c1', 'Qc1#', 'Skakmat di baris belakang.']] },
    gajah: { nama: 'Jebakan Gajah', sisi: 'b', ide: 'Pin bukan berarti bidaknya mati.', l: [['d2d4', 'd4', ''], ['d7d5', 'd5', ''], ['c2c4', 'c4', ''], ['e7e6', 'e6', ''], ['b1c3', 'Nc3', ''], ['g8f6', 'Nf6', ''], ['c1g5', 'Bg5', ''], ['b8d7', 'Nbd7', 'Keliatan ninggalin d5.'], ['c4d5', 'cxd5', ''], ['e6d5', 'exd5', ''], ['c3d5', 'Nxd5??', 'Putih kira pion d5 gratis karena kuda f6 kepaku.'], ['f6d5', 'Nxd5!', 'Hitam "ngorbanin" ratu!'], ['g5d8', 'Bxd8', 'Putih makan ratu...'], ['f8b4', 'Bb4+', '...tapi skak dulu!'], ['d1d2', 'Qd2', 'Terpaksa nutup.'], ['b4d2', 'Bxd2+', ''], ['e1d2', 'Kxd2', ''], ['e8d8', 'Kxd8', 'Hitam menang satu kuda.']] }
  }
  ALAT.buka = (el, { daftar }) => {
    let kode = daftar[0], ix = 0, latihan = false, pilih = null
    el.innerHTML = '<div id="bk-chip"></div><p class="kecil" id="bk-ide" style="margin-bottom:8px"></p><div id="pp"></div><div class="not-baris" id="bk-l"></div><div class="pesan" id="bk-p"></div><div class="aksi"><button class="btn garis kecil-btn" id="bk-0" aria-label="Ke awal">⏮</button><button class="btn garis kecil-btn" id="bk-m" aria-label="Mundur">◀</button><button class="btn merek kecil-btn" id="bk-n" aria-label="Maju">▶</button><button class="btn garis kecil-btn" id="bk-lat">Mode latihan</button></div>'
    const B = () => BUKA[kode]
    const papanKe = n => { const p = awalCatur(); B().l.slice(0, n).forEach(m => terapkan(p, m[0])); return p }
    const giliranKu = () => latihan && ix < B().l.length && (ix % 2 === 0 ? 'w' : 'b') === B().sisi
    const gambar = () => {
      const P = papanKe(ix), terakhir = ix ? [B().l[ix - 1][0].slice(0, 2), B().l[ix - 1][0].slice(2, 4)] : []
      $('#bk-ide', el).innerHTML = `<b>${B().nama}</b> · ${B().ide}`
      gambarPapan($('#pp', el), P, pilih, pilih && giliranKu() ? langkah(P, pilih) : [], latihan ? s => {
        if (!giliranKu()) return
        if (pilih && langkah(P, pilih).includes(s)) {
          const benar = B().l[ix][0]
          if (pilih + s === benar) { ix++; pilih = null; petik(hz(67), 0, 0.15); pesanDi($('#bk-p', el), 'Bener! ' + (B().l[ix - 1][2] || ''), 'ok'); gambar(); setTimeout(lawan, 650) }
          else { pilih = null; pesanDi($('#bk-p', el), `Belum. Coba lagi. Petunjuk: bidak di ${benar.slice(0, 2)}.`, 'salah'); gambar() }
        } else { pilih = P[s] && P[s].w === (B().sisi === 'w') ? s : null; gambar() }
      } : null, terakhir)
      $('#bk-l', el).innerHTML = B().l.map((m, i) => `<span class="${i < ix - 1 ? 'udah' : i === ix - 1 ? 'kini' : ''}">${i % 2 === 0 ? (i / 2 + 1) + '.' : ''}${m[1]}</span>`).join('')
      if (!latihan) pesanDi($('#bk-p', el), ix ? (B().l[ix - 1][2] || 'Langkah ' + B().l[ix - 1][1] + '.') : 'Posisi awal. Pencet ▶.', '')
      $('#bk-lat', el).textContent = latihan ? 'Keluar latihan' : 'Mode latihan'
      ;['#bk-0', '#bk-m', '#bk-n'].forEach(k => $(k, el).disabled = latihan)
    }
    const lawan = () => { if (!latihan) return; if (ix < B().l.length && !giliranKu()) { ix++; gambar(); setTimeout(lawan, 650) } else if (ix >= B().l.length) pesanDi($('#bk-p', el), `Mantap, kamu udah mainin ${B().nama} sampai habis!`, 'ok') }
    chipPilih($('#bk-chip', el), 'bk-pilih', daftar, kode, v => { kode = v; ix = 0; latihan = false; pilih = null; gambar() }, k => BUKA[k].nama)
    $('#bk-0', el).onclick = () => { ix = 0; gambar() }
    $('#bk-m', el).onclick = () => { ix = Math.max(0, ix - 1); gambar() }
    $('#bk-n', el).onclick = () => { if (ix < B().l.length) { ix++; petik(hz(64), 0, 0.1); gambar() } }
    $('#bk-lat', el).onclick = () => { latihan = !latihan; ix = 0; pilih = null; gambar(); if (latihan) { pesanDi($('#bk-p', el), `Kamu main ${B().sisi === 'w' ? 'putih' : 'hitam'}. Pencet bidak, terus kotak tujuannya.`); setTimeout(lawan, 500) } }
    gambar()
  }
  const PZ = {
    garpu: { judul: 'Garpu kuda', w: { g1: 'k', b5: 'n' }, b: { e8: 'k', a8: 'r' }, sol: ['b5', 'c7'], hint: 'Cari kotak di mana kuda nyerang raja dan benteng sekaligus.', ok: 'Garpu! Raja harus minggir, terus benteng a8 kemakan.' },
    pin: { judul: 'Pasang pin', w: { e1: 'k', f1: 'b', d4: 'p' }, b: { e8: 'k', c6: 'n' }, sol: ['f1', 'b5'], hint: 'Gajah bisa bikin kuda c6 terjepit di antara gajah dan raja.', ok: 'Pin! Kuda c6 ga boleh gerak karena di belakangnya raja. Lanjut d5 buat nyerang dia.' },
    tusuk: { judul: 'Tusuk sate', w: { h1: 'k', a1: 'r' }, b: { d5: 'k', d8: 'q' }, sol: ['a1', 'd1'], hint: 'Raja dan ratu hitam ada di kolom yang sama.', ok: 'Tusuk sate! Raja harus minggir, terus Rxd8.' },
    mat1: { judul: 'Skakmat baris belakang', w: { g1: 'k', a1: 'r' }, b: { g8: 'k', f7: 'p', g7: 'p', h7: 'p' }, sol: ['a1', 'a8'], hint: 'Raja hitam kekunci pionnya sendiri.', ok: 'Skakmat baris belakang!' },
    mat2: { judul: 'Ratu dijagain raja', w: { f6: 'k', a7: 'q' }, b: { h8: 'k' }, sol: ['a7', 'g7'], hint: 'Ratu butuh dijagain raja biar ga bisa dimakan.', ok: 'Skakmat! Raja hitam ga bisa makan ratu karena dijagain raja putih.' },
    mat3: { judul: 'Skakmat tangga', w: { a1: 'k', a7: 'r', b1: 'r' }, b: { h8: 'k' }, sol: ['b1', 'b8'], hint: 'Satu benteng udah ngunci baris 7.', ok: 'Skakmat tangga!' },
    buka: { judul: 'Serangan buka', w: { g1: 'k', d1: 'r', d3: 'b' }, b: { g8: 'k', d8: 'q', f7: 'p', g7: 'p', h7: 'p' }, sol: ['d3', 'h7'], hint: 'Gajah d3 ngehalangin benteng ke ratu d8. Gimana kalau gajahnya minggir sambil skak?', ok: 'Bxh7+! Skak sekaligus ngebuka serangan benteng ke ratu. Raja harus urus skak, terus Rxd8.' },
    pembela: { judul: 'Hilangin pembela', w: { g1: 'k', b5: 'b', f3: 'n' }, b: { g8: 'k', c6: 'n', e5: 'p' }, sol: ['b5', 'c6'], hint: 'Pion e5 cuma dijaga satu bidak.', ok: 'Bxc6! Penjaga e5 hilang. Langkah berikutnya Nxe5.' },
    mat4: { judul: 'Smothered mate', w: { a1: 'k', g5: 'n' }, b: { h8: 'k', g8: 'r', g7: 'p', h7: 'p' }, sol: ['g5', 'f7'], hint: 'Raja hitam ketutup bidaknya sendiri. Bidak mana yang bisa loncat?', ok: 'Smothered mate! Raja kejepit bidaknya sendiri.' }
  }
  ALAT.puzzle = (el, { daftar }) => {
    let n = 0, papan, pilih = null, beres = false
    el.innerHTML = '<div class="kecil" style="margin-bottom:8px"><b id="pz-j"></b> · Putih jalan.</div><div id="pp"></div><div class="pesan" id="pz-p"></div><div class="aksi"><button class="btn garis kecil-btn" id="pz-h">Petunjuk</button><button class="btn garis kecil-btn" id="pz-u">Ulang</button><button class="btn utama kecil-btn" id="pz-n">Puzzle berikutnya</button></div>'
    const P = () => PZ[daftar[n]]
    const muat = () => { papan = {}; Object.entries(P().w).forEach(([s, t]) => papan[s] = { t, w: true }); Object.entries(P().b).forEach(([s, t]) => papan[s] = { t, w: false }); pilih = null; beres = false; pesanDi($('#pz-p', el), ''); tampil() }
    const tampil = () => { $('#pz-j', el).textContent = `${P().judul} (${n + 1}/${daftar.length})`; gambarPapan($('#pp', el), papan, pilih, pilih ? langkah(papan, pilih) : [], s => {
      if (beres) return
      if (pilih && langkah(papan, pilih).includes(s)) {
        const [a, b] = P().sol
        if (pilih === a && s === b) { papan[s] = papan[pilih]; delete papan[pilih]; pilih = null; beres = true; tampil(); pesanDi($('#pz-p', el), P().ok, 'ok'); petik(hz(67)); petik(hz(71), 0.08); petik(hz(74), 0.16) }
        else { pilih = null; tampil(); pesanDi($('#pz-p', el), 'Belum itu. Coba lagi.', 'salah') }
      } else { pilih = papan[s] && papan[s].w ? s : null; tampil() } }) }
    $('#pz-h', el).onclick = () => pesanDi($('#pz-p', el), P().hint)
    $('#pz-u', el).onclick = muat
    $('#pz-n', el).onclick = () => { n = (n + 1) % daftar.length; muat() }
    muat()
  }

  // ---------- gitar ----------
  const SENAR = [40, 45, 50, 55, 59, 64], NAMA_S = ['E', 'A', 'D', 'G', 'B', 'e']
  const KUNCI_G = { A: [-1, 0, 2, 2, 2, 0], D: [-1, -1, 0, 2, 3, 2], E: [0, 2, 2, 1, 0, 0], Am: [-1, 0, 2, 2, 1, 0], Em: [0, 2, 2, 0, 0, 0], Dm: [-1, -1, 0, 2, 3, 1], G: [3, 2, 0, 0, 0, 3], C: [-1, 3, 2, 0, 1, 0], F: [-1, -1, 3, 2, 1, 1], E5: [0, 2, 2, -1, -1, -1], A5: [-1, 0, 2, 2, -1, -1], G5: [3, 5, 5, -1, -1, -1], Fb: [1, 3, 3, 2, 1, 1], Bm: [-1, 2, 4, 4, 3, 2] }
  const NAMA_K = k => ({ Fb: 'F (barre)' }[k] || k)
  function fretboard(el, jari, onSel) {
    let h = '<div class="fret-wrap"><div class="fret">'
    for (let s = 5; s >= 0; s--) {
      h += `<div class="sel nol" data-s="${s}" data-f="0" style="--tebal:${1 + (5 - s) * 0.5}px">${jari[s] === -1 ? '×' : NAMA_S[s]}</div>`
      for (let f = 1; f <= 5; f++) h += `<div class="sel" data-s="${s}" data-f="${f}" style="--tebal:${1 + (5 - s) * 0.5}px">${jari[s] === f ? `<span class="jari">${f}</span>` : ''}</div>`
    }
    el.innerHTML = h + '</div><div class="nomor-fret"><span></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>'
    $$('.sel', el).forEach(c => c.onclick = () => onSel(+c.dataset.s, +c.dataset.f))
  }
  const genjreng = (el, jari, naik = false) => { const urut = jari.map((f, s) => [f, s]); (naik ? urut.reverse().slice(0, 4) : urut).forEach(([f, s], i) => { if (f >= 0) petik(hz(SENAR[s] + f), i * (naik ? 0.02 : 0.028), naik ? 0.22 : 0.32) }); if (el) $$('.sel', el).forEach(c => { c.classList.remove('getar'); void c.offsetWidth; if (jari[+c.dataset.s] >= 0) c.classList.add('getar') }) }
  ALAT.senar = el => {
    el.innerHTML = `<div class="tab-baris">${NAMA_S.map((n, s) => `<button class="btn garis kecil-btn" data-s="${s}">${n} <span class="kecil redup">${['E2', 'A2', 'D3', 'G3', 'B3', 'E4'][s]}</span></button>`).join('')}</div><div id="fb"></div><p class="kecil redup" style="margin-top:8px">Bandingin bunyi senar gitar kamu sama nada ini pas nyetem.</p>`
    fretboard($('#fb', el), [0, 0, 0, 0, 0, 0], s => petik(hz(SENAR[s])))
    $$('[data-s]', el).forEach(b => b.tagName === 'BUTTON' && (b.onclick = () => petik(hz(SENAR[+b.dataset.s]))))
  }
  ALAT.kunci = (el, { daftar }) => {
    let kc = daftar[0]
    el.innerHTML = '<div id="kc-chip"></div><div id="fb"></div><div class="aksi" style="margin-top:12px"><button class="btn merek" id="jreng"></button></div><p class="kecil redup" style="margin-top:8px">Angka = nomor fret. × artinya senar itu ga dibunyiin. Pencet senar buat dengerin satu-satu.</p>'
    const g = () => { fretboard($('#fb', el), KUNCI_G[kc], s => { const f = KUNCI_G[kc][s]; if (f >= 0) petik(hz(SENAR[s] + f)) }); $('#jreng', el).textContent = 'Genjreng ' + NAMA_K(kc) }
    chipPilih($('#kc-chip', el), 'kc', daftar, kc, v => { kc = v; g(); genjreng($('#fb', el), KUNCI_G[kc]) }, NAMA_K)
    $('#jreng', el).onclick = () => genjreng($('#fb', el), KUNCI_G[kc])
    g()
  }
  ALAT.omc = el => {
    const PASANG = ['A-D', 'D-E', 'A-E', 'Am-Em', 'C-G', 'G-D']
    let p = PASANG[0], n = 0, sisa = 60, jalan = null
    el.innerHTML = '<div id="om-chip"></div><div class="omc"><div><span class="label">Waktu</span><div class="timer" id="om-t">60</div></div><div><span class="label">Ganti</span><div class="timer" id="om-n">0</div></div><div><span class="label">Rekor</span><div class="timer" id="om-r">0</div></div></div><div class="aksi"><button class="btn utama" id="om-mulai">Mulai 1 menit</button><button class="btn merek omc-btn" id="om-g" disabled>Ganti!</button></div><div class="pesan" id="om-p"></div>'
    const rekor = () => { $('#om-r', el).textContent = S.omc[p] || 0 }
    const henti = () => { clearInterval(jalan); jalan = null; $('#om-g', el).disabled = true; $('#om-mulai', el).textContent = 'Mulai 1 menit' }
    chipPilih($('#om-chip', el), 'om-pasang', PASANG, p, v => { p = v; henti(); rekor() }, x => x.replace('-', ' ⇄ '))
    $('#om-mulai', el).onclick = () => {
      if (jalan) { henti(); return }
      n = 0; sisa = 60; $('#om-n', el).textContent = 0; $('#om-t', el).textContent = 60; $('#om-g', el).disabled = false; $('#om-mulai', el).textContent = 'Berhenti'; pesanDi($('#om-p', el), '')
      jalan = setInterval(() => { sisa--; $('#om-t', el).textContent = sisa; if (sisa <= 0) { henti(); klik(true); const lama = S.omc[p] || 0; if (n > lama) { S.omc[p] = n; simpan() } rekor(); pesanDi($('#om-p', el), `${n} kali ganti. ${n >= 30 ? 'Udah lewat target 30!' : 'Target awal 30, terus latihan ya.'}${n > lama ? ' Rekor baru!' : ''}`, 'ok') } }, 1000)
    }
    $('#om-g', el).onclick = () => { n++; $('#om-n', el).textContent = n; klik() }
    tambahBersih(henti); rekor()
  }
  ALAT.strum = el => {
    const POLA = { '4 bawah': ['D', '', 'D', '', 'D', '', 'D', ''], 'D DU UDU': ['D', '', 'D', 'U', '', 'U', 'D', 'U'], '8 bawah atas': ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'] }
    let pola = '4 bawah', kc = 'G', bpm = 70, i = 0, jalan = null
    el.innerHTML = '<div id="st-p"></div><div id="st-k"></div><div class="pola" id="st-v"></div><div class="kontrol"><button class="btn merek" id="st-m">Mulai</button><label class="kecil">Tempo <input type="range" id="st-b" min="50" max="110" value="70"> <b id="st-bn">70</b> bpm</label></div><p class="kecil redup" style="margin-top:8px">↓ = genjreng ke bawah, ↑ = ke atas. Angka di bawah itu hitungan "1 & 2 & 3 & 4 &".</p>'
    const gambar = (aktif = -1) => { $('#st-v', el).innerHTML = POLA[pola].map((x, k) => `<div class="${k === aktif ? 'on' : ''} ${x ? '' : 'kosong'}"><b>${x === 'D' ? '↓' : x === 'U' ? '↑' : '·'}</b><span>${k % 2 ? '&' : k / 2 + 1}</span></div>`).join('') }
    const tik = () => { const x = POLA[pola][i]; if (i % 2 === 0) klik(i === 0); if (x) genjreng(null, KUNCI_G[kc], x === 'U'); gambar(i); i = (i + 1) % 8 }
    const henti = () => { clearInterval(jalan); jalan = null; $('#st-m', el).textContent = 'Mulai'; gambar() }
    chipPilih($('#st-p', el), 'st-pola', Object.keys(POLA), pola, v => { pola = v; gambar() })
    chipPilih($('#st-k', el), 'st-kunci', ['G', 'C', 'D', 'Em', 'Am'], kc, v => { kc = v })
    $('#st-m', el).onclick = () => { if (jalan) return henti(); i = 0; tik(); jalan = setInterval(tik, 30000 / bpm); $('#st-m', el).textContent = 'Berhenti' }
    $('#st-b', el).oninput = e => { bpm = +e.target.value; $('#st-bn', el).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 30000 / bpm) } }
    tambahBersih(henti); gambar()
  }
  ALAT.tab = el => {
    // Ode to Joy (Beethoven, domain publik) di senar e dan B. [senar, fret], senar 5 = e tipis.
    const NOT = [[5, 0], [5, 0], [5, 1], [5, 3], [5, 3], [5, 1], [5, 0], [4, 3], [4, 1], [4, 1], [4, 3], [5, 0], [5, 0], [4, 3], [4, 3]]
    let ix = -1, jalan = null
    el.innerHTML = '<div class="tab-wrap"><div class="tab-g" id="tb"></div></div><div id="fb" style="margin-top:12px"></div><div class="aksi" style="margin-top:12px"><button class="btn merek" id="tb-m">Mainin</button></div><p class="kecil redup" style="margin-top:8px">Garis atas = senar e tipis. Angka = fret yang ditekan.</p>'
    const gambar = () => {
      let h = ''
      for (let s = 5; s >= 0; s--) { h += `<span class="tn">${NAMA_S[s]}</span>`; NOT.forEach(([ss, f], i) => { h += `<span class="${i === ix ? 'kini' : ''}">${ss === s ? f : '–'}</span>` }) }
      $('#tb', el).innerHTML = h; $('#tb', el).style.gridTemplateColumns = `24px repeat(${NOT.length}, minmax(22px, 1fr))`
      const jari = [-1, -1, -1, -1, -1, -1]; if (ix >= 0) jari[NOT[ix][0]] = NOT[ix][1]; fretboard($('#fb', el), jari.map(x => x), () => {})
    }
    const stop = () => { clearInterval(jalan); jalan = null; $('#tb-m', el).textContent = 'Mainin' }
    $('#tb-m', el).onclick = () => { if (jalan) return stop(); ix = -1; jalan = setInterval(() => { ix++; if (ix >= NOT.length) { stop(); ix = -1; gambar(); return } const [s, f] = NOT[ix]; petik(hz(SENAR[s] + f)); gambar() }, 420); $('#tb-m', el).textContent = 'Berhenti' }
    tambahBersih(stop); gambar()
  }
  ALAT.petik = el => {
    const POLA = ['p', 'i', 'm', 'a', 'm', 'i'], SNR = { i: 3, m: 4, a: 5 }
    let kc = 'C', bpm = 90, k = 0, jalan = null
    el.innerHTML = '<div id="pt-k"></div><div id="fb"></div><div class="pola" id="pt-v" style="grid-template-columns:repeat(6,minmax(0,1fr))"></div><div class="kontrol"><button class="btn merek" id="pt-m">Mulai</button><label class="kecil">Tempo <input type="range" id="pt-b" min="60" max="140" value="90"> <b id="pt-bn">90</b> bpm</label></div>'
    const bass = () => KUNCI_G[kc].findIndex(f => f >= 0)
    const gambar = (aktif = -1) => { $('#pt-v', el).innerHTML = POLA.map((x, i) => `<div class="${i === aktif ? 'on' : ''}"><b>${x}</b><span>${x === 'p' ? NAMA_S[bass()] : NAMA_S[SNR[x]]}</span></div>`).join('') }
    const tik = () => { const x = POLA[k], s = x === 'p' ? bass() : SNR[x], f = KUNCI_G[kc][s]; if (f >= 0) petik(hz(SENAR[s] + f), 0, 0.28); gambar(k); k = (k + 1) % POLA.length }
    const stop = () => { clearInterval(jalan); jalan = null; $('#pt-m', el).textContent = 'Mulai'; gambar() }
    chipPilih($('#pt-k', el), 'pt', ['C', 'G', 'Am', 'Em', 'D'], kc, v => { kc = v; fretboard($('#fb', el), KUNCI_G[kc], () => {}); gambar() })
    $('#pt-m', el).onclick = () => { if (jalan) return stop(); k = 0; tik(); jalan = setInterval(tik, 30000 / bpm); $('#pt-m', el).textContent = 'Berhenti' }
    $('#pt-b', el).oninput = e => { bpm = +e.target.value; $('#pt-bn', el).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 30000 / bpm) } }
    fretboard($('#fb', el), KUNCI_G[kc], () => {}); tambahBersih(stop); gambar()
  }
  ALAT.progresi = el => {
    const prog = ['C', 'G', 'Am', 'F']; let bpm = 70, ix = 0, ketuk = 0, jalan = null
    el.innerHTML = `<div class="tab-baris" id="urut">${prog.map((x, i) => `<span class="chip" data-i="${i}">${x}</span>`).join('')}</div><div id="fb"></div><div class="kontrol"><button class="btn merek" id="main">Mulai</button><label class="kecil">Tempo <input type="range" id="bpm" min="50" max="110" value="70"> <b id="bpm-n">70</b> bpm</label></div><p class="kecil redup" style="margin-top:8px">Tiap kunci 4 ketukan. Pindah jari pas kuncinya ganti.</p>`
    const tampil = () => { fretboard($('#fb', el), KUNCI_G[prog[ix]], () => {}); $$('#urut .chip', el).forEach(c => c.setAttribute('aria-pressed', +c.dataset.i === ix)) }
    const tik = () => { if (ketuk === 0) { tampil(); genjreng($('#fb', el), KUNCI_G[prog[ix]]) } else klik(); ketuk = (ketuk + 1) % 4; if (ketuk === 0) ix = (ix + 1) % prog.length }
    const stop = () => { clearInterval(jalan); jalan = null; $('#main', el).textContent = 'Mulai' }
    $('#main', el).onclick = () => { if (jalan) return stop(); ix = 0; ketuk = 0; tik(); jalan = setInterval(tik, 60000 / bpm); $('#main', el).textContent = 'Berhenti' }
    $('#bpm', el).oninput = e => { bpm = +e.target.value; $('#bpm-n', el).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 60000 / bpm) } }
    tambahBersih(stop); tampil()
  }

  // ---------- piano ----------
  const NOTA = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const TOMBOL = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ';': 76 }
  let pianoAktif = null
  addEventListener('keydown', e => { if (e.repeat || !pianoAktif || e.metaKey || e.ctrlKey || /input|textarea/i.test(e.target.tagName)) return; const m = TOMBOL[e.key.toLowerCase()]; if (m !== undefined) pianoAktif(m) })
  function piano(el, dari, sampai, onNada, label = true) {
    const putih = [], hitam = []
    for (let m = dari; m <= sampai; m++) (NOTA[m % 12].includes('#') ? hitam : putih).push(m)
    const lebar = 100 / putih.length
    el.innerHTML = `<div class="piano">${putih.map(m => `<button class="tuts" data-m="${m}" aria-label="${NOTA[m % 12]}${Math.floor(m / 12) - 1}">${label ? NOTA[m % 12] + (m === 60 ? '<i class="mc">tengah</i>' : '') : ''}</button>`).join('')}${hitam.map(m => `<button class="tuts hitam" data-m="${m}" style="left:calc(${(putih.indexOf(m - 1) + 1) * lebar}% - 12px)" aria-label="${NOTA[m % 12]}"></button>`).join('')}</div>`
    const tekan = m => { const b = $(`.tuts[data-m="${m}"]`, el); if (!b) return; tutsSuara(m); b.classList.add('tekan'); setTimeout(() => b.classList.remove('tekan'), 180); if (onNada) onNada(m) }
    $$('.tuts', el).forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); tekan(+b.dataset.m) }))
    pianoAktif = tekan
    tambahBersih(() => { if (pianoAktif === tekan) pianoAktif = null })
    return { tandai: ms => { const a = [].concat(ms); $$('.tuts', el).forEach(b => b.classList.toggle('next', a.includes(+b.dataset.m))) } }
  }
  const LAGU = { 'Tangga nada C': [60, 62, 64, 65, 67, 69, 71, 72], 'Tangga nada G': [67, 69, 71, 72, 74, 76, 78, 79], 'Bintang Kecil': [60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60], 'Ode to Joy': [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62] }
  ALAT.lagu = (el, opt = {}) => {
    let judul = opt.awal || 'Tangga nada C', ix = 0, pn
    el.innerHTML = '<div id="lg-chip"></div><div class="not-baris" id="not"></div><div id="pn"></div><div class="pesan" id="pn-p"></div>'
    const notBaris = () => { $('#not', el).innerHTML = LAGU[judul].map((m, i) => `<span class="${i < ix ? 'udah' : i === ix ? 'kini' : ''}">${NOTA[m % 12]}</span>`).join('') }
    const mulai = () => { ix = 0; notBaris(); pn = piano($('#pn', el), 60, Math.max(...LAGU[judul]) > 72 ? 84 : 72, m => {
      const L = LAGU[judul]; if (ix >= L.length) return
      if (m === L[ix]) { ix++; pesanDi($('#pn-p', el), ''); if (ix === L.length) { pesanDi($('#pn-p', el), `Mantap, ${judul} selesai!`, 'ok'); pn.tandai(-1) } else pn.tandai(L[ix]) }
      else pesanDi($('#pn-p', el), `Ups, harusnya ${NOTA[L[ix] % 12]}. Cari tuts yang ditandain oranye.`, 'salah')
      notBaris() }); pn.tandai(LAGU[judul][0]) }
    chipPilih($('#lg-chip', el), 'lg', Object.keys(LAGU), judul, v => { judul = v; pesanDi($('#pn-p', el), ''); mulai() })
    mulai()
  }
  const kuisTuts = (el, buatSoal, teks) => {
    let soal, skor = 0, salah = 0
    el.innerHTML = `<div class="soal-besar" id="ks-s"></div><div id="pn"></div><div class="kontrol"><span class="kecil">Bener <b id="ks-b">0</b> · Salah <b id="ks-x">0</b></span><button class="btn garis kecil-btn" id="ks-l">Lewati</button></div><div class="pesan" id="ks-p"></div>`
    const baru = () => { soal = buatSoal(); $('#ks-s', el).innerHTML = teks(soal) }
    piano($('#pn', el), 60, 83, m => { if (soal.cek(m)) { skor++; $('#ks-b', el).textContent = skor; pesanDi($('#ks-p', el), 'Bener!', 'ok'); setTimeout(baru, 350) } else { salah++; $('#ks-x', el).textContent = salah; pesanDi($('#ks-p', el), soal.salah ? soal.salah(m) : 'Belum, coba lagi.', 'salah') } })
    $('#ks-l', el).onclick = baru
    baru()
  }
  ALAT.carinada = el => kuisTuts(el, () => { const n = ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)]; return { n, cek: m => NOTA[m % 12] === n, salah: m => `Itu ${NOTA[m % 12]}. Cari pola tuts hitam dulu.` } }, s => `Pencet tuts <b>${s.n}</b> (yang mana aja)`)
  ALAT.nomorjari = el => {
    const POS = { 1: 60, 2: 62, 3: 64, 4: 65, 5: 67 }, NJ = { 1: 'jempol', 2: 'telunjuk', 3: 'jari tengah', 4: 'jari manis', 5: 'kelingking' }
    kuisTuts(el, () => { const j = 1 + Math.floor(Math.random() * 5); return { j, cek: m => m === POS[j], salah: () => `Jari ${j} di posisi C itu ${NOTA[POS[j] % 12]}.` } }, s => `Jari <b>${s.j}</b> <span class="redup">(${NJ[s.j]})</span> · tangan kanan di posisi C`)
    $('.piano', el).insertAdjacentHTML('beforebegin', '<div class="posisi-c kecil redup">Posisi C: jempol (1) di C tengah, kelingking (5) di G.</div>')
  }
  ALAT.bacanot = el => {
    const NOT = [[60, -2], [62, -1], [64, 0], [65, 1], [67, 2], [69, 3], [71, 4], [72, 5], [74, 6], [76, 7], [77, 8], [79, 9]]
    const staff = st => { const y0 = 96, g = 8, y = y0 - st * g; let s = '<svg viewBox="0 0 220 130" class="staff" role="img" aria-label="Paranada dengan satu not">'
      for (let i = 0; i < 5; i++) s += `<line x1="10" x2="210" y1="${y0 - i * 16}" y2="${y0 - i * 16}" stroke="currentColor" stroke-width="1.4"/>`
      s += `<text x="16" y="${y0 - 12}" font-size="46" fill="currentColor" font-family="serif">𝄞</text>`
      if (st <= -2) s += `<line x1="104" x2="136" y1="${y0 + 16}" y2="${y0 + 16}" stroke="currentColor" stroke-width="1.4"/>`
      s += `<ellipse cx="120" cy="${y}" rx="9" ry="6.5" transform="rotate(-20 120 ${y})" fill="currentColor"/><line x1="${st >= 4 ? 111.5 : 128.5}" x2="${st >= 4 ? 111.5 : 128.5}" y1="${y}" y2="${st >= 4 ? y + 44 : y - 44}" stroke="currentColor" stroke-width="1.6"/></svg>`; return s }
    kuisTuts(el, () => { const [m, st] = NOT[Math.floor(Math.random() * NOT.length)]; return { m, st, cek: x => x === m, salah: x => `Itu ${NOTA[x % 12]}${Math.floor(x / 12) - 1}. Hitung dari C tengah (garis tambahan di bawah).` } }, s => staff(s.st))
  }
  ALAT.akor = (el, opt = {}) => {
    const AK = opt.inversi
      ? { 'C': [60, 64, 67], 'C inversi 1': [64, 67, 72], 'C inversi 2': [67, 72, 76], 'F inversi 2': [60, 65, 69], 'G inversi 1': [59, 62, 67] }
      : { C: [60, 64, 67], F: [65, 69, 72], G: [67, 71, 74], Am: [69, 72, 76] }
    el.innerHTML = `<div id="ak-chip"></div><div id="pn"></div>${opt.inversi ? '<div class="aksi" style="margin-top:10px"><button class="btn merek kecil-btn" id="ak-prog">Mainin C → F → G → C (pakai inversi)</button></div>' : ''}<p class="kecil redup" style="margin-top:8px">Pilih akor buat liat dan dengerin nadanya.</p>`
    const pn = piano($('#pn', el), opt.inversi ? 59 : 60, opt.inversi ? 79 : 77, null)
    const bunyi = ns => { pn.tandai(ns); ns.forEach((m, i) => setTimeout(() => tutsSuara(m, 0.22), i * 30)) }
    chipPilih($('#ak-chip', el), 'ak', Object.keys(AK), '', v => bunyi(AK[v]))
    if (opt.inversi) $('#ak-prog', el).onclick = () => [[60, 64, 67], [60, 65, 69], [59, 62, 67], [60, 64, 67]].forEach((a, i) => setTimeout(() => bunyi(a), i * 800))
  }
  ALAT.interval = el => {
    const IV = [[2, 'Sekunde'], [4, 'Terts'], [5, 'Kwart'], [7, 'Kwint'], [12, 'Oktaf']]
    let soal, skor = 0, total = 0
    el.innerHTML = '<div class="aksi"><button class="btn merek" id="iv-d">▶ Dengerin</button><button class="btn garis kecil-btn" id="iv-n">Soal baru</button></div><div class="opsi" id="iv-o" style="margin-top:12px"></div><div class="pesan" id="iv-p"></div><div class="kecil redup" id="iv-s"></div><div id="pn" style="margin-top:10px"></div>'
    const pn = piano($('#pn', el), 60, 84, null)
    const dengar = () => { const [a, b] = [soal.dasar, soal.dasar + soal.iv[0]]; tutsSuara(a); setTimeout(() => tutsSuara(b), 600); setTimeout(() => { tutsSuara(a, 0.2); tutsSuara(b, 0.2) }, 1300) }
    const baru = () => { soal = { iv: IV[Math.floor(Math.random() * IV.length)], dasar: 60 + Math.floor(Math.random() * 8) }; pn.tandai([]); pesanDi($('#iv-p', el), ''); $('#iv-o', el).innerHTML = IV.map(([n, nama]) => `<button data-n="${n}">${nama} <span class="redup kecil">(${n} setengah nada)</span></button>`).join(''); $$('#iv-o button', el).forEach(b => b.onclick = () => { total++; const ok = +b.dataset.n === soal.iv[0]; if (ok) skor++; pn.tandai([soal.dasar, soal.dasar + soal.iv[0]]); pesanDi($('#iv-p', el), ok ? `Bener, ${soal.iv[1].toLowerCase()}!` : `Itu ${soal.iv[1].toLowerCase()}. Dengerin lagi bedanya.`, ok ? 'ok' : 'salah'); $('#iv-s', el).textContent = `Skor ${skor}/${total}` }); dengar() }
    $('#iv-d', el).onclick = dengar; $('#iv-n', el).onclick = baru
    baru()
  }

  // ---------- drum ----------
  const BARIS = [['kick', 'Kick'], ['snare', 'Snare'], ['hat', 'Hi-hat'], ['tom', 'Tom']]
  const PRESET = {
    'Rock dasar': { kick: [1, 0, 0, 0, 1, 0, 0, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [1, 1, 1, 1, 1, 1, 1, 1], tom: [0, 0, 0, 0, 0, 0, 0, 0] },
    '16-an hi-hat': { kick: [1, 0, 0, 0, 1, 0, 1, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [1, 1, 1, 1, 1, 1, 1, 1], tom: [0, 0, 0, 0, 0, 0, 0, 0] },
    'Fill snare': { kick: [1, 0, 0, 0, 0, 0, 0, 0], snare: [1, 1, 1, 1, 0, 0, 0, 0], hat: [0, 0, 0, 0, 0, 0, 0, 0], tom: [0, 0, 0, 0, 1, 1, 1, 1] },
    'Disko': { kick: [1, 0, 1, 0, 1, 0, 1, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [0, 1, 0, 1, 0, 1, 0, 1], tom: [0, 0, 0, 0, 0, 0, 0, 0] },
    'Santai': { kick: [1, 0, 0, 1, 0, 0, 1, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [1, 0, 1, 0, 1, 0, 1, 1], tom: [0, 0, 0, 0, 0, 0, 0, 0] },
    'Kosong': { kick: [0, 0, 0, 0, 0, 0, 0, 0], snare: [0, 0, 0, 0, 0, 0, 0, 0], hat: [0, 0, 0, 0, 0, 0, 0, 0], tom: [0, 0, 0, 0, 0, 0, 0, 0] }
  }
  ALAT.pad = el => {
    el.innerHTML = `<div class="pads">${BARIS.map(([k, n], i) => `<button class="pad-d" data-k="${k}">${n}<br><span class="kecil redup">${i + 1}</span></button>`).join('')}</div>`
    const pukul = k => { DRUM[k](ac().currentTime); const p = $(`.pad-d[data-k="${k}"]`, el); p.classList.add('pukul'); setTimeout(() => p.classList.remove('pukul'), 110) }
    $$('.pad-d', el).forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); pukul(b.dataset.k) }))
    const kb = e => { const i = '1234'.indexOf(e.key); if (i >= 0 && !e.repeat) pukul(BARIS[i][0]) }
    addEventListener('keydown', kb); tambahBersih(() => removeEventListener('keydown', kb))
  }
  ALAT.seq = (el, opt = {}) => {
    let nama = opt.awal || 'Rock dasar', pola = JSON.parse(JSON.stringify(PRESET[nama])), bpm = 96, ke = 0, jalan = null
    el.innerHTML = '<div id="sq-chip"></div><div class="seq" id="seq"></div><div class="kontrol"><button class="btn merek" id="sq-m">Mainin beat</button><label class="kecil">Tempo <input type="range" id="sq-b" min="60" max="160" value="96"> <b id="sq-bn">96</b> bpm</label></div><p class="kecil redup" style="margin-top:8px">8 kotak = "1 & 2 & 3 & 4 &". Nyalain kotak buat bikin pola sendiri.</p>'
    const seq = () => { $('#seq', el).innerHTML = BARIS.map(([k, n]) => `<span class="nm">${n}</span>${pola[k].map((v, i) => `<button class="${v ? 'on' : ''}" data-k="${k}" data-i="${i}" aria-label="${n} ketukan ${i + 1}" aria-pressed="${!!v}"></button>`).join('')}`).join('') + `<span></span>${[1, '&', 2, '&', 3, '&', 4, '&'].map(x => `<span class="nm" style="text-align:center">${x}</span>`).join('')}`
      $$('#seq button', el).forEach(b => b.onclick = () => { const r = pola[b.dataset.k]; r[+b.dataset.i] = r[+b.dataset.i] ? 0 : 1; seq(); if (r[+b.dataset.i]) DRUM[b.dataset.k](ac().currentTime) }) }
    const tik = () => { const t = ac().currentTime; BARIS.forEach(([k]) => { if (pola[k][ke]) DRUM[k](t) }); $$('#seq button', el).forEach(b => b.classList.toggle('jalan', +b.dataset.i === ke)); ke = (ke + 1) % 8 }
    const stop = () => { clearInterval(jalan); jalan = null; $('#sq-m', el).textContent = 'Mainin beat'; $$('#seq button', el).forEach(b => b.classList.remove('jalan')) }
    chipPilih($('#sq-chip', el), 'sq-pre', Object.keys(PRESET), nama, v => { pola = JSON.parse(JSON.stringify(PRESET[v])); seq() })
    $('#sq-m', el).onclick = () => { if (jalan) return stop(); ke = 0; tik(); jalan = setInterval(tik, 30000 / bpm); $('#sq-m', el).textContent = 'Berhenti' }
    $('#sq-b', el).oninput = e => { bpm = +e.target.value; $('#sq-bn', el).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 30000 / bpm) } }
    tambahBersih(stop); seq()
  }
  ALAT.rudimen = (el, opt = {}) => {
    const SEMUA = { 'Single stroke': 'RLRLRLRL', 'Double stroke': 'RRLLRRLL', 'Paradiddle': 'RLRRLRLL', 'Double paradiddle': 'RLRLRRLRLRLL' }
    const RD = Object.fromEntries((opt.daftar || ['Single stroke', 'Double stroke', 'Paradiddle']).map(k => [k, SEMUA[k]]))
    let nama = Object.keys(RD)[0], ix = 0, bener = 0, salah = 0, metro = null
    el.innerHTML = '<div id="rd-chip"></div><div class="sticking" id="rd-s"></div><div class="lr"><button class="btn garis" id="rd-L">L<br><span class="kecil redup">tombol F</span></button><button class="btn garis" id="rd-R">R<br><span class="kecil redup">tombol J</span></button></div><div class="kontrol"><span class="kecil">Bener <b id="rd-b">0</b> · Salah <b id="rd-x">0</b></span><button class="btn garis kecil-btn" id="rd-m">Nyalain metronom</button></div><div class="pesan" id="rd-p"></div>'
    const gambar = () => { $('#rd-s', el).style.gridTemplateColumns = `repeat(${RD[nama].length > 8 ? 6 : 8}, minmax(0, 1fr))`; $('#rd-s', el).innerHTML = RD[nama].split('').map((h, i) => `<span class="${i === ix ? 'kini' : i < ix ? 'udah' : ''}">${h}</span>`).join('') }
    const pukul = h => {
      DRUM.snare(ac().currentTime)
      if (RD[nama][ix] === h) { bener++; ix++; if (ix >= RD[nama].length) { ix = 0; pesanDi($('#rd-p', el), 'Satu putaran rapi! Ulang terus, terus naikin tempo.', 'ok') } }
      else { salah++; pesanDi($('#rd-p', el), `Harusnya ${RD[nama][ix]}.`, 'salah') }
      $('#rd-b', el).textContent = bener; $('#rd-x', el).textContent = salah; gambar()
    }
    chipPilih($('#rd-chip', el), 'rd', Object.keys(RD), nama, v => { nama = v; ix = 0; bener = salah = 0; $('#rd-b', el).textContent = 0; $('#rd-x', el).textContent = 0; pesanDi($('#rd-p', el), ''); gambar() })
    $('#rd-L', el).onclick = () => pukul('L'); $('#rd-R', el).onclick = () => pukul('R')
    const kb = e => { if (e.repeat) return; if (e.key.toLowerCase() === 'f') pukul('L'); if (e.key.toLowerCase() === 'j') pukul('R') }
    addEventListener('keydown', kb)
    const stopM = () => { clearInterval(metro); metro = null; $('#rd-m', el).textContent = 'Nyalain metronom' }
    $('#rd-m', el).onclick = () => { if (metro) return stopM(); klik(true); metro = setInterval(() => klik(), 60000 / 80); $('#rd-m', el).textContent = 'Matiin metronom' }
    tambahBersih(() => { removeEventListener('keydown', kb); stopM() })
    gambar()
  }

  // ---------- menggambar ----------
  const kanvasDasar = (el, tinggi = 500) => {
    el.insertAdjacentHTML('beforeend', `<div class="kanvas-wrap"><canvas width="900" height="${tinggi}"></canvas></div>`)
    const kv = $('canvas', el), cx = kv.getContext('2d')
    const titik = e => { const r = kv.getBoundingClientRect(); return [(e.clientX - r.left) * kv.width / r.width, (e.clientY - r.top) * kv.height / r.height] }
    return { kv, cx, titik }
  }
  ALAT.garis = el => {
    el.innerHTML = ''
    const { kv, cx, titik } = kanvasDasar(el)
    el.insertAdjacentHTML('beforeend', '<div class="aksi" style="margin-top:10px"><button class="btn garis kecil-btn" id="gr-baru">Garis baru</button></div><div class="pesan" id="gr-p"></div>')
    let A, B, jejak = [], aktif = false, skor = []
    const baru = () => { const r = () => [80 + Math.random() * 740, 60 + Math.random() * 380]; do { A = r(); B = r() } while (Math.hypot(A[0] - B[0], A[1] - B[1]) < 300); jejak = []; gambar() }
    const gambar = () => { cx.fillStyle = '#fff'; cx.fillRect(0, 0, kv.width, kv.height); [[A, '#7B4FD6'], [B, '#378ADD']].forEach(([p, c]) => { cx.fillStyle = c; cx.beginPath(); cx.arc(p[0], p[1], 9, 0, 7); cx.fill() }); if (jejak.length) { cx.strokeStyle = '#0E1525'; cx.lineWidth = 4; cx.lineCap = 'round'; cx.beginPath(); jejak.forEach((p, i) => i ? cx.lineTo(...p) : cx.moveTo(...p)); cx.stroke() } }
    kv.addEventListener('pointerdown', e => { kv.setPointerCapture(e.pointerId); aktif = true; jejak = [titik(e)]; gambar() })
    kv.addEventListener('pointermove', e => { if (aktif) { jejak.push(titik(e)); gambar() } })
    kv.addEventListener('pointerup', () => {
      if (!aktif) return; aktif = false; if (jejak.length < 5) return
      const s = jejak[0], t = jejak[jejak.length - 1], L = Math.hypot(t[0] - s[0], t[1] - s[1]) || 1
      const dev = Math.max(...jejak.map(p => Math.abs((t[0] - s[0]) * (s[1] - p[1]) - (s[0] - p[0]) * (t[1] - s[1])) / L))
      const ujung = Math.min(Math.hypot(s[0] - A[0], s[1] - A[1]) + Math.hypot(t[0] - B[0], t[1] - B[1]), Math.hypot(s[0] - B[0], s[1] - B[1]) + Math.hypot(t[0] - A[0], t[1] - A[1]))
      const lurus = Math.max(0, 100 - dev / L * 600), tepat = Math.max(0, 100 - ujung / 2)
      const nilai = Math.round(lurus * 0.6 + tepat * 0.4); skor.push(nilai)
      pesanDi($('#gr-p', el), `Kelurusan ${Math.round(lurus)} · Ketepatan ujung ${Math.round(tepat)} · Nilai ${nilai}. ${lurus < 60 ? 'Garisnya melengkung: gerakin dari bahu dan jangan ragu.' : tepat < 60 ? 'Lurus! Sekarang latih biar ujungnya pas di titik.' : 'Mantap, yakin dan tepat.'}`, nilai >= 70 ? 'ok' : '')
    })
    $('#gr-baru', el).onclick = baru; baru()
  }
  ALAT.elips = el => {
    el.innerHTML = ''
    const { kv, cx, titik } = kanvasDasar(el)
    el.insertAdjacentHTML('beforeend', '<div class="aksi" style="margin-top:10px"><button class="btn garis kecil-btn" id="el-baru">Lingkaran baru</button></div><div class="pesan" id="el-p"></div>')
    let C, R, jejak = [], aktif = false
    const baru = () => { R = 70 + Math.random() * 110; C = [R + 40 + Math.random() * (900 - 2 * R - 80), R + 30 + Math.random() * (500 - 2 * R - 60)]; jejak = []; gambar() }
    const gambar = () => { cx.fillStyle = '#fff'; cx.fillRect(0, 0, kv.width, kv.height); cx.setLineDash([8, 8]); cx.strokeStyle = '#C3CAD6'; cx.lineWidth = 2; cx.beginPath(); cx.arc(C[0], C[1], R, 0, 7); cx.stroke(); cx.setLineDash([]); if (jejak.length) { cx.strokeStyle = '#7B4FD6'; cx.lineWidth = 3.5; cx.lineCap = 'round'; cx.beginPath(); jejak.forEach((p, i) => i ? cx.lineTo(...p) : cx.moveTo(...p)); cx.stroke() } }
    kv.addEventListener('pointerdown', e => { kv.setPointerCapture(e.pointerId); aktif = true; jejak = [titik(e)]; gambar() })
    kv.addEventListener('pointermove', e => { if (aktif) { jejak.push(titik(e)); gambar() } })
    kv.addEventListener('pointerup', () => {
      if (!aktif) return; aktif = false; if (jejak.length < 10) return
      const dev = jejak.reduce((s, p) => s + Math.abs(Math.hypot(p[0] - C[0], p[1] - C[1]) - R), 0) / jejak.length
      let sudut = 0; for (let i = 1; i < jejak.length; i++) { let d = Math.atan2(jejak[i][1] - C[1], jejak[i][0] - C[0]) - Math.atan2(jejak[i - 1][1] - C[1], jejak[i - 1][0] - C[0]); if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; sudut += d }
      const putaran = Math.abs(sudut) / (2 * Math.PI), bentuk = Math.max(0, Math.round(100 - dev / R * 300))
      pesanDi($('#el-p', el), putaran < 0.9 ? 'Lingkarannya belum nutup. Gambar muter penuh, bahkan 2 sampai 3 kali.' : `Kebulatan ${bentuk} · ${putaran.toFixed(1)} putaran. ${bentuk >= 75 ? 'Bulet dan lancar!' : 'Lancarin gerakannya, jangan pelan-pelan.'}`, bentuk >= 75 && putaran >= 0.9 ? 'ok' : '')
    })
    $('#el-baru', el).onclick = baru; baru()
  }
  ALAT.perspektif = el => {
    el.innerHTML = '<div id="ps-chip"></div>'
    const { kv, cx, titik } = kanvasDasar(el, 520)
    el.insertAdjacentHTML('beforeend', '<p class="kecil redup" style="margin-top:8px">Seret titik oranye (titik hilang) atau garis cakrawala biru buat liat perubahan.</p>')
    let mode = '2 titik', hor = 200, vp = [[120, 200], [780, 200]], seret = null
    const gambar = () => {
      cx.fillStyle = '#fff'; cx.fillRect(0, 0, 900, 520)
      cx.strokeStyle = '#378ADD'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(0, hor); cx.lineTo(900, hor); cx.stroke()
      const x = 450, y1 = 300, y2 = 430, garis = (a, b, w = 3, c = '#0E1525', dash = []) => { cx.setLineDash(dash); cx.strokeStyle = c; cx.lineWidth = w; cx.beginPath(); cx.moveTo(...a); cx.lineTo(...b); cx.stroke(); cx.setLineDash([]) }
      const ke = (p, v, t) => [p[0] + (v[0] - p[0]) * t, p[1] + (v[1] - p[1]) * t]
      if (mode === '2 titik') {
        const [L, R] = vp, a = [x, y1], b = [x, y2]
        ;[a, b].forEach(p => { garis(p, L, 1, '#C3CAD6', [6, 6]); garis(p, R, 1, '#C3CAD6', [6, 6]) })
        const aL = ke(a, L, 0.35), bL = ke(b, L, 0.35), aR = ke(a, R, 0.3), bR = ke(b, R, 0.3)
        garis(a, b); garis(a, aL); garis(b, bL); garis(a, aR); garis(b, bR); garis(aL, bL); garis(aR, bR)
        const isec = (p1, p2, p3, p4) => { const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]); const t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d; return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])] }
        const top = isec(aL, R, aR, L); if (hor < y1) { garis(aL, top, 2, '#8E98AA', [4, 4]); garis(aR, top, 2, '#8E98AA', [4, 4]) } else { garis(aL, top); garis(aR, top) }
        vp.forEach(p => { cx.fillStyle = '#7B4FD6'; cx.beginPath(); cx.arc(p[0], hor, 10, 0, 7); cx.fill() })
      } else {
        const V = vp[0], f = [[360, 300], [540, 300], [540, 430], [360, 430]]
        f.forEach(p => garis(p, V, 1, '#C3CAD6', [6, 6]))
        const bk = f.map(p => ke(p, [V[0], hor], 0.3))
        for (let i = 0; i < 4; i++) { garis(f[i], f[(i + 1) % 4]); garis(f[i], bk[i], 2); garis(bk[i], bk[(i + 1) % 4], 2, '#8E98AA') }
        cx.fillStyle = '#7B4FD6'; cx.beginPath(); cx.arc(V[0], hor, 10, 0, 7); cx.fill()
      }
    }
    kv.addEventListener('pointerdown', e => { const [x, y] = titik(e); kv.setPointerCapture(e.pointerId); const t = (mode === '2 titik' ? vp : [vp[0]]).findIndex(p => Math.hypot(p[0] - x, hor - y) < 30); seret = t >= 0 ? t : Math.abs(y - hor) < 25 ? 'h' : null })
    kv.addEventListener('pointermove', e => { if (seret === null) return; const [x, y] = titik(e); if (seret === 'h') hor = Math.max(40, Math.min(480, y)); else vp[seret][0] = Math.max(10, Math.min(890, x)); vp.forEach(p => p[1] = hor); gambar() })
    kv.addEventListener('pointerup', () => { seret = null })
    chipPilih($('#ps-chip', el), 'ps', ['2 titik', '1 titik'], mode, v => { mode = v; vp = v === '2 titik' ? [[120, hor], [780, hor]] : [[450, hor]]; gambar() })
    gambar()
  }
  const TEMA = ['kucing lagi tidur', 'gelas kopi', 'sepatu kamu', 'pohon di depan rumah', 'wajah teman pakai 5 garis', 'rumah impian', 'awan bentuk hewan', 'tangan kamu sendiri', 'motor lewat', 'makanan favorit', 'kursi di kamar', 'bulan dan bintang', 'ikan di akuarium', 'payung pas hujan']
  const WARNA = ['#0E1525', '#D85A30', '#F5A300', '#378ADD', '#1D9E75', '#7F77DD', '#E84D7A', '#FFFFFF']
  ALAT.kanvas = el => {
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><div><span class="label">Tema</span><div class="prompt" id="tema-g">tekan Acak tema</div></div><div style="display:flex;gap:8px;align-items:center"><span class="timer" id="timer">60</span><button class="btn merek kecil-btn" id="mulai">Mulai 60 detik</button></div></div>`
    const { kv, cx, titik } = kanvasDasar(el, 600)
    el.insertAdjacentHTML('beforeend', `<div class="kontrol"><div class="warna-baris" id="wr">${WARNA.map((w, i) => `<button style="background:${w}" data-w="${w}" aria-label="Warna ${w === '#FFFFFF' ? 'putih (penghapus)' : w}" aria-pressed="${i === 0}"></button>`).join('')}</div><label class="kecil">Tebal <input type="range" id="tebal" min="2" max="30" value="6"></label></div>
      <div class="aksi" style="margin-top:10px"><button class="btn garis kecil-btn" id="acak">Acak tema</button><button class="btn garis kecil-btn" id="undo">Urungkan</button><button class="btn garis kecil-btn" id="hapus">Bersihin</button><button class="btn garis kecil-btn" id="simpan">Simpan gambar</button></div><div class="pesan" id="g-pesan"></div>`)
    let warna = WARNA[0], nyala = false, riwayat = [], waktu = null
    const kosong = () => { cx.fillStyle = '#fff'; cx.fillRect(0, 0, kv.width, kv.height) }
    kosong(); cx.lineCap = 'round'; cx.lineJoin = 'round'
    kv.addEventListener('pointerdown', e => { kv.setPointerCapture(e.pointerId); riwayat.push(cx.getImageData(0, 0, kv.width, kv.height)); if (riwayat.length > 20) riwayat.shift(); nyala = true; const [x, y] = titik(e); cx.strokeStyle = warna; cx.lineWidth = +$('#tebal', el).value * (warna === '#FFFFFF' ? 2 : 1); cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + 0.1, y); cx.stroke() })
    kv.addEventListener('pointermove', e => { if (!nyala) return; const [x, y] = titik(e); cx.lineTo(x, y); cx.stroke() })
    const selesai = () => { nyala = false }; kv.addEventListener('pointerup', selesai); kv.addEventListener('pointercancel', selesai)
    $$('#wr button', el).forEach(b => b.onclick = () => { warna = b.dataset.w; $$('#wr button', el).forEach(x => x.setAttribute('aria-pressed', x === b)) })
    const acak = () => { $('#tema-g', el).textContent = TEMA[Math.floor(Math.random() * TEMA.length)] }
    $('#acak', el).onclick = acak
    $('#undo', el).onclick = () => { const r = riwayat.pop(); if (r) cx.putImageData(r, 0, 0) }
    $('#hapus', el).onclick = () => { riwayat.push(cx.getImageData(0, 0, kv.width, kv.height)); kosong() }
    $('#simpan', el).onclick = () => { const a = document.createElement('a'); a.download = 'gambar-get-a-hobby.png'; a.href = kv.toDataURL('image/png'); a.click() }
    const henti = () => { clearInterval(waktu); waktu = null; $('#mulai', el).textContent = 'Mulai 60 detik' }
    $('#mulai', el).onclick = () => {
      if (waktu) { henti(); $('#timer', el).textContent = '60'; return }
      if ($('#tema-g', el).textContent.startsWith('tekan')) acak()
      kosong(); riwayat = []; let sisa = 60; $('#timer', el).textContent = sisa; pesanDi($('#g-pesan', el), ''); $('#mulai', el).textContent = 'Berhenti'
      waktu = setInterval(() => { sisa--; $('#timer', el).textContent = sisa; if (sisa <= 0) { henti(); pesanDi($('#g-pesan', el), 'Waktu habis! Ga harus bagus, yang penting jadi.', 'ok') } }, 1000)
    }
    tambahBersih(henti)
  }

  // ---------- fotografi ----------
  const AP = [1.8, 2.8, 4, 5.6, 8, 11, 16], SH = [15, 30, 60, 125, 250, 500, 1000], ISO = [100, 200, 400, 800, 1600, 3200, 6400]
  const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
  const ADEGAN = '<div class="lap langit"></div><div class="lap gunung"></div><div class="lap tanah"></div><div class="lap bunga"></div><div class="lap orang"></div>'
  const MISI = [
    { n: 'Exposure pas', d: 'Bikin meternya pas di tengah (hijau).', cek: (a, s, i, e) => Math.abs(e) < 0.5 },
    { n: 'Orang lari tetap tajam', d: 'Shutter 1/500 atau lebih cepat, exposure tetap pas.', cek: (a, s, i, e) => SH[s] >= 500 && Math.abs(e) < 0.5 },
    { n: 'Background blur', d: 'Aperture f/2.8 atau lebih kecil angkanya, exposure tetap pas.', cek: (a, s, i, e) => AP[a] <= 2.8 && Math.abs(e) < 0.5 },
    { n: 'Foto bersih tanpa bintik', d: 'ISO 200 atau lebih rendah, exposure tetap pas.', cek: (a, s, i, e) => ISO[i] <= 200 && Math.abs(e) < 0.5 }
  ]
  ALAT.exposure = el => {
    let a = 3, s = 3, i = 0, misi = 0
    el.innerHTML = `<div id="ms-chip"></div><p class="kecil" id="misi-d" style="margin-bottom:10px"></p>
      <div class="foto" id="foto">${ADEGAN}<div class="lap noise" style="background-image:${NOISE}"></div></div>
      <div class="meter" id="meter">${[-3, -2, -1, 0, 1, 2, 3].map(v => `<span data-v="${v}"></span>`).join('')}</div><div class="kecil" id="status" style="text-align:center;font-weight:700"></div>
      <div class="slider-baris"><span class="kecil">Aperture</span><input type="range" id="ap" min="0" max="6" value="${a}" aria-label="Aperture"><b id="ap-n"></b></div>
      <div class="slider-baris"><span class="kecil">Shutter</span><input type="range" id="sh" min="0" max="6" value="${s}" aria-label="Kecepatan shutter"><b id="sh-n"></b></div>
      <div class="slider-baris"><span class="kecil">ISO</span><input type="range" id="iso" min="0" max="6" value="${i}" aria-label="ISO"><b id="iso-n"></b></div>
      <div class="aksi" style="margin-top:8px"><button class="btn merek" id="jepret">Jepret!</button></div><div class="pesan" id="f-pesan"></div>`
    const ev = () => Math.log2((1 / SH[s]) * ISO[i] / (AP[a] * AP[a])) - Math.log2((1 / 250) * 400 / (5.6 * 5.6))
    const segar = () => {
      const e = ev(), ce = Math.max(-3, Math.min(3, e)), f = $('#foto', el)
      $('#ap-n', el).textContent = 'f/' + AP[a]; $('#sh-n', el).textContent = '1/' + SH[s]; $('#iso-n', el).textContent = ISO[i]
      f.style.filter = `brightness(${Math.pow(2, ce * 0.55).toFixed(2)})`
      const blurBg = Math.max(0, 1.6 * (1 / AP[a] - 1 / 16) * 6)
      ;['.langit', '.gunung', '.tanah'].forEach(k => $(k, f).style.filter = `blur(${blurBg.toFixed(1)}px)`)
      const gerak = Math.min(7, 120 / SH[s]); $('.orang', f).style.filter = `blur(${(gerak * 0.6).toFixed(1)}px)`; $('.orang', f).style.transform = `scaleX(${(1 + gerak * 0.12).toFixed(2)})`
      $('.noise', f).style.opacity = (Math.log2(ISO[i] / 100) / 6 * 0.85).toFixed(2)
      const r = Math.round(ce); $$('#meter span', el).forEach(m => { const v = +m.dataset.v; m.className = v === r ? (v === 0 ? 'nol' : 'on') : '' })
      $('#status', el).textContent = Math.abs(e) < 0.5 ? 'Pas' : e < 0 ? 'Terlalu gelap' : 'Terlalu terang'
      $('#misi-d', el).textContent = MISI[misi].d
    }
    $('#ap', el).oninput = e => { a = +e.target.value; segar() }; $('#sh', el).oninput = e => { s = +e.target.value; segar() }; $('#iso', el).oninput = e => { i = +e.target.value; segar() }
    chipPilih($('#ms-chip', el), 'ms', MISI.map((_, k) => String(k)), '0', v => { misi = +v; pesanDi($('#f-pesan', el), ''); segar() }, k => MISI[+k].n)
    $('#jepret', el).onclick = () => { $('#foto', el).animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 220 }); const ok = MISI[misi].cek(a, s, i, ev()); pesanDi($('#f-pesan', el), ok ? `Berhasil! Misi "${MISI[misi].n}" beres.` : 'Belum pas. Cek meter dan syarat misinya.', ok ? 'ok' : 'salah') }
    segar()
  }
  ALAT.wb = el => {
    const SUMBER = { 'Lampu pijar': 3200, 'Neon putih': 4200, 'Siang cerah': 5500, 'Mendung': 6500 }
    let src = 'Lampu pijar', k = 5500
    el.innerHTML = '<div id="wb-chip"></div><div class="foto wb" id="wb-f"><div class="lap ruang"></div><div class="lap kertas">kertas putih</div><div class="lap cast" id="wb-c"></div></div><div class="slider-baris"><span class="kecil">White balance</span><input type="range" id="wb-s" min="2500" max="9000" step="100" value="5500" aria-label="White balance Kelvin"><b id="wb-n"></b></div><div class="aksi"><button class="btn merek" id="wb-j">Jepret!</button></div><div class="pesan" id="wb-p"></div>'
    const segar = () => {
      const d = SUMBER[src] - k, c = $('#wb-c', el) // d < 0: setelan lebih tinggi dari cahaya, foto jadi oranye
      c.style.background = d < 0 ? '#FF8A1E' : '#2E7BFF'; c.style.opacity = Math.min(0.55, Math.abs(d) / 5000).toFixed(2)
      $('#wb-n', el).textContent = k + 'K'
    }
    chipPilih($('#wb-chip', el), 'wb', Object.keys(SUMBER), src, v => { src = v; pesanDi($('#wb-p', el), ''); segar() })
    $('#wb-s', el).oninput = e => { k = +e.target.value; segar() }
    $('#wb-j', el).onclick = () => { const d = Math.abs(SUMBER[src] - k); pesanDi($('#wb-p', el), d <= 300 ? `Netral! Cahaya ${src.toLowerCase()} sekitar ${SUMBER[src]}K.` : SUMBER[src] - k < 0 ? 'Fotonya kekuningan. Turunin angka Kelvin.' : 'Fotonya kebiruan. Naikin angka Kelvin.', d <= 300 ? 'ok' : 'salah') }
    segar()
  }
  ALAT.sepertiga = el => {
    el.innerHTML = '<div class="foto bingkai" id="sp-f"><div class="lap langit"></div><div class="lap laut" id="sp-l"></div><div class="grid3"></div><div class="objek" id="sp-o" tabindex="0" aria-label="Objek, seret ke posisi"></div><div class="cakra" id="sp-c" aria-label="Garis cakrawala, seret"></div></div><div class="aksi" style="margin-top:10px"><button class="btn merek" id="sp-j">Cek komposisi</button></div><div class="pesan" id="sp-p"></div><p class="kecil redup">Seret pohon (oranye) dan garis cakrawala (biru).</p>'
    const f = $('#sp-f', el), o = $('#sp-o', el), c = $('#sp-c', el)
    let ox = 0.5, oy = 0.55, hy = 0.5, seret = null
    const posisi = () => { o.style.left = ox * 100 + '%'; o.style.top = oy * 100 + '%'; c.style.top = hy * 100 + '%'; $('#sp-l', el).style.top = hy * 100 + '%' }
    const gerak = e => { if (!seret) return; const r = f.getBoundingClientRect(), x = Math.min(0.97, Math.max(0.03, (e.clientX - r.left) / r.width)), y = Math.min(0.95, Math.max(0.05, (e.clientY - r.top) / r.height)); if (seret === 'o') { ox = x; oy = y } else hy = y; posisi() }
    o.addEventListener('pointerdown', e => { seret = 'o'; f.setPointerCapture(e.pointerId); e.stopPropagation() })
    c.addEventListener('pointerdown', e => { seret = 'c'; f.setPointerCapture(e.pointerId) })
    f.addEventListener('pointermove', gerak); f.addEventListener('pointerup', () => { seret = null })
    $('#sp-j', el).onclick = () => {
      const d = Math.min(...[1 / 3, 2 / 3].flatMap(x => [1 / 3, 2 / 3].map(y => Math.hypot(ox - x, oy - y)))), dh = Math.min(Math.abs(hy - 1 / 3), Math.abs(hy - 2 / 3))
      const ok1 = d < 0.07, ok2 = dh < 0.05
      pesanDi($('#sp-p', el), ok1 && ok2 ? 'Komposisi mantap: objek di titik potong, cakrawala di garis sepertiga.' : !ok1 ? 'Geser pohon ke salah satu titik potong garis.' : 'Pohon udah pas. Sekarang taruh cakrawala di garis sepertiga atas atau bawah.', ok1 && ok2 ? 'ok' : 'salah')
    }
    posisi()
  }

  // ---------- alat tambahan: arsir, histogram, edit ----------
  ALAT.arsir = el => {
    el.innerHTML = ''
    const { kv, cx, titik } = kanvasDasar(el, 260)
    el.insertAdjacentHTML('beforeend', '<div class="aksi" style="margin-top:10px"><button class="btn merek kecil-btn" id="ar-c">Cek skala value</button><button class="btn garis kecil-btn" id="ar-h">Bersihin</button></div><div class="pesan" id="ar-p"></div><div class="nilai-kotak" id="ar-n"></div>')
    const KT = [0, 1, 2, 3, 4].map(i => [40 + i * 170, 50, 140, 160])
    const kosong = () => { cx.fillStyle = '#fff'; cx.fillRect(0, 0, 900, 260); cx.strokeStyle = '#9AA3B2'; cx.lineWidth = 2; KT.forEach(([x, y, w, h], i) => { cx.strokeRect(x, y, w, h); cx.fillStyle = '#9AA3B2'; cx.font = '600 16px sans-serif'; cx.fillText(String(i + 1), x + 4, y - 10) }) }
    let aktif = false
    kv.addEventListener('pointerdown', e => { kv.setPointerCapture(e.pointerId); aktif = true; const [x, y] = titik(e); cx.strokeStyle = '#0E1525'; cx.lineWidth = 3; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(x, y) })
    kv.addEventListener('pointermove', e => { if (!aktif) return; const [x, y] = titik(e); cx.lineTo(x, y); cx.stroke() })
    kv.addEventListener('pointerup', () => { aktif = false })
    $('#ar-h', el).onclick = () => { kosong(); pesanDi($('#ar-p', el), ''); $('#ar-n', el).innerHTML = '' }
    $('#ar-c', el).onclick = () => {
      const gelap = KT.map(([x, y, w, h]) => { const d = cx.getImageData(x + 4, y + 4, w - 8, h - 8).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 255 - (d[i] + d[i + 1] + d[i + 2]) / 3; return Math.round(s / (d.length / 4) / 255 * 100) })
      $('#ar-n', el).innerHTML = gelap.map(g => `<span>${g}%</span>`).join('')
      const naik = gelap.every((g, i) => i === 0 || g > gelap[i - 1]), lebar = gelap[4] - gelap[0]
      pesanDi($('#ar-p', el), naik && lebar >= 40 ? 'Mantap, gradasinya rata dari terang ke gelap.' : !naik ? 'Belum naik terus. Tiap kotak harus lebih gelap dari kotak kirinya.' : 'Urutannya bener, tapi kotak 5 kurang gelap. Rapatin dan silangin garisnya.', naik && lebar >= 40 ? 'ok' : 'salah')
    }
    kosong()
  }
  const DIST = (() => { const a = []; for (let i = 0; i < 64; i++) a.push(Math.exp(-((i - 22) ** 2) / 90) * 0.8 + Math.exp(-((i - 42) ** 2) / 60)); return a })()
  ALAT.histogram = el => {
    let ev = 0, tebak = null
    el.innerHTML = '<div class="foto" id="hg-f">' + ADEGAN + '</div><canvas id="hg-c" width="640" height="150" class="histo"></canvas><div class="slider-baris"><span class="kecil">Exposure</span><input type="range" id="hg-s" min="-3" max="3" step="0.5" value="0" aria-label="Exposure"><b id="hg-n">0</b></div><div class="aksi"><button class="btn garis kecil-btn" id="hg-t">Tebak histogram acak</button></div><div class="opsi" id="hg-o" hidden><button data-v="-1">Underexposed (kegelapan)</button><button data-v="0">Pas</button><button data-v="1">Overexposed (keterangan)</button></div><div class="pesan" id="hg-p"></div>'
    const cv = $('#hg-c', el), cx = cv.getContext('2d')
    const gambar = (e, sembunyi = false) => {
      $('#hg-f', el).style.filter = `brightness(${Math.pow(2, e * 0.55).toFixed(2)})`; $('#hg-f', el).style.visibility = sembunyi ? 'hidden' : 'visible'
      const b = new Array(64).fill(0); DIST.forEach((v, i) => { const j = Math.max(0, Math.min(63, Math.round(i + e * 9))); b[j] += v })
      const mx = Math.max(...b); cx.clearRect(0, 0, 640, 150)
      const warna = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#0E1525'
      cx.fillStyle = warna; b.forEach((v, i) => { const h = v / mx * 140; cx.fillRect(i * 10, 150 - h, 9, h) })
      cx.fillStyle = 'rgba(216,90,48,.9)'; if (b[0] > mx * 0.25) cx.fillRect(0, 0, 4, 150); if (b[63] > mx * 0.25) cx.fillRect(636, 0, 4, 150)
    }
    $('#hg-s', el).oninput = e => { tebak = null; $('#hg-o', el).hidden = true; ev = +e.target.value; $('#hg-n', el).textContent = (ev > 0 ? '+' : '') + ev; gambar(ev); pesanDi($('#hg-p', el), ev <= -1.5 ? 'Batang numpuk di kiri: kegelapan.' : ev >= 1.5 ? 'Batang numpuk di kanan dan kepotong: keterangan.' : 'Sebaran rata, ga kepotong di ujung.') }
    $('#hg-t', el).onclick = () => { const p = [-2.5, -2, 0, 0.5, 2, 2.5][Math.floor(Math.random() * 6)]; tebak = p <= -1.5 ? -1 : p >= 1.5 ? 1 : 0; gambar(p, true); $('#hg-o', el).hidden = false; pesanDi($('#hg-p', el), 'Fotonya disembunyiin. Liat histogramnya aja, tebak kondisinya.') }
    $$('#hg-o button', el).forEach(b => b.onclick = () => { if (tebak === null) return; const ok = +b.dataset.v === tebak; pesanDi($('#hg-p', el), ok ? 'Bener!' : 'Belum. Liat ke mana batangnya numpuk.', ok ? 'ok' : 'salah'); $('#hg-f', el).style.visibility = 'visible'; tebak = null })
    gambar(0)
  }
  ALAT.edit = el => {
    const NIL = { ex: 0.7, ko: 0.75, su: -35, sa: 0.6 }
    el.innerHTML = '<div class="foto" id="ed-f">' + ADEGAN + '<div class="lap cast" id="ed-c"></div></div><div class="slider-baris"><span class="kecil">Exposure</span><input type="range" id="ed-ex" min="0.4" max="1.6" step="0.05" aria-label="Exposure"><b id="ed-exn"></b></div><div class="slider-baris"><span class="kecil">Kontras</span><input type="range" id="ed-ko" min="0.5" max="1.6" step="0.05" aria-label="Kontras"><b id="ed-kon"></b></div><div class="slider-baris"><span class="kecil">Suhu warna</span><input type="range" id="ed-su" min="-60" max="60" step="5" aria-label="Suhu warna"><b id="ed-sun"></b></div><div class="slider-baris"><span class="kecil">Saturasi</span><input type="range" id="ed-sa" min="0" max="2" step="0.05" aria-label="Saturasi"><b id="ed-san"></b></div><div class="aksi"><button class="btn merek kecil-btn" id="ed-cek">Cek hasil edit</button><button class="btn garis kecil-btn" id="ed-r">Reset</button></div><div class="pesan" id="ed-p"></div>'
    const segar = () => { $('#ed-f', el).style.filter = `brightness(${NIL.ex}) contrast(${NIL.ko}) saturate(${NIL.sa})`; const c = $('#ed-c', el); c.style.background = NIL.su < 0 ? '#2E7BFF' : '#FF8A1E'; c.style.opacity = Math.min(0.5, Math.abs(NIL.su) / 110).toFixed(2); c.style.mixBlendMode = 'multiply'; ;['ex', 'ko', 'su', 'sa'].forEach(k => { $('#ed-' + k, el).value = NIL[k]; $('#ed-' + k + 'n', el).textContent = k === 'su' ? (NIL.su > 0 ? '+' : '') + NIL.su : (+NIL[k]).toFixed(2) }) }
    ;['ex', 'ko', 'su', 'sa'].forEach(k => $('#ed-' + k, el).oninput = e => { NIL[k] = +e.target.value; segar() })
    $('#ed-r', el).onclick = () => { Object.assign(NIL, { ex: 0.7, ko: 0.75, su: -35, sa: 0.6 }); pesanDi($('#ed-p', el), ''); segar() }
    $('#ed-cek', el).onclick = () => {
      const m = []; if (NIL.ex < 0.9) m.push('masih kegelapan'); if (NIL.ex > 1.2) m.push('kebanyakan terang'); if (NIL.ko < 0.9) m.push('kontras masih lemah'); if (NIL.ko > 1.35) m.push('kontras kekerasan'); if (Math.abs(NIL.su) > 10) m.push(NIL.su < 0 ? 'warna masih kebiruan' : 'warna kekuningan'); if (NIL.sa < 0.85) m.push('warna masih pucat'); if (NIL.sa > 1.4) m.push('saturasi norak')
      pesanDi($('#ed-p', el), m.length ? 'Belum natural: ' + m.join(', ') + '.' : 'Natural! Terang, kontras, dan warnanya pas.', m.length ? 'salah' : 'ok')
    }
    segar()
  }

  // ---------- main bebas ----------
  const MAIN = {
    catur: el => tabs(el, ['Kenalan bidak', 'Semua puzzle', 'Semua pembukaan'], (k, isi) => k === 0 ? ALAT.bidak(isi) : k === 1 ? ALAT.puzzle(isi, { daftar: Object.keys(PZ) }) : ALAT.buka(isi, { daftar: Object.keys(BUKA) })),
    gitar: el => tabs(el, ['Fretboard bebas', 'Semua kunci', 'Pola genjreng'], (k, isi) => {
      if (k === 1) return ALAT.kunci(isi, { daftar: Object.keys(KUNCI_G) })
      if (k === 2) return ALAT.strum(isi)
      const jari = [0, 0, 0, 0, 0, 0]
      isi.innerHTML = '<div id="fb"></div><div class="aksi" style="margin-top:12px"><button class="btn merek" id="jreng">Genjreng</button><button class="btn garis" id="reset">Lepas semua</button></div><p class="kecil redup" style="margin-top:8px">Pencet kotak buat naruh jari (satu per senar). Pencet nama senar buat matiin atau nyalain senar.</p>'
      const g = () => fretboard($('#fb', isi), jari, (s, f) => { if (f === 0) jari[s] = jari[s] === 0 ? -1 : 0; else jari[s] = jari[s] === f ? 0 : f; g(); if (jari[s] >= 0) petik(hz(SENAR[s] + jari[s])) })
      $('#jreng', isi).onclick = () => genjreng($('#fb', isi), jari); $('#reset', isi).onclick = () => { jari.fill(0); g() }; g()
    }),
    piano: el => { el.innerHTML = '<div id="pn"></div><p class="kecil redup" style="margin-top:10px">Di laptop: A S D F G H J K buat tuts putih, W E T Y U buat tuts hitam.</p>'; piano($('#pn', el), 60, 83, null) },
    drum: el => { ALAT.pad(el); const d = document.createElement('div'); el.appendChild(d); ALAT.seq(d, {}) },
    gambar: el => ALAT.kanvas(el),
    foto: el => tabs(el, ['Exposure', 'White balance', 'Komposisi'], (k, isi) => [ALAT.exposure, ALAT.wb, ALAT.sepertiga][k](isi))
  }

  siap.finally(render)
  render()
})()
