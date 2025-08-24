import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Chatbot.css";
import mascot from "../assets/chat.png"; 

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatContentRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = {
      type: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://vivutravel.net/api/Tour/recommend",
        { userInput: userInput },
        { headers: { "Content-Type": "application/json" } }
      );
      
      const botResponse = response.data;
      let botMessageContent = "";
      let isTourRecommendation = false;

      // Kiểm tra xem có phải là tour recommendation không
      if (botResponse.isTourRecommendation && botResponse.tourRecommendation) {
        // Hiển thị tour recommendation
        isTourRecommendation = true;
        const tour = botResponse.tourRecommendation;
        
        const price = tour.price != null
          ? tour.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          : "Không có thông tin";

        botMessageContent = [
          "🎯 **Gợi ý tour phù hợp**:",
          `**${tour.tourName}**`,
          "",
          "📍 **Thông tin chi tiết**:",
          `• **Điểm đến**: ${tour.destinationName}`,
          `• **Khởi hành từ**: ${tour.departurePointName}`,
          `• **Thời gian**: ${tour.durationDays}`,
          `• **Giá**: ${price}`,
          `• **Ngày khởi hành**: ${tour.departureDate}`,
          "",
          "💡 Bạn có muốn tìm hiểu thêm về tour này hoặc tìm tour khác không?"
        ].join("\n");
      } else {
        // Hiển thị general chat response
        botMessageContent = botResponse.message || "Xin lỗi, tôi không hiểu yêu cầu của bạn.";
      }

      const botMessage = {
        type: "bot",
        content: botMessageContent,
        isTourRecommendation: isTourRecommendation,
        tourId: isTourRecommendation ? botResponse.tourRecommendation?.tourId : null,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err.response?.data?.Message || 
                          err.response?.data?.message || 
                          "Đã xảy ra lỗi khi xử lý yêu cầu của bạn.";
      
      const botMessage = {
        type: "bot",
        content: `❌ **Lỗi**: ${errorMessage}`,
        isTourRecommendation: false,
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([]);
  };

  // Copy message to clipboard
  const handleCopyMessage = (content) => {
    navigator.clipboard
      .writeText(
        content
          .replace(/<span class="highlight-[^"]*">|<\/span>/g, "")
          .replace(/\*\*.*?\*\*: /g, "")
          .replace(/\n/g, "\n")
      )
      .then(() => {
        alert("Đã sao chép tin nhắn!");
      });
  };

  // Format message content with proper styling
  const formatMessageContent = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
      .replace(/🎯/g, '<span class="emoji">🎯</span>')
      .replace(/📍/g, '<span class="emoji">📍</span>')
      .replace(/💡/g, '<span class="emoji">💡</span>')
      .replace(/❌/g, '<span class="emoji">❌</span>')
      .replace(/•/g, '<span class="bullet">•</span>');
  };

  // SVG paths for readability
  const closeIconPath = "M6 18L18 6M6 6l12 12";
  const chatIconPath = `
        M8 12h.01M12 12h.01M16 12h.01
        M21 12c0 4.418-4.03 8-9 8
        a9.863 9.863 0 01-4.255-.949
        L3 20l1.395-3.72
        C3.512 15.042 3 13.574 3 12
        c0-4.418 4.03-8 9-8
        s9 3.582 9 8z
    `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="chatbot-wrapper">
      <button
        className="chatbot-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
      >
        <img src={mascot} alt="Chatbot Icon" className="chatbot-icon-img" />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-logo">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ffffff" />
                <path d="M2 17L12 22L22 17" fill="#ffffff" />
                <path d="M2 12L12 17L22 12" fill="#ffffff" />
              </svg>
            </div>
            <h2 className="chatbot-title">Vivi Bot</h2>
            <button
              className="chatbot-clear-button"
              onClick={handleClearChat}
              aria-label="Xóa lịch sử trò chuyện"
              title="Xóa lịch sử trò chuyện"
            >
              <svg
                className="chatbot-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              className="chatbot-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chatbot"
            >
              <svg
                className="chatbot-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="chatbot-content" ref={chatContentRef}>
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <div className="welcome-header">👋 Chào bạn! Tôi là Vivi Bot</div>
                <div className="welcome-content">
                  Tôi có thể giúp bạn:
                  <ul>
                    <li>🔍 Tìm kiếm tour phù hợp</li>
                    <li>💬 Trò chuyện về du lịch</li>
                    <li>📅 Tư vấn thời gian đi</li>
                    <li>💰 Gợi ý tour theo ngân sách</li>
                  </ul>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.type === "user"
                    ? "chat-message-user"
                    : "chat-message-bot"
                }`}
              >
                <div className="chat-message-content">
                  {message.type === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(message.content),
                      }}
                    />
                  ) : (
                    <>{message.content}</>
                  )}
                  
                  {message.isTourRecommendation && message.tourId && (
                    <div className="tour-actions">
                      <Link
                        to={`/tour/tour-detail/${message.tourId}`}
                        className="chat-tour-link"
                      >
                        🔗 Xem chi tiết tour
                      </Link>
                    </div>
                  )}
                  
                  <button
                    className="chat-copy-button"
                    onClick={() => handleCopyMessage(message.content)}
                    title="Sao chép tin nhắn"
                  >
                    <svg
                      className="chat-copy-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7v8a2 2 0 002 2h6a2 2 0 002-2V7m-9-4h6a2 2 0 012 2v2m-8 0v2a2 2 0 01-2-2H4a2 2 0 012-2z"
                      />
                    </svg>
                  </button>
                  
                  <div className="chat-message-timestamp">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message chat-message-bot">
                <div className="chat-message-content chat-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="chatbot-form">
            <div className="input-group">
              <textarea
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="input-field"
                placeholder="Nhập yêu cầu của bạn..."
                disabled={isLoading}
                rows="1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isLoading}
                className="submit-button"
              >
                {isLoading ? "Đang xử lý..." : "Gửi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
