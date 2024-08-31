import { evaluate } from "mathjs";
import React, { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const isOperator = (char) => {
    return ["+", "-", "*", "/"].includes(char);
  };

  const hasDecimalPoint = (str) => {
    const lastPart = str.split(/[+\-*/]/).pop();
    return lastPart.includes(".");
  };

  const handleButtonClick = (value) => {
    const lastChar = input.slice(-1);

    if (isOperator(lastChar) && isOperator(value)) {
      setInput(input.slice(0, -1) + value);
    } else if (value === ".") {
      if (!hasDecimalPoint(input)) {
        setInput(input + value);
      }
    } else {
      setInput(input + value);
    }
  };

  const formatNumber = (number) => {
    const parts = number.toString().split("."); // Разделение целой и дробной части
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Форматирование целой части с пробелами
    return parts.join("."); // Соединение целой и дробной части обратно с точкой в качестве разделителя
  };

  const removeSpaces = (str) => {
    return str.replace(/\s+/g, "");
  };

  const handleEqualClick = () => {
    try {
      const cleanedInput = removeSpaces(input);
      let result = evaluate(cleanedInput);
      result = roundToTwoDecimalPlaces(result);
      const formattedResult = formatNumber(result);
      setInput(formattedResult);
      setHistory([...history, `${input} = ${formattedResult}`]);
    } catch {
      setInput("Error");
    }
  };

  const handleClearClick = () => {
    setInput("");
  };

  // Округление до 2х знаков после запятой
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  const handlePercentClick = () => {
    try {
      const result = evaluate(input) / 100; // Вычисляем 1% от текущего значения
      setInput(result.toString());
    } catch {
      setInput("Error");
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  return (
    <div className="calculator">
      <div className="display">{input}</div>
      <div className="buttons">
        <button onClick={handleClearClick}>C</button>
        <button onClick={handleBackspace}>←</button>
        <button onClick={handlePercentClick}>%</button>
        <button onClick={() => handleButtonClick("/")}>/</button>

        <button onClick={() => handleButtonClick("7")}>7</button>
        <button onClick={() => handleButtonClick("8")}>8</button>
        <button onClick={() => handleButtonClick("9")}>9</button>
        <button onClick={() => handleButtonClick("*")}>*</button>


        <button onClick={() => handleButtonClick("4")}>4</button>
        <button onClick={() => handleButtonClick("5")}>5</button>
        <button onClick={() => handleButtonClick("6")}>6</button>
        <button onClick={() => handleButtonClick("-")}>-</button>

        <button onClick={() => handleButtonClick("1")}>1</button>
        <button onClick={() => handleButtonClick("2")}>2</button>
        <button onClick={() => handleButtonClick("3")}>3</button>
        <button onClick={() => handleButtonClick("+")}>+</button>

        <button onClick={() => handleButtonClick("0")}>0</button>
        <button onClick={() => handleButtonClick(".")}>.</button>
        <button onClick={() => handleEqualClick()}>=</button>

        
      </div>
      <div className="history-toggle">
        <h2>История запросов:</h2>
        <button onClick={toggleHistoryVisibility}>
          {isHistoryVisible ? "Скрыть" : "Показать"}
        </button>
      </div>

      {isHistoryVisible && (
        <div className="history">
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calculator;
