const { google } = require("googleapis");
const fs = require("fs");
const keys = require("../../secret.json");

class SheetRepository {
    constructor() {
        this.auth = new google.auth.GoogleAuth({
            keyFile: "secret.json",
            scopes: [
                "https://www.googleapis.com/auth/spreadsheets",
                "https://www.googleapis.com/auth/drive",
            ],
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

    async uploadFilesToDrive(files, nim) {
        const client = await this.auth.getClient();
        const drive = google.drive({ version: "v3", auth: client });

        const mainFolderId = process.env.DRIVE_FOLDER_ID; // Folder utama
        const fileLinks = {};

        // Pastikan folder utama dapat diakses
        try {
            const folderCheck = await drive.files.get({ fileId: mainFolderId });
        } catch (err) {
            console.error("Failed to access main folder:", err.message);
            throw new Error("Main folder not found or not accessible.");
        }

        // Buat atau cari sub-folder berdasarkan NIM
        let subFolderId;
        try {
            // Cari folder dengan nama sesuai NIM di dalam folder utama
            const searchResponse = await drive.files.list({
                q: `'${mainFolderId}' in parents and name = '${nim}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: "files(id, name)",
            });

            if (searchResponse.data.files.length > 0) {
                // Folder ditemukan
                subFolderId = searchResponse.data.files[0].id;
            } else {
                // Buat folder baru jika tidak ditemukan
                const folderMetadata = {
                    name: nim,
                    mimeType: "application/vnd.google-apps.folder",
                    parents: [mainFolderId],
                };

                const folderResponse = await drive.files.create({
                    resource: folderMetadata,
                    fields: "id",
                });

                subFolderId = folderResponse.data.id;
            }
        } catch (error) {
            console.error(
                `Error creating/accessing sub-folder for NIM ${nim}:`,
                error.message
            );
            throw new Error("Failed to create/access sub-folder.");
        }

        // Upload files ke dalam sub-folder
        for (const file of files) {
            try {
                const fileMetadata = {
                    name: file.originalname || `file_${Date.now()}`,
                    parents: [subFolderId],
                };
                const media = {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(file.path),
                };

                const response = await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: "id",
                });

                const fileId = response.data.id;

                // Berikan akses publik
                await drive.permissions.create({
                    fileId: fileId,
                    requestBody: {
                        role: "reader",
                        type: "anyone",
                    },
                });

                const fileLink = `https://drive.google.com/uc?id=${fileId}`;
                fileLinks[file.fieldname] = fileLink;
            } catch (error) {
                console.error(
                    `Error uploading file ${file.originalname}:`,
                    error.message
                );
            }
        }
        return fileLinks;
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
