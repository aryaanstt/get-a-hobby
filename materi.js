// Materi kursus get a hobby. Urutan bab ngikutin kursus pemula sampai menengah yang beneran dipakai orang:
// catur ala chess.com (dasar, prinsip, pembukaan, jebakan, taktik, endgame), gitar ala JustinGuitar (open chord, ganti kunci, strumming)
// lanjut power chord, barre, fingerpicking; piano ala metode pemula (posisi C, baca not) lanjut teori (setengah nada, tangga nada, interval, inversi, pedal);
// drum ala Drumeo (grip, rudimen, beat, fill) lanjut notasi, 16-an, aksen dan ghost note; menggambar ala Drawabox (garis, elips, kotak)
// lanjut kontur, ruang negatif, proporsi, arsir, bayangan; fotografi dari exposure, WB, komposisi, cahaya lanjut histogram, metering, DoF, lensa, edit.
// Semua teks ditulis ulang sendiri.
const K = (q, ops, b, k) => ({ q, ops, b, k })
window.MATERI = {
  catur: [
    { bab: 'Dasar permainan', pel: [
      { id: 'bidak', judul: 'Cara jalan tiap bidak', isi: ['Catur dimainin di papan 8 × 8. Tiap pemain punya 16 bidak: 1 raja, 1 ratu, 2 benteng, 2 gajah, 2 kuda, dan 8 pion. Putih selalu jalan duluan, dan kotak pojok kanan bawah tiap pemain selalu warna terang.', 'Pilih bidak di bawah, terus pencet titik-titiknya buat liat ke mana aja dia bisa jalan. Bidak hitam di papan bisa dimakan.'], alat: { t: 'bidak' } },
      { id: 'tujuan', judul: 'Skak, skakmat, dan remis', isi: ['<b>Skak</b> artinya raja lagi diserang. Kamu wajib nyelamatin raja di langkah berikutnya: geser raja, tutup jalurnya, atau makan bidak yang nyerang.', '<b>Skakmat</b> artinya raja diserang dan ga ada cara nyelamatin. Itu akhir permainan.', '<b>Remis</b> (seri) bisa terjadi karena <i>stalemate</i> (giliran jalan tapi ga punya langkah legal dan ga lagi diskak), posisi sama terulang 3 kali, 50 langkah tanpa makan bidak atau gerakin pion, atau bidak yang tersisa ga cukup buat skakmat.'], alat: { t: 'kuis', soal: [
        K('Raja kamu lagi diskak. Mana yang GA boleh?', ['Geser raja ke kotak aman', 'Tutup jalur skak pakai bidak lain', 'Jalanin pion lain tanpa nyelamatin raja'], 2, 'Kalau raja diskak, langkah kamu wajib nyelamatin raja.'),
        K('Lawan ga punya langkah legal, tapi rajanya ga diskak. Hasilnya?', ['Kamu menang', 'Remis (stalemate)', 'Lawan menang'], 1, 'Itu stalemate, hasilnya seri.'),
        K('Sisa raja + gajah lawan raja doang. Hasilnya?', ['Pasti menang', 'Remis, bidaknya ga cukup buat skakmat', 'Harus main 50 langkah dulu'], 1, 'Raja + satu gajah (atau satu kuda) ga bisa maksa skakmat.')] } },
      { id: 'khusus', judul: 'Tiga aturan khusus', isi: ['<b>Rokade</b>: raja geser 2 kotak ke arah benteng, terus benteng loncat ke sisi sebelahnya. Syaratnya raja dan benteng belum pernah jalan, kotak di antaranya kosong, dan raja ga lagi diskak, ga ngelewatin, atau mendarat di kotak yang diserang.', '<b>Promosi</b>: pion yang nyampe baris terakhir wajib berubah jadi ratu, benteng, gajah, atau kuda. Hampir selalu ratu.', '<b>En passant</b>: kalau pion lawan maju 2 kotak dan berhenti persis di samping pion kamu, pion kamu boleh makan dia seolah dia cuma maju 1 kotak. Kesempatannya cuma di langkah berikutnya.'], alat: { t: 'kuis', soal: [
        K('Kapan kamu ga boleh rokade?', ['Raja udah pernah jalan', 'Ratu masih di papan', 'Udah lewat langkah ke-10'], 0, 'Rokade butuh raja dan benteng yang belum pernah jalan.'),
        K('Pion kamu nyampe baris terakhir. Dia jadi apa?', ['Tetap pion', 'Ratu, benteng, gajah, atau kuda (pilih)', 'Otomatis raja kedua'], 1, 'Promosi bebas pilih, biasanya ratu.')] } },
      { id: 'notasi', judul: 'Cara baca notasi catur', isi: ['Kolom dinamain huruf <b>a sampai h</b> (kiri ke kanan dari sisi putih), baris dinamain angka <b>1 sampai 8</b>. Tiap kotak punya nama, misalnya e4.', 'Bidak ditulis pakai huruf Inggris: <b>K</b> raja, <b>Q</b> ratu, <b>R</b> benteng, <b>B</b> gajah, <b>N</b> kuda. Pion ga pakai huruf. Contoh: <b>Nf3</b> = kuda ke f3, <b>e4</b> = pion ke e4.', '<b>x</b> = makan (Bxc6), <b>+</b> = skak, <b>#</b> = skakmat, <b>O-O</b> = rokade pendek, <b>O-O-O</b> = rokade panjang. Tanda <b>!</b> langkah bagus, <b>?</b> kesalahan, <b>??</b> blunder.'], alat: { t: 'kuis', soal: [
        K('Arti "Qxf7#"?', ['Ratu makan di f7, skakmat', 'Ratu ke f7, skak', 'Raja makan di f7'], 0, 'Q = ratu, x = makan, # = skakmat.'),
        K('"O-O-O" artinya...', ['Rokade pendek', 'Rokade panjang (ke sisi ratu)', 'Remis'], 1, 'Tiga O = rokade panjang.'),
        K('"Nbd2" artinya...', ['Kuda dari kolom b ke d2', 'Gajah ke d2', 'Pion b ke d2'], 0, 'Huruf b dipakai buat bedain kuda mana yang jalan.')] } },
      { id: 'nilai', judul: 'Nilai bidak dan tukar-menukar', isi: ['Patokan umum nilai bidak: <b>pion 1, kuda 3, gajah 3, benteng 5, ratu 9</b>. Raja ga dihitung karena ga bisa ditukar.', 'Dipakai buat mutusin tukar-menukar: kasih kuda (3) buat dapet benteng (5) itu untung, namanya menang <i>exchange</i>.', 'Ini cuma patokan. Bidak aktif di posisi bagus bisa lebih berharga dari angkanya.'], alat: { t: 'kuis', soal: [
        K('Kamu kasih gajah, dapet benteng. Hasilnya?', ['Rugi 2', 'Untung 2', 'Impas'], 1, 'Benteng 5 dikurangi gajah 3 = untung 2.'),
        K('Ratu ditukar sama 2 benteng. Hitungannya?', ['Ratu lebih untung', '2 benteng (10) sedikit lebih banyak dari ratu (9)', 'Sama persis'], 1, '5 + 5 = 10 lawan 9.'),
        K('Mana yang paling berharga?', ['Kuda', 'Gajah', 'Benteng'], 2, 'Benteng 5, kuda dan gajah 3.')] } }
    ] },
    { bab: 'Prinsip pembukaan', pel: [
      { id: 'prinsip', judul: '4 tujuan di awal permainan', isi: ['Kursus pemula biasanya ngajarin empat tujuan di pembukaan:', '1. <b>Kuasai tengah</b> pakai pion (e4, d4, e5, d5).<br>2. <b>Keluarin bidak ringan</b> (kuda dan gajah) sebelum bidak berat.<br>3. <b>Rokade</b> biar raja aman.<br>4. <b>Sambungin benteng</b> dan arahin ke kolom yang kebuka.', 'Kesalahan umum: ngeluarin ratu terlalu cepat, jalanin bidak yang sama berkali-kali, dan kebanyakan jalanin pion pinggir.'], alat: { t: 'kuis', soal: [
        K('Langkah pertama yang paling ngikutin prinsip?', ['1. e4', '1. h4', '1. a3'], 0, 'e4 ngerebut tengah dan buka jalan gajah dan ratu.'),
        K('Udah langkah ke-3, kuda dan gajah belum keluar. Mending?', ['Qh5, serang langsung', 'Nf3 atau Bc4', 'h3 jaga-jaga'], 1, 'Kembangin bidak ringan dulu.'),
        K('Kenapa rokade penting?', ['Biar raja aman dan benteng aktif', 'Biar dapat poin tambahan', 'Wajib sebelum langkah 10'], 0, 'Raja ngumpet, benteng ke tengah.')] } }
    ] },
    { bab: 'Pembukaan populer', pel: [
      { id: 'buka-e4', judul: 'Pembukaan 1.e4: Italia dan Ruy Lopez', isi: ['Dua pembukaan klasik setelah 1.e4 e5 2.Nf3 Nc6. Di <b>Italia</b>, gajah ke c4 ngincar f7. Di <b>Ruy Lopez</b>, gajah ke b5 neken kuda yang jagain e5.', 'Pencet ▶ buat jalanin langkah satu-satu dan baca alasannya. Mode <b>Latihan</b> nyuruh kamu nebak langkahnya sendiri.'], alat: { t: 'buka', daftar: ['italia', 'ruy'] } },
      { id: 'buka-hitam', judul: 'Pertahanan hitam: Sisilia, Prancis, Caro-Kann', isi: ['Kalau kamu main hitam dan lawan buka 1.e4, tiga pertahanan ini paling sering dipakai.', '<b>Sisilia</b> (1...c5) bikin posisi ga seimbang dan tajam. <b>Prancis</b> (1...e6) dan <b>Caro-Kann</b> (1...c6) lebih kokoh: siapin d5 biar tengah ga gampang dijebol.'], alat: { t: 'buka', daftar: ['sisilia', 'prancis', 'caro'] } },
      { id: 'buka-d4', judul: 'Pembukaan 1.d4: Gambit Menteri dan London', isi: ['<b>Gambit Menteri</b> (1.d4 d5 2.c4) nawarin pion c4 buat narik d5 hitam dari tengah.', '<b>Sistem London</b> populer di pemula karena susunannya hampir selalu sama: d4, Bf4, e3, Nf3, c3, Nbd2.'], alat: { t: 'buka', daftar: ['gambit', 'london'] } }
    ] },
    { bab: 'Jebakan pembukaan', pel: [
      { id: 'jebak-cepat', judul: 'Skakmat kilat: Skolar dan Fool’s mate', isi: ['Dua skakmat paling cepat. Wajib kenal biar ga kena.', '<b>Skolar mate</b>: ratu dan gajah bareng nyerang f7. Cara nangkisnya gampang, misalnya 3...g6 atau 3...Qe7.', '<b>Fool’s mate</b>: 2 langkah, terjadi kalau putih buka diagonal raja pakai f3 dan g4.'], alat: { t: 'buka', daftar: ['skolar', 'nangkis', 'fool'] } },
      { id: 'jebak-klasik', judul: 'Jebakan klasik', isi: ['<b>Jebakan Légal</b>: putih "ngorbanin" ratu, kalau diambil langsung skakmat. <b>Blackburne Shilling</b>: hitam pura-pura ngasih pion e5. <b>Englund</b>: hukuman buat putih yang ninggalin b2. <b>Jebakan Gajah</b>: pion d5 yang keliatan gratis ternyata umpan.', 'Pelajaran: sebelum makan bidak "gratis", cek dulu kenapa lawan ngebiarin.'], alat: { t: 'buka', daftar: ['legal', 'blackburne', 'englund', 'gajah'] } }
    ] },
    { bab: 'Taktik', pel: [
      { id: 'taktik', judul: 'Garpu, pin, dan tusuk sate', isi: ['<b>Garpu</b>: satu bidak nyerang dua bidak lawan sekaligus. Kuda paling jago.', '<b>Pin</b>: bidak ga bisa gerak karena di belakangnya ada bidak yang lebih berharga.', '<b>Tusuk sate</b>: bidak berharga di depan diserang, begitu minggir, bidak di belakangnya kemakan.', 'Putih jalan, cari satu langkah terbaik.'], alat: { t: 'puzzle', daftar: ['garpu', 'pin', 'tusuk'] } },
      { id: 'taktik2', judul: 'Serangan buka dan hilangin pembela', isi: ['<b>Serangan buka</b> (discovered attack): satu bidak minggir dan "ngebuka" serangan bidak lain di belakangnya. Kalau bidak yang minggir juga ngancam sesuatu (apalagi skak), lawan ga bisa nangkis dua-duanya.', '<b>Hilangin pembela</b>: bidak lawan yang dijaga bisa dimakan setelah penjaganya disingkirin, lewat tukar, ancaman, atau pengorbanan.', '<b>Defleksi</b> mirip: maksa bidak pembela pindah ke kotak lain.'], alat: { t: 'puzzle', daftar: ['buka', 'pembela'] } },
      { id: 'mat', judul: 'Pola skakmat', isi: ['<b>Baris belakang</b>: raja kekunci pionnya sendiri.<br><b>Tangga</b>: dua benteng gantian ngunci baris.<br><b>Ratu dijagain raja</b>: ratu nempel ke raja lawan, dilindungin raja sendiri.<br><b>Smothered mate</b>: raja ketutup bidaknya sendiri, kuda yang ngeskakmat.'], alat: { t: 'puzzle', daftar: ['mat1', 'mat2', 'mat3', 'mat4'] } },
      { id: 'cek', judul: 'Kebiasaan sebelum jalan: cek, makan, ancam', isi: ['Pemain kuat punya rutinitas tiap giliran. Cek dulu semua <b>skak</b>, semua <b>makan bidak</b>, dan semua <b>ancaman</b>, baik buat kamu maupun lawan.', 'Sebelum langkah kamu dilakuin, tanya: "Setelah ini, bidak mana yang jadi ga dijaga?" Banyak blunder pemula terjadi karena bidak ditinggal ga ada yang jagain.', 'Pas lawan jalan, tanya: "Apa yang dia ancam?"'], alat: { t: 'kuis', soal: [
        K('Urutan cek kandidat langkah yang dianjurin?', ['Skak, makan, ancaman', 'Langkah paling cantik dulu', 'Langsung jalan biar cepat'], 0, 'Langkah paling memaksa dicek duluan.'),
        K('Lawan baru jalan. Hal pertama yang kamu pikirin?', ['Rencana saya sendiri', 'Apa yang dia ancam', 'Bidak mana yang paling mahal'], 1, 'Ancaman lawan dulu, baru rencana kamu.')] } }
    ] },
    { bab: 'Tengah dan akhir permainan', pel: [
      { id: 'rencana', judul: 'Bikin rencana di tengah permainan', isi: ['Setelah pembukaan, cari <b>kelemahan</b> lawan: pion terisolasi, kotak yang ga bisa dijaga pion, atau raja yang belum aman.', 'Perbaiki <b>bidak terburuk</b> kamu: bidak yang paling pasif dipindah ke posisi yang lebih aktif.', 'Benteng suka <b>kolom terbuka</b> (ga ada pionnya). Kuda suka <b>pos</b>, kotak di tengah yang ga bisa diusir pion lawan.'], alat: { t: 'kuis', soal: [
        K('Benteng paling aktif di kolom yang...', ['Penuh pion sendiri', 'Terbuka, ga ada pion', 'Paling pinggir'], 1, 'Kolom terbuka bikin benteng bisa nembus.'),
        K('Ga tau mau ngapain di tengah permainan. Saran paling umum?', ['Gerakin pion pinggir', 'Perbaiki bidak paling pasif', 'Tawarin remis'], 1, 'Aktifin bidak yang paling ga berguna.')] } },
      { id: 'endgame', judul: 'Dasar endgame', isi: ['Pas bidak tinggal sedikit, raja jadi bidak penyerang. Bawa raja ke tengah.', '<b>Ratu + raja vs raja</b>: kecilin ruang gerak raja lawan sampai ke pinggir, terus bawa raja kamu. Hati-hati stalemate.', '<b>Oposisi</b>: dua raja berhadapan dengan 1 kotak di tengah. Yang ga harus jalan duluan, dialah yang pegang oposisi.', '<b>Aturan kotak</b>: buat ngecek raja bisa ngejar pion lolos atau nggak, bayangin kotak dari pion ke baris promosi. Kalau raja bisa masuk kotak itu, pionnya kekejar.'], alat: { t: 'kuis', soal: [
        K('Di endgame, raja sebaiknya...', ['Tetap ngumpet', 'Maju ke tengah dan ikut nyerang', 'Ditukar sama ratu'], 1, 'Aktifin raja.'),
        K('Tinggal ratu + raja vs raja. Bahaya terbesar?', ['Kalah waktu', 'Stalemate', 'Ratu kemakan pion'], 1, 'Sisain kotak buat raja lawan selama belum skakmat.'),
        K('Raja lawan bisa masuk "kotak" pion kamu. Artinya?', ['Pion pasti promosi', 'Raja bisa ngejar pionnya', 'Remis otomatis'], 1, 'Aturan kotak buat ngitung kejar-kejaran.')] } },
      { id: 'latihan', judul: 'Cara latihan yang efektif', isi: ['Kombinasi paling sering disaranin: <b>puzzle taktik tiap hari</b> (10 sampai 15 menit), <b>main game dengan waktu cukup lama</b> (minimal 10 menit per pemain), dan <b>ngecek ulang game</b> setelah main.', 'Pas ngecek ulang, cari momen pertama kamu salah. Catat polanya. Biasanya kesalahan pemula itu-itu aja.', 'Kuis harian di halaman ini bantu ngulang materi biar ga lupa.'], alat: { t: 'kuis', soal: [
        K('Mana yang paling ngebantu naik level buat pemula?', ['Hafalin 20 pembukaan', 'Puzzle taktik rutin dan ngecek ulang game', 'Main 1 menit terus'], 1, 'Taktik dan evaluasi kesalahan paling cepat ngangkat level.')] } }
    ] }
  ],
  gitar: [
    { bab: 'Persiapan', pel: [
      { id: 'kenal', judul: 'Kenalan gitar dan nama senar', isi: ['Senar dari yang paling tebal ke paling tipis: <b>E A D G B e</b>. Bikin kalimat sendiri biar gampang inget.', '<b>Fret</b> itu kotak di leher gitar. Makin dekat ke badan gitar, nadanya makin tinggi. Tiap pindah satu fret = naik setengah nada.', 'Pencet nama senar buat dengerin nada senar terbuka. Ini patokan nyetem.'], alat: { t: 'senar' } },
      { id: 'posisi', judul: 'Cara megang dan nekan senar', isi: ['Tekan pakai <b>ujung jari</b>, posisinya <b>dekat fret</b>. Jempol kiri di belakang leher gitar, jangan nyengkram kenceng.', 'Ujung jari sakit di minggu pertama itu normal. Latihan pendek tapi sering.', 'Tangan kanan: genjreng pakai pick atau kuku, gerakannya dari pergelangan, bukan dari siku.'], alat: { t: 'kuis', soal: [
        K('Biar bunyi bersih, jari nekan di mana?', ['Tengah kotak fret', 'Dekat batang fret', 'Di atas batang fret'], 1, 'Dekat fret = ringan dan bersih.'),
        K('Satu fret itu beda nada berapa?', ['Setengah nada', 'Satu nada penuh', 'Satu oktaf'], 0, 'Tiap fret naik setengah nada.')] } }
    ] },
    { bab: 'Kunci pertama', pel: [
      { id: 'ade', judul: 'Kunci A, D, dan E', isi: ['Banyak kursus pemula (termasuk JustinGuitar) mulai dari <b>A, D, dan E</b>. Bentuknya ramah buat jari yang belum terbiasa.', 'Pasang jari satu-satu, genjreng, cek tiap senar bunyi. Senar bertanda × jangan dibunyiin.'], alat: { t: 'kunci', daftar: ['A', 'D', 'E'] } },
      { id: 'omc', judul: 'Latihan ganti kunci 1 menit', isi: ['<b>One minute changes</b>: pilih dua kunci, ganti bolak-balik selama 1 menit, hitung tiap perpindahan yang bunyi bersih. Target awal sekitar 30.', 'Pegang gitar beneran, pencet "Ganti!" tiap kali berhasil pindah.'], alat: { t: 'omc' } }
    ] },
    { bab: 'Ritme', pel: [
      { id: 'strum', judul: 'Pola genjreng (strumming)', isi: ['Mulai dari <b>4 kali genjreng ke bawah</b> tiap birama. Lanjut ke pola populer: <b>D, DU, UDU</b>.', 'Tangan kanan terus gerak naik turun kayak bandul walaupun ada ketukan yang ga kena senar.'], alat: { t: 'strum' } },
      { id: 'tab', judul: 'Cara baca tab gitar', isi: ['<b>Tab</b> (tablature) itu cara nulis lagu gitar paling umum. Ada 6 garis, garis paling <b>atas = senar e tipis</b>, paling bawah = E tebal.', 'Angka di garis = nomor fret yang ditekan di senar itu. <b>0</b> = senar terbuka. Dibaca dari kiri ke kanan.', 'Pencet "Mainin" buat dengerin contoh tab dan liat jarinya di fretboard.'], alat: { t: 'tab' } }
    ] },
    { bab: 'Kunci lainnya', pel: [
      { id: 'minor', judul: 'Kunci minor: Am, Em, Dm', isi: ['Kunci minor bunyinya lebih sendu. Em paling gampang, cuma 2 jari.'], alat: { t: 'kunci', daftar: ['Am', 'Em', 'Dm'] } },
      { id: 'gcf', judul: 'Kunci G, C, dan F versi gampang', isi: ['<b>G</b> dan <b>C</b> ada di hampir semua lagu. <b>F</b> asli butuh barre, jadi pemula pakai F versi 4 senar dulu.'], alat: { t: 'kunci', daftar: ['G', 'C', 'F'] } },
      { id: 'progresi', judul: 'Progresi C, G, Am, F', isi: ['Empat kunci ini dipakai di ratusan lagu pop. Mulai di tempo pelan.'], alat: { t: 'progresi' } }
    ] },
    { bab: 'Naik level', pel: [
      { id: 'power', judul: 'Power chord dan palm muting', isi: ['<b>Power chord</b> cuma 2 sampai 3 senar: nada dasar plus nada ke-5. Bentuknya sama di mana pun di leher gitar, jadi tinggal digeser. Bunyinya netral (bukan mayor atau minor), andalan musik rock.', '<b>Palm muting</b>: sisi telapak tangan kanan nempel tipis di senar dekat jembatan gitar. Bunyinya jadi "dug-dug" tebal dan pendek.'], alat: { t: 'kunci', daftar: ['E5', 'A5', 'G5'] } },
      { id: 'barre', judul: 'Kunci barre: F dan Bm', isi: ['Di kunci <b>barre</b>, jari telunjuk nekan semua senar di satu fret, kayak jadi capo. Ini rintangan besar pertama buat banyak pemula, jadi wajar kalau butuh berminggu-minggu.', 'Tipsnya: pakai sisi telunjuk yang agak keras, posisi telunjuk dekat batang fret, siku agak masuk, dan latih pelan-pelan.', 'Bentuk barre bisa digeser: bentuk F di fret 3 jadi G, di fret 5 jadi A.'], alat: { t: 'kunci', daftar: ['Fb', 'Bm'] } },
      { id: 'capo', judul: 'Capo dan ganti nada dasar', isi: ['<b>Capo</b> dijepit di satu fret dan bikin semua senar naik nadanya. Kamu tetap pakai bentuk kunci yang sama, tapi bunyinya lebih tinggi.', 'Rumus: tiap fret naik setengah nada. Bentuk G dengan capo fret 2 bunyinya A.', 'Berguna buat nyesuain lagu sama suara penyanyi tanpa belajar kunci baru.'], alat: { t: 'kuis', soal: [
        K('Capo di fret 2, kamu main bentuk C. Bunyinya?', ['C', 'D', 'E'], 1, 'C naik 2 setengah nada = D.'),
        K('Capo dipakai buat...', ['Nyetem gitar', 'Naikin nada tanpa ganti bentuk kunci', 'Biar senar ga putus'], 1, 'Bentuk kunci tetap, nadanya naik.'),
        K('Bentuk G, capo fret 3. Bunyinya?', ['A', 'A#', 'B'], 1, 'G → G# → A → A#.')] } },
      { id: 'fingerpick', judul: 'Fingerpicking dasar', isi: ['Fingerpicking pakai jari, bukan pick. Jempol (<b>p</b>) mainin senar bass (E, A, D), telunjuk (<b>i</b>) senar G, tengah (<b>m</b>) senar B, manis (<b>a</b>) senar e.', 'Pola dasar: bass, lalu G, B, e satu-satu (p i m a). Pegang kunci, dengerin polanya di bawah, terus tiru pelan-pelan.'], alat: { t: 'petik' } },
      { id: 'teori-g', judul: 'Kenapa kunci-kunci ini cocok bareng', isi: ['Lagu biasanya pakai kunci dari satu <b>tangga nada</b>. Di nada dasar C, kunci utamanya: <b>C (I), F (IV), G (V)</b>, plus <b>Am (vi)</b>. Di nada dasar G: <b>G, C, D</b>, plus <b>Em</b>.', 'Makanya progresi I, V, vi, IV (C, G, Am, F) kedengerannya enak dan dipakai di banyak lagu.', 'Kalau tau nada dasar lagu, kamu bisa nebak kunci-kunci yang kemungkinan muncul.'], alat: { t: 'kuis', soal: [
        K('Di nada dasar G, kunci IV-nya?', ['C', 'D', 'Em'], 0, 'G A B C: urutan ke-4 = C.'),
        K('Progresi I, V, vi, IV di nada C?', ['C, G, Am, F', 'C, F, G, Am', 'C, Dm, Em, F'], 0, 'I = C, V = G, vi = Am, IV = F.')] } }
    ] }
  ],
  piano: [
    { bab: 'Kenalan tuts', pel: [
      { id: 'geografi', judul: 'Pola tuts hitam dan nada C', isi: ['Tuts hitam selalu ngumpul dalam pola <b>2</b> dan <b>3</b>. Tuts putih persis di kiri kelompok 2 tuts hitam selalu <b>C</b>.', 'Urutan tuts putih: C D E F G A B, balik lagi ke C. C di tengah keyboard namanya <b>middle C</b> (C4).'], alat: { t: 'carinada' } },
      { id: 'kres', judul: 'Tuts hitam: kres (#) dan mol (♭)', isi: ['Jarak dari satu tuts ke tuts persis sebelahnya (termasuk hitam) = <b>setengah nada</b>. Dua kali setengah nada = <b>satu nada</b>.', '<b>Kres (#)</b> = naik setengah nada. <b>Mol (♭)</b> = turun setengah nada. Tuts hitam antara C dan D bisa disebut <b>C#</b> atau <b>D♭</b>, satu tuts dua nama.', 'Antara E dan F, juga antara B dan C, ga ada tuts hitam. Jaraknya cuma setengah nada.'], alat: { t: 'kuis', soal: [
        K('Tuts hitam di antara F dan G namanya?', ['F# atau G♭', 'E#', 'Ga punya nama'], 0, 'Naik dari F = F#, turun dari G = G♭.'),
        K('Jarak E ke F?', ['Setengah nada', 'Satu nada', 'Satu setengah nada'], 0, 'Ga ada tuts hitam di antaranya.'),
        K('C ke D itu...', ['Setengah nada', 'Satu nada', 'Dua nada'], 1, 'Ada tuts hitam di tengah, jadi 2 setengah nada = 1 nada.')] } }
    ] },
    { bab: 'Posisi tangan', pel: [
      { id: 'jari', judul: 'Nomor jari dan posisi C', isi: ['Nomor jari: <b>1 jempol, 2 telunjuk, 3 tengah, 4 manis, 5 kelingking</b>, sama buat dua tangan.', 'Posisi C: jempol kanan di C, jari 2 sampai 5 di D, E, F, G. Jari melengkung, nekan pakai bantalan ujung jari.'], alat: { t: 'nomorjari' } },
      { id: 'lagu', judul: 'Lagu pertama di posisi C', isi: ['Lagu pertama di buku metode biasanya cuma 5 nada posisi C. Ikutin tuts oranye.'], alat: { t: 'lagu' } },
      { id: 'kiri', judul: 'Tangan kiri dan iringan', isi: ['Posisi C tangan kiri: kelingking (5) di C di bawah middle C, jempol (1) di G.', 'Iringan paling dasar: tangan kiri mainin <b>nada dasar akor</b> tiap awal birama, tangan kanan mainin melodi. Lanjutannya: akor penuh tangan kiri, atau pola <b>bas-akor-akor</b> (kayak irama walz).', 'Latih tangan masing-masing dulu sampai lancar, baru digabung pelan-pelan.'], alat: { t: 'kuis', soal: [
        K('Cara paling aman belajar lagu dua tangan?', ['Langsung dua tangan tempo cepat', 'Tiap tangan sendiri dulu, baru digabung pelan', 'Tangan kiri aja'], 1, 'Pisah dulu, gabung pelan.'),
        K('Posisi C tangan kiri, jempol ada di...', ['C', 'G', 'E'], 1, 'Tangan kiri kebalik: 5 di C, 1 di G.')] } }
    ] },
    { bab: 'Baca not', pel: [
      { id: 'paranada', judul: 'Baca not di paranada', isi: ['Paranada (staff) itu 5 garis. <b>Kunci G</b> (treble clef) buat tangan kanan. Middle C ada di garis tambahan di bawah paranada.', 'Garis kunci G dari bawah: <b>E G B D F</b>. Spasinya: <b>F A C E</b>.'], alat: { t: 'bacanot' } },
      { id: 'ritme', judul: 'Ketukan dan nilai not', isi: ['Birama 4/4 = 4 ketukan tiap birama. <b>Not penuh</b> 4 ketukan, <b>setengah</b> 2, <b>seperempat</b> 1, <b>seperdelapan</b> ½.', 'Titik di samping not nambah setengah nilainya: setengah bertitik = 3 ketukan.', 'Hitung keras-keras: "1, 2, 3, 4". Pakai metronom.'], alat: { t: 'kuis', soal: [
        K('Not setengah = berapa ketukan?', ['1', '2', '4'], 1, 'Setengah dari 4.'),
        K('Not setengah bertitik = ?', ['2', '3', '2,5'], 1, '2 + setengahnya (1) = 3.'),
        K('Birama 3/4 isinya berapa ketukan?', ['3', '4', '6'], 0, 'Angka atas = jumlah ketukan per birama.')] } }
    ] },
    { bab: 'Teori dasar', pel: [
      { id: 'tangga', judul: 'Rumus tangga nada mayor', isi: ['Semua tangga nada mayor pakai pola jarak yang sama: <b>1 - 1 - ½ - 1 - 1 - 1 - ½</b> (satu nada, satu nada, setengah, satu, satu, satu, setengah).', 'C mayor cocok sama pola ini tanpa tuts hitam. Kalau mulai dari G, nada ke-7 harus <b>F#</b> biar polanya sama.', 'Penjarian tangan kanan C mayor: 1-2-3, jempol nyelip ke F, lanjut 1-2-3-4-5.'], alat: { t: 'lagu', awal: 'Tangga nada G' } },
      { id: 'interval', judul: 'Interval: jarak antar nada', isi: ['<b>Interval</b> = jarak dua nada, dihitung dari nada bawah termasuk dirinya. C ke E = <b>terts</b> (3), C ke G = <b>kwint</b> (5), C ke C berikutnya = <b>oktaf</b> (8).', 'Interval yang sering dipakai buat ngelatih telinga: terts (manis), kwart (C ke F, kayak awal lagu kebangsaan banyak negara), kwint (kosong dan kuat), oktaf.', 'Dengerin dua nada di bawah, terus tebak intervalnya.'], alat: { t: 'interval' } },
      { id: 'akor', judul: 'Akor dasar C, F, G, Am', isi: ['Akor = 3 nada barengan, dari nada ke-1, 3, 5. <b>C</b> = C E G, <b>F</b> = F A C, <b>G</b> = G B D, <b>Am</b> = A C E.', 'Akor <b>mayor</b> = terts besar (4 setengah nada) lalu terts kecil. Akor <b>minor</b> kebalikannya.'], alat: { t: 'akor' } },
      { id: 'inversi', judul: 'Inversi akor', isi: ['Nada akor bisa disusun ulang. C = C E G (posisi dasar), <b>inversi 1</b> = E G C, <b>inversi 2</b> = G C E.', 'Gunanya: pindah antar akor jadi lebih dekat, tangan ga loncat-loncat. Contoh: C (C E G) ke F inversi 2 (C F A) ke G inversi 1 (B D G).'], alat: { t: 'akor', inversi: true } }
    ] },
    { bab: 'Ekspresi', pel: [
      { id: 'pedal', judul: 'Pedal sustain dan dinamika', isi: ['<b>Pedal sustain</b> (paling kanan) bikin nada tetap bunyi setelah tuts dilepas. Teknik umumnya: injak setelah akor baru dibunyiin, angkat dan injak lagi pas ganti akor, biar suaranya ga numpuk.', '<b>Dinamika</b> = keras lembut. <b>p</b> (piano) = lembut, <b>mp</b> agak lembut, <b>mf</b> agak keras, <b>f</b> (forte) = keras. <i>Crescendo</i> = makin keras, <i>decrescendo</i> = makin lembut.'], alat: { t: 'kuis', soal: [
        K('Tanda "f" di partitur artinya...', ['Lembut', 'Keras', 'Cepat'], 1, 'f = forte = keras.'),
        K('Kapan pedal diangkat lalu diinjak lagi?', ['Tiap ganti akor', 'Ga pernah', 'Tiap 4 lagu'], 0, 'Biar akor lama ga nyampur sama akor baru.'),
        K('Crescendo artinya...', ['Makin lembut', 'Makin keras', 'Berhenti'], 1, 'Pelan-pelan makin keras.')] } }
    ] }
  ],
  drum: [
    { bab: 'Kenalan drum', pel: [
      { id: 'set', judul: 'Bagian-bagian drum set', isi: ['<b>Kick</b> dimainin kaki kanan. <b>Snare</b> di depan kamu. <b>Hi-hat</b> dua simbal yang dibuka tutup kaki kiri. Ada juga <b>tom</b>, <b>crash</b> (aksen), dan <b>ride</b>.', 'Pukul pad di bawah, atau tombol 1 sampai 4.'], alat: { t: 'pad' } },
      { id: 'grip', judul: 'Cara megang stik', isi: ['<b>Matched grip</b>: dua tangan megang stik dengan cara sama. Titik tumpu (<b>fulcrum</b>) di antara jempol dan telunjuk, sekitar sepertiga dari ujung belakang stik.', 'Biarin stik mantul. Tenaga dari pergelangan.'], alat: { t: 'kuis', soal: [
        K('Tenaga pukulan utama dari mana?', ['Bahu', 'Pergelangan tangan', 'Kelingking'], 1, 'Pergelangan bikin pukulan cepat dan ga capek.'),
        K('Setelah mukul, stik sebaiknya...', ['Ditekan', 'Dibiarin mantul', 'Diangkat tinggi'], 1, 'Mantul = bunyi hidup.')] } }
    ] },
    { bab: 'Rudimen', pel: [
      { id: 'rudimen', judul: 'Single, double, paradiddle', isi: ['Rudimen = "alfabet" drum. <b>Single stroke</b>: R L R L. <b>Double stroke</b>: R R L L. <b>Paradiddle</b>: R L R R L R L L.', 'Pencet L dan R (atau F dan J) ngikutin pola. Akurasi dulu, baru kecepatan.'], alat: { t: 'rudimen' } },
      { id: 'rudimen2', judul: 'Double paradiddle dan flam', isi: ['<b>Double paradiddle</b>: R L R L R R L R L R L L. Enak buat fill dengan rasa "6".', '<b>Flam</b>: dua pukulan hampir barengan, satu pelan (grace note) dan satu keras. Ditulis lR (pelan l, keras R). Bunyinya "flam", lebih tebal dari satu pukulan.', 'Latih pakai metronom di tempo pelan.'], alat: { t: 'rudimen', daftar: ['Double paradiddle', 'Single stroke', 'Paradiddle'] } }
    ] },
    { bab: 'Membaca dan menghitung', pel: [
      { id: 'notasi', judul: 'Baca notasi drum', isi: ['Notasi drum pakai paranada 5 garis. Tiap posisi = satu bagian drum. Biasanya: <b>kick</b> di spasi bawah, <b>snare</b> di spasi ketiga dari bawah, <b>hi-hat</b> di atas paranada.', 'Drum ditulis pakai <b>not bulat</b>, simbal (hi-hat, crash, ride) pakai tanda <b>x</b>.', 'Batang not drum umumnya ngadep ke atas semua, termasuk kick.'], alat: { t: 'kuis', soal: [
        K('Tanda "x" di notasi drum biasanya buat...', ['Simbal (hi-hat, crash)', 'Kick', 'Istirahat'], 0, 'Drum pakai not bulat, simbal pakai x.'),
        K('Kick biasanya ditulis di...', ['Atas paranada', 'Bagian bawah paranada', 'Ga ditulis'], 1, 'Kick di spasi bawah.')] } },
      { id: 'enambelas', judul: 'Not 16-an: "1 e & a"', isi: ['Satu ketukan dibagi 4 pukulan = not 16-an. Hitungannya: <b>1 e & a 2 e & a 3 e & a 4 e & a</b>.', 'Not 8-an = "1 & 2 &", not 16-an = "1 e & a". Hitung keras-keras pas latihan.', 'Coba preset <b>16-an hi-hat</b>: hi-hat tiap kotak di tempo pelan kerasa kayak 16-an.'], alat: { t: 'seq', awal: '16-an hi-hat' } }
    ] },
    { bab: 'Beat dan fill', pel: [
      { id: 'beat', judul: 'Beat rock 8-an', isi: ['Hi-hat tiap "1 & 2 & 3 & 4 &", kick di 1 dan 3, snare di 2 dan 4.', 'Nyalain sequencer dan tepuk meja ngikutin.'], alat: { t: 'seq', awal: 'Rock dasar' } },
      { id: 'aksen', judul: 'Aksen dan ghost note', isi: ['<b>Aksen</b> (tanda >) = pukulan lebih keras dari sekitarnya. Bikin beat jadi hidup.', '<b>Ghost note</b> (not dalam kurung) = pukulan snare yang pelan banget, hampir ga kedengeran. Bikin groove funk dan RnB kerasa "ngisi".', 'Kuncinya kontras: aksen jelas keras, ghost note jelas pelan. Pukulan pelan pakai ketinggian stik yang rendah.'], alat: { t: 'kuis', soal: [
        K('Not dalam kurung di notasi snare artinya...', ['Dipukul keras', 'Ghost note (pelan banget)', 'Jangan dipukul'], 1, 'Ghost note = pelan.'),
        K('Cara bikin pukulan pelan yang konsisten?', ['Stik diangkat rendah', 'Pukul ke pinggir drum', 'Pegang stik kenceng'], 0, 'Tinggi stik nentuin kerasnya.')] } },
      { id: 'fill', judul: 'Fill pertama dan variasi', isi: ['<b>Fill</b> = jembatan pendek di akhir frasa, biasanya birama ke-4 atau ke-8.', 'Fill paling gampang: pukulan snare rata, terus pindahin sebagian ke tom.'], alat: { t: 'seq', awal: 'Fill snare' } },
      { id: 'tempo', judul: 'Latihan pakai metronom', isi: ['Drummer itu penjaga tempo band. Latihan pakai <b>metronom</b> dari tempo pelan (60 sampai 70 bpm), naikin 5 bpm kalau udah rapi 4 kali berturut-turut.', 'Rekam latihan kamu. Telinga sering ga sadar tempo kita lari sampai denger rekamannya.', 'Hi-hat <b>dibuka</b> (kaki kiri diangkat) bikin bunyi "tss" panjang, biasanya dipakai di "&" buat beat disko.'], alat: { t: 'seq', awal: 'Disko' } }
    ] }
  ],
  gambar: [
    { bab: 'Garis dan bentuk', pel: [
      { id: 'garis', judul: 'Garis yakin: metode ghosting', isi: ['<b>Ghosting</b> ala Drawabox: 1. <b>Rencanain</b> titik awal dan akhir. 2. <b>Latih gerakan</b> di atas kertas tanpa nyentuh. 3. <b>Eksekusi</b> satu goresan yakin.', 'Gerakin dari <b>bahu</b> biar garis panjang ga melengkung.'], alat: { t: 'garis' } },
      { id: 'elips', judul: 'Lingkaran dan elips', isi: ['Gambar <b>muter 2 sampai 3 kali</b> sebelum ngangkat pensil. Lancar dulu, bentuk nyusul.'], alat: { t: 'elips' } },
      { id: 'kontur', judul: 'Gambar kontur dan kontur buta', isi: ['<b>Gambar kontur</b>: satu garis nyambung yang ngikutin tepi benda, pelan-pelan, mata ngikutin tepi bendanya.', '<b>Kontur buta</b>: sama, tapi mata cuma liat benda, bukan kertas. Hasilnya aneh, tapi ngelatih koordinasi mata dan tangan. Latihan klasik di kelas gambar.', 'Coba gambar tangan kamu sendiri di kanvas ini tanpa ngeliat layar selama 60 detik.'], alat: { t: 'kanvas' } }
    ] },
    { bab: 'Ngeliat bentuk', pel: [
      { id: 'negatif', judul: 'Ruang negatif', isi: ['<b>Ruang negatif</b> = ruang kosong di sekitar dan di antara benda. Misalnya celah di antara kaki kursi.', 'Ngegambar bentuk ruang kosongnya sering lebih gampang daripada bendanya, karena otak ga ngelabelin "ini kursi" dan kita ngegambar apa yang beneran keliatan.', 'Ngecek ruang negatif juga cara cepat nemuin proporsi yang salah.'], alat: { t: 'kuis', soal: [
        K('Ruang negatif itu...', ['Bagian gelap benda', 'Ruang kosong di sekitar dan antara benda', 'Bayangan jatuh'], 1, 'Ruang di luar benda.'),
        K('Kenapa ruang negatif ngebantu?', ['Biar gambar lebih gelap', 'Otak ga sok tau soal bentuk bendanya', 'Biar cepat selesai'], 1, 'Kita ngegambar bentuk yang beneran keliatan.')] } },
      { id: 'proporsi', judul: 'Proporsi: ngukur pakai pensil', isi: ['Ulurin tangan lurus, pegang pensil tegak. Pakai panjang satu bagian benda (misal tinggi kepala) jadi <b>satuan</b>, terus bandingin bagian lain: "lebarnya 2 kepala".', 'Siku harus tetap lurus biar ukurannya konsisten. Merem satu mata.', 'Bisa juga pakai pensil buat ngecek <b>sudut</b> garis miring.'], alat: { t: 'kuis', soal: [
        K('Biar ukuran pakai pensil konsisten, lengan harus...', ['Ditekuk', 'Lurus terus', 'Gerak bebas'], 1, 'Jarak mata ke pensil harus sama terus.'),
        K('Satuan ukur paling enak dipilih dari...', ['Bagian benda yang jelas dan pendek', 'Ukuran kertas', 'Penggaris'], 0, 'Misal tinggi kepala atau lebar jendela.')] } }
    ] },
    { bab: 'Bentuk 3 dimensi', pel: [
      { id: 'perspektif', judul: 'Perspektif 1 titik dan 2 titik', isi: ['Garis sejajar yang menjauh ketemu di <b>titik hilang</b> di garis cakrawala (setinggi mata kamu).', '<b>1 titik</b>: satu sisi ngadep kamu. <b>2 titik</b>: kamu liat sudut kotak.'], alat: { t: 'perspektif' } },
      { id: 'silinder', judul: 'Silinder dan elips dalam perspektif', isi: ['Silinder = dua lingkaran (atas dan bawah) disambung permukaan melengkung. Lingkaran yang diliat dari samping keliatan jadi <b>elips</b>.', 'Makin jauh dari garis cakrawala, elipsnya makin bulet. Elips di bawah mata (misal permukaan gelas di meja) keliatan lebih lebar daripada yang dekat garis mata.', 'Latihan: gambar gelas atau kaleng, mulai dari garis sumbu tengah, terus elips atas dan bawah.'], alat: { t: 'elips' } }
    ] },
    { bab: 'Gelap terang', pel: [
      { id: 'value', judul: 'Value dan arah cahaya', isi: ['<b>Value</b> = tingkat gelap terang. Benda keliatan 3D karena ada sisi terang, bayangan, dan bayangan jatuh. Tentuin arah cahaya dulu sebelum ngarsir.'], alat: { t: 'kuis', soal: [
        K('Cahaya dari kiri atas. Bayangan jatuh ke...', ['Kiri atas', 'Kanan bawah', 'Atas'], 1, 'Berlawanan arah sumber cahaya.'),
        K('Gambar keliatan datar. Kenapa?', ['Kurang warna', 'Kontras gelap terang kurang', 'Kertasnya kecil'], 1, 'Kontras value bikin bentuk bervolume.')] } },
      { id: 'arsir', judul: 'Arsir: hatching dan cross-hatching', isi: ['<b>Hatching</b> = garis-garis sejajar buat bikin gelap. Makin rapat, makin gelap. <b>Cross-hatching</b> = lapisan garis yang nyilang buat bagian lebih gelap.', 'Latihan klasik: <b>skala value 5 kotak</b> dari terang ke gelap. Arsir kotak di bawah dari kiri (paling terang) ke kanan (paling gelap), terus cek nilainya.'], alat: { t: 'arsir' } },
      { id: 'bayangan', judul: 'Bayangan jatuh', isi: ['<b>Bayangan jatuh</b> (cast shadow) paling gelap dan paling tajam di dekat benda, makin jauh makin terang dan buram.', 'Bentuknya ngikutin benda dan arah cahaya: bola bikin bayangan elips, kubus bikin bayangan bersudut.', 'Di benda bulat ada juga <b>bayangan inti</b> (core shadow), bagian paling gelap di benda itu sendiri, dan <b>cahaya pantul</b> yang bikin tepi bayangan agak terang lagi.'], alat: { t: 'kuis', soal: [
        K('Bagian bayangan jatuh yang paling gelap ada di...', ['Paling jauh dari benda', 'Dekat benda', 'Rata semua'], 1, 'Dekat benda paling gelap dan tajam.'),
        K('Bola di lantai, bayangannya berbentuk...', ['Kotak', 'Elips', 'Segitiga'], 1, 'Benda bulat bikin bayangan elips.')] } },
      { id: 'gesture', judul: 'Gambar cepat 60 detik', isi: ['Gambar cepat (gesture) ngelatih nangkep bentuk besar dan gerakan. Ga harus bagus, yang penting rutin.'], alat: { t: 'kanvas' } }
    ] }
  ],
  foto: [
    { bab: 'Exposure', pel: [
      { id: 'segitiga', judul: 'Segitiga exposure', isi: ['<b>Aperture</b> (f/angka): angka kecil = lubang besar, cahaya banyak, background blur. <b>Shutter</b>: cepat bikin gerakan beku. <b>ISO</b>: tinggi = terang tapi berbintik.', 'Ubah satu, imbangin yang lain. Selesaiin misinya.'], alat: { t: 'exposure' } },
      { id: 'mode', judul: 'Mode kamera dan mode pro di HP', isi: ['<b>Auto</b>, <b>A/Av</b> (atur aperture), <b>S/Tv</b> (atur shutter), <b>M</b> (manual). Di HP buka <b>mode Pro</b>. Kalau bisa simpan <b>RAW</b>, pakai buat edit lebih leluasa.'], alat: { t: 'kuis', soal: [
        K('Foto anak lari biar tajam. Mode paling pas?', ['Aperture priority', 'Shutter priority dengan shutter cepat', 'Auto pakai flash'], 1, 'Shutter cepat bikin gerakan beku.'),
        K('Foto malam berbintik. Penyebab paling mungkin?', ['ISO terlalu tinggi', 'Aperture kecil', 'WB salah'], 0, 'ISO tinggi = noise.')] } },
      { id: 'histogram', judul: 'Baca histogram', isi: ['<b>Histogram</b> = grafik sebaran terang gelap foto. Kiri = gelap, kanan = terang, tinggi batang = banyaknya piksel.', 'Grafik numpuk di kiri dan kepotong = <b>underexposed</b> (detail bayangan ilang). Numpuk di kanan dan kepotong = <b>overexposed</b> (bagian terang jadi putih polos).', 'Layar HP bisa nipu pas terik matahari. Histogram ga.'], alat: { t: 'histogram' } },
      { id: 'metering', judul: 'Metering: kamera ngukur cahaya', isi: ['Kamera ngukur cahaya buat nentuin exposure. <b>Evaluative/matrix</b> ngukur seluruh bingkai (default, paling aman). <b>Center-weighted</b> fokus ke tengah. <b>Spot</b> cuma ngukur titik kecil.', 'Kamera ngira semua adegan itu "abu-abu rata-rata". Salju putih jadi keabuan, baju hitam jadi abu-abu. Benerin pakai <b>kompensasi exposure</b> (+/−).', 'Di HP: ketuk wajah buat fokus dan ngukur, terus geser ikon matahari buat nerangin atau ngegelapin.'], alat: { t: 'kuis', soal: [
        K('Foto pemandangan salju jadi keabu-abuan. Solusinya?', ['Kompensasi exposure + (lebih terang)', 'Kompensasi − (lebih gelap)', 'Ganti WB'], 0, 'Kamera ngegelapin salju, jadi tambah exposure.'),
        K('Mode metering buat ngukur wajah orang di depan jendela terang?', ['Evaluative', 'Spot', 'Ga perlu metering'], 1, 'Spot ngukur titik kecil, misalnya wajah.')] } }
    ] },
    { bab: 'Fokus dan lensa', pel: [
      { id: 'dof', judul: 'Depth of field: apa yang bikin background blur', isi: ['<b>Depth of field</b> (DoF) = area yang keliatan tajam. Empat hal yang bikin DoF makin <b>tipis</b> (background makin blur):', '1. Aperture lebih besar (angka f kecil).<br>2. Focal length lebih panjang (zoom).<br>3. Objek lebih dekat ke kamera.<br>4. Sensor lebih besar.', 'Kebalikannya buat pemandangan yang pengen tajam semua: aperture kecil (f/8 sampai f/11).'], alat: { t: 'kuis', soal: [
        K('Mau background blur maksimal. Pilih...', ['f/16, objek jauh', 'f/1.8, objek dekat', 'ISO tinggi'], 1, 'Aperture besar dan dekat = DoF tipis.'),
        K('Foto pemandangan tajam dari depan sampai belakang. Aperture?', ['f/1.8', 'f/8 sampai f/11', 'Ga ngaruh'], 1, 'Aperture kecil = DoF dalam.'),
        K('Mana yang GA ngaruh ke depth of field?', ['Focal length', 'Jarak ke objek', 'White balance'], 2, 'WB cuma soal warna.')] } },
      { id: 'lensa', judul: 'Focal length dan mode fokus', isi: ['<b>Focal length</b> (mm): kecil (14 sampai 35mm) = <b>lebar</b>, buat pemandangan dan ruangan. Sekitar 50mm mirip pandangan mata. 85mm ke atas = <b>tele</b>, buat potret dan objek jauh. Di HP: ganti lensa 0,5×, 1×, 3×.', 'Lensa tele bikin background keliatan lebih "dekat" (kompresi), bagus buat potret.', 'Mode fokus: <b>single/AF-S</b> buat objek diam, <b>continuous/AF-C</b> buat objek bergerak, <b>manual</b> buat kondisi susah (misal lewat kaca).'], alat: { t: 'kuis', soal: [
        K('Potret wajah yang flattering, focal length?', ['14mm', 'Sekitar 85mm', '10mm'], 1, 'Tele pendek bikin proporsi wajah enak.'),
        K('Foto anak lari, mode fokus?', ['Single (AF-S)', 'Continuous (AF-C)', 'Manual'], 1, 'Continuous ngikutin objek bergerak.')] } }
    ] },
    { bab: 'Warna', pel: [
      { id: 'wb', judul: 'White balance', isi: ['Lampu pijar kekuningan, mendung kebiruan. <b>White balance</b> (Kelvin) bikin putih tetap putih. Siang ~5500K, mendung ~6500K, lampu pijar ~3200K.'], alat: { t: 'wb' } },
      { id: 'edit', judul: 'Edit dasar', isi: ['Urutan edit yang umum: 1. <b>Luruskan dan crop</b>. 2. <b>Exposure</b> (terang gelap keseluruhan). 3. <b>Kontras</b>. 4. <b>White balance / suhu warna</b>. 5. <b>Saturasi</b> secukupnya.', 'Aturan emas: jangan berlebihan. Saturasi kegedean bikin kulit oranye dan langit norak.', 'Coba atur slider sampai foto keliatan natural.'], alat: { t: 'edit' } }
    ] },
    { bab: 'Komposisi dan cahaya', pel: [
      { id: 'sepertiga', judul: 'Aturan sepertiga', isi: ['Bagi bingkai 3 × 3. Objek di <b>titik potong</b>, cakrawala di sepertiga atas atau bawah.'], alat: { t: 'sepertiga' } },
      { id: 'teknik', judul: 'Garis pemandu, bingkai, simetri', isi: ['<b>Garis pemandu</b>: jalan atau pagar ngarahin mata. <b>Bingkai alami</b>: pintu, jendela, ranting ngebingkai objek. <b>Simetri</b>: buat arsitektur, aturan sepertiga boleh dilanggar. <b>Ruang kosong</b>: biar objek menonjol.', 'Coba juga ganti <b>sudut pandang</b>: jongkok atau dari atas.'], alat: { t: 'kuis', soal: [
        K('Foto jalan biar mata langsung ke ujung jalan?', ['Garis pemandu', 'ISO tinggi', 'Flash'], 0, 'Garis jalan ngarahin pandangan.'),
        K('Foto gedung simetris, objek ditaruh di...', ['Titik sepertiga', 'Tengah, biar simetrinya kerasa', 'Pojok'], 1, 'Simetri boleh ngelanggar aturan sepertiga.')] } },
      { id: 'cahaya', judul: 'Golden hour dan arah cahaya', isi: ['<b>Golden hour</b>: sekitar sejam setelah matahari terbit dan sebelum terbenam. Cahaya hangat dan lembut. Siang bolong bikin bayangan keras.', 'Cahaya <b>depan</b> rata, <b>samping</b> dramatis, <b>belakang</b> siluet.'], alat: { t: 'kuis', soal: [
        K('Potret lembut tanpa bayangan keras, kapan?', ['Jam 12 siang', 'Golden hour atau di tempat teduh', 'Malam tanpa lampu'], 1, 'Cahaya lembut.'),
        K('Mau foto siluet, cahaya dari mana?', ['Depan', 'Belakang objek', 'Bawah'], 1, 'Backlight.')] } },
      { id: 'malam', judul: 'Foto malam dan cahaya rendah', isi: ['Cahaya sedikit = harus pilih: shutter lambat (butuh tangan stabil atau tripod), aperture besar, atau ISO tinggi (berbintik).', 'Aturan praktis tanpa tripod: shutter jangan lebih lambat dari 1/focal length (lensa 50mm minimal 1/50). Di HP, mode malam ngegabungin banyak foto biar bersih.', 'Sandarin kamera ke tembok atau pakai timer 2 detik biar ga goyang.'], alat: { t: 'kuis', soal: [
        K('Lensa 50mm tanpa tripod, shutter paling lambat yang aman?', ['1/5', '1/50', '1/2000'], 1, 'Aturan 1/focal length.'),
        K('Foto malam di HP biar ga goyang?', ['Pakai timer atau sandarin HP', 'Zoom maksimal', 'Nyalain flash terus'], 0, 'Kurangi goyangan tangan.')] } }
    ] }
  ]
}
