const fs = require("fs");
const path = require("path");
const supabase = require("../../core/database/supabase");

async function uploadImage(file, folder, id) {
    if (!file) {
        throw new Error("Image file is required.");
    }

    const fileExtension = path.extname(file.originalname);
    const fileName = `${id}${fileExtension}`;

    const { error } = await supabase.storage
        .from(folder)
        .upload(fileName, file.buffer, {
            cacheControl: "3600",
            upsert: true,
        });

    if (error) {
        throw new Error(`File upload error: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(folder)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

async function deleteImage(folder, imageUrl) {
    if (!imageUrl) {
        throw new Error("Image URL is required for deletion.");
    }

    const fileName = imageUrl.split("/").pop();

    const { error } = await supabase.storage.from(folder).remove([fileName]);

    if (error) {
        throw new Error(`File deletion error: ${error.message}`);
    }
}

// module.exports = { uploadImage, deleteImage };
module.exports = uploadImage, deleteImage;
