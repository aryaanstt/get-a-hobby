// Materi kursus get a hobby. Urutan bab disusun ngikutin kursus pemula yang beneran dipakai orang:
// catur ala kurikulum pemula chess.com, gitar ala JustinGuitar Grade 1, piano ala buku metode pemula (nomor jari, posisi C, baca not),
// drum ala Drumeo (grip, rudimen, beat, fill), menggambar ala Drawabox (garis, elips, kotak), fotografi ala kursus dasar (exposure, WB, komposisi, cahaya).
// Teks ditulis ulang sendiri, bukan disalin.
window.MATERI = {
  catur: [
    { bab: 'Dasar permainan', pel: [
      { id: 'bidak', judul: 'Cara jalan tiap bidak', isi: ['Catur dimainin di papan 8 × 8. Tiap pemain punya 16 bidak: 1 raja, 1 ratu, 2 benteng, 2 gajah, 2 kuda, dan 8 pion. Putih selalu jalan duluan.', 'Pilih bidak di bawah, terus pencet titik-titiknya buat liat ke mana aja dia bisa jalan. Bidak hitam di papan bisa dimakan.'], alat: { t: 'bidak' } },
      { id: 'tujuan', judul: 'Skak, skakmat, dan remis', isi: ['<b>Skak</b> artinya raja lagi diserang. Kamu wajib nyelamatin raja di langkah berikutnya: geser raja, tutup jalurnya, atau makan bidak yang nyerang.', '<b>Skakmat</b> artinya raja diserang dan ga ada cara nyelamatin. Itu akhir permainan, yang ngeskakmat menang.', '<b>Remis</b> (seri) bisa terjadi kalau pemain yang giliran jalan ga punya langkah legal tapi rajanya ga lagi diskak (namanya <i>stalemate</i>), posisi yang sama terulang 3 kali, atau bidaknya udah ga cukup buat skakmat.'], alat: { t: 'kuis', soal: [
        { q: 'Raja kamu lagi diskak. Mana yang GA boleh?', ops: ['Geser raja ke kotak aman', 'Tutup jalur skak pakai bidak lain', 'Jalanin pion lain tanpa nyelamatin raja'], b: 2, k: 'Kalau raja diskak, langkah kamu wajib nyelamatin raja.' },
        { q: 'Lawan ga punya langkah legal, tapi rajanya ga diskak. Hasilnya?', ops: ['Kamu menang', 'Remis (stalemate)', 'Lawan menang'], b: 1, k: 'Itu stalemate, hasilnya seri. Hati-hati pas lagi unggul jauh.' }] } },
      { id: 'khusus', judul: 'Tiga aturan khusus', isi: ['<b>Rokade</b>: raja geser 2 kotak ke arah benteng, terus benteng loncat ke sisi sebelahnya. Syaratnya raja dan benteng itu belum pernah jalan, kotak di antaranya kosong, dan raja ga lagi diskak atau ngelewatin kotak yang diserang.', '<b>Promosi</b>: pion yang nyampe baris terakhir wajib berubah jadi ratu, benteng, gajah, atau kuda. Hampir selalu dipilih ratu.', '<b>En passant</b>: kalau pion lawan maju 2 kotak dan berhenti persis di samping pion kamu, pion kamu boleh makan dia seolah-olah dia cuma maju 1 kotak. Kesempatan ini cuma berlaku di langkah berikutnya.'], alat: { t: 'kuis', soal: [
        { q: 'Kapan kamu ga boleh rokade?', ops: ['Raja udah pernah jalan', 'Ratu masih di papan', 'Udah lewat langkah ke-10'], b: 0, k: 'Rokade butuh raja dan benteng yang belum pernah jalan.' }] } }
    ] },
    { bab: 'Prinsip pembukaan', pel: [
      { id: 'prinsip', judul: '4 tujuan di awal permainan', isi: ['Kursus pemula biasanya ngajarin empat tujuan di pembukaan:', '1. <b>Kuasai tengah</b> pakai pion (e4, d4, e5, d5).<br>2. <b>Keluarin bidak ringan</b> (kuda dan gajah) sebelum bidak berat.<br>3. <b>Rokade</b> biar raja aman.<br>4. <b>Sambungin benteng</b> dan arahin ke kolom yang kebuka.', 'Kesalahan umum pemula: ngeluarin ratu terlalu cepat (bakal diusir-usir lawan sambil dia ngembangin bidak), jalanin bidak yang sama berkali-kali, dan banyak jalanin pion pinggir.'], alat: { t: 'kuis', soal: [
        { q: 'Langkah pertama yang paling ngikutin prinsip?', ops: ['1. e4', '1. h4', '1. a3'], b: 0, k: 'e4 langsung ngerebut tengah dan buka jalan buat gajah dan ratu.' },
        { q: 'Udah langkah ke-3, kuda dan gajah belum keluar. Mending?', ops: ['Qh5, serang langsung', 'Nf3 atau Bc4', 'h3 jaga-jaga'], b: 1, k: 'Kembangin bidak ringan dulu. Serangan ratu sendirian gampang ditangkis.' },
        { q: 'Kenapa rokade penting?', ops: ['Biar raja aman dan benteng aktif', 'Biar dapat poin tambahan', 'Wajib sebelum langkah 10'], b: 0, k: 'Rokade nyembunyiin raja di pinggir dan bawa benteng ke tengah.' }] } }
    ] },
    { bab: 'Pembukaan populer', pel: [
      { id: 'buka-e4', judul: 'Pembukaan 1.e4: Italia dan Ruy Lopez', isi: ['Dua pembukaan klasik setelah 1.e4 e5 2.Nf3 Nc6. Di <b>Italia</b>, gajah ke c4 ngincar kotak f7 yang cuma dijaga raja. Di <b>Ruy Lopez</b>, gajah ke b5 neken kuda yang ngelindungin pion e5.', 'Pencet ▶ buat jalanin langkah satu-satu dan baca alasannya. Mode <b>Latihan</b> nyuruh kamu nebak langkah putih sendiri.'], alat: { t: 'buka', daftar: ['italia', 'ruy'] } },
      { id: 'buka-hitam', judul: 'Pertahanan buat hitam: Sisilia, Prancis, Caro-Kann', isi: ['Kalau kamu main hitam dan lawan buka 1.e4, tiga pertahanan ini paling sering dipakai.', '<b>Sisilia</b> (1...c5) langsung bikin posisi ga seimbang dan tajam. <b>Prancis</b> (1...e6) dan <b>Caro-Kann</b> (1...c6) lebih kokoh: siapin d5 dulu biar tengahnya ga gampang dijebol.'], alat: { t: 'buka', daftar: ['sisilia', 'prancis', 'caro'] } },
      { id: 'buka-d4', judul: 'Pembukaan 1.d4: Gambit Menteri dan London', isi: ['<b>Gambit Menteri</b> (1.d4 d5 2.c4) nawarin pion c4 buat narik pion d5 hitam keluar dari tengah. Kalau hitam ga ambil (2...e6), itu Gambit Menteri Ditolak.', '<b>Sistem London</b> populer di pemula karena susunannya hampir selalu sama: d4, Bf4, e3, Nf3, c3, Nbd2. Gampang diinget, posisinya aman.'], alat: { t: 'buka', daftar: ['gambit', 'london'] } }
    ] },
    { bab: 'Jebakan pembukaan', pel: [
      { id: 'jebak-cepat', judul: 'Skakmat kilat: Skolar dan Fool’s mate', isi: ['Dua skakmat paling cepat di catur. Wajib kenal biar ga kena, bukan buat diandelin.', '<b>Skolar mate</b>: ratu dan gajah bareng-bareng nyerang f7. Cara nangkisnya gampang, contohnya 3...g6 atau 3...Qe7. Liat juga versi "Nangkis Skolar".', '<b>Fool’s mate</b>: skakmat paling cepat, 2 langkah. Terjadi kalau putih ngebuka diagonal raja pakai f3 dan g4.'], alat: { t: 'buka', daftar: ['skolar', 'nangkis', 'fool'] } },
      { id: 'jebak-klasik', judul: 'Jebakan klasik yang sering kejadian', isi: ['<b>Jebakan Légal</b>: putih "ngorbanin" ratu, dan kalau hitam serakah ngambil, langsung kena skakmat.', '<b>Gambit Blackburne Shilling</b>: hitam pura-pura ngasih pion e5. Kalau putih serakah makan terus, rajanya kena skakmat.', '<b>Jebakan Englund</b>: jebakan buat putih yang serakah setelah 1.d4 e5.', '<b>Jebakan Gajah</b> (Elephant trap): kalau putih makan pion d5 yang keliatan gratis, hitam malah menang kuda.', 'Pelajaran dari semuanya: sebelum makan bidak "gratis", cek dulu kenapa lawan ngebiarin.'], alat: { t: 'buka', daftar: ['legal', 'blackburne', 'englund', 'gajah'] } }
    ] },
    { bab: 'Taktik', pel: [
      { id: 'taktik', judul: 'Garpu, pin, dan tusuk sate', isi: ['<b>Garpu</b>: satu bidak nyerang dua bidak lawan sekaligus. Kuda paling jago soal ini.', '<b>Pin</b>: bidak lawan ga bisa gerak karena di belakangnya ada bidak yang lebih berharga (kalau di belakangnya raja, bidak itu ga boleh gerak sama sekali).', '<b>Tusuk sate</b>: kebalikan pin. Bidak berharga di depan diserang, begitu dia minggir, bidak di belakangnya kemakan.', 'Kerjain puzzle di bawah. Putih jalan, cari satu langkah terbaik.'], alat: { t: 'puzzle', daftar: ['garpu', 'pin', 'tusuk'] } },
      { id: 'mat', judul: 'Pola skakmat', isi: ['Pola yang paling sering muncul di permainan pemula:', '<b>Baris belakang</b>: raja kekunci pionnya sendiri, satu benteng cukup buat skakmat.<br><b>Tangga</b>: dua benteng gantian ngunci baris.<br><b>Ratu dijagain raja</b>: ratu nempel ke raja lawan, dilindungin raja sendiri.<br><b>Smothered mate</b>: raja ketutup bidaknya sendiri, kuda yang ngeskakmat.'], alat: { t: 'puzzle', daftar: ['mat1', 'mat2', 'mat3', 'mat4'] } }
    ] },
    { bab: 'Akhir permainan', pel: [
      { id: 'endgame', judul: 'Dasar endgame', isi: ['Pas bidak tinggal sedikit, raja berubah dari "harus disembunyiin" jadi bidak penyerang. Bawa raja ke tengah.', '<b>Ratu + raja vs raja</b>: pakai ratu buat ngecilin ruang gerak raja lawan sampai ke pinggir, terus bawa raja kamu mendekat. Hati-hati jangan bikin stalemate.', '<b>Oposisi</b>: di endgame raja vs raja + pion, dua raja yang berhadapan dengan 1 kotak di tengah saling ngehalangin. Yang ga harus jalan duluan, dialah yang pegang oposisi.', '<b>Pion lolos</b> (passed pawn), yaitu pion yang ga dihalangin pion lawan, makin berharga makin dekat ke promosi.'], alat: { t: 'kuis', soal: [
        { q: 'Di endgame, raja sebaiknya...', ops: ['Tetap ngumpet di pojok', 'Maju ke tengah dan ikut nyerang', 'Ditukar sama ratu'], b: 1, k: 'Di endgame raja jadi bidak kuat. Aktifin.' },
        { q: 'Kamu tinggal ratu + raja, lawan cuma raja. Bahaya terbesar?', ops: ['Kalah waktu', 'Stalemate (bikin remis)', 'Ratu kemakan pion'], b: 1, k: 'Sisain kotak buat raja lawan selama belum skakmat.' }] } }
    ] }
  ],
  gitar: [
    { bab: 'Persiapan', pel: [
      { id: 'kenal', judul: 'Kenalan gitar dan nama senar', isi: ['Senar gitar dari yang paling tebal (atas pas gitar dipegang) ke yang paling tipis: <b>E A D G B e</b>. Cara gampang ngapalinnya: "<i>Elang Atas Danau Gak Bisa Ellak</i>", atau bikin kalimat sendiri.', '<b>Fret</b> itu kotak-kotak di leher gitar. Makin dekat ke badan gitar, nadanya makin tinggi.', 'Pencet nama senar di bawah buat dengerin nada senar terbuka. Ini juga patokan buat nyetem (tuning).'], alat: { t: 'senar' } },
      { id: 'posisi', judul: 'Cara megang dan nekan senar', isi: ['Tekan senar pakai <b>ujung jari</b>, posisinya <b>dekat fret</b> (bukan di tengah kotak). Makin dekat fret, makin sedikit tenaga yang dibutuhin dan bunyinya makin bersih.', 'Jempol tangan kiri di belakang leher gitar, kira-kira di belakang jari tengah. Jangan nyengkram terlalu kenceng.', 'Ujung jari bakal sakit di minggu pertama. Itu normal. Latihan pendek tapi sering (10 sampai 15 menit) lebih baik daripada sekali lama.'], alat: { t: 'kuis', soal: [
        { q: 'Biar bunyi bersih, jari nekan senar di mana?', ops: ['Di tengah kotak fret', 'Dekat batang fret', 'Di atas batang fret'], b: 1, k: 'Dekat fret = tenaga lebih ringan, bunyi lebih bersih.' }] } }
    ] },
    { bab: 'Kunci pertama', pel: [
      { id: 'ade', judul: 'Kunci A, D, dan E', isi: ['Banyak kursus pemula (termasuk JustinGuitar) mulai dari <b>A, D, dan E</b>, bukan C. Bentuknya lebih gampang buat jari yang belum terbiasa.', 'Pasang jari satu-satu, genjreng, terus cek tiap senar bunyi atau nggak. Senar bertanda × jangan dibunyiin.'], alat: { t: 'kunci', daftar: ['A', 'D', 'E'] } },
      { id: 'omc', judul: 'Latihan ganti kunci 1 menit', isi: ['Latihan paling ampuh buat pemula: <b>one minute changes</b>. Pilih dua kunci, terus selama 1 menit ganti bolak-balik sebanyak mungkin. Hitung tiap kali kuncinya bunyi bersih.', 'Target awal sekitar 30 kali per menit. Catat skor tiap hari, pasti naik.', 'Pegang gitar beneran, terus pencet tombol "Ganti!" tiap kali kamu berhasil pindah kunci.'], alat: { t: 'omc' } }
    ] },
    { bab: 'Ritme', pel: [
      { id: 'strum', judul: 'Pola genjreng (strumming)', isi: ['Mulai dari yang paling dasar: <b>4 kali genjreng ke bawah</b> tiap birama, ngikutin ketukan 1, 2, 3, 4.', 'Kalau udah rapi, lanjut ke pola paling populer di lagu pop: <b>Bawah, Bawah-Atas, Atas-Bawah-Atas</b> (D, DU, UDU).', 'Kuncinya: tangan kanan terus gerak naik turun kayak bandul, walaupun ada ketukan yang ga kena senar. Jadi ritmenya ga lepas.'], alat: { t: 'strum' } }
    ] },
    { bab: 'Kunci lainnya', pel: [
      { id: 'minor', judul: 'Kunci minor: Am, Em, Dm', isi: ['Kunci minor bunyinya lebih sedih atau sendu. Ketiganya sering banget dipakai bareng kunci mayor.', 'Em itu kunci paling gampang, cuma 2 jari. Am dan Dm bentuknya mirip kunci yang udah kamu kenal.'], alat: { t: 'kunci', daftar: ['Am', 'Em', 'Dm'] } },
      { id: 'gcf', judul: 'Kunci G, C, dan F versi gampang', isi: ['<b>G</b> dan <b>C</b> ada di hampir semua lagu. <b>F</b> asli butuh barre (satu jari nekan semua senar), jadi pemula pakai F versi 4 senar dulu.', 'Latih ganti C ke G dan G ke C pakai latihan 1 menit.'], alat: { t: 'kunci', daftar: ['G', 'C', 'F'] } },
      { id: 'progresi', judul: 'Progresi C, G, Am, F', isi: ['Empat kunci ini dipakai di ratusan lagu pop. Kalau kamu bisa pindah antar empat kunci ini dengan lancar, kamu udah bisa ngiringin banyak lagu.', 'Mulai di tempo pelan. Naikin tempo kalau perpindahannya udah ga kepotong.'], alat: { t: 'progresi' } }
    ] }
  ],
  piano: [
    { bab: 'Kenalan tuts', pel: [
      { id: 'geografi', judul: 'Pola tuts hitam dan nada C', isi: ['Tuts hitam selalu ngumpul dalam pola <b>2</b> dan <b>3</b>. Tuts putih persis di kiri kelompok 2 tuts hitam itu selalu <b>C</b>.', 'Urutan tuts putih: C D E F G A B, terus balik lagi ke C. C yang ada di tengah keyboard namanya <b>middle C</b> (C4), dipakai jadi patokan.', 'Coba kuis di bawah: cari tuts yang diminta.'], alat: { t: 'carinada' } }
    ] },
    { bab: 'Posisi tangan', pel: [
      { id: 'jari', judul: 'Nomor jari dan posisi C', isi: ['Di partitur, jari dikasih nomor: <b>1 jempol, 2 telunjuk, 3 tengah, 4 manis, 5 kelingking</b>. Sama buat tangan kiri dan kanan.', 'Posisi C: jempol kanan di C, terus jari 2 sampai 5 di D, E, F, G. Jari agak melengkung kayak megang bola kecil, yang nekan bantalan ujung jari.', 'Kuis: tangan kanan di posisi C, pencet tuts sesuai nomor jari yang muncul.'], alat: { t: 'nomorjari' } },
      { id: 'lagu', judul: 'Lagu pertama di posisi C', isi: ['Banyak buku metode ngajarin lagu pertama cuma pakai 5 nada di posisi C, jadi tangan ga perlu pindah.', 'Ikutin tuts yang ditandain oranye. Mulai dari tangga nada, terus Bintang Kecil, terus Ode to Joy.'], alat: { t: 'lagu' } }
    ] },
    { bab: 'Baca not', pel: [
      { id: 'paranada', judul: 'Baca not di paranada', isi: ['Paranada (staff) itu 5 garis. Simbol di awalnya, <b>kunci G</b> (treble clef), dipakai buat tangan kanan.', 'Not bisa duduk di garis atau di spasi. Middle C ada di garis tambahan di bawah paranada. Naik satu posisi (garis ke spasi atau sebaliknya) = naik satu tuts putih.', 'Garis paranada kunci G dari bawah: E G B D F. Spasinya: F A C E.', 'Kuis: liat not di paranada, pencet tuts yang sesuai.'], alat: { t: 'bacanot' } },
      { id: 'ritme', judul: 'Ketukan dan nilai not', isi: ['Kebanyakan lagu pakai birama 4/4: 4 ketukan tiap birama.', '<b>Not penuh</b> = 4 ketukan. <b>Not setengah</b> = 2 ketukan. <b>Not seperempat</b> = 1 ketukan. <b>Not seperdelapan</b> = setengah ketukan.', 'Hitung keras-keras pas latihan: "1, 2, 3, 4". Pakai metronom biar temponya stabil.'], alat: { t: 'kuis', soal: [
        { q: 'Not setengah nilainya berapa ketukan?', ops: ['1', '2', '4'], b: 1, k: 'Setengah dari not penuh (4) = 2 ketukan.' },
        { q: 'Satu birama 4/4 bisa diisi...', ops: ['2 not setengah', '3 not setengah', '1 not penuh dan 1 not seperempat'], b: 0, k: '2 + 2 = 4 ketukan.' },
        { q: 'Dua not seperdelapan sama dengan...', ops: ['1 not seperempat', '1 not setengah', '1 not penuh'], b: 0, k: '½ + ½ = 1 ketukan = not seperempat.' }] } }
    ] },
    { bab: 'Akor dan tangga nada', pel: [
      { id: 'akor', judul: 'Akor dasar C, F, G, Am', isi: ['Akor = 3 nada yang dibunyiin barengan. Akor mayor dan minor dasar dibentuk dari nada ke-1, 3, dan 5 (loncat-loncat satu tuts putih).', '<b>C</b> = C E G. <b>F</b> = F A C. <b>G</b> = G B D. <b>Am</b> = A C E.', 'Empat akor ini bisa ngiringin banyak lagu, sama kayak progresi di gitar.'], alat: { t: 'akor' } },
      { id: 'tangganada', judul: 'Tangga nada C mayor', isi: ['Tangga nada C mayor = semua tuts putih dari C ke C.', 'Penjarian tangan kanan: 1-2-3 (C D E), terus <b>jempol nyelip</b> ke bawah buat F, lanjut 1-2-3-4-5 (F G A B C).', 'Latih pelan-pelan sampai jempolnya nyelip tanpa ada jeda.'], alat: { t: 'lagu', awal: 'Tangga nada C' } }
    ] }
  ],
  drum: [
    { bab: 'Kenalan drum', pel: [
      { id: 'set', judul: 'Bagian-bagian drum set', isi: ['<b>Kick</b> (bass drum) dimainin pakai kaki kanan. <b>Snare</b> di depan kamu, bunyinya "tak" yang tajam. <b>Hi-hat</b> dua simbal yang bisa dibuka tutup pakai kaki kiri.', 'Ada juga <b>tom</b> (buat fill), <b>crash</b> (aksen), dan <b>ride</b> (pengganti hi-hat).', 'Pukul pad di bawah, atau pakai tombol 1 sampai 4 di keyboard.'], alat: { t: 'pad' } },
      { id: 'grip', judul: 'Cara megang stik', isi: ['Pemula biasanya pakai <b>matched grip</b>: dua tangan megang stik dengan cara yang sama.', 'Titik tumpu (<b>fulcrum</b>) ada di antara jempol dan jari telunjuk, kira-kira sepertiga dari ujung belakang stik. Jari lain cuma ngebungkus santai.', 'Biarin stik mantul dari pad atau drum. Jangan ditekan ke bawah. Tenaganya dari pergelangan, bukan dari lengan.'], alat: { t: 'kuis', soal: [
        { q: 'Tenaga pukulan utama dari mana?', ops: ['Bahu', 'Pergelangan tangan', 'Jari kelingking'], b: 1, k: 'Pergelangan bikin pukulan cepat dan ga capek.' },
        { q: 'Setelah mukul, stik sebaiknya...', ops: ['Ditekan ke drum', 'Dibiarin mantul', 'Langsung diangkat tinggi'], b: 1, k: 'Biarin mantul, nanti bunyinya lebih hidup.' }] } }
    ] },
    { bab: 'Rudimen', pel: [
      { id: 'rudimen', judul: 'Single stroke, double stroke, paradiddle', isi: ['Rudimen sering disebut "alfabet"-nya drum: pola pukulan tangan kanan (R) dan kiri (L) yang jadi dasar semua beat dan fill.', '<b>Single stroke</b>: R L R L. <b>Double stroke</b>: R R L L. <b>Paradiddle</b>: R L R R L R L L.', 'Pencet tombol L dan R (atau huruf F dan J di keyboard) ngikutin pola yang nyala. Mulai pelan, akurasi dulu baru kecepatan.'], alat: { t: 'rudimen' } }
    ] },
    { bab: 'Beat dan fill', pel: [
      { id: 'beat', judul: 'Beat rock 8-an', isi: ['Beat paling dasar di musik pop dan rock: hi-hat tiap seperdelapan ketuk ("1 & 2 & 3 & 4 &"), kick di ketukan 1 dan 3, snare di ketukan 2 dan 4.', 'Nyalain sequencer dan tepuk meja ngikutin. Tangan kanan = hi-hat, tangan kiri = snare, kaki = kick.'], alat: { t: 'seq', awal: 'Rock dasar' } },
      { id: 'fill', judul: 'Fill pertama dan variasi', isi: ['<b>Fill</b> itu "jembatan" pendek di akhir frasa, biasanya di birama ke-4 atau ke-8, sebelum balik lagi ke beat utama.', 'Fill paling gampang: 8 pukulan snare rata di birama terakhir. Lanjutannya: pindahin sebagian pukulan ke tom.', 'Coba preset <b>Fill snare</b>, terus bandingin sama <b>Disko</b> dan <b>Santai</b> buat ngerasain variasi beat.'], alat: { t: 'seq', awal: 'Fill snare' } }
    ] }
  ],
  gambar: [
    { bab: 'Garis', pel: [
      { id: 'garis', judul: 'Garis yang yakin: metode ghosting', isi: ['Kursus Drawabox ngajarin <b>ghosting</b> buat bikin garis lurus yang yakin:', '1. <b>Rencanain</b>: tandain titik awal dan akhir.<br>2. <b>Latih gerakan</b> (ghost): gerakin tangan di atas kertas tanpa nyentuh, beberapa kali.<br>3. <b>Eksekusi</b>: tarik garis dalam satu gerakan yakin. Jangan diperlambat.', 'Gerakin dari <b>bahu</b>, bukan pergelangan, biar garis panjangnya ga melengkung.', 'Latihan: tarik garis dari titik oranye ke titik biru dalam satu goresan.'], alat: { t: 'garis' } }
    ] },
    { bab: 'Elips', pel: [
      { id: 'elips', judul: 'Lingkaran dan elips', isi: ['Elips muncul di mana-mana: gelas, roda, mata. Kuncinya: <b>gambar muter 2 sampai 3 kali</b> sebelum ngangkat pensil. Gerakannya jadi halus dan bentuknya lebih bulet.', 'Utamain gerakan yang lancar dulu. Bentuk yang sempurna nyusul kalau rutin latihan.', 'Latihan: gambar lingkaran yang pas di dalam lingkaran panduan.'], alat: { t: 'elips' } }
    ] },
    { bab: 'Kotak dan perspektif', pel: [
      { id: 'perspektif', judul: 'Perspektif 1 titik dan 2 titik', isi: ['Benda yang makin jauh keliatan makin kecil. Garis-garis sejajar yang menjauh bakal ketemu di satu titik di garis cakrawala: <b>titik hilang</b>.', '<b>Perspektif 1 titik</b>: satu sisi kotak ngadep kamu, semua garis kedalaman ke satu titik hilang. <b>Perspektif 2 titik</b>: kamu ngeliat sudut kotak, garisnya ke dua titik hilang di kiri dan kanan.', 'Geser titik hilang di bawah dan liat gimana kotaknya berubah.'], alat: { t: 'perspektif' } }
    ] },
    { bab: 'Latihan rutin', pel: [
      { id: 'value', judul: 'Gelap terang (value)', isi: ['<b>Value</b> itu tingkat gelap terang. Gambar keliatan 3 dimensi karena ada bagian terang, bayangan, dan bayangan jatuh.', 'Latihan klasik: bikin <b>skala value 5 kotak</b> dari putih ke hitam pakai pensil, gradasinya rata.', 'Tentuin dulu arah cahaya sebelum ngarsir. Bagian yang ngadep cahaya paling terang.'], alat: { t: 'kuis', soal: [
        { q: 'Cahaya dari kiri atas. Bayangan jatuh ke arah...', ops: ['Kiri atas', 'Kanan bawah', 'Atas'], b: 1, k: 'Bayangan jatuh berlawanan arah dengan sumber cahaya.' },
        { q: 'Kenapa gambar keliatan datar?', ops: ['Kurang warna', 'Gelap terangnya kurang kontras', 'Kertasnya kecil'], b: 1, k: 'Kontras value yang bikin bentuk keliatan bervolume.' }] } },
      { id: 'gesture', judul: 'Gambar cepat 60 detik', isi: ['Gambar cepat (gesture) ngelatih kamu nangkep bentuk besar dan gerakan, bukan detail.', 'Pilih tema acak, pasang timer 60 detik, dan gambar semampunya. Ga harus bagus, yang penting jadi dan rutin.'], alat: { t: 'kanvas' } }
    ] }
  ],
  foto: [
    { bab: 'Exposure', pel: [
      { id: 'segitiga', judul: 'Segitiga exposure', isi: ['Terang gelapnya foto ditentuin 3 hal:', '<b>Aperture</b> (f/angka): lubang lensa. Angka kecil (f/1.8) = lubang besar, cahaya banyak, background blur.<br><b>Shutter speed</b>: lama sensor kebuka. Cepat (1/1000) bikin gerakan beku, lambat (1/15) bikin gerakan blur.<br><b>ISO</b>: kepekaan sensor. Tinggi = lebih terang tapi muncul bintik (noise).', 'Ngubah satu hal biasanya harus diimbangin hal lain. Coba di simulator dan selesaiin misinya.'], alat: { t: 'exposure' } },
      { id: 'mode', judul: 'Mode kamera dan mode pro di HP', isi: ['<b>Auto</b>: kamera ngatur semuanya. <b>A atau Av</b> (aperture priority): kamu atur aperture, kamera atur shutter. <b>S atau Tv</b> (shutter priority): kebalikannya. <b>M</b> (manual): kamu atur semua.', 'Di HP, buka <b>mode Pro</b> atau Manual di aplikasi kamera. Biasanya kamu bisa atur ISO, shutter, fokus, dan white balance. Aperture di HP kebanyakan tetap.', 'Kalau kamera atau HP kamu bisa nyimpen <b>RAW</b>, pakai itu: warna dan terang gelapnya bisa dibenerin lebih leluasa pas edit.'], alat: { t: 'kuis', soal: [
        { q: 'Mau foto anak lari biar tajam. Mode paling pas?', ops: ['Aperture priority', 'Shutter priority dengan shutter cepat', 'Auto pakai flash'], b: 1, k: 'Shutter cepat bikin gerakan beku.' },
        { q: 'Foto malam berbintik. Penyebab paling mungkin?', ops: ['ISO terlalu tinggi', 'Aperture terlalu kecil angkanya', 'White balance salah'], b: 0, k: 'ISO tinggi = lebih banyak noise.' }] } }
    ] },
    { bab: 'Warna', pel: [
      { id: 'wb', judul: 'White balance', isi: ['Tiap sumber cahaya punya warna: lampu pijar kuning oranye, langit mendung kebiruan. Mata kita otomatis nyesuaiin, kamera nggak.', '<b>White balance</b> (dalam Kelvin) bikin benda putih tetap keliatan putih. Preset umum: siang hari sekitar 5500K, mendung sekitar 6500K, lampu pijar sekitar 3200K.', 'Atur slider sampai kertas putih di foto keliatan netral.'], alat: { t: 'wb' } }
    ] },
    { bab: 'Komposisi', pel: [
      { id: 'sepertiga', judul: 'Aturan sepertiga', isi: ['Bagi bingkai jadi 3 × 3 kotak sama besar. Taruh objek utama di <b>salah satu titik potong</b> garisnya, bukan pas di tengah. Hasilnya biasanya lebih dinamis.', 'Garis cakrawala taruh di sepertiga atas atau bawah, jangan pas di tengah. Kebanyakan kamera HP punya pilihan buat nampilin garis bantu (grid).', 'Geser objek di bawah ke posisi yang pas.'], alat: { t: 'sepertiga' } },
      { id: 'teknik', judul: 'Garis pemandu, ruang kosong, sudut pandang', isi: ['<b>Garis pemandu</b> (leading lines): jalan, pagar, atau rel yang ngarahin mata ke objek utama.', '<b>Ruang kosong</b> (negative space): sisain area kosong biar objeknya lebih menonjol.', '<b>Sudut pandang</b>: coba jongkok atau naik ke tempat tinggi. Foto dari tinggi mata orang biasa itu yang paling sering, jadi paling ngebosenin.'], alat: { t: 'kuis', soal: [
        { q: 'Foto jalan raya biar mata langsung ke ujung jalan. Teknik apa?', ops: ['Garis pemandu', 'ISO tinggi', 'Simetri sempurna'], b: 0, k: 'Garis jalan ngarahin pandangan.' },
        { q: 'Garis cakrawala paling enak ditaruh di...', ops: ['Persis di tengah', 'Sepertiga atas atau bawah', 'Paling bawah bingkai'], b: 1, k: 'Aturan sepertiga berlaku juga buat cakrawala.' }] } }
    ] },
    { bab: 'Cahaya', pel: [
      { id: 'cahaya', judul: 'Golden hour dan arah cahaya', isi: ['<b>Golden hour</b>: sekitar satu jam setelah matahari terbit dan sebelum terbenam. Cahayanya hangat, lembut, dan bayangannya panjang.', 'Matahari siang bolong bikin bayangan keras di wajah. Kalau terpaksa motret siang, cari tempat teduh.', 'Arah cahaya ngubah suasana. <b>Dari depan</b>: rata dan jelas. <b>Dari samping</b>: dramatis, tekstur keliatan. <b>Dari belakang</b> (backlight): siluet atau rambut bercahaya.'], alat: { t: 'kuis', soal: [
        { q: 'Mau potret wajah yang lembut tanpa bayangan keras. Kapan?', ops: ['Jam 12 siang di lapangan', 'Golden hour atau di tempat teduh', 'Malam tanpa lampu'], b: 1, k: 'Cahaya lembut = bayangan halus.' },
        { q: 'Mau foto siluet. Cahaya dari mana?', ops: ['Dari depan objek', 'Dari belakang objek', 'Dari bawah'], b: 1, k: 'Backlight bikin objek gelap, background terang.' }] } }
    ] }
  ]
}
