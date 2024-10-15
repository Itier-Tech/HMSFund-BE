const db = require("../../core/database/supabase");

class ActivityRepository {
    async findAll() {
        const { data, error } = await db
            .from("Activities")
            .select("*")
            .order("date", { ascending: false });
        if (error) {
            throw new Error(`Error fetching activities: ${error.message}`);
        }
        return data || [];
    }

    async findActivityById(id) {
        const { data, error } = await db
            .from("Activities")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            throw new Error(
                `Error fetching activity with ID ${id}: ${error.message}`
            );
        }
        if (!data) {
            throw new Error(`Activity with ID ${id} not found.`);
        }
        return data;
    }

    async createActivity(activity) {
        const { data, error } = await db
            .from("Activities")
            .insert(activity)
            .select("*");
        if (error) {
            throw new Error(`Error creating activity: ${error.message}`);
        }
        return data[0];
    }

    async updateActivity(id, activity) {
        const { data, error } = await db
            .from("Activities")
            .update(activity)
            .eq("id", id)
            .select("*");
        if (error) {
            throw new Error(
                `Error updating activity with ID ${id}: ${error.message}`
            );
        }
        if (!data.length) {
            throw new Error(`Activity with ID ${id} not found for update.`);
        }
        return data[0];
    }

    async deleteActivity(id) {
        const { data, error } = await db
            .from("Activities")
            .delete()
            .eq("id", id)
            .select("*");
        if (error) {
            throw new Error(
                `Error deleting activity with ID ${id}: ${error.message}`
            );
        }
        if (!data.length) {
            throw new Error(`Activity with ID ${id} not found for deletion.`);
        }
        return {
            success: true,
            message: `Activity with ID ${id} deleted successfully.`,
        };
    }
}

module.exports = ActivityRepository;
