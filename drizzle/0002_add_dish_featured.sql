ALTER TABLE `dishes` ADD `is_featured` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE INDEX `idx_dishes_featured` ON `dishes` (`is_published`,`is_featured`);
--> statement-breakpoint
PRAGMA optimize;
