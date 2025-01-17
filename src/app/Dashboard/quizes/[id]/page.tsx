"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSession, useSession } from "next-auth/react";

interface Quiz {
  _id: string;
  title: string;
  numberOfQuestions: number;
}

interface Question {
  question: string;
  answers: { key: string; answer: string }[];
  correct: string;
  exam?: { duration?: number };
}

export default function QuizDetails() {
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [hasExamStarted, setHasExamStarted] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const params = useParams();
  const id = params?.id;

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchQuizDetails = async () => {
    try {
      const session = await getSession();
      console.log("ssss",session)
      if (!session || !session.accessToken) {
        setError("No token found in session");
        setLoading(false);
        return;
      }
      const response = await fetch(
        `https://exam.elevateegy.com/api/v1/exams?subject=${id}`,
        {
          method: "GET",
          headers: {
            token: session.accessToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quiz details");
      }

      const data = await response.json();
      setQuizzes(data.exams || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId: string) => {
    try {
      const response = await fetch(
        `https://exam.elevateegy.com/api/v1/questions?exam=${quizId}`,
        {
          method: "GET",
          headers: {
            token: session?.accessToken || "",
            "Content-Type": "application/json",
          },
        }
      );console.log("response",response)
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.questions || []);
      setCorrectAnswers(data.questions.map((q: Question) => q.correct || ""));
      setTimer((data.questions[0]?.exam?.duration || 0) * 60);
      setTimerActive(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching questions");
    }
  };
  useEffect(() => {
    if (id) fetchQuizDetails();
  }, [id, session]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      handleFinishQuiz();
      setTimerActive(false);
    }

    return () => interval && clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    fetchQuestions(quiz._id);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowInstructions(false);
    setHasExamStarted(true); // Set to true when the exam starts
  };

  const handleFinishQuiz = () => {
    let correct = 0;
    let incorrect = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        correct++;
      } else {
        incorrect++;
      }
    });
console.log("answers",userAnswers)
    setCorrectCount(correct);
    setIncorrectCount(incorrect);
    setScore((correct / questions.length) * 100);
    setShowResults(true);
    setTimerActive(false);
    setHasExamStarted(false); // Set to false when the exam ends
  };

  const handleAnswerSelect = (answerKey: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answerKey;
    setUserAnswers(updatedAnswers);

    const updatedAnsweredQuestions = [...answeredQuestions];
    updatedAnsweredQuestions[currentQuestionIndex] = true;
    setAnsweredQuestions(updatedAnsweredQuestions);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleFinishQuiz();
    }
  };
 // Handle comparison and show results
  const compareAnswers = () => {
    const updatedQuestions = questions.map((question) => {
      const userAnswer = userAnswers[question._id];
      return {
        ...question,
        isCorrect: userAnswer === question.correct,
        userAnswer,
      };
    });
    setQuestions(updatedQuestions);
  };
  if (loading) return <h1>Loading quiz details...</h1>;
  if (error) return <h1 className="text-red-500">{error}</h1>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Available Quizzes</h1>
      <div className="space-y-4">
        {quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img src="/bro.png" alt={quiz.title} className="w-12 h-12" />
                <div>
                  <h2 className="text-lg font-semibold">{quiz.title}</h2>
                  <p>{quiz.numberOfQuestions} Questions</p>
                </div>
              </div>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                onClick={() => {
                  setShowInstructions(true);
                  setActiveQuiz(quiz);
                }}
              >
                Start
              </button>
            </div>
          ))
        ) : (
          <p>No quizzes available for this subject.</p>
        )}
      </div>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Read all questions carefully.</li>
              <li>You cannot go back to previous questions.</li>
              <li>Make sure to answer all questions.</li>
              <li>Click "Start Exam" to begin.</li>
            </ul>
            <div className="mt-6 text-center">
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => handleStartQuiz(activeQuiz!)}
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {activeQuiz && !showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg shadow-lg w-2/5 p-6">
            <header className="text-center">
              <div className="flex justify-between items-center mb-4">
                <p>Time Remaining: {formatTime(timer)}</p>
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              </div>
              <div className="flex justify-center mb-4">
                {questions.map((_, index) => (
                  <span
                    key={index}
                    className={`w-4 h-4 mx-1 rounded-full ${
                      answeredQuestions[index] ? "bg-blue-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {questions[currentQuestionIndex]?.question || "No Question"}
              </h2>
            </header>
            <main className="mt-4">
              <div className="space-y-3">
                {questions[currentQuestionIndex]?.answers.map((answer, index) => (
                  <label
                    key={index}
                    className="flex items-center border rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <input
                      type="radio"
                      name="question"
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                      onClick={() => handleAnswerSelect(answer.key)}
                    />
                    <span className="ml-3 text-gray-700">{answer.answer}</span>
                  </label>
                ))}
              </div>
            </main>
            <footer className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setActiveQuiz(null)}
              >
                Back
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={handleFinishQuiz}
                  disabled={!userAnswers[currentQuestionIndex]}
                >
                  Finish
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  onClick={handleNextQuestion}
                  disabled={!userAnswers[currentQuestionIndex]}
                >
                  Next
                </button>
              )}
            </footer>
          </div>
        </div>
      )}

      {showResults && !hasExamStarted && correctCount + incorrectCount > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 text-center">
            <h1 className="text-xl font-bold text-gray-800">Your Score</h1>
            <div className="flex justify-center items-center my-4">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ddd"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                  />
                </svg>
                <span className="absolute inset-0 flex justify-center items-center text-lg font-semibold">
                  {score.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="text-lg">
              <p className="text-blue-600">Correct: {correctCount}</p>
              <p className="text-red-600">Incorrect: {incorrectCount}</p>
            </div>
            <button
              className="mt-6 w-2/5 px-9 mx-2 py-2 bg-transparent text-blue-800 border border-blue-800 rounded-full hover:bg-blue-600 hover:text-white"
              onClick={() => setShowResults(false)}
            >
              Back
            </button>
            <button
              className="mt-6 w-2/5 px-7 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              onClick={() => setShowResultPopup(true)} // Show the popup
            >
              Show Result
            </button>
          </div>
        </div>
      )}

      {/* Add this for the result popup */}
      {showResultPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl flex flex-col space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex flex-row flex-wrap gap-6">
              {questions.map((question, questionIndex) => (
                <section key={question._id} className="flex-1 min-w-[45%] space-y-3">
                  <h2 className="text-lg font-semibold">{question.question}</h2>
                  <div className="space-y-1">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg ${
                          answer.key === correctAnswers[questionIndex]
                            ? "bg-green-50 border-green-300"
                            : userAnswers[questionIndex] === answer.key
                            ? "bg-red-50 border-red-300"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          checked={userAnswers[questionIndex] === answer.key}
                          readOnly
                          className={`w-5 h-5 border-gray-300 rounded focus:ring ${
                            answer.key === correctAnswers[questionIndex]
                              ? "focus:ring-green-500"
                              : "focus:ring-red-500"
                          }`}
                        />
                        <span
                          className={`${
                            answer.key === correctAnswers[questionIndex]
                              ? "text-green-700"
                              : userAnswers[questionIndex] === answer.key
                              ? "text-red-700"
                              : "text-gray-700"
                          }`}
                        >
                          {answer.answer}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 text-right">
              <button
                onClick={() => setShowResultPopup(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
