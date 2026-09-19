ALTER TABLE `dishes` ADD `tags` text DEFAULT '[]' NOT NULL;
--> statement-breakpoint
PRAGMA optimize;
