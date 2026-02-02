'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Heart, Flame, Sparkles, ArrowLeft } from 'lucide-react';
import { GameIntro } from '@/components/games/GameIntro';
import { GameConclusion } from '@/components/games/GameConclusion';
import { GameCard } from '@/components/games/GameCard';
import { GameProgress } from '@/components/games/GameProgress';
import { useGameSound } from '@/hooks/useGameSound';

type Mode = 'soft' | 'romantic' | 'hot';

function useMe() {
  return useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);
}

function ModePicker({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={mode === 'soft' ? 'default' : 'outline'} onClick={() => onChange('soft')}>
        Soft
      </Button>
      <Button
        variant={mode === 'romantic' ? 'default' : 'outline'}
        onClick={() => onChange('romantic')}
      >
        Romantique
      </Button>
      <Button variant={mode === 'hot' ? 'default' : 'outline'} onClick={() => onChange('hot')}>
        Hot (consensuel)
      </Button>
    </div>
  );
}

export default function GameDetailPage() {
  const params = useParams<{ gameId: string }>();
  const gameId = params?.gameId ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/games" className="inline-flex items-center gap-2 text-gray-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour aux jeux
        </Link>
      </div>

      {gameId === 'memory' && <MemoryGame />}
      {gameId === 'truth-dare' && <TruthDareGame />}
      {gameId === 'quiz' && <QuizGame />}
      {gameId === 'daily-challenge' && <DailyChallengeGame />}
      {gameId === 'would-you-rather' && <WouldYouRatherGame />}
      {gameId === 'more-less' && <MoreLessGame />}
      {gameId === 'wheel' && <WheelGame />}
      {gameId === 'compliments' && <ComplimentsGame />}
      {gameId === 'telepathy' && <TelepathyPlaceholder />}
      {gameId === 'love-letter' && <LoveLetterPlaceholder />}
      {gameId === 'mood-garden' && <MoodGardenPlaceholder />}

      {![
        'memory',
        'truth-dare',
        'quiz',
        'daily-challenge',
        'would-you-rather',
        'more-less',
        'wheel',
        'compliments',
        'telepathy',
        'love-letter',
        'mood-garden',
      ].includes(gameId) && (
        <Card className="p-6">
          <p className="text-gray-700">Jeu inconnu.</p>
        </Card>
      )}
    </div>
  );
}

function MemoryGame() {
  const me = useMe();
  const [gridSize, setGridSize] = useState<4 | 6>(4);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [introDone, setIntroDone] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);

  const refresh = async () => {
    setError('');
    try {
      const s = await api.games.sessions.create('memory', { gridSize });
      setSession(s);
    } catch (e: any) {
      setError(e?.message || 'Impossible de charger la session');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  const state = session?.state || {};
  const deck: Array<{ index: number; pairId: number; assetKey: string }> = state.deck || [];
  const selected: number[] = state.selectedIndices || [];
  const matchedPairIds: number[] = state.matchedPairIds || [];

  const isMyTurn = session?.currentTurnUserId && me?.id && session.currentTurnUserId === me.id;
  const done = session?.status === 'completed';

  const handleFlip = async (index: number) => {
    if (!session?.id || done) return;
    try {
      const updated = await api.games.sessions.move(session.id, 'flip', { index });
      setSession(updated);
    } catch (e: any) {
      setError(e?.message || 'Move refusé');
    }
  };

  const restart = async () => {
    if (!session?.id) return;
    setError('');
    setLoading(true);
    try {
      await api.games.sessions.complete(session.id, null);
      const s = await api.games.sessions.create('memory', { gridSize });
      setSession(s);
    } catch (e: any) {
      setError(e?.message || 'Impossible de redémarrer');
    } finally {
      setLoading(false);
    }
  };

  const matchedCount = matchedPairIds.length;
  const totalPairs = (gridSize * gridSize) / 2;

  if (showConclusion) {
    return (
      <div className="space-y-4">
        <GameConclusion
          title="Memory Love"
          message="Votre mémoire d'amour — paires trouvées."
          score={`${matchedCount} / ${totalPairs}`}
          scoreLabel="paires"
          footer="À bientôt pour une nouvelle partie."
          icon="🃏❤️"
          onAction={() => setShowConclusion(false)}
          actionLabel="Rejouer"
          variant="romantic"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!introDone && (
        <GameIntro
          title="Memory Love"
          subtitle="Paires de souvenirs, emojis et mots doux — trouvez-les ensemble."
          icon="🃏❤️"
          duration={2500}
          onComplete={() => setIntroDone(true)}
          variant="romantic"
        />
      )}

      {introDone && (
        <>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Memory Love</h1>
              <p className="text-gray-600">Tours alternés — glow sur match, victoire à deux.</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setGridSize(4)} disabled={gridSize === 4} className="game-btn">
                4×4
              </Button>
              <Button variant="outline" size="sm" onClick={() => setGridSize(6)} disabled={gridSize === 6} className="game-btn">
                6×6
              </Button>
              <Button onClick={restart} variant="secondary" size="sm" className="game-btn">Recommencer</Button>
              <Button variant="outline" size="sm" onClick={() => setShowConclusion(true)} className="game-btn">Voir conclusion</Button>
            </div>
          </div>

          {loading ? (
            <Card className="p-8 animate-pulse">Chargement…</Card>
          ) : error ? (
            <Card className="p-6 text-red-600">{error}</Card>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className={isMyTurn ? 'bg-green-600' : 'bg-gray-600'}>
                  {isMyTurn ? 'Votre tour' : 'Tour partenaire'}
                </Badge>
                {done && <Badge className="bg-pink-600">Victoire ✨</Badge>}
                <GameProgress value={matchedCount} max={totalPairs} label="Paires" compact />
              </div>

              <Card className="p-4 rounded-2xl shadow-lg border-2 border-pink-100">
                <div
                  className="grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                >
                  {deck.map((card) => {
                    const isFaceUp =
                      selected.includes(card.index) || matchedPairIds.includes(card.pairId) || done;
                    const isMatched = matchedPairIds.includes(card.pairId);
                    return (
                      <button
                        key={card.index}
                        onClick={() => handleFlip(card.index)}
                        className={[
                          'aspect-square rounded-xl border-2 transition-all duration-200 game-btn',
                          'flex items-center justify-center text-sm font-semibold',
                          isFaceUp ? 'bg-white border-pink-200' : 'bg-gradient-to-br from-pink-100 to-purple-100 border-pink-200 hover:from-pink-200 hover:to-purple-200',
                          isMatched ? 'ring-2 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] scale-[0.98]' : '',
                        ].join(' ')}
                        disabled={!isMyTurn || done}
                      >
                        {isFaceUp ? (
                          <div className="w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br from-white to-pink-50">
                            <span className="text-xl">{card.pairId}</span>
                          </div>
                        ) : (
                          <span className="text-2xl opacity-80">💗</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
}

function TruthDareGame() {
  const me = useMe();
  const [mode, setMode] = useState<Mode>('soft');
  const [session, setSession] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const s = await api.games.sessions.create('truth-dare', { mode });
        setSession(s);
        setCard(s?.state?.lastCard || null);
      } catch (e: any) {
        setError(e?.message || 'Impossible de charger la session');
      } finally {
        setLoading(false);
      }
    })();
  }, [mode]);

  const consents = session?.state?.hotConsents || {};
  const hotUnlocked = mode !== 'hot' || (consents && Object.values(consents).every(Boolean));

  const toggleConsent = async (value: boolean) => {
    if (!session?.id) return;
    const updated = await api.games.sessions.move(session.id, 'consent_hot', { value });
    setSession(updated);
  };

  const spin = async () => {
    if (!session?.id) return;
    if (mode === 'hot' && !hotUnlocked) return;
    setError('');
    setSpinning(true);
    try {
      const result = Math.random() < 0.5 ? 'truth' : 'dare';
      // tiny delay for “wheel” effect
      await new Promise((r) => setTimeout(r, 900));
      const q = await api.games.questions.random(result, mode);
      const payload = { type: result, mode, ...q };
      const updated = await api.games.sessions.move(session.id, 'draw_card', payload);
      setSession(updated);
      setCard(payload);
    } catch (e: any) {
      setError(e?.message || 'Impossible de tirer une carte');
    } finally {
      setSpinning(false);
    }
  };

  if (loading) {
    return <Card className="p-6">Chargement…</Card>;
  }

  return (
    <div className="space-y-4">
      {!introDone && (
        <GameIntro
          title="Action ou Vérité"
          subtitle="Soft, romantique ou hot (avec double consentement)"
          icon="🎲❤️"
          duration={2400}
          onComplete={() => setIntroDone(true)}
          variant={mode === 'hot' ? 'intimate' : 'romantic'}
        />
      )}

      {introDone && (
        <>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Action ou Vérité</h1>
              <p className="text-gray-600">Soft, romantique, hot consensuel (double consentement requis).</p>
            </div>
            <ModePicker mode={mode} onChange={setMode} />
          </div>

          {mode === 'hot' && (
            <Card className="p-4 border-pink-200">
              <div className="flex items-center gap-3 mb-3">
                <Flame className="w-5 h-5 text-pink-600" />
                <p className="text-gray-700 font-medium">
                  Mode hot : uniquement si vous êtes d’accord tous les deux.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={consents?.[me?.id] ? 'default' : 'outline'}
                  onClick={() => toggleConsent(!consents?.[me?.id])}
                  className="min-w-[140px]"
                >
                  {consents?.[me?.id] ? '✅ Je consens' : 'Je consens'}
                </Button>
                <Badge className={hotUnlocked ? 'bg-green-600' : 'bg-gray-600'}>
                  {hotUnlocked ? 'Déverrouillé ✓' : 'En attente du partenaire'}
                </Badge>
              </div>
            </Card>
          )}

          {error && (
            <Card className="p-4 text-red-600 border-red-200 bg-red-50">{error}</Card>
          )}

          <Card className="p-6 text-center space-y-8">
            <Button
              className="game-btn rounded-xl px-10 py-7 text-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={spin}
              disabled={spinning || (mode === 'hot' && !hotUnlocked)}
              size="lg"
            >
              <RotateCw className={`w-6 h-6 mr-3 ${spinning ? 'animate-spin' : ''}`} />
              {spinning ? 'Ça tourne…' : 'Tirer une carte'}
            </Button>

            {card && (
              <GameCard
                title={card.type === 'truth' ? 'VÉRITÉ' : 'ACTION'}
                variant={card.type === 'truth' ? 'truth' : 'dare'}
                animate
              >
                {card.prompt}
              </GameCard>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function QuizGame() {
  const [mode, setMode] = useState<Mode>('romantic');
  const [session, setSession] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [error, setError] = useState('');
  const me = useMe();

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const s = await api.games.sessions.create('quiz', { mode });
        setSession(s);
        setQuestion(s?.state?.lastCard || null);
      } catch (e: any) {
        setError(e?.message || 'Impossible de démarrer le quiz');
      }
    })();
  }, [mode]);

  const newQuestion = async () => {
    if (!session?.id) return;
    setError('');
    try {
      const q = await api.games.questions.random('quiz', mode);
      const payload = { type: 'quiz', mode, ...q };
      const updated = await api.games.sessions.move(session.id, 'draw_card', payload);
      setSession(updated);
      setQuestion(payload);
    } catch (e: any) {
      setError(e?.message || 'Impossible de récupérer une question');
    }
  };

  const answer = async (choiceIndex: number) => {
    if (!session?.id || !question) return;
    setError('');
    try {
      const updated = await api.games.sessions.move(session.id, 'answer', {
        questionId: question.id,
        choiceIndex,
        ts: Date.now(),
      });
      setSession(updated);
    } catch (e: any) {
      setError(e?.message || 'Réponse refusée');
    }
  };

  const answers = session?.state?.answers || {};
  const myAnswers: any[] = (me?.id && answers[me.id]) || [];
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="space-y-6">
      {!introDone && (
        <GameIntro title="Love Quiz Personnalisé" subtitle="Testez votre complicité — répondez et comparez." icon="🧠" duration={2200} onComplete={() => setIntroDone(true)} variant={mode === 'hot' ? 'intimate' : 'romantic'} />
      )}
      {introDone && (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Love Quiz Personnalisé</h1>
          <p className="text-gray-600">Répondez tous les deux, comparez vos réponses.</p>
        </div>
        <ModePicker mode={mode} onChange={setMode} />
      </div>

      {error && <Card className="p-4 text-red-600">{error}</Card>}

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={newQuestion} variant="secondary">
            Nouvelle question
          </Button>
          <Badge className="bg-gray-700">Mes réponses: {myAnswers.length}</Badge>
        </div>

        {!question ? (
          <p className="text-gray-700">Clique “Nouvelle question” pour commencer.</p>
        ) : (
          <>
            <GameCard variant="quiz" title="Question" animate>{question.prompt}</GameCard>
            <div className="grid gap-3">
              {(question.options?.choices || []).map((c: string, idx: number) => (
                <Button key={idx} className="game-btn w-full py-4 text-left justify-start rounded-xl" variant="outline" onClick={() => answer(idx)}>{c}</Button>
              ))}
            </div>
          </>
        )}
      </Card>
        </>
      )}
    </div>
  );
}

function DailyChallengeGame() {
  const me = useMe();
  const [mode, setMode] = useState<Mode>('soft');
  const [assignment, setAssignment] = useState<any>(null);
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setError('');
    try {
      const a = await api.games.daily.today(mode);
      setAssignment(a);
    } catch (e: any) {
      setError(e?.message || 'Impossible de charger le défi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const submit = async () => {
    setError('');
    try {
      await api.games.daily.submitToday({ text: payload }, mode);
      setPayload('');
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Impossible de soumettre');
    }
  };

  const validate = async (completionId: string) => {
    setError('');
    try {
      await api.games.daily.validateCompletion(completionId);
      await refresh();
    } catch (e: any) {
      setError(e?.message || 'Impossible de valider');
    }
  };

  if (loading) return <Card className="p-6">Chargement…</Card>;

  const completions: any[] = assignment?.completions || [];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Défi Quotidien</h1>
          <p className="text-gray-600">1 défi / jour, validation manuelle, timer 24h.</p>
        </div>
        <ModePicker mode={mode} onChange={setMode} />
      </div>

      {error && <Card className="p-4 text-red-600">{error}</Card>}

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-600" />
          <p className="text-gray-900 font-semibold">{assignment?.challenge?.prompt}</p>
        </div>

        <div className="grid gap-2 max-w-lg">
          <label className="text-sm text-gray-600">Votre preuve / message (simple)</label>
          <input
            className="px-4 py-2 border rounded-lg"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Ex: fait ✅ + petit mot…"
          />
          <Button onClick={submit}>Je l’ai fait</Button>
        </div>

        <div className="pt-2 border-t">
          <p className="font-semibold text-gray-900 mb-2">Validations</p>
          {completions.length === 0 ? (
            <p className="text-gray-600">Aucune soumission pour l’instant.</p>
          ) : (
            <div className="space-y-2">
              {completions.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-2">
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {c.userId === me?.id ? 'Vous' : 'Partenaire'}
                    </span>
                    {c.validatedAt ? (
                      <span className="ml-2 text-green-700">validé</span>
                    ) : (
                      <span className="ml-2 text-gray-500">en attente</span>
                    )}
                  </div>
                  {!c.validatedAt && c.userId !== me?.id && (
                    <Button variant="outline" onClick={() => validate(c.id)}>
                      Valider
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function WouldYouRatherGame() {
  const [mode, setMode] = useState<Mode>('soft');
  const [session, setSession] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const s = await api.games.sessions.create('would-you-rather', { mode });
        setSession(s);
        setCard(s?.state?.lastCard || null);
      } catch (e: any) {
        setError(e?.message || 'Impossible de charger');
      }
    })();
  }, [mode]);

  const newCard = async () => {
    if (!session?.id) return;
    setError('');
    const q = await api.games.questions.random('would_you_rather', mode);
    const payload = { type: 'would_you_rather', mode, ...q };
    const updated = await api.games.sessions.move(session.id, 'draw_card', payload);
    setSession(updated);
    setCard(payload);
  };

  const choose = async (choice: 'a' | 'b') => {
    if (!session?.id || !card) return;
    await api.games.sessions.move(session.id, 'answer', { questionId: card.id, choice });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tu préfères</h1>
          <p className="text-gray-600">Swipe (version simple), comparez vos choix.</p>
        </div>
        <ModePicker mode={mode} onChange={setMode} />
      </div>

      {error && <Card className="p-4 text-red-600">{error}</Card>}

      <Card className="p-6 space-y-4">
        <Button onClick={newCard} variant="secondary">
          Nouvelle carte
        </Button>

        {!card ? (
          <p className="text-gray-700">Clique “Nouvelle carte”.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900">{card.prompt}</p>
            <div className="grid gap-2">
              <Button onClick={() => choose('a')} variant="outline">
                {card.options?.a || 'Option A'}
              </Button>
              <Button onClick={() => choose('b')} variant="outline">
                {card.options?.b || 'Option B'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function MoreLessGame() {
  const [session, setSession] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      try {
        const s = await api.games.sessions.create('more-less', {});
        setSession(s);
      } catch (e: any) {
        setError(e?.message || 'Impossible de démarrer');
      }
    })();
  }, []);

  const submit = async () => {
    if (!session?.id) return;
    setError('');
    try {
      const updated = await api.games.sessions.move(session.id, 'guess', { guess: Number(guess) });
      setSession(updated);
      setGuess('');
    } catch (e: any) {
      setError(e?.message || 'Guess invalide');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">Plus ou Moins</h1>
      {error && <Card className="p-4 text-red-600">{error}</Card>}
      <Card className="p-6 space-y-3">
        <p className="text-gray-700">Devine le nombre secret (1–100).</p>
        <div className="flex gap-2 max-w-sm">
          <input
            className="flex-1 px-4 py-2 border rounded-lg"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Ex: 42"
          />
          <Button onClick={submit}>OK</Button>
        </div>
        <div className="text-gray-900 font-semibold">{session?.state?.hint || ''}</div>
        {session?.status === 'completed' && <Badge className="bg-pink-600">Gagné 🎯</Badge>}
      </Card>
    </div>
  );
}

function WheelGame() {
  const [mode, setMode] = useState<Mode>('soft');
  const [session, setSession] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setError('');
      const s = await api.games.sessions.create('wheel', { mode });
      setSession(s);
      setResult(s?.state?.lastCard || null);
    })().catch((e: any) => setError(e?.message || 'Impossible de charger'));
  }, [mode]);

  const spin = async () => {
    if (!session?.id) return;
    setError('');
    setSpinning(true);
    try {
      const types = ['compliment', 'surprise', 'truth', 'dare'] as const;
      const pick = types[Math.floor(Math.random() * types.length)];
      await new Promise((r) => setTimeout(r, 900));
      const q = await api.games.questions.random(pick, mode);
      const payload = { type: pick, mode, ...q };
      const updated = await api.games.sessions.move(session.id, 'draw_card', payload);
      setSession(updated);
      setResult(payload);
    } catch (e: any) {
      setError(e?.message || 'Impossible de tourner');
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roue des Surprises</h1>
          <p className="text-gray-600">Spin → compliment / défi / question (soft, romantique, hot).</p>
        </div>
        <ModePicker mode={mode} onChange={setMode} />
      </div>

      {error && <Card className="p-4 text-red-600">{error}</Card>}

      <Card className="p-6 text-center space-y-4">
        <Button onClick={spin} disabled={spinning}>
          <RotateCw className={`w-4 h-4 mr-2 ${spinning ? 'animate-spin' : ''}`} />
          {spinning ? 'Ça tourne…' : 'Tourner'}
        </Button>
        {result && (
          <div>
            <Badge className="bg-gray-700">{result.type}</Badge>
            <p className="mt-2 text-lg font-semibold text-gray-900">{result.prompt}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function ComplimentsGame() {
  const me = useMe();
  const [mode, setMode] = useState<Mode>('romantic');
  const [session, setSession] = useState<any>(null);
  const [prompt, setPrompt] = useState<any>(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [introDone, setIntroDone] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const { playSound } = useGameSound(true);

  useEffect(() => {
    (async () => {
      setError('');
      const s = await api.games.sessions.create('compliments', { mode });
      setSession(s);
      setPrompt(s?.state?.lastCard || null);
    })().catch((e: any) => setError(e?.message || 'Impossible de charger'));
  }, [mode]);

  const generate = async () => {
    if (!session?.id) return;
    setError('');
    playSound('tap');
    try {
      const q = await api.games.questions.random('compliment', mode);
      const payload = { type: 'compliment', mode, ...q };
      const updated = await api.games.sessions.move(session.id, 'draw_card', payload);
      setSession(updated);
      setPrompt(payload);
      playSound('success');
    } catch (e: any) {
      setError(e?.message || 'Impossible de générer');
    }
  };

  const send = async () => {
    if (!session?.id || !text.trim()) return;
    setError('');
    playSound('tap');
    try {
      await api.games.sessions.move(session.id, 'answer', { text: text.trim(), ts: Date.now() });
      setText('');
      playSound('success');
    } catch (e: any) {
      setError(e?.message || 'Impossible d’envoyer');
    }
  };

  const count = (me?.id && session?.state?.answers?.[me.id]?.length) || 0;

  const handleShowConclusion = () => {
    setShowConclusion(true);
    playSound('celebration');
  };

  if (showConclusion) {
    return (
      <div className="space-y-4">
        <GameConclusion
          title="Compliment Rain"
          message="Vous avez fait pleuvoir l’amour."
          score={count}
          scoreLabel="compliments envoyés"
          footer="À bientôt pour une nouvelle pluie."
          icon="🌧️❤️"
          onAction={() => setShowConclusion(false)}
          actionLabel="Continuer"
          variant={mode === 'hot' ? 'intimate' : 'romantic'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!introDone && (
        <GameIntro
          title="Compliment Rain"
          subtitle="Une pluie de compliments — tapez pour faire éclater les mots en cœurs."
          icon="🌧️❤️"
          duration={2500}
          onComplete={() => setIntroDone(true)}
          variant={mode === 'hot' ? 'intimate' : 'romantic'}
        />
      )}

      {introDone && (
        <>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compliment Rain</h1>
              <p className="text-gray-600">Générez des mots doux, écrivez librement — mode hot pour mots plus suggestifs.</p>
            </div>
            <ModePicker mode={mode} onChange={setMode} />
          </div>

          {error && <Card className="p-4 text-red-600">{error}</Card>}

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={generate} variant="secondary" className="transition active:scale-[0.98]">
                Générer
              </Button>
              <Badge className="bg-gray-700">Mes messages: {count}</Badge>
            </div>

            {prompt && (
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-pink-600 mt-1 shrink-0" />
                <p className="text-gray-900 font-semibold">{prompt.prompt}</p>
              </div>
            )}

            <div className="grid gap-2 max-w-xl">
              <textarea
                className="px-4 py-3 border rounded-lg min-h-28 transition focus:ring-2 focus:ring-pink-300"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écris quelque chose de doux, vrai, un peu coquin (sans explicite)…"
              />
              <Button onClick={send} className="transition active:scale-[0.98]">Envoyer</Button>
            </div>

            <Button variant="outline" onClick={handleShowConclusion} className="mt-4">
              Voir ma conclusion
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}

function TelepathyPlaceholder() {
  return (
    <Card className="p-8 text-center">
      <div className="text-4xl mb-4">❤️</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Telepathy Love</h1>
      <p className="text-gray-600 mb-4">
        Même question, réponses en secret — révélation simultanée avec halo doré si vous matchez. Compte à rebours circulaire, connexion qui monte.
      </p>
      <Badge className="bg-amber-100 text-amber-800">Bientôt disponible</Badge>
    </Card>
  );
}

function LoveLetterPlaceholder() {
  return (
    <Card className="p-8 text-center">
      <div className="text-4xl mb-4">💌</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Love Letter Game</h1>
      <p className="text-gray-600 mb-4">
        Écris un message brut — l’IA le transforme en lettre romantique avec animation manuscrite. Version hot plus sensuelle et artistique.
      </p>
      <Badge className="bg-red-100 text-red-800">Bientôt disponible</Badge>
    </Card>
  );
}

function MoodGardenPlaceholder() {
  return (
    <Card className="p-8 text-center">
      <div className="text-4xl mb-4">🌿</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mood Garden</h1>
      <p className="text-gray-600 mb-4">
        Joie → tournesol, Désir → rose, Manque → lavande, Amour → cerisier. Chaque émotion plante une fleur dans votre jardin partagé.
      </p>
      <Badge className="bg-emerald-100 text-emerald-800">Bientôt disponible</Badge>
    </Card>
  );
}
