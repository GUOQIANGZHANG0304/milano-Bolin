ALTER TABLE `dishes` ADD `is_published` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE INDEX `idx_dishes_is_published` ON `dishes` (`is_published`);
--> statement-breakpoint
PRAGMA optimize;
