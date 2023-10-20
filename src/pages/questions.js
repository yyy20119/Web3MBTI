import React from "react";
import { useNetwork } from 'wagmi'
import questions from "../constants/questions.json"
import abi from "../constants/abi.json"
import { useEffect, useState } from "react"
import { RadioGroup, Radio } from "@nextui-org/react";
import WriteButton from "../components/button/WriteButton";
import networkMapping from "../constants/networkMapping.json"



function QuestionsPage() {
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length).fill(undefined))
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const { chain } = useNetwork()
  const [chainId, setChainId] = useState(0)

  useEffect(() => {
    if (chain != undefined) {
      setChainId(chain.id)
    }
    else {
      setChainId(0)
    }
  },
    [chain]
  )


  const handleAnswerSelection = (questionIndex, answerIndex) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setUserAnswers(updatedAnswers);
    setIsQuizComplete(updatedAnswers.every(answer => answer !== undefined))
    console.log(updatedAnswers)
    console.log(isQuizComplete)
  };

  return (
    <div id="mainContainer">
      <h1 class="text-2xl font-semibold text-indigo-600">Web3MBTI</h1>
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            {/* <h2>{question.question}</h2> */}
            <RadioGroup
              label={question.question}
            >
              <Radio value="answer1" onChange={() => handleAnswerSelection(index, 0)}>{question.answer1}</Radio>
              <Radio value="answer2" onChange={() => handleAnswerSelection(index, 1)}>{question.answer2}</Radio>
            </RadioGroup>
            <br></br>

            {/* <div>
            <label>
              <input
                type="radio"
                name={`answer-${index}`}
                value="0"
                onChange={() => handleAnswerSelection(index, 0)}
                checked={userAnswers[index] === 0}
              />
              {question.answer1}
            </label>
          </div>
          <div>
            <label>
              <input
                type="radio"
                name={`answer-${index}`}
                value="1"
                onChange={() => handleAnswerSelection(index, 1)}
                checked={userAnswers[index] === 1}
              />
              {question.answer2}
            </label>
          </div>
          <br></br> */}
          </div>
        ))}
      </div>
      {(chainId != 0 && chainId in networkMapping) ? (
        <WriteButton
          abi={abi}
          functionName={"updateMBTIResult"}
          userAnswers={userAnswers}
          value={"0"}
          disabled={!isQuizComplete}
          chainId={chainId}>
          Submit
        </WriteButton>) : (<div>Please switch to the right network.</div>)}
      {!isQuizComplete && <div>Please answer all questions before submitting.</div>}
    </div>
  );

}


export default QuestionsPage;
