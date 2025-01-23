import { useState, useEffect, useRef } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

function App() {
  const { user, signOut } = useAuthenticator();
  const [messages, setMessages] = useState<Array<{ id: number; content: string; sender: string }>>([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 메시지 추가 함수
  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, content: input, sender: user.username },
      ]);
      setInput(""); // 입력 필드 초기화
    }
  };

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enter 키 기본 동작(줄바꿈)을 방지
      sendMessage(); // 메시지 전송
    }
  };

  return (
    <main style={mainContainerStyle}>
      <div style={chatContainerStyle}>
        <header style={headerStyle}>
          <h1 style={{ margin: 0 }}>Chat Room</h1>
          <div>
            <span style={welcomeTextStyle}>Logged in as: <strong>{user.username}</strong></span>
            <button onClick={signOut} style={logoutButtonStyle}>Sign out</button>
          </div>
        </header>
        <div ref={chatBoxRef} style={chatBoxStyle}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>No messages yet. Start chatting!</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...messageStyle,
                  alignSelf: msg.sender === user.username ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === user.username ? "#d1f7c4" : "#f1f0f0",
                }}
              >
                <strong style={{ color: "#673ab7" }}>{msg.sender}:</strong> {msg.content}
              </div>
            ))
          )}
        </div>
        <div style={inputContainerStyle}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Enter 키를 감지하는 이벤트
            placeholder="Type your message..."
            style={inputStyle}
          />
          <button onClick={sendMessage} style={sendButtonStyle}>
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

// 스타일 정의
const mainContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f0f2f5",
  fontFamily: "Arial, sans-serif",
};

const chatContainerStyle = {
  display: "flex",
  flexDirection: "column" as "column",
  width: "80%",
  maxWidth: "900px",
  height: "80vh",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 20px",
  backgroundColor: "#673ab7", // 보라색 배경
  color: "white",
  borderBottom: "1px solid #ccc",
};

const welcomeTextStyle = {
  marginRight: "10px",
};

const logoutButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "white",
  color: "#673ab7",
  border: "1px solid #673ab7",
  borderRadius: "5px",
  cursor: "pointer",
};

const chatBoxStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column" as "column",
  padding: "15px",
  overflowY: "auto" as "auto", // 스크롤 자동으로 표시
  backgroundColor: "#f9f9f9",
};

const messageStyle = {
  maxWidth: "70%",
  padding: "10px",
  margin: "5px 0",
  borderRadius: "10px",
  fontSize: "14px",
  lineHeight: "1.5",
};

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  padding: "10px 15px",
  borderTop: "1px solid #ccc",
};

const inputStyle = {
  flex: 1,
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  marginRight: "10px",
};

const sendButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#673ab7",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

export default App;
