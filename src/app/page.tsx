"use client";

import { useEffect, FormEvent, useState, SetStateAction, useRef, KeyboardEvent } from "react";

import { Loader, SendHorizonal } from "lucide-react";

import PathList from "@/components/layout/PathList";
import Button from "@/components/ui/button";
import Input, { FieldGroup } from "@/components/ui/input";


import { useAlert } from "@/contexts/AlertMessageContext";
import { useSearchClub, useSearchPlayer, useStartGame, useSubmitGuess } from "@/hooks/game-hooks";
import { GameLogo } from "@/components/GameLogo";
import { useDebounce } from "@uidotdev/usehooks";
import { GameStep } from "@/services/game/game.types";
import { RenderAnimation } from "@/components/RenderAnimation";

import fireworksAnimation from '@/assets/fireworks.json'

const SESSION_ID_LS = '@connectplayers/session_id'

export default function Home() {
  const { mutateAsync: callStartGame, data: gameSession, isPending, isSuccess, isIdle } = useStartGame();
  const {
    mutateAsync: submitGuess,
    data: guessData,
    error: guessError,
    isPending: guessIsPending,
    isSuccess: guessIsSuccess,
    reset: resetGuessData } = useSubmitGuess()
  const { mutate: searchPlayer, data: searchPlayerData, reset: resetSearchPlayer } = useSearchPlayer()
  const { mutate: searchClub, data: searchClubData, reset: resetSearchClub } = useSearchClub()

  const inputRef = useRef<HTMLInputElement>(null)

  const [guess, setGuess] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<GameStep>('CLUB');
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(0);
  const [playAnimation, setPlayAnimation] = useState<boolean>(false);
  const selectedSuggestionRef = useRef<string | null>(null);

  const debouncedSearchTerm = useDebounce(guess, 300);
  const suggestions = (searchPlayerData || searchClubData) ?? [];

  const { showAlertMessage } = useAlert();

  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        return;
      }

      if (selectedSuggestionRef.current === debouncedSearchTerm) {
        return;
      }

      if (currentStep === 'CLUB') {
        searchClub(debouncedSearchTerm);
      } else {
        searchPlayer(debouncedSearchTerm);
      }
    }
    search()
  }, [currentStep, debouncedSearchTerm, searchClub, searchPlayer])


  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem(SESSION_ID_LS, gameSession.id)
    }
  }, [gameSession, isSuccess, showAlertMessage])

  useEffect(() => {
    const message = guessData?.GameStep === 'WIN' ? 'Congratulations, you win the game' : guessData?.message ?? guessError?.message ?? ''

    if (message?.length > 0) {
      showAlertMessage({
        title: message,
        type: guessData?.GameStep === 'WIN' ? 'success' : guessData?.type,
        autoClose: true
      })
    }
  }, [guessData, guessError, showAlertMessage])

  const handleOnStartGame = async () => {
    resetGuessData()
    resetSearchClub();
    resetSearchPlayer()
    setCurrentStep('CLUB')
    setPlayAnimation(false);
    await callStartGame();
  }

  const focusGuessInput = () => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleOnSubmitGuess = async (e: FormEvent<HTMLFormElement>) => {
    if (e !== null)
      e.preventDefault()

    if (guess.length === 0) {
      showAlertMessage({ title: `Informe um ${currentStep === 'PLAYER' ? 'player' : 'clube'} antes de enviar`, type: 'warning', autoClose: true })
      return;
    }

    const sessionId = localStorage.getItem(SESSION_ID_LS);
    if (!sessionId) {
      showAlertMessage({
        message: 'Erro ao encontrar o ID da sessão',
        type: 'error'
      })
    }

    const response = await submitGuess({
      input: guess,
      sessionId: sessionId!
    })
    setCurrentStep(response.GameStep);
    setPlayAnimation(response.GameStep === 'WIN');
    setGuess('')
    resetSearchClub();
    resetSearchPlayer()
    focusGuessInput();
  }

  const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
    setGuess(e.target.value)
    setHighlightedSuggestionIndex(0)
    selectedSuggestionRef.current = null
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedSuggestion = suggestions[highlightedSuggestionIndex];
      if (selectedSuggestion) {
        handleClickSuggestion(selectedSuggestion.fullName);
      }
    }
  };

  const handleClickSuggestion = (value: string) => {
    setGuess(value);
    resetSearchClub();
    resetSearchPlayer();
    setHighlightedSuggestionIndex(0)
    selectedSuggestionRef.current = value
    focusGuessInput();
  }


  return (
    <div className="flex flex-col items- justify-center gap-4 h-screen">
      {
        !isIdle && (
          <GameLogo className="mb-5" />
        )
      }
      {
        isIdle ? (
          <div className="flex flex-col gap-4 items-center justify-center h-75 w-full border border-amber-400 my-auto p-4">
            <GameLogo />
            <p className="text-white text-center">
              Test your football knowledge in a game of connections.
              Start with a player or a team and find the links between them through other players and clubs. Each connection must be valid — a player who played for both clubs, a teammate who shared the pitch, or another football connection.
              How many connections can you find? Build the chain, think carefully, and connect the stars of football.
            </p>
            <Button onClick={handleOnStartGame} disabled={isPending} >
              {isPending ? <Loader className="animate-spin" /> : isIdle ? 'Start Game' : 'restart Game'}
            </Button>
          </div>
        ) : (
          <PathList
            loading={isPending}
            gameList={guessIsSuccess ? guessData.gameList : gameSession?.gameList ?? []}
            playerFrom={gameSession?.playerFrom}
            win={guessData?.GameStep === 'WIN' || gameSession?.gameStep === 'WIN'}
          />
        )
      }
      <div className="text-white w-full text-center mt-5">
        {
          isSuccess && currentStep !== 'WIN' && (
            <>
              <p className="text-[14px]">Connect from <span className="uppercase text-sm font-bold text-amber-400">
                {gameSession?.playerTo.shortName}</span> to <span className="uppercase text-sm font-bold text-amber-400">{gameSession?.playerFrom.shortName}</span>
              </p>
            </>
          )
        }

        {
          !isIdle && currentStep !== 'WIN' && (
            <>
              <span className="text-[14px] font-bold">
                Choose a {currentStep === 'CLUB' ? 'Player' : 'Club'} to which the{" "}
                <span className="font-black uppercase text-amber-400">
                  {currentStep === 'CLUB' ? 'Club' : 'Player'}  on the left
                </span>{" "}
                has ties.
              </span>
              <br />
              <span className="font-thin text-[12px]">
                *To connect the players, they must have played together during the
                same period at the selected club.
              </span>
            </>
          )
        }

        {
          currentStep === 'WIN' && (
            <p className="text-xs">Congratulations, <span className="uppercase text-sm font-bold text-amber-400">you win the game</span></p>
          )
        }

      </div>
      {
        isSuccess && guessData?.GameStep !== 'WIN' && (
          <section className="flex justify-center mt-5">
            <form onSubmit={handleOnSubmitGuess} className="w-full">
              <FieldGroup>
                <div className="relative w-full">

                  <Input
                    ref={inputRef}
                    placeholder={guessIsPending ? "Loading..." : "Type here..."}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    value={guess}
                    autoFocus
                    disabled={guessIsPending}
                  />
                  {
                    suggestions.length > 0 && (
                      <div className="absolute bg-white top-full w-full max-h-50 overflow-y-auto">
                        {
                          suggestions.map((item: any, index) => (
                            <p
                              key={item.id}
                              className={`flex flex-col p-2 cursor-pointer font-bold uppercase ${highlightedSuggestionIndex === index ? 'bg-amber-100 text-black' : 'hover:bg-gray-300 text-black'}`}
                              onMouseDown={() => handleClickSuggestion(item.fullName)}
                            >
                              {item.fullName}
                              <span className="flex gap-2 items-center text-xs text-zinc-500">
                                {
                                  item.shortName && (
                                    <>
                                      <span>{item.shortName}</span>
                                    </>

                                  )
                                }

                                {
                                  item.age && (
                                    <>
                                      <span>{item.age} years</span>
                                    </>

                                  )
                                }
                              </span>

                            </p>
                          ))
                        }
                      </div>
                    )
                  }
                </div>

                <Button
                  className="flex justify-center items-center"
                  disabled={guessIsPending}
                  type="submit"
                >
                  {guessIsPending ? <Loader className="animate-spin" /> : <SendHorizonal />}
                </Button>
              </FieldGroup>
            </form>

          </section>
        )
      }
      {
        !isIdle &&
        <section className="flex w-full items-center justify-center mt-5">
          <Button onClick={handleOnStartGame} disabled={isPending} >
            {isPending && <Loader className="animate-spin" />}
            {isIdle && 'Start Game'}
            {guessData?.GameStep !== 'WIN' && 'restart Game'}
            {guessData?.GameStep === 'WIN' && 'new Game'}
          </Button>
        </section>
      }

      <RenderAnimation play={playAnimation} song={'/fireworks_song.mp3'} animationData={fireworksAnimation} />

    </div>
  );
}
