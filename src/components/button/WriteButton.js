import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import { useSnackbar } from "notistack";
import questions from "../../constants/questions.json"
import { Button } from "@nextui-org/react";
import { useRouter } from 'next/router';
import networkMapping from "../../constants/networkMapping.json"

function calculateMBTI(userAnswers) {
  const mbtiTypes = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // Loop through each question and calculate the MBTI type based on userAnswers
  for (let i = 0; i < userAnswers.length; i++) {
    const question = questions[i];
    const answerIndex = userAnswers[i];
    mbtiTypes[question.type1] += answerIndex === 0 ? 1 : 0;
    mbtiTypes[question.type2] += answerIndex === 1 ? 1 : 0;
  }

  // Calculate the MBTI result based on dichotomy counts
  let mbtiResult = '';

  if (mbtiTypes['E'] > mbtiTypes['I']) {
    mbtiResult += 'E';
  } else {
    mbtiResult += 'I';
  }

  if (mbtiTypes['S'] > mbtiTypes['N']) {
    mbtiResult += 'S';
  } else {
    mbtiResult += 'N';
  }

  if (mbtiTypes['T'] > mbtiTypes['F']) {
    mbtiResult += 'T';
  } else {
    mbtiResult += 'F';
  }

  if (mbtiTypes['J'] > mbtiTypes['P']) {
    mbtiResult += 'J';
  } else {
    mbtiResult += 'P';
  }

  const contractTypes = [
    "ISTJ", "ISFJ", "INFJ", "INTJ",
    "ISTP", "ISFP", "INFP", "INTP",
    "ESTP", "ESFP", "ENFP", "ENTP",
    "ESTJ", "ESFJ", "ENFJ", "ENTJ"
  ];

  return contractTypes.indexOf(mbtiResult);
}

const WriteButton = ({ onClick, children, abi, functionName, value, userAnswers, disabled, chainId }) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();
  const {
    config,
    isError: prepareIsError,
    error: prepareError,
  } = usePrepareContractWrite({
    address: networkMapping[chainId]['contractAddress'],
    abi,
    functionName,
    overrides: {
      value: ethers.utils.parseEther(value),
    },
    args: [calculateMBTI(userAnswers)],
  });

  const {
    data,
    error: writeError,
    isError: writeIsError,
    isLoading: writeIsLoading,
    write,
  } = useContractWrite({
    ...config,
    request: {
      ...config.request,
      gasLimit: Math.ceil(config?.request?.gasLimit * 1.2),
    },
  });

  const {
    data: txnRes,
    error: txnError,
    isError: txnIsError,
    isLoading: txnIsLoading,
    isSuccess: txnIsSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (txnIsSuccess) {
      console.log("Transaction success", txnRes);
      router.push('/')
    }
  }, [txnIsSuccess]);

  useEffect(() => {
    if (txnIsError) {
      enqueueSnackbar(txnError.message, { variant: "error" });
    }
  }, [txnIsError]);

  useEffect(() => {
    if (writeIsError) {
      enqueueSnackbar(writeError.message, { variant: "error" });
    }
  }, [writeIsError]);

  useEffect(() => {
    if (prepareIsError) {
      enqueueSnackbar(prepareError.message, { variant: "error" });
    }
  }, [prepareIsError]);

  const handleClick = () => {
    write?.();
    onClick?.();
  };
  return (
    <>
      <Button
        color="primary"
        isDisabled={!write || writeIsLoading || txnIsLoading || disabled}
        onClick={handleClick}
        id="inherit-button"
        isLoading={txnIsLoading}
      >
        {children}
      </Button>
      {prepareError && (
        <div>
          An error occurred preparing the transaction: {prepareError.message}
        </div>
      )}
    </>
  );
};

WriteButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
  abi: PropTypes.any.isRequired,
  functionName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  args: PropTypes.array.isRequired,
  userAnswers: PropTypes.array.isRequired,
  chainId: PropTypes.any.isRequired,
  disabled: PropTypes.bool.isRequired
};


export default WriteButton;
