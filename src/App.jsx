import { useState } from "react";
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: "tu-id-organizacion",
  apiKey: "tu-api-key-openai",
});

const openai = new OpenAIApi(configuration);

function App() {

  const [mensaje, setMensaje] = useState("");
  const [chats, setChats] = useState([]); 
  const [estaEscribiendo, setEstaEscribiendo] = useState(false);

  const chat = async (e, mensaje) =>{
    e.preventDefault();

    if (!mensaje) return;


    setEstaEscribiendo(true);

    let mensajes = chats;
    mensajes.push({ role: "user", content: mensaje});
    setChats(mensajes);

    scrollTo(0, 1e10);
    setMensaje('');

    await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Te llamas Hermes. Ayudas a las personas a elegir nombres para sus mascotas",
        },
        ...chats,
      ],
    }).then((result)=>{
      mensajes.push(result.data.choices[0].message);
      setChats(mensajes);
      setEstaEscribiendo(false);
      scrollTo(0, 1e10);

    }).catch((err) =>{
      console.log('Ha ocurrido un error: ' + err);
    })

  };

  return(
    <main>
      <h1>ReactGPT APP</h1>

      <section>
        {
          chats && chats.length ? (
            chats.map((chat, index)=>(
              <p key={index} className={chat.role === "user" ? "msg-usuario" : ""}>
                <span>
                  {chat.role}
                </span>
                <span>:</span>
                <span>
                  {chat.content}
                </span>
              </p>
            ))
          ) : ""
        }
      </section>

      <div className={estaEscribiendo ? "" : "esconder"}>
        <p>
          <i>{estaEscribiendo ? "Escribiendo" : ""}</i>
        </p>
      </div>


      <form onSubmit={e => chat(e, mensaje)}>
        <input 
          type="text" 
          name='mensaje' 
          value={mensaje} 
          placeholder="Escriba su mensaje y presione enter" 
          onChange={e => setMensaje(e.target.value)}
        />
      </form>
    </main>
  )
}

export default App;
