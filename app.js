// get a hobby · nemu hobi dan langsung nyobain di browser
(() => {
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => [...el.querySelectorAll(s)]
  const hal = $('#hal')

  // ---------- simpanan lokal ----------
  const KUNCI = 'gah'
  let S = {}
  try { S = JSON.parse(localStorage.getItem(KUNCI) || '{}') || {} } catch (e) { S = {} }
  S.tant = S.tant || {}
  const simpan = () => { try { localStorage.setItem(KUNCI, JSON.stringify(S)) } catch (e) {} }

  // ---------- tema ----------
  const pasangTema = t => { if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme') }
  try { pasangTema(localStorage.getItem('gah-tema')) } catch (e) {}
  $('#tema').onclick = () => {
    const gelap = document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches)
    const t = gelap ? 'light' : 'dark'
    pasangTema(t); try { localStorage.setItem('gah-tema', t) } catch (e) {}
  }

  // ---------- audio ----------
  let AC = null
  const ac = () => { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC }
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
  function tutsSuara(m) {
    const a = ac(), t = a.currentTime, g = a.createGain(), f = hz(m)
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3, t + 0.01); g.gain.exponentialRampToValueAtTime(0.12, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 1.4)
    ;[[f, 'triangle', 1], [f * 2, 'sine', 0.25], [f * 3, 'sine', 0.08]].forEach(([fr, ty, v]) => {
      const o = a.createOscillator(), og = a.createGain(); o.type = ty; o.frequency.value = fr; og.gain.value = v
      o.connect(og).connect(g); o.start(t); o.stop(t + 1.5)
    })
    g.connect(a.destination)
  }
  let derauBuf = null
  const derau = () => {
    const a = ac()
    if (!derauBuf) { derauBuf = a.createBuffer(1, a.sampleRate, a.sampleRate); const d = derauBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1 }
    const s = a.createBufferSource(); s.buffer = derauBuf; return s
  }
  const DRUM = {
    kick(t) { const a = ac(), o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14); g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.42); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.45) },
    snare(t) { const a = ac(), n = derau(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = 1200; g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2); n.connect(f).connect(g).connect(a.destination); n.start(t); n.stop(t + 0.22)
      const o = a.createOscillator(), og = a.createGain(); o.type = 'triangle'; o.frequency.value = 185; og.gain.setValueAtTime(0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.1); o.connect(og).connect(a.destination); o.start(t); o.stop(t + 0.12) },
    hat(t) { const a = ac(), n = derau(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05); n.connect(f).connect(g).connect(a.destination); n.start(t); n.stop(t + 0.06) },
    clap(t) { const a = ac(); [0, 0.012, 0.024].forEach(dt => { const n = derau(), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'bandpass'; f.frequency.value = 1500; g.gain.setValueAtTime(0.6, t + dt); g.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.09); n.connect(f).connect(g).connect(a.destination); n.start(t + dt); n.stop(t + dt + 0.1) }) }
  }

  // ---------- ikon ----------
  const IK = {
    catur: '<path d="M9 21h6M8 18h8l-1-4h-6zM10 14l-1-5h6l-1 5M10 9a2 2 0 1 1 4 0"/>',
    gitar: '<path d="M19 3l2 2-6.5 6.5M14.5 11.5l-1-1M10 9.5c-2.5-1-5 0-5.5 2.5-.4 2 .8 3.4.6 5.1-.2 1.7 1.2 3.4 3.4 2.4 1.7-.8 2.6-2.6 4.6-2.4 2.5.2 3.7-1.6 2.9-4-.6-1.8-2.6-2.6-4.4-3.4z"/><circle cx="10.5" cy="14.5" r="1.4"/>',
    piano: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v8M13 5v8M8 13v6M13 13v6M18 5v8"/>',
    drum: '<ellipse cx="12" cy="9" rx="8" ry="3"/><path d="M4 9v6c0 1.7 3.6 3 8 3s8-1.3 8-3V9M8 3l3 5M16 3l-3 5"/>',
    gambar: '<path d="M4 20l1.5-5L16 4.5a2.1 2.1 0 0 1 3 3L8.5 18z"/><path d="M14 7l3 3"/>',
    foto: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
  }
  const ikon = (k, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IK[k]}</svg>`

  // ---------- data hobi ----------
  const HOBI = [
    { id: 'catur', nama: 'Catur', ring: 'Main strategi berdua atau lawan aplikasi. Murah, bisa di mana aja.', modal: 'Gratis (aplikasi) sampai Rp 100 ribuan buat papan', alat: 'Papan catur atau aplikasi', waktu: '10 sampai 30 menit sehari', cocok: 'Yang suka mikir dan nyusun rencana',
      tant: ['Hafalin cara jalan 6 bidak di mode Kenalan bidak', 'Selesaiin 3 puzzle skakmat di sini', 'Main 1 game lawan aplikasi level paling gampang', 'Pelajari aturan rokade', 'Main 1 game lawan teman', 'Pelajari skakmat pakai raja dan benteng', 'Main 3 game, catat 1 kesalahan tiap game'] },
    { id: 'gitar', nama: 'Gitar', ring: 'Genjreng lagu favorit pakai 4 sampai 6 kunci dasar.', modal: 'Kisaran Rp 500 ribu sampai Rp 1,5 juta (gitar akustik pemula)', alat: 'Gitar akustik dan pick', waktu: '15 sampai 30 menit sehari', cocok: 'Yang suka nyanyi dan nongkrong bareng',
      tant: ['Kenalan nama 6 senar (E A D G B e)', 'Hafalin kunci C dan G', 'Tambah kunci Am dan Em', 'Pindah C ke G 10 kali tanpa berhenti', 'Main progresi C, G, Am, F di mode Latihan', 'Pelajari kunci D', 'Mainin 1 lagu pakai kunci yang udah kamu bisa'] },
    { id: 'piano', nama: 'Piano', ring: 'Dari tangga nada sampai lagu pertama, pakai keyboard di rumah.', modal: 'Kisaran Rp 1 juta sampai Rp 3 juta (keyboard 61 tuts)', alat: 'Keyboard atau piano digital', waktu: '15 sampai 30 menit sehari', cocok: 'Yang sabar dan suka musik',
      tant: ['Temuin semua tuts C di keyboard', 'Mainin tangga nada C naik turun', 'Mainin Bintang Kecil versi tangga nada di mode Ikutin lagu', 'Mainin Ode to Joy sampai habis', 'Latih tangan kiri: C, F, G bergantian', 'Mainin Ode to Joy tanpa liat petunjuk', 'Rekam diri sendiri mainin 1 lagu'] },
    { id: 'drum', nama: 'Drum', ring: 'Rasain groove dulu pakai pad dan sequencer sebelum beli stik.', modal: 'Rp 50 ribuan (stik dan practice pad) sampai jutaan (drum elektrik)', alat: 'Stik, practice pad, atau aplikasi', waktu: '15 sampai 30 menit sehari', cocok: 'Yang energik dan suka ritme',
      tant: ['Pukul keempat pad dan kenalan sama suaranya', 'Mainin preset Rock dasar, ikutin pakai tangan di meja', 'Bikin beat sendiri di sequencer', 'Naikin tempo jadi 120 dan tetap rapi', 'Bikin beat disko sendiri tanpa preset', 'Ketuk ritme lagu favorit di meja selama 2 menit', 'Bikin 2 beat berbeda dan bandingin'] },
    { id: 'gambar', nama: 'Menggambar', ring: 'Mulai dari coretan 60 detik. Ga harus bagus, yang penting rutin.', modal: 'Hampir gratis (kertas dan pensil)', alat: 'Pensil, kertas, atau aplikasi gambar', waktu: '10 sampai 20 menit sehari', cocok: 'Yang suka visual dan tenang',
      tant: ['Gambar 1 tema acak dalam 60 detik', 'Gambar gelas di meja kamu', 'Gambar tangan kamu sendiri', 'Gambar 3 tema acak berturut-turut', 'Gambar wajah pakai 10 garis aja', 'Gambar pemandangan dari jendela', 'Kumpulin 7 gambar minggu ini dan bandingin hari 1 sama hari 7'] },
    { id: 'foto', nama: 'Fotografi', ring: 'Ngerti aperture, shutter, dan ISO. Cukup pakai kamera HP buat mulai.', modal: 'Gratis pakai HP (mode pro) sampai jutaan buat kamera', alat: 'HP dengan mode pro atau kamera', waktu: '15 sampai 30 menit sehari', cocok: 'Yang suka jalan-jalan dan ngeliat detail',
      tant: ['Selesaiin misi Exposure pas di simulator', 'Selesaiin misi Orang lari tetap tajam', 'Selesaiin misi Background blur', 'Foto 5 benda di rumah pakai mode pro HP', 'Foto 1 objek bergerak pakai shutter cepat', 'Foto saat matahari terbenam', 'Pilih 3 foto terbaik minggu ini'] }
  ]
  const byId = id => HOBI.find(h => h.id === id)
  const progres = id => (S.tant[id] || []).filter(Boolean).length

  // ---------- router ----------
  let bersih = []
  const tambahBersih = f => bersih.push(f)
  function render() {
    bersih.forEach(f => { try { f() } catch (e) {} }); bersih = []
    const h = (location.hash || '#beranda').slice(1)
    if (h === 'kuis') kuis()
    else if (byId(h)) halHobi(byId(h))
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
          <p class="lead">Ga perlu beli alat dulu. Coba main catur, genjreng gitar, pencet piano, bikin beat drum, gambar, atau belajar motret langsung di sini. Kalau cocok, lanjut tantangan 7 hari.</p>
          <div class="aksi"><a class="btn merek" href="#kuis">Cari hobi yang cocok</a><a class="btn garis" href="#daftar">Liat semua hobi</a></div>
        </div>
        <div class="kartu hero-demo">
          <span class="label">Coba sekarang · pencet tutsnya</span>
          <div id="demo-piano"></div>
          <p class="kecil redup" style="margin-top:8px">Di laptop bisa pakai keyboard: A S D F G H J K.</p>
        </div>
      </section>
      <div class="sek-judul" id="daftar"><h2>6 hobi yang bisa langsung dicoba</h2><span class="redup kecil">Semua ada mainan interaktif dan tantangan 7 hari</span></div>
      <div class="grid-hobi">${HOBI.map(h => `
        <a class="kartu k-hobi" href="#${h.id}">
          <span class="ikon">${ikon(h.id)}</span>
          <h3>${h.nama}</h3>
          <p>${h.ring}</p>
          <div class="meta"><span>${h.waktu.split(' sehari')[0]}</span></div>
          <div><div class="kecil redup" style="margin-bottom:4px">Tantangan ${progres(h.id)}/7</div><div class="prog"><i style="width:${progres(h.id) / 7 * 100}%"></i></div></div>
        </a>`).join('')}
      </div>`
    piano($('#demo-piano'), 60, 72, null)
    $('a[href="#daftar"]').onclick = e => { e.preventDefault(); $('#daftar').scrollIntoView({ behavior: 'smooth' }) }
  }

  // ---------- kuis ----------
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
      const urut = HOBI.map(h => [h, skor[h.id] || 0]).sort((a, b) => b[1] - a[1])
      const [top, ...lain] = urut
      S.kuis = top[0].id; simpan()
      hal.innerHTML = `<div class="kuis"><span class="label">Hasil kuis</span>
        <h1 style="margin-top:8px">Coba <span style="color:var(--merek)">${top[0].nama.toLowerCase()}</span> dulu.</h1>
        <p class="redup" style="margin-top:8px">${top[0].ring} Cocok buat ${top[0].cocok.toLowerCase()}.</p>
        <div class="aksi" style="margin-top:16px"><a class="btn merek" href="#${top[0].id}">Coba ${top[0].nama.toLowerCase()} sekarang</a><a class="btn garis" href="#kuis" id="ulang">Ulang kuis</a></div>
        <div class="sek-judul"><h2 style="font-size:19px">Alternatif lain</h2></div>
        <div class="grid-hobi">${lain.slice(0, 2).map(([h]) => `<a class="kartu k-hobi" href="#${h.id}"><span class="ikon">${ikon(h.id)}</span><h3>${h.nama}</h3><p>${h.ring}</p></a>`).join('')}</div></div>`
      $('#ulang').onclick = e => { e.preventDefault(); kuis() }
    }
    tampil()
  }

  // ---------- halaman hobi ----------
  const MAIN = {}
  function halHobi(h) {
    const t = S.tant[h.id] || []
    hal.innerHTML = `
      <a class="balik" href="#beranda">← Semua hobi</a>
      <div class="h-atas"><div><span class="label">${ikon(h.id, 16)} Hobi</span><h1 style="margin-top:6px">${h.nama}</h1><p>${h.ring}</p></div></div>
      <div class="lay-hobi">
        <section class="kartu pad main"><h3>Coba sekarang</h3><div id="mainan"></div></section>
        <div style="display:grid;gap:14px">
          <section class="kartu pad tant"><h3>Tantangan 7 hari</h3>
            <div class="kecil redup" id="tant-info"></div><div class="pbar"><i id="tant-bar"></i></div>
            <ol>${h.tant.map((x, k) => `<li class="${t[k] ? 'selesai' : ''}"><label><input type="checkbox" data-k="${k}" ${t[k] ? 'checked' : ''}><span><span class="hari">Hari ${k + 1}</span>${x}</span></label></li>`).join('')}</ol>
          </section>
          <section class="kartu pad info"><h3>Sebelum mulai</h3><dl><dt>Modal</dt><dd>${h.modal}</dd><dt>Alat</dt><dd>${h.alat}</dd><dt>Waktu</dt><dd>${h.waktu}</dd><dt>Cocok buat</dt><dd>${h.cocok}</dd></dl></section>
        </div>
      </div>`
    const segarTant = () => { const n = progres(h.id); $('#tant-info').textContent = n === 7 ? 'Tujuh hari beres. Keren, hobi baru resmi kamu punya.' : `${n} dari 7 hari selesai`; $('#tant-bar').style.width = n / 7 * 100 + '%' }
    $$('.tant input').forEach(c => c.onchange = () => { S.tant[h.id] = S.tant[h.id] || []; S.tant[h.id][+c.dataset.k] = c.checked; simpan(); c.closest('li').classList.toggle('selesai', c.checked); segarTant() })
    segarTant()
    MAIN[h.id]($('#mainan'))
  }
  const tabs = (el, daftar, pilih) => {
    el.innerHTML = `<div class="tab-baris">${daftar.map((d, k) => `<button class="chip" data-k="${k}" aria-pressed="${k === 0}">${d}</button>`).join('')}</div><div class="isi-tab"></div>`
    const isi = $('.isi-tab', el)
    $$('.tab-baris .chip', el).forEach(b => b.onclick = () => { $$('.tab-baris .chip', el).forEach(x => x.setAttribute('aria-pressed', x === b)); bersih.forEach(f => { try { f() } catch (e) {} }); bersih = []; pilih(+b.dataset.k, isi) })
    pilih(0, isi)
  }

  // ---------- catur ----------
  const GLIF = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
  const NAMA_B = { k: 'Raja', q: 'Ratu', r: 'Benteng', b: 'Gajah', n: 'Kuda', p: 'Pion' }
  const CARA = { k: 'Raja jalan 1 kotak ke segala arah. Kalau raja diskak dan ga bisa kabur, itu skakmat.', q: 'Ratu paling kuat: lurus dan miring sejauh apa pun.', r: 'Benteng jalan lurus, maju mundur atau ke samping, sejauh apa pun.', b: 'Gajah jalan miring sejauh apa pun, jadi selalu di warna kotak yang sama.', n: 'Kuda jalan bentuk L: 2 kotak lurus lalu 1 ke samping. Satu-satunya yang bisa loncatin bidak lain.', p: 'Pion maju 1 kotak (2 kotak di langkah pertama), tapi makannya miring.' }
  const PUZZLE = [
    { w: { g1: 'k', a1: 'r' }, b: { g8: 'k', f7: 'p', g7: 'p', h7: 'p' }, sol: ['a1', 'a8'], hint: 'Raja hitam kekunci pionnya sendiri. Benteng bisa jalan jauh.' },
    { w: { f6: 'k', a7: 'q' }, b: { h8: 'k' }, sol: ['a7', 'g7'], hint: 'Ratu butuh dijagain raja biar ga bisa dimakan.' },
    { w: { a1: 'k', a7: 'r', b1: 'r' }, b: { h8: 'k' }, sol: ['b1', 'b8'], hint: 'Satu benteng udah ngunci baris 7. Benteng satunya tinggal kasih skak.' }
  ]
  const KOL = 'abcdefgh'
  const sq = (c, r) => KOL[c] + (r + 1)
  const pos = s => [KOL.indexOf(s[0]), +s[1] - 1]
  function langkah(papan, dari) {
    const [c, r] = pos(dari), bd = papan[dari], hasil = []
    const isi = s => papan[s], lawan = s => papan[s] && papan[s].w !== bd.w
    const dlm = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8
    const geser = arah => arah.forEach(([dx, dy]) => { let x = c + dx, y = r + dy; while (dlm(x, y)) { const s = sq(x, y); if (isi(s)) { if (lawan(s)) hasil.push(s); break } hasil.push(s); x += dx; y += dy } })
    const lompat = arah => arah.forEach(([dx, dy]) => { const x = c + dx, y = r + dy; if (dlm(x, y)) { const s = sq(x, y); if (!isi(s) || lawan(s)) hasil.push(s) } })
    const L = [[1, 0], [-1, 0], [0, 1], [0, -1]], D = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    if (bd.t === 'r') geser(L); if (bd.t === 'b') geser(D); if (bd.t === 'q') geser([...L, ...D]); if (bd.t === 'k') lompat([...L, ...D])
    if (bd.t === 'n') lompat([[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]])
    if (bd.t === 'p') { const m = bd.w ? 1 : -1; if (dlm(c, r + m) && !isi(sq(c, r + m))) { hasil.push(sq(c, r + m)); const awal = bd.w ? 1 : 6; if (r === awal && !isi(sq(c, r + 2 * m))) hasil.push(sq(c, r + 2 * m)) }
      ;[-1, 1].forEach(dx => { if (dlm(c + dx, r + m) && lawan(sq(c + dx, r + m))) hasil.push(sq(c + dx, r + m)) }) }
    return hasil
  }
  function gambarPapan(el, papan, pilih, bisa, klik) {
    let h = ''
    for (let r = 7; r >= 0; r--) for (let c = 0; c < 8; c++) {
      const s = sq(c, r), bd = papan[s], gl = (c + r) % 2 === 0
      h += `<button class="ptk ${gl ? 'gl' : ''} ${s === pilih ? 'pilih' : ''} ${bisa.includes(s) ? 'bisa' + (bd ? ' makan' : '') : ''}" data-s="${s}" aria-label="${s}${bd ? ' ' + NAMA_B[bd.t] + (bd.w ? ' putih' : ' hitam') : ''}">${bd ? `<span class="${bd.w ? 'bidak-p' : 'bidak-h'}">${GLIF[bd.t]}&#xFE0E;</span>` : ''}${c === 0 ? `<span class="koord">${r + 1}</span>` : ''}</button>`
    }
    el.innerHTML = `<div class="papan">${h}</div>`
    $$('.ptk', el).forEach(b => b.onclick = () => klik(b.dataset.s))
  }
  MAIN.catur = el => tabs(el, ['Kenalan bidak', 'Puzzle skakmat'], (k, isi) => {
    if (k === 0) {
      let tipe = 'n', papan, pilih = null
      const atur = () => { papan = {}; if (tipe === 'p') { papan.d2 = { t: 'p', w: true }; papan.e3 = { t: 'p', w: false } } else { papan.d4 = { t: tipe, w: true }; papan.f6 = { t: 'p', w: false } }; pilih = tipe === 'p' ? 'd2' : 'd4'; gambar() }
      isi.innerHTML = `<div class="tab-baris" id="bidak">${Object.keys(NAMA_B).map(t => `<button class="chip" data-t="${t}" aria-pressed="${t === tipe}">${GLIF[t]}&#xFE0E; ${NAMA_B[t]}</button>`).join('')}</div><div id="pp"></div><p class="kecil" id="cara" style="margin-top:10px"></p><p class="kecil redup">Pencet titik buat jalanin bidaknya. Bidak hitam bisa dimakan.</p>`
      const gambar = () => { $('#cara', isi).textContent = CARA[tipe]; gambarPapan($('#pp', isi), papan, pilih, pilih && papan[pilih] && papan[pilih].w ? langkah(papan, pilih) : [], s => {
        if (pilih && langkah(papan, pilih).includes(s)) { papan[s] = papan[pilih]; delete papan[pilih]; pilih = s; petik(hz(64), 0, 0.12) } else if (papan[s] && papan[s].w) pilih = s; else pilih = null
        gambar() }) }
      $$('#bidak .chip', isi).forEach(b => b.onclick = () => { tipe = b.dataset.t; $$('#bidak .chip', isi).forEach(x => x.setAttribute('aria-pressed', x === b)); atur() })
      atur()
    } else {
      let n = 0, papan, pilih = null, beres = false
      const muat = () => { const P = PUZZLE[n]; papan = {}; Object.entries(P.w).forEach(([s, t]) => papan[s] = { t, w: true }); Object.entries(P.b).forEach(([s, t]) => papan[s] = { t, w: false }); pilih = null; beres = false; tampil('') }
      isi.innerHTML = `<div class="kecil" style="margin-bottom:8px"><b id="pz-judul"></b> · Putih jalan, skakmat dalam 1 langkah.</div><div id="pp"></div><div class="pesan" id="pz-pesan"></div><div class="aksi" style="margin-top:8px"><button class="btn garis kecil-btn" id="pz-hint">Petunjuk</button><button class="btn garis kecil-btn" id="pz-ulang">Ulang</button><button class="btn utama kecil-btn" id="pz-next">Puzzle berikutnya</button></div>`
      const pesan = (t, kls) => { const p = $('#pz-pesan', isi); p.textContent = t; p.className = 'pesan ' + (kls || '') }
      const tampil = msg => { $('#pz-judul', isi).textContent = `Puzzle ${n + 1} dari ${PUZZLE.length}`; if (msg !== undefined) pesan(msg); gambarPapan($('#pp', isi), papan, pilih, pilih ? langkah(papan, pilih) : [], s => {
        if (beres) return
        if (pilih && langkah(papan, pilih).includes(s)) {
          const [a, b] = PUZZLE[n].sol
          if (pilih === a && s === b) { papan[s] = papan[pilih]; delete papan[pilih]; pilih = null; beres = true; tampil(); pesan('Skakmat! Raja hitam ga bisa kabur ke mana-mana.', 'ok'); petik(hz(67)); petik(hz(71), 0.08); petik(hz(74), 0.16) }
          else { pilih = null; tampil(); pesan('Belum skakmat. Raja hitam masih bisa kabur, coba lagi.', 'salah') }
        } else { pilih = papan[s] && papan[s].w ? s : null; tampil() } }) }
      $('#pz-hint', isi).onclick = () => pesan(PUZZLE[n].hint)
      $('#pz-ulang', isi).onclick = muat
      $('#pz-next', isi).onclick = () => { n = (n + 1) % PUZZLE.length; muat() }
      muat()
    }
  })

  // ---------- gitar ----------
  const SENAR = [40, 45, 50, 55, 59, 64] // E2 A2 D3 G3 B3 E4
  const NAMA_S = ['E', 'A', 'D', 'G', 'B', 'e']
  const KUNCI_G = { C: [-1, 3, 2, 0, 1, 0], G: [3, 2, 0, 0, 0, 3], Am: [-1, 0, 2, 2, 1, 0], Em: [0, 2, 2, 0, 0, 0], D: [-1, -1, 0, 2, 3, 2], F: [-1, -1, 3, 2, 1, 1] }
  function fretboard(el, jari, onSel) {
    let h = '<div class="fret-wrap"><div class="fret">'
    for (let s = 5; s >= 0; s--) {
      h += `<div class="sel nol" data-s="${s}" data-f="0" style="--tebal:${1 + (5 - s) * 0.5}px">${jari[s] === -1 ? '×' : NAMA_S[s]}</div>`
      for (let f = 1; f <= 5; f++) h += `<div class="sel" data-s="${s}" data-f="${f}" style="--tebal:${1 + (5 - s) * 0.5}px">${jari[s] === f ? `<span class="jari">${f}</span>` : ''}</div>`
    }
    h += '</div><div class="nomor-fret"><span></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div></div>'
    el.innerHTML = h
    $$('.sel', el).forEach(c => c.onclick = () => onSel(+c.dataset.s, +c.dataset.f))
  }
  const genjreng = (el, jari) => { jari.forEach((f, s) => { if (f >= 0) petik(hz(SENAR[s] + f), s * 0.028) }); $$('.sel', el).forEach(c => { c.classList.remove('getar'); void c.offsetWidth; if (jari[+c.dataset.s] >= 0) c.classList.add('getar') }) }
  MAIN.gitar = el => tabs(el, ['Kunci dasar', 'Main bebas', 'Latihan pindah kunci'], (k, isi) => {
    if (k === 0) {
      let kc = 'C'
      isi.innerHTML = `<div class="tab-baris" id="kc">${Object.keys(KUNCI_G).map(x => `<button class="chip" data-k="${x}" aria-pressed="${x === kc}">${x}</button>`).join('')}</div><div id="fb"></div><div class="aksi" style="margin-top:12px"><button class="btn merek" id="jreng">Genjreng ${kc}</button></div><p class="kecil redup" style="margin-top:10px">Angka di bulatan = nomor fret. × artinya senar itu ga dibunyiin. Pencet senar buat dengerin satu-satu.</p>`
      const g = () => { fretboard($('#fb', isi), KUNCI_G[kc], (s) => { const f = KUNCI_G[kc][s]; if (f >= 0) petik(hz(SENAR[s] + f)) }); $('#jreng', isi).textContent = 'Genjreng ' + kc }
      $$('#kc .chip', isi).forEach(b => b.onclick = () => { kc = b.dataset.k; $$('#kc .chip', isi).forEach(x => x.setAttribute('aria-pressed', x === b)); g(); genjreng($('#fb', isi), KUNCI_G[kc]) })
      $('#jreng', isi).onclick = () => genjreng($('#fb', isi), KUNCI_G[kc])
      g()
    } else if (k === 1) {
      const jari = [0, 0, 0, 0, 0, 0]
      isi.innerHTML = `<div id="fb"></div><div class="aksi" style="margin-top:12px"><button class="btn merek" id="jreng">Genjreng</button><button class="btn garis" id="reset">Lepas semua</button></div><p class="kecil redup" style="margin-top:10px">Pencet kotak buat naruh jari (satu per senar). Pencet nama senar buat bunyi tanpa ditekan, pencet lagi buat matiin senar.</p>`
      const g = () => fretboard($('#fb', isi), jari, (s, f) => { if (f === 0) jari[s] = jari[s] === 0 ? -1 : 0; else jari[s] = jari[s] === f ? 0 : f; g(); if (jari[s] >= 0) petik(hz(SENAR[s] + jari[s])) })
      $('#jreng', isi).onclick = () => genjreng($('#fb', isi), jari)
      $('#reset', isi).onclick = () => { jari.fill(0); g() }
      g()
    } else {
      const prog = ['C', 'G', 'Am', 'F']; let bpm = 70, ix = 0, ketuk = 0, jalan = null
      isi.innerHTML = `<div class="tab-baris" id="urut">${prog.map((x, i) => `<span class="chip" data-i="${i}">${x}</span>`).join('')}</div><div id="fb"></div>
        <div class="kontrol"><button class="btn merek" id="main">Mulai</button><label class="kecil">Tempo <input type="range" id="bpm" min="50" max="110" value="70"> <b id="bpm-n">70</b> bpm</label></div><p class="kecil redup" style="margin-top:10px">Tiap kunci 4 ketukan. Ikutin pindah jari pas kuncinya ganti.</p>`
      const tampil = () => { fretboard($('#fb', isi), KUNCI_G[prog[ix]], () => {}); $$('#urut .chip', isi).forEach(c => c.setAttribute('aria-pressed', +c.dataset.i === ix)) }
      const tik = () => { if (ketuk === 0) { tampil(); genjreng($('#fb', isi), KUNCI_G[prog[ix]]) } else petik(hz(76), 0, 0.06); ketuk = (ketuk + 1) % 4; if (ketuk === 0) ix = (ix + 1) % prog.length }
      const stop = () => { clearInterval(jalan); jalan = null; $('#main', isi).textContent = 'Mulai' }
      $('#main', isi).onclick = () => { if (jalan) return stop(); ac(); ix = 0; ketuk = 0; tik(); jalan = setInterval(tik, 60000 / bpm); $('#main', isi).textContent = 'Berhenti' }
      $('#bpm', isi).oninput = e => { bpm = +e.target.value; $('#bpm-n', isi).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 60000 / bpm) } }
      tambahBersih(stop); tampil()
    }
  })

  // ---------- piano ----------
  const NOTA = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const TOMBOL = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ';': 76 }
  let pianoAktif = null
  addEventListener('keydown', e => { if (e.repeat || !pianoAktif || e.metaKey || e.ctrlKey || /input|textarea/i.test(e.target.tagName)) return; const m = TOMBOL[e.key.toLowerCase()]; if (m !== undefined) pianoAktif(m) })
  function piano(el, dari, sampai, onNada) {
    const putih = [], hitam = []
    for (let m = dari; m <= sampai; m++) (NOTA[m % 12].includes('#') ? hitam : putih).push(m)
    const lebar = 100 / putih.length
    el.innerHTML = `<div class="piano">${putih.map(m => `<button class="tuts" data-m="${m}" aria-label="${NOTA[m % 12]}${Math.floor(m / 12) - 1}">${NOTA[m % 12]}</button>`).join('')}${hitam.map(m => { const iPutih = putih.indexOf(m - 1); return `<button class="tuts hitam" data-m="${m}" style="left:calc(${(iPutih + 1) * lebar}% - 12px)" aria-label="${NOTA[m % 12]}${Math.floor(m / 12) - 1}"></button>` }).join('')}</div>`
    const tekan = m => { const b = $(`.tuts[data-m="${m}"]`, el); if (!b) return; tutsSuara(m); b.classList.add('tekan'); setTimeout(() => b.classList.remove('tekan'), 180); if (onNada) onNada(m) }
    $$('.tuts', el).forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); tekan(+b.dataset.m) }))
    pianoAktif = tekan
    tambahBersih(() => { if (pianoAktif === tekan) pianoAktif = null })
    return { tandai: m => { $$('.tuts', el).forEach(b => b.classList.toggle('next', +b.dataset.m === m)) } }
  }
  const LAGU = {
    'Tangga nada C': [60, 62, 64, 65, 67, 69, 71, 72],
    'Bintang Kecil': [60, 60, 67, 67, 69, 69, 67, 65, 65, 64, 64, 62, 62, 60],
    'Ode to Joy': [64, 64, 65, 67, 67, 65, 64, 62, 60, 60, 62, 64, 64, 62, 62]
  }
  MAIN.piano = el => tabs(el, ['Ikutin lagu', 'Main bebas'], (k, isi) => {
    if (k === 1) { isi.innerHTML = '<div id="pn"></div><p class="kecil redup" style="margin-top:10px">Di laptop: A S D F G H J K buat tuts putih, W E T Y U buat tuts hitam.</p>'; piano($('#pn', isi), 60, 83, null); return }
    let judul = 'Tangga nada C', ix = 0
    isi.innerHTML = `<div class="tab-baris" id="lagu">${Object.keys(LAGU).map(x => `<button class="chip" data-l="${x}" aria-pressed="${x === judul}">${x}</button>`).join('')}</div><div class="not-baris" id="not"></div><div id="pn"></div><div class="pesan" id="pn-pesan"></div>`
    const notBaris = () => { $('#not', isi).innerHTML = LAGU[judul].map((m, i) => `<span class="${i < ix ? 'udah' : i === ix ? 'kini' : ''}">${NOTA[m % 12]}</span>`).join('') }
    const pesan = (t, kls) => { const p = $('#pn-pesan', isi); p.textContent = t; p.className = 'pesan ' + (kls || '') }
    let pn
    const mulai = () => { ix = 0; notBaris(); pn = piano($('#pn', isi), 60, 72, m => {
      const L = LAGU[judul]; if (ix >= L.length) return
      if (m === L[ix]) { ix++; pesan(''); if (ix === L.length) { pesan(`Mantap, ${judul} selesai! Pilih lagu lain atau ulang.`, 'ok'); pn.tandai(-1) } else pn.tandai(L[ix]) }
      else pesan(`Ups, harusnya ${NOTA[L[ix] % 12]}. Cari tuts yang ditandain oranye.`, 'salah')
      notBaris() }); pn.tandai(LAGU[judul][0]) }
    $$('#lagu .chip', isi).forEach(b => b.onclick = () => { judul = b.dataset.l; $$('#lagu .chip', isi).forEach(x => x.setAttribute('aria-pressed', x === b)); pesan(''); mulai() })
    mulai()
  })

  // ---------- drum ----------
  const BARIS = [['kick', 'Kick'], ['snare', 'Snare'], ['hat', 'Hi-hat'], ['clap', 'Clap']]
  const PRESET = {
    'Rock dasar': { kick: [1, 0, 0, 0, 1, 0, 0, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [1, 1, 1, 1, 1, 1, 1, 1], clap: [0, 0, 0, 0, 0, 0, 0, 0] },
    'Disko': { kick: [1, 0, 1, 0, 1, 0, 1, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [0, 1, 0, 1, 0, 1, 0, 1], clap: [0, 0, 1, 0, 0, 0, 1, 0] },
    'Santai': { kick: [1, 0, 0, 1, 0, 0, 1, 0], snare: [0, 0, 1, 0, 0, 0, 1, 0], hat: [1, 0, 1, 0, 1, 0, 1, 1], clap: [0, 0, 0, 0, 0, 0, 0, 1] },
    'Kosong': { kick: [0, 0, 0, 0, 0, 0, 0, 0], snare: [0, 0, 0, 0, 0, 0, 0, 0], hat: [0, 0, 0, 0, 0, 0, 0, 0], clap: [0, 0, 0, 0, 0, 0, 0, 0] }
  }
  MAIN.drum = el => {
    let pola = JSON.parse(JSON.stringify(PRESET['Rock dasar'])), bpm = 96, langkahKe = 0, jalan = null
    el.innerHTML = `<div class="pads">${BARIS.map(([k, n], i) => `<button class="pad-d" data-k="${k}">${n}<br><span class="kecil redup">${i + 1}</span></button>`).join('')}</div>
      <div class="tab-baris" id="pre">${Object.keys(PRESET).map((x, i) => `<button class="chip" data-p="${x}" aria-pressed="${i === 0}">${x}</button>`).join('')}</div>
      <div class="seq" id="seq"></div>
      <div class="kontrol"><button class="btn merek" id="main">Mainin beat</button><label class="kecil">Tempo <input type="range" id="bpm" min="60" max="160" value="96"> <b id="bpm-n">96</b> bpm</label></div>
      <p class="kecil redup" style="margin-top:10px">Pencet pad buat mukul (atau tombol 1 sampai 4). Nyalain kotak di sequencer buat bikin pola sendiri.</p>`
    const pukul = k => { DRUM[k](ac().currentTime); const p = $(`.pad-d[data-k="${k}"]`, el); p.classList.add('pukul'); setTimeout(() => p.classList.remove('pukul'), 110) }
    $$('.pad-d', el).forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); pukul(b.dataset.k) }))
    const kb = e => { const i = '1234'.indexOf(e.key); if (i >= 0 && !e.repeat) pukul(BARIS[i][0]) }
    addEventListener('keydown', kb); tambahBersih(() => removeEventListener('keydown', kb))
    const seq = () => { $('#seq', el).innerHTML = BARIS.map(([k, n]) => `<span class="nm">${n}</span>${pola[k].map((v, i) => `<button class="${v ? 'on' : ''}" data-k="${k}" data-i="${i}" aria-label="${n} ketukan ${i + 1}" aria-pressed="${!!v}"></button>`).join('')}`).join('')
      $$('#seq button', el).forEach(b => b.onclick = () => { const r = pola[b.dataset.k]; r[+b.dataset.i] = r[+b.dataset.i] ? 0 : 1; seq(); if (r[+b.dataset.i]) DRUM[b.dataset.k](ac().currentTime) }) }
    const tik = () => { const t = ac().currentTime; BARIS.forEach(([k]) => { if (pola[k][langkahKe]) DRUM[k](t) }); $$('#seq button', el).forEach(b => b.classList.toggle('jalan', +b.dataset.i === langkahKe)); langkahKe = (langkahKe + 1) % 8 }
    const stop = () => { clearInterval(jalan); jalan = null; $('#main', el).textContent = 'Mainin beat'; $$('#seq button', el).forEach(b => b.classList.remove('jalan')) }
    $('#main', el).onclick = () => { if (jalan) return stop(); langkahKe = 0; tik(); jalan = setInterval(tik, 30000 / bpm); $('#main', el).textContent = 'Berhenti' }
    $('#bpm', el).oninput = e => { bpm = +e.target.value; $('#bpm-n', el).textContent = bpm; if (jalan) { clearInterval(jalan); jalan = setInterval(tik, 30000 / bpm) } }
    $$('#pre .chip', el).forEach(b => b.onclick = () => { pola = JSON.parse(JSON.stringify(PRESET[b.dataset.p])); $$('#pre .chip', el).forEach(x => x.setAttribute('aria-pressed', x === b)); seq() })
    tambahBersih(stop); seq()
  }

  // ---------- menggambar ----------
  const TEMA = ['kucing lagi tidur', 'gelas kopi', 'sepatu kamu', 'pohon di depan rumah', 'wajah teman pakai 5 garis', 'rumah impian', 'awan bentuk hewan', 'tangan kamu sendiri', 'motor lewat', 'makanan favorit', 'kursi di kamar', 'bulan dan bintang', 'ikan di akuarium', 'payung pas hujan']
  const WARNA = ['#0E1525', '#D85A30', '#F5A300', '#378ADD', '#1D9E75', '#7F77DD', '#E84D7A', '#FFFFFF']
  MAIN.gambar = el => {
    el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px"><div><span class="label">Tema</span><div class="prompt" id="tema-g">tekan Acak tema</div></div><div style="display:flex;gap:8px;align-items:center"><span class="timer" id="timer">60</span><button class="btn merek kecil-btn" id="mulai">Mulai 60 detik</button></div></div>
      <div class="kanvas-wrap"><canvas id="kv" width="900" height="600" aria-label="Kanvas gambar"></canvas></div>
      <div class="kontrol"><div class="warna-baris" id="wr">${WARNA.map((w, i) => `<button style="background:${w}" data-w="${w}" aria-label="Warna ${w === '#FFFFFF' ? 'putih (penghapus)' : w}" aria-pressed="${i === 0}"></button>`).join('')}</div>
      <label class="kecil">Tebal <input type="range" id="tebal" min="2" max="30" value="6"></label></div>
      <div class="aksi" style="margin-top:10px"><button class="btn garis kecil-btn" id="acak">Acak tema</button><button class="btn garis kecil-btn" id="undo">Urungkan</button><button class="btn garis kecil-btn" id="hapus">Bersihin</button><button class="btn garis kecil-btn" id="simpan">Simpan gambar</button></div>
      <div class="pesan" id="g-pesan"></div>`
    const kv = $('#kv', el), cx = kv.getContext('2d'); let warna = WARNA[0], gambarNyala = false, riwayat = [], waktu = null
    const kosong = () => { cx.fillStyle = '#fff'; cx.fillRect(0, 0, kv.width, kv.height) }
    kosong(); cx.lineCap = 'round'; cx.lineJoin = 'round'
    const titik = e => { const r = kv.getBoundingClientRect(); return [(e.clientX - r.left) * kv.width / r.width, (e.clientY - r.top) * kv.height / r.height] }
    kv.addEventListener('pointerdown', e => { kv.setPointerCapture(e.pointerId); riwayat.push(cx.getImageData(0, 0, kv.width, kv.height)); if (riwayat.length > 20) riwayat.shift(); gambarNyala = true; const [x, y] = titik(e); cx.strokeStyle = warna; cx.lineWidth = +$('#tebal', el).value * (warna === '#FFFFFF' ? 2 : 1); cx.beginPath(); cx.moveTo(x, y); cx.lineTo(x + 0.1, y); cx.stroke() })
    kv.addEventListener('pointermove', e => { if (!gambarNyala) return; const [x, y] = titik(e); cx.lineTo(x, y); cx.stroke() })
    const selesai = () => { gambarNyala = false }
    kv.addEventListener('pointerup', selesai); kv.addEventListener('pointercancel', selesai)
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
      kosong(); riwayat = []; let sisa = 60; $('#timer', el).textContent = sisa; $('#g-pesan', el).textContent = ''; $('#mulai', el).textContent = 'Berhenti'
      waktu = setInterval(() => { sisa--; $('#timer', el).textContent = sisa; if (sisa <= 0) { henti(); const p = $('#g-pesan', el); p.textContent = 'Waktu habis! Ga harus bagus, yang penting jadi. Simpan atau coba tema lain.'; p.className = 'pesan ok' } }, 1000)
    }
    tambahBersih(henti)
  }

  // ---------- fotografi ----------
  const AP = [1.8, 2.8, 4, 5.6, 8, 11, 16], SH = [15, 30, 60, 125, 250, 500, 1000], ISO = [100, 200, 400, 800, 1600, 3200, 6400]
  const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")"
  const MISI = [
    { n: 'Exposure pas', d: 'Bikin meternya pas di tengah (hijau).', cek: (a, s, i, e) => Math.abs(e) < 0.5 },
    { n: 'Orang lari tetap tajam', d: 'Shutter 1/500 atau lebih cepat, exposure tetap pas.', cek: (a, s, i, e) => SH[s] >= 500 && Math.abs(e) < 0.5 },
    { n: 'Background blur', d: 'Aperture f/2.8 atau lebih kecil angkanya, exposure tetap pas.', cek: (a, s, i, e) => AP[a] <= 2.8 && Math.abs(e) < 0.5 },
    { n: 'Foto bersih tanpa bintik', d: 'ISO 200 atau lebih rendah, exposure tetap pas.', cek: (a, s, i, e) => ISO[i] <= 200 && Math.abs(e) < 0.5 }
  ]
  MAIN.foto = el => {
    let a = 3, s = 3, i = 0, misi = 0
    el.innerHTML = `<div class="tab-baris" id="misi">${MISI.map((m, k) => `<button class="chip" data-k="${k}" aria-pressed="${k === 0}">${m.n}</button>`).join('')}</div>
      <p class="kecil" id="misi-d" style="margin-bottom:10px"></p>
      <div class="foto" id="foto"><div class="lap langit"></div><div class="lap gunung"></div><div class="lap tanah"></div><div class="lap bunga"></div><div class="lap orang"></div><div class="lap noise" style="background-image:${NOISE}"></div></div>
      <div class="meter" id="meter">${[-3, -2, -1, 0, 1, 2, 3].map(v => `<span data-v="${v}"></span>`).join('')}</div>
      <div class="kecil" id="status" style="text-align:center;font-weight:700"></div>
      <div class="slider-baris"><span class="kecil">Aperture</span><input type="range" id="ap" min="0" max="6" value="${a}" aria-label="Aperture"><b id="ap-n"></b></div>
      <div class="slider-baris"><span class="kecil">Shutter</span><input type="range" id="sh" min="0" max="6" value="${s}" aria-label="Kecepatan shutter"><b id="sh-n"></b></div>
      <div class="slider-baris"><span class="kecil">ISO</span><input type="range" id="iso" min="0" max="6" value="${i}" aria-label="ISO"><b id="iso-n"></b></div>
      <div class="aksi" style="margin-top:8px"><button class="btn merek" id="jepret">Jepret!</button></div><div class="pesan" id="f-pesan"></div>
      <p class="kecil redup" style="margin-top:8px">Aperture kecil (f/1.8) = cahaya banyak dan background blur. Shutter cepat = gerakan beku tapi gelap. ISO tinggi = terang tapi berbintik.</p>`
    const ev = () => Math.log2((1 / SH[s]) * ISO[i] / (AP[a] * AP[a])) - Math.log2((1 / 250) * 400 / (5.6 * 5.6))
    const segar = () => {
      const e = ev(), ce = Math.max(-3, Math.min(3, e))
      $('#ap-n', el).textContent = 'f/' + AP[a]; $('#sh-n', el).textContent = '1/' + SH[s]; $('#iso-n', el).textContent = ISO[i]
      const f = $('#foto', el)
      f.style.filter = `brightness(${Math.pow(2, ce * 0.55).toFixed(2)})`
      const blurBg = Math.max(0, 1.6 * (1 / AP[a] - 1 / 16) * 6)
      ;['.langit', '.gunung', '.tanah'].forEach(k => $(k, f).style.filter = `blur(${blurBg.toFixed(1)}px)`)
      const gerak = Math.min(7, 120 / SH[s])
      $('.orang', f).style.filter = `blur(${(gerak * 0.6).toFixed(1)}px)`; $('.orang', f).style.transform = `scaleX(${(1 + gerak * 0.12).toFixed(2)})`
      $('.noise', f).style.opacity = (Math.log2(ISO[i] / 100) / 6 * 0.85).toFixed(2)
      const r = Math.round(ce)
      $$('#meter span', el).forEach(m => { const v = +m.dataset.v; m.className = v === r ? (v === 0 ? 'nol' : 'on') : '' })
      $('#status', el).textContent = Math.abs(e) < 0.5 ? 'Pas' : e < 0 ? 'Terlalu gelap' : 'Terlalu terang'
      $('#misi-d', el).textContent = MISI[misi].d
    }
    $('#ap', el).oninput = e => { a = +e.target.value; segar() }
    $('#sh', el).oninput = e => { s = +e.target.value; segar() }
    $('#iso', el).oninput = e => { i = +e.target.value; segar() }
    $$('#misi .chip', el).forEach(b => b.onclick = () => { misi = +b.dataset.k; $$('#misi .chip', el).forEach(x => x.setAttribute('aria-pressed', x === b)); $('#f-pesan', el).textContent = ''; segar() })
    $('#jepret', el).onclick = () => {
      const f = $('#foto', el); f.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 220 })
      try { const o = ac(), n = derau(), g = o.createGain(), t = o.currentTime; g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07); n.connect(g).connect(o.destination); n.start(t); n.stop(t + 0.08) } catch (e) {}
      const ok = MISI[misi].cek(a, s, i, ev()), p = $('#f-pesan', el)
      p.textContent = ok ? `Berhasil! Misi "${MISI[misi].n}" beres.` : 'Belum pas. Cek meter dan syarat misinya, terus coba lagi.'; p.className = 'pesan ' + (ok ? 'ok' : 'salah')
    }
    segar()
  }

  render()
})()
