import { useState } from "react";
import {
  GptMessage,
  MyMessage,
  TextMessageBoxFile,
  TypingLoader,
} from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

const audioToText = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);

    // Todo UseCase

    const resp = await audioToTextUseCase(audioFile, text);

    if (!resp) return;

    const gptMessage = `
      ## Transcripción: 
      __Duración:__ ${Math.round(resp.duration)}
      ## El texto fue  
      ${resp.text}
    `;

    setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

    for (const segment of resp.segments) {
      const segmentMessage = `
      __De ${Math.round(segment.start)} a ${Math.round(
        segment.end
      )} segundos: __
      ${segment.text}
      
      `;

      setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
    }

    setIsLoading(false);

    // Todo add isGPT message in true
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/* Bienvenida  */}
          <GptMessage text="¿Que audio deseas generar hoy?" />

          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessage key={index} text={message.text} />
            ) : (
              <MyMessage
                key={index}
                text={
                  message.text === "" ? "Transcribe el audio" : message.text
                }
              />
            )
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 fade-in">
              <TypingLoader className="fade-in" />
            </div>
          )}
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Escribe aqui tu consulta"
        disableCorrections
        accept="audio/*"
      />
    </div>
  );
};

export default audioToText;
