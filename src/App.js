import React, { useState, useEffect } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousMessages((previousMessages) => [
        ...previousMessages,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle, value]);

  const handleCreateNewChat = () => {
    setMessage("");
    setValue("");
    setCurrentTitle("");
  };
  const handleGetMessages = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );

      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickTitle = (title) => {
    setCurrentTitle(title);
    setMessage("");
    setValue("");
  };

  const currentChat = previousMessages.filter(
    (previousMessage) => previousMessage.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousMessages.map((previousMessage) => previousMessage.title))
  );

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={handleCreateNewChat}>+ New chat</button>

        <ul className="history">
          {uniqueTitles?.map((title, index) => (
            <li key={`title_${index}`} onClick={() => handleClickTitle(title)}>
              {title}
            </li>
          ))}
        </ul>

        <nav>
          <p>Made by GrafSoul</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && <h1>My Friend ChatGPT</h1>}

        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li
              key={`chat_${index}`}
              className={chatMessage.role === "user" ? "" : "bot"}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>

        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              placeholder="Type your message here"
              value={value}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGetMessages();
                }
              }}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={handleGetMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </div>
      </section>
    </div>
  );
};

export default App;
