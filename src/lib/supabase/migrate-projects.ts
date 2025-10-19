/**
 * Migrate Projects from IndexedDB to Supabase
 *
 * This utility helps users migrate their locally stored projects
 * to the cloud-synchronized Supabase database.
 */

import {listProjects, deleteProject as deleteLocalProject} from '../storage/projects';
import {createProject, getProjects} from './projects';
import {createClient} from './client';
import {logger} from '@/lib/logger';

export interface MigrationResult {
  success: boolean;
  migrated: number;
  skipped: number;
  errors: number;
  details: Array<{
    projectName: string;
    status: 'migrated' | 'skipped' | 'error';
    message?: string;
  }>;
}

/**
 * Migrate all local projects to Supabase
 *
 * @param deleteAfterMigration - Whether to delete local projects after successful migration
 * @returns Migration result with statistics
 */
export async function migrateProjectsToSupabase(
  deleteAfterMigration = false
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: 0,
    skipped: 0,
    errors: 0,
    details: []
  };

  try {
    // Check authentication
    const supabase = createClient();
    const {
      data: {user}
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be logged in to migrate projects');
    }

    // Get existing Supabase projects to avoid duplicates
    const existingProjects = await getProjects();
    const existingProjectIds = new Set(existingProjects.map((p) => p.id));

    // Get local projects
    const localProjects = await listProjects();

    if (localProjects.length === 0) {
      result.success = true;
      return result;
    }

    logger.info(`Found ${localProjects.length} local projects to migrate`);

    // Migrate each project
    for (const localProject of localProjects) {
      try {
        // Skip if already exists in Supabase
        if (existingProjectIds.has(localProject.id)) {
          logger.debug(`Skipping ${localProject.name} (already exists in Supabase)`);
          result.skipped++;
          result.details.push({
            projectName: localProject.name,
            status: 'skipped',
            message: 'Already exists in Supabase'
          });
          continue;
        }

        // Create in Supabase
        await createProject({
          id: localProject.id,
          name: localProject.name,
          product_id: localProject.productId,
          canvas: localProject.canvas as never,
          preview_url: localProject.previewDataUrl || null,
          is_public: false,
          tags: []
        });

        logger.info(`✓ Migrated: ${localProject.name}`);
        result.migrated++;
        result.details.push({
          projectName: localProject.name,
          status: 'migrated'
        });

        // Delete local copy if requested
        if (deleteAfterMigration) {
          await deleteLocalProject(localProject.id);
          logger.debug(`  Deleted local copy of: ${localProject.name}`);
        }
      } catch (error) {
        logger.error(`✗ Error migrating ${localProject.name}:`, error);
        result.errors++;
        result.details.push({
          projectName: localProject.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    result.success = result.errors === 0;

    logger.info('\n=== Migration Summary ===');
    logger.info(`✓ Migrated: ${result.migrated}`);
    logger.info(`⊘ Skipped: ${result.skipped}`);
    logger.info(`✗ Errors: ${result.errors}`);
    logger.info('=======================\n');

    return result;
  } catch (error) {
    logger.error('Migration failed:', error);
    result.success = false;
    throw error;
  }
}

/**
 * Check if there are local projects that need migration
 */
export async function hasLocalProjectsToMigrate(): Promise<boolean> {
  try {
    const localProjects = await listProjects();
    const supabaseProjects = await getProjects();

    const localProjectIds = new Set(localProjects.map((p) => p.id));
    const supabaseProjectIds = new Set(supabaseProjects.map((p) => p.id));

    // Check if there are any local projects not in Supabase
    for (const localId of localProjectIds) {
      if (!supabaseProjectIds.has(localId)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    logger.error('Error checking for local projects:', error);
    return false;
  }
}

/**
 * Get count of projects pending migration
 */
export async function getPendingMigrationCount(): Promise<number> {
  try {
    const localProjects = await listProjects();
    const supabaseProjects = await getProjects();

    const supabaseProjectIds = new Set(supabaseProjects.map((p) => p.id));

    return localProjects.filter((p) => !supabaseProjectIds.has(p.id)).length;
  } catch (error) {
    logger.error('Error getting pending migration count:', error);
    return 0;
  }
}
