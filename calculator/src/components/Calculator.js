import { evaluate } from "mathjs";
import React, { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    } catch (error) {
      console.error("Evaluation error: ", error);
      setInput("Error");
    }
  };

  const handleClearClick = () => {
    setInput("");
  };

  // Округление до 2-х знаков после запятой
  const roundToTwoDecimalPlaces = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const toggleHistoryVisibility = () => {
    setIsHistoryVisible(!isHistoryVisible);
  };

  const handlePercentClick = () => {
    try {
      const result = evaluate(input) / 100; // Вычисление 1% от текущего значения
      setInput(result.toString());
    } catch (error) {
      console.error("Percent calculation error: ", error);
      setInput("Error");
    }
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  const handleAdvancedButtonClick = (value) => {
    try {
      switch (value) {
        case 'sin':
          setInput(`sin(${input})`);
          break;
        case 'cos':
          setInput(`cos(${input})`);
          break;
        case 'tan':
          setInput(`tan(${input})`);
          break;
        case '^2':
          setInput(`${input}^2`);
          break;
        case '√':
          setInput(`sqrt(${input})`);
          break;
        case '1/x':
          setInput(`1/${input}`);
          break;
        case 'π':
          setInput(`${input}*pi`);
          break;
        case 'e':
          setInput(`${input}*e`);
          break;
        default:
          setInput(`${input}${value}`);
      }
    } catch (error) {
      console.error("Advanced button error: ", error);
      setInput("Error");
    }
  };

  return (
    <div className="calculator">
      <div className="display">{input}</div>
      <div className={`buttons ${showAdvanced ? 'shifted' : ''}`}>
        <button className="button-clear" onClick={handleClearClick}>C</button>
        <button className="button-backspace" onClick={handleBackspace}>←</button>
        <button className="button-percent" onClick={handlePercentClick}>%</button>
        <button className="button-division" onClick={() => handleButtonClick("/")}>/</button>

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

        <button onClick={toggleAdvanced} className="button-advanced-toggle">
          {showAdvanced ? '-' : '+'}
        </button>
        <button onClick={() => handleButtonClick("0")}>0</button>
        <button onClick={() => handleButtonClick(".")}>.</button>
        <button onClick={handleEqualClick}>=</button>
      </div>

      {showAdvanced && (
        <div className="advanced-functions">
          <div className="advanced-row">
            <button onClick={() => handleAdvancedButtonClick('sin')}>sin</button>
            <button onClick={() => handleAdvancedButtonClick('cos')}>cos</button>
            <button onClick={() => handleAdvancedButtonClick('tan')}>tan</button>
            <button onClick={() => handleAdvancedButtonClick('^')}>x²</button>
            <button onClick={() => handleAdvancedButtonClick('√')}>√</button>
          </div>
          <div className="advanced-row">
            <button onClick={() => handleAdvancedButtonClick('1/x')}>1/x</button>
            <button onClick={() => handleAdvancedButtonClick('π')}>π</button>
            <button onClick={() => handleAdvancedButtonClick('e')}>e</button>
            <button onClick={() => handleAdvancedButtonClick('lg')}>lg</button>
            <button onClick={() => handleAdvancedButtonClick('ln')}>ln</button>
          </div>
          <div className="advanced-row">
            <button onClick={() => handleAdvancedButtonClick('(')}>(</button>
            <button onClick={() => handleAdvancedButtonClick(')')}>)</button>
          </div>
        </div>
      )}

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
