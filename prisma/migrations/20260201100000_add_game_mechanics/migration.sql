-- CreateTable
CREATE TABLE "game_sessions" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "game_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "started_by_user_id" TEXT NOT NULL,
    "current_turn_user_id" TEXT,
    "winner_user_id" TEXT,
    "state" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_moves" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "move_index" INTEGER NOT NULL,
    "move_type" TEXT NOT NULL,
    "move_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_moves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_questions" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'soft',
    "prompt" TEXT NOT NULL,
    "options" JSONB,
    "answer" JSONB,
    "tags" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenges" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'soft',
    "challenge_type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tags" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenge_assignments" (
    "id" TEXT NOT NULL,
    "couple_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenge_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_challenge_completions" (
    "id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payload" JSONB,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),

    CONSTRAINT "daily_challenge_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_sessions_couple_id_game_type_status_idx" ON "game_sessions"("couple_id", "game_type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "game_moves_session_id_move_index_key" ON "game_moves"("session_id", "move_index");

-- CreateIndex
CREATE INDEX "game_moves_session_id_idx" ON "game_moves"("session_id");

-- CreateIndex
CREATE INDEX "game_questions_type_mode_is_active_idx" ON "game_questions"("type", "mode", "is_active");

-- CreateIndex
CREATE INDEX "daily_challenges_mode_is_active_idx" ON "daily_challenges"("mode", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_assignments_couple_id_day_key" ON "daily_challenge_assignments"("couple_id", "day");

-- CreateIndex
CREATE INDEX "daily_challenge_assignments_couple_id_expires_at_idx" ON "daily_challenge_assignments"("couple_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "daily_challenge_completions_assignment_id_user_id_key" ON "daily_challenge_completions"("assignment_id", "user_id");

-- CreateIndex
CREATE INDEX "daily_challenge_completions_assignment_id_idx" ON "daily_challenge_completions"("assignment_id");

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_started_by_user_id_fkey" FOREIGN KEY ("started_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_current_turn_user_id_fkey" FOREIGN KEY ("current_turn_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_winner_user_id_fkey" FOREIGN KEY ("winner_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "game_moves" ADD CONSTRAINT "game_moves_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "game_moves" ADD CONSTRAINT "game_moves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "daily_challenge_assignments" ADD CONSTRAINT "daily_challenge_assignments_couple_id_fkey" FOREIGN KEY ("couple_id") REFERENCES "couples"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "daily_challenge_assignments" ADD CONSTRAINT "daily_challenge_assignments_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "daily_challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "daily_challenge_completions" ADD CONSTRAINT "daily_challenge_completions_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "daily_challenge_assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "daily_challenge_completions" ADD CONSTRAINT "daily_challenge_completions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

