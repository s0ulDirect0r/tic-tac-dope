CREATE TABLE "games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"board" text[][] DEFAULT '{{},{},{}}' NOT NULL,
	"currentPlayer" varchar(255) NOT NULL,
	"winner" varchar(255),
	"stalemate" boolean
);
