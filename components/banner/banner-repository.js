const db = require("../../core/database/supabase");

class BannerRepository {
    async getTotalCount() {
        const { count, error } = await db
            .from("Banners")
            .select("*", { count: "exact", head: true });

        if (error) {
            throw new Error(`Error fetching total count: ${error.message}`);
        }
        return count || 0;
    }

    async findAll({ limit, offset }) {
        const { data, error } = await db
            .from("Banners")
            .select("*")
            .order("date", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            throw new Error(`Error fetching banners: ${error.message}`);
        }
        return data || [];
    }

    async findBannerById(id) {
        const { data, error } = await db
            .from("Banners")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            throw new Error(
                `Error fetching banner with ID ${id}: ${error.message}`
            );
        }
        if (!data) {
            throw new Error(`Banner with ID ${id} not found.`);
        }
        return data;
    }

    async createBanner(banner) {
        const { data, error } = await db
            .from("Banners")
            .insert(banner)
            .select("*");
        if (error) {
            throw new Error(`Error creating banner: ${error.message}`);
        }
        return data[0];
    }

    async updateBanner(id, banner) {
        const { data, error } = await db
            .from("Banners")
            .update(banner)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            throw new Error(
                `Error updating banner with ID ${id}: ${error.message}`
            );
        }
        if (!data) {
            throw new Error(`Banner with ID ${id} not found for update.`);
        }
        return data;
    }

    async deleteBanner(id) {
        const { data, error } = await db
            .from("Banners")
            .delete()
            .eq("id", id)
            .select("*");
        if (error) {
            throw new Error(
                `Error deleting banner with ID ${id}: ${error.message}`
            );
        }
        if (!data.length) {
            throw new Error(`Banner with ID ${id} not found for deletion.`);
        }
        return {
            success: true,
            message: `Banner with ID ${id} deleted successfully.`,
        };
    }
}

module.exports = BannerRepository;
