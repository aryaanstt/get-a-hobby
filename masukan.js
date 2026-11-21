// Tombol dan form "Kasih masukan" (dipakai bareng get a hobby dan get a health).
// Masukan masuk ke tabel public.masukan di Supabase (insert-only, ga bisa dibaca pengunjung).
// Atur lewat window.MASUKAN_CFG = { produk, jenis: [[kode, label], ...], contoh } sebelum file ini dimuat.
(() => {
  const C = window.MASUKAN_CFG || {}
  const PRODUK = C.produk || 'hobby'
  const JENIS = C.jenis || [['bidang', 'Topik baru'], ['fitur', 'Ide fitur'], ['error', 'Ada yang error'], ['lainnya', 'Lainnya']]
  const SB_URL = 'https://wtfshyfgcrglknogjgfb.supabase.co'
  const SB_KEY = 'sb_publishable_-vUvZe04JtPTTGfF6LEY6A_y0l1n_Ff'
  let sb = null
  try { if (window.self === window.top && window.supabase && window.supabase.createClient) sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false, storageKey: 'gas-masukan' } }) } catch (e) { sb = null }

  const gaya = document.createElement('style')
  gaya.textContent = `
  .msk-btn { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; color: var(--ink-2); background: none; border: 0; cursor: pointer }
  .msk-btn:hover { background: var(--panel-2) }
  .msk-latar { position: fixed; inset: 0; z-index: 400; display: grid; place-items: center; padding: max(16px, env(safe-area-inset-top, 0px)) max(16px, env(safe-area-inset-right, 0px)) max(16px, env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); background: rgba(0, 0, 0, .45) }
  .msk { width: min(480px, 100%); max-height: 100%; overflow-y: auto; background: var(--panel); color: var(--ink); border: 1px solid var(--garis-ui); border-radius: 18px; padding: 20px; display: grid; gap: 12px; font: 15px/1.5 var(--f-teks) }
  .msk h2 { font: 800 22px/1.15 var(--f-judul); margin: 0; letter-spacing: -.02em }
  .msk p { margin: 0 }
  .msk .msk-redup { color: var(--redup); font-size: 13.5px }
  .msk .msk-jenis { display: flex; flex-wrap: wrap; gap: 6px }
  .msk .msk-jenis button { min-height: 34px; padding: 0 12px; border-radius: 99px; border: 1px solid var(--garis-kuat); background: var(--panel); color: var(--ink); font: 650 13px/1 var(--f-teks); cursor: pointer }
  .msk .msk-jenis button[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink) }
  .msk label { display: grid; gap: 6px; font-size: 13px; font-weight: 650 }
  .msk textarea, .msk input { font: inherit; color: inherit; width: 100%; border-radius: 12px; border: 1px solid var(--garis-kuat); background: var(--panel-2); padding: 10px 12px }
  .msk textarea { min-height: 110px; resize: vertical }
  .msk .msk-tombol { display: flex; justify-content: flex-end; gap: 8px }
  .msk .msk-tombol button { min-height: 42px; padding: 0 16px; border-radius: 12px; font: 700 14px/1 var(--f-teks); cursor: pointer; border: 1px solid var(--garis-kuat); background: var(--panel); color: var(--ink) }
  .msk .msk-tombol .msk-kirim { background: var(--merek-isi); border-color: transparent; color: #fff }
  .msk .msk-kirim:disabled { opacity: .5; cursor: default }
  .msk .msk-pesan { font-size: 14px; font-weight: 600; min-height: 20px }
  .msk .msk-pesan.ok { color: var(--ok) } .msk .msk-pesan.salah { color: var(--bad) }`
  document.head.appendChild(gaya)

  const buka = () => {
    let jenis = JENIS[0][0]
    const w = document.createElement('div')
    w.className = 'msk-latar'
    w.innerHTML = `<form class="msk" role="dialog" aria-modal="true" aria-labelledby="msk-judul" novalidate>
      <h2 id="msk-judul">Kasih masukan</h2>
      <p class="msk-redup">${C.ajakan || 'Ide, yang kurang, atau ada yang error. Semua masukan dibaca.'}</p>
      <div class="msk-jenis" role="radiogroup" aria-label="Jenis masukan">${JENIS.map(([k, n]) => `<button type="button" role="radio" data-k="${k}" aria-pressed="${k === jenis}">${n}</button>`).join('')}</div>
      <label>Ceritain<textarea name="isi" maxlength="2000" placeholder="${C.contoh || 'Tulis di sini'}"></textarea></label>
      <label>Email atau kontak <span class="msk-redup">(opsional, kalau mau dikabarin)</span><input name="kontak" maxlength="120" autocomplete="email"></label>
      <p class="msk-pesan" aria-live="polite"></p>
      <div class="msk-tombol"><button type="button" class="msk-batal">Tutup</button><button class="msk-kirim">Kirim masukan</button></div>
    </form>`
    document.body.appendChild(w)
    const f = w.querySelector('form'), pesan = w.querySelector('.msk-pesan'), kirim = w.querySelector('.msk-kirim')
    const tutup = () => { w.remove(); document.removeEventListener('keydown', esc) }
    const esc = e => { if (e.key === 'Escape') tutup() }
    document.addEventListener('keydown', esc)
    w.addEventListener('click', e => { if (e.target === w) tutup() })
    w.querySelector('.msk-batal').onclick = tutup
    w.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { jenis = b.dataset.k; w.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-pressed', x === b)) })
    setTimeout(() => f.isi.focus(), 30)
    f.onsubmit = async e => {
      e.preventDefault()
      const isi = f.isi.value.trim(), kontak = f.kontak.value.trim()
      pesan.className = 'msk-pesan'; pesan.textContent = ''
      if (isi.length < 3) { pesan.className = 'msk-pesan salah'; pesan.textContent = 'Tulis masukannya dulu, minimal beberapa kata.'; return }
      if (!sb) { pesan.className = 'msk-pesan salah'; pesan.textContent = 'Masukan ga bisa dikirim dari halaman ini (koneksi ke server diblok).'; return }
      kirim.disabled = true
      try {
        const { error } = await sb.from('masukan').insert({ produk: PRODUK, jenis, isi: isi.slice(0, 2000), kontak: kontak ? kontak.slice(0, 120) : null, halaman: (location.hash || '#').slice(0, 120) })
        if (error) throw error
        pesan.className = 'msk-pesan ok'; pesan.textContent = 'Makasih, masukan kamu udah terkirim.'
        f.isi.value = ''; kirim.textContent = 'Terkirim'
        setTimeout(tutup, 1600)
      } catch (err) {
        kirim.disabled = false
        pesan.className = 'msk-pesan salah'
        pesan.textContent = /fetch|network|load failed/i.test((err && err.message) || '') ? 'Koneksi bermasalah. Coba lagi bentar.' : 'Masukan gagal dikirim. Coba lagi bentar.'
      }
    }
  }

  // Tombol ikon di header, sebelum tombol tema.
  const pasang = () => {
    const tema = document.getElementById('tema')
    if (!tema || document.getElementById('msk-btn')) return
    const b = document.createElement('button')
    b.id = 'msk-btn'; b.className = 'msk-btn'; b.type = 'button'
    b.setAttribute('aria-label', 'Kasih masukan'); b.title = 'Kasih masukan'
    b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>'
    b.onclick = buka
    tema.parentNode.insertBefore(b, tema)
  }
  pasang()
  window.bukaMasukan = buka
})()
