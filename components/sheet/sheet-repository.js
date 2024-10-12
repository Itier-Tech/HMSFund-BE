const { google } = require("googleapis");
const keys = require("../../secret.json");

class SheetRepository {
    constructor() {
        this.auth = new google.auth.GoogleAuth({
            keyFile: "secret.json",
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });
    }

    async getRowCount(spreadsheetId) {
        const client = await this.auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Mahasiswa!A:A",
        });

        const rows = result.data.values;
        return rows ? rows.length : 0;
    }

    async saveData(data) {
        const spreadsheetId = process.env.SPREADSHEET_ID;
        const rowCount = await this.getRowCount(spreadsheetId);
        const nextRowNumber = rowCount + 1;
        const range = `Mahasiswa!A${nextRowNumber}:W${nextRowNumber}`;

        const values = [
            [
                nextRowNumber - 1, // No
                data.nama, // Nama
                data.nim, // Nim
                data.pilihanBeasiswa, // Pilihan Beasiswa
                data.pasFoto, // Pas Foto
                data.ktm, // KTM
                data.ktp, // KTP
                data.kk, // KK
                data.transkripNilai, // Transkrip Nilai
                data.suratKeteranganAktifPrestasi, // Surat Keterangan Aktif Prestasi
                data.suratTidakMenerimaBeasiswa, // Surat Tidak Menerima Beasiswa Lain
                data.suratPermohonanBeasiswa, // Surat Permohonan
                data.suratKeteranganAktifKuliah, // Surat Keterangan Aktif Kuliah
                data.suratRincianUKT, // Surat Rincian UKT
                data.rincianBiayaHidup, // Rincian Biaya Hidup
                data.slipGaji, // Slip Gaji
                data.suratPengajuanAlasan, // Surat Pengajuan Alasan
                data.suratTidakCuti, // Surat Tidak Cuti
                data.tagihanListrik, // Tagihan Listrik
                data.nomorRekeningKampus, // Nomor Rekening Kampus
                data.nomorRekeningPribadi, // Nomor Rekening Pribadi
                data.alamatKosBandung, // Alamat Kos Bandung
                data.rincianJenisKebutuhanMendadak, // Rincian Jenis Kebutuhan Mendadak
            ],
        ];

        const client = await this.auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: client });

        const resource = {
            values,
        };

        const result = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: "RAW",
            resource,
        });

        return result.data;
    }
}

module.exports = SheetRepository;
