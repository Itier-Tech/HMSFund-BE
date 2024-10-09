const db = require("../../core/database/supabase");

class AnnouncementRepository {
    async findAll() {
        const { data, error } = await db.from("Announcements").select("*");
        if (error) {
            throw new Error(`Error fetching announcements: ${error.message}`);
        }
        return data || [];
    }

    async findAnnouncementById(id) {
        const { data, error } = await db
            .from("Announcements")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            throw new Error(
                `Error fetching announcement with ID ${id}: ${error.message}`
            );
        }
        if (!data) {
            throw new Error(`Announcement with ID ${id} not found.`);
        }
        return data;
    }

    async createAnnouncement(announcement) {
        const { data, error } = await db
            .from("Announcements")
            .insert(announcement)
            .select("*");
        if (error) {
            throw new Error(`Error creating announcement: ${error.message}`);
        }
        return data[0];
    }

    async updateAnnouncement(id, announcement) {
        const { data, error } = await db
            .from("Announcements")
            .update(announcement)
            .eq("id", id)
            .select("*");
        if (error) {
            throw new Error(
                `Error updating announcement with ID ${id}: ${error.message}`
            );
        }
        if (!data.length) {
            throw new Error(`Announcement with ID ${id} not found for update.`);
        }
        return data[0];
    }

    async deleteAnnouncement(id) {
        const { data, error } = await db
            .from("Announcements")
            .delete()
            .eq("id", id)
            .select("*");
        if (error) {
            throw new Error(
                `Error deleting announcement with ID ${id}: ${error.message}`
            );
        }
        if (!data.length) {
            throw new Error(
                `Announcement with ID ${id} not found for deletion.`
            );
        }
        return {
            success: true,
            message: `Announcement with ID ${id} deleted successfully.`,
        };
    }
}

module.exports = AnnouncementRepository;