import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBox,
  TypingLoader,
} from "../../components";
import { prosConsUseCase } from "../../../core/use-cases"

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    errors: string[];
    message: string;
  }
}

const ProsConsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // Todo UseCase

    const { ok, content } = await prosConsUseCase(text);
    setIsLoading(false);

    if (!ok ) return;

    setMessages((prev) => [...prev, { text: content, isGpt: true }]);

  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida  */}
          <GptMessage text="Hola, puedes responder con lo que quieres que te ayude a comparar." />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text}/>
            ) : (
              <MyMessage key={index} text={message.text} />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe aqui tu consulta"
        disableCorrections
      />
    </div>
  );
};

export default ProsConsPage;
