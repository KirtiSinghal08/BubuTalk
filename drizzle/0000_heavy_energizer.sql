CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`role` varchar(10) NOT NULL,
	`content` text NOT NULL,
	`language` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`language` varchar(50) NOT NULL DEFAULT 'Spanish',
	`started_at` timestamp DEFAULT (now()),
	`ended_at` timestamp,
	`message_count` int NOT NULL DEFAULT 0,
	`duration_seconds` int NOT NULL DEFAULT 0,
	CONSTRAINT `chat_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_completions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`language` varchar(50) NOT NULL,
	`lesson_id` varchar(100) NOT NULL,
	`score` float NOT NULL DEFAULT 0,
	`completed_at` timestamp DEFAULT (now()),
	CONSTRAINT `lesson_completions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`language` varchar(50) NOT NULL,
	`level` varchar(20) NOT NULL DEFAULT 'beginner',
	`xp` int NOT NULL DEFAULT 0,
	`streak` int NOT NULL DEFAULT 0,
	`last_active_at` timestamp DEFAULT (now()),
	`lessons_completed` int NOT NULL DEFAULT 0,
	`words_learned` int NOT NULL DEFAULT 0,
	`minutes_practiced` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(128),
	`from_lang` varchar(50) NOT NULL,
	`to_lang` varchar(50) NOT NULL,
	`original_text` text NOT NULL,
	`translated_text` text NOT NULL,
	`mode` varchar(10) NOT NULL DEFAULT 'text',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `translations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` varchar(128) NOT NULL,
	`name` varchar(100) NOT NULL DEFAULT 'Learner',
	`avatar_color` varchar(20) NOT NULL DEFAULT '#3B6FD4',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `vocab` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`language` varchar(50) NOT NULL,
	`word` varchar(200) NOT NULL,
	`translation` varchar(200) NOT NULL,
	`context` text,
	`mastered` boolean NOT NULL DEFAULT false,
	`review_count` int NOT NULL DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `vocab_id` PRIMARY KEY(`id`)
);
