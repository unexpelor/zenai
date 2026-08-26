"use client";

import { useRef, useState } from "react";

export default function Home() {

  const [tab, setTab] =
    useState("command");

  const [text, setText] =
    useState("");

  const [image, setImage] =
    useState("");

  const [audio, setAudio] =
    useState("");

  const [audioMimeType, setAudioMimeType] =
    useState("");

  const [audioName, setAudioName] =
    useState("");

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);


  const [business, setBusiness] =
    useState(null);

  const [diagnosis, setDiagnosis] =
    useState(null);

  const [autopilotData, setAutopilotData] =
    useState(null);


  const [busy, setBusy] =
    useState(false);

  const [provider, setProvider] =
    useState("");

  const [days, setDays] =
    useState(7);



  const mediaRecorderRef =
    useRef(null);

  const mediaStreamRef =
    useRef(null);

  const audioChunksRef =
    useRef([]);

  const recordingTimerRef =
    useRef(null);

  const audioInputRef =
    useRef(null);



  const formatError = (value) => {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }


    if (
      typeof value === "string"
    ) {
      return value;
    }


    if (
      value instanceof Error
    ) {
      return value.message;
    }


    if (
      Array.isArray(value)
    ) {
      return value
        .map(formatError)
        .filter(Boolean)
        .join("\n");
    }


    try {

      return JSON.stringify(
        value,
        null,
        2
      );

    } catch {

      return String(value);

    }

  };




  const askAI = async(payload)=>{

    const response =
      await fetch(
        "/api/ai",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(payload),
        }
      );


    const result =
      await response.json();



    if(!response.ok){

      throw new Error(
        [
          formatError(
            result.message
          ) ||
          "AI gagal memproses permintaan.",

          formatError(
            result.details
          ),

          result.error
            ?
            `Error: ${formatError(result.error)}`
            :
            ""
        ]
        .filter(Boolean)
        .join("\n\n")
      );

    }


    setProvider(
      result.provider || ""
    );


    return result.text;

  };




  const extractJson = (rawResult)=>{

    const clean =
      String(rawResult || "")
      .replace(/```json/gi,"")
      .replace(/```/g,"")
      .trim();


    const start =
      clean.indexOf("{");


    const end =
      clean.lastIndexOf("}");



    if(
      start === -1 ||
      end === -1
    ){

      throw new Error(
        "AI tidak mengembalikan JSON valid."
      );

    }


    return JSON.parse(
      clean.substring(
        start,
        end + 1
      )
    );

  };




  const fileToBase64=(file)=>
    new Promise(
      (resolve,reject)=>{

        const reader =
          new FileReader();


        reader.onload=()=>{
          resolve(
            reader.result
          );
        };


        reader.onerror=()=>{
          reject(
            new Error(
              "Gagal membaca file."
            )
          );
        };


        reader.readAsDataURL(file);

      }
    );




  const handleImage=async(event)=>{

    const file =
      event.target.files?.[0];


    if(!file)
      return;



    if(
      !file.type.startsWith("image/")
    ){

      alert(
        "File harus berupa gambar."
      );

      return;

    }


    try{

      setImage(
        await fileToBase64(file)
      );


    }catch(error){

      alert(
        formatError(error) ||
        "Gagal membaca gambar."
      );

    }

  };




  const handleAudio=async(event)=>{

    const file =
      event.target.files?.[0];


    if(!file)
      return;



    if(
      !file.type.startsWith("audio/")
    ){

      alert(
        "File yang dipilih bukan audio."
      );

      return;

    }



    try{

      setAudio(
        await fileToBase64(file)
      );


      setAudioMimeType(
        file.type ||
        "audio/webm"
      );


      setAudioName(
        file.name ||
        "Voice Note"
      );



    }catch(error){

      alert(
        formatError(error) ||
        "Gagal membaca voice note."
      );

    }

  };




  const clearAudio=()=>{

    setAudio("");

    setAudioMimeType("");

    setAudioName("");

    setRecordingTime(0);



    if(audioInputRef.current){

      audioInputRef.current.value="";

    }

  };




  const formatRecordingTime=(seconds)=>{

    const minutes =
      Math.floor(
        seconds / 60
      );


    const remaining =
      seconds % 60;



    return `${String(minutes).padStart(2,"0")}:${String(remaining).padStart(2,"0")}`;

  };
  const stopMicrophone = () => {
    if (mediaStreamRef.current) {

      mediaStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });


      mediaStreamRef.current = null;
    }
  };




  const startRecording = async () => {

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      alert(
        "Browser ini tidak mendukung perekaman audio."
      );

      return;
    }



    if (
      typeof MediaRecorder === "undefined"
    ) {

      alert(
        "MediaRecorder tidak didukung."
      );

      return;
    }



    try {

      clearAudio();


      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio:true,
          }
        );


      mediaStreamRef.current =
        stream;



      const types = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ];



      const supportedType =
        types.find(
          (type)=>
            MediaRecorder.isTypeSupported(
              type
            )
        );



      const recorder =
        new MediaRecorder(
          stream,
          supportedType
          ?
          {
            mimeType:
              supportedType,
          }
          :
          {}
        );



      mediaRecorderRef.current =
        recorder;



      audioChunksRef.current=[];



      recorder.ondataavailable =
        (event)=>{

          if(
            event.data &&
            event.data.size > 0
          ){

            audioChunksRef.current.push(
              event.data
            );

          }

        };




      recorder.onstop =
        async()=>{

          try{

            clearInterval(
              recordingTimerRef.current
            );


            setIsRecording(false);



            const mimeType =
              recorder.mimeType ||
              "audio/webm";



            const blob =
              new Blob(
                audioChunksRef.current,
                {
                  type:mimeType,
                }
              );



            const extension =
              mimeType.includes("ogg")
              ?
              "ogg"
              :
              "webm";



            const file =
              new File(
                [
                  blob
                ],
                `zenai-vn-${Date.now()}.${extension}`,
                {
                  type:mimeType,
                }
              );



            setAudio(
              await fileToBase64(file)
            );


            setAudioMimeType(
              mimeType
            );


            setAudioName(
              "Voice Note ZENAI"
            );



          }catch(error){

            alert(
              formatError(error)
            );

          }
          finally{

            stopMicrophone();

          }

        };




      recorder.start();



      setRecordingTime(0);


      setIsRecording(true);



      recordingTimerRef.current =
        setInterval(
          ()=>{

            setRecordingTime(
              (current)=>
                current + 1
            );

          },
          1000
        );



    }catch(error){


      alert(
        "Gagal mengakses mikrofon."
      );


      setIsRecording(false);


      stopMicrophone();

    }

  };





  const stopRecording = ()=>{

    if(
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !==
      "inactive"
    ){

      mediaRecorderRef.current.stop();

    }


    clearInterval(
      recordingTimerRef.current
    );

  };







  const analyzeBusiness =
    async()=>{


    if(
      !text.trim() &&
      !image &&
      !audio
    ){

      alert(
        "Masukkan teks, gambar, atau voice note."
      );

      return;

    }



    setBusy(true);



    try{


      const prompt = `

Analisis informasi UMKM berikut.

INFORMASI TEKS:
${text.trim() || "Tidak ada"}


${
audio
?
`
VOICE NOTE:
Gunakan isi voice note sebagai informasi tambahan bisnis.
`
:
""
}


${
image
?
`
GAMBAR:
Analisis produk dari gambar yang tersedia.
`
:
""
}


Jangan membuat informasi yang tidak tersedia.

Balas JSON:

{
"product":"",
"description":"",
"price":"",
"target":"",
"problem":"",
"opportunity":"",
"keywords":[],
"visualSummary":"",
"nextStep":""
}

`;



      const raw =
        await askAI(
          {
            prompt,

            image,

            audio,

            audioMimeType,


            system:`

Anda adalah AI Business Analyst UMKM Indonesia.

Analisis hanya berdasarkan data yang diberikan.

Jangan membuat angka palsu,
persentase,
omzet,
atau fakta yang tidak ada.

Balas JSON valid.
`
          }
        );



      const parsed =
        extractJson(raw);



      setBusiness(
        parsed
      );


      setDiagnosis(null);


      setAutopilotData(null);


      setTab(
        "command"
      );



    }catch(error){


      alert(
        formatError(error)
      );


    }finally{


      setBusy(false);


    }

};








const runDiagnosis =
async()=>{


if(!business){

alert(
"Ceritakan usaha terlebih dahulu."
);

setTab("capture");

return;

}



setBusy(true);



try{


const prompt = `

Buat Business Diagnosis berdasarkan data berikut:

${JSON.stringify(
business,
null,
2
)}


Gunakan kategori:

1. areaPriority
2. attention
3. opportunity
4. strength


Jangan membuat:
- skor
- persentase
- angka
- omzet
- tren
tanpa data.


Balas JSON:

{
"summary":"",

"areaPriority":{
"title":"",
"summary":"",
"evidence":[],
"impact":"",
"recommendations":[]
},

"attention":{
"title":"",
"summary":"",
"evidence":[],
"impact":"",
"recommendations":[]
},

"opportunity":{
"title":"",
"summary":"",
"evidence":[],
"impact":"",
"recommendations":[]
},

"strength":{
"title":"",
"summary":"",
"evidence":[],
"impact":"",
"recommendations":[]
},

"dataUsed":[]
}

`;



const raw =
await askAI({

prompt,

system:`

Anda adalah Business Diagnosis Engine.

Buat diagnosis formal,
transparan,
dan berbasis bukti.

Jangan mengarang data.

`

});



setDiagnosis(
extractJson(raw)
);



setTab(
"diagnosis"
);



}catch(error){


alert(
formatError(error)
);


}
finally{

setBusy(false);

}


};








const runAutopilot =
async()=>{


if(!business){

alert(
"Ceritakan usaha terlebih dahulu."
);

setTab(
"capture"
);

return;

}



setBusy(true);



try{


const response =
await fetch(
"/api/autopilot",
{
method:"POST",

headers:{
"Content-Type":
"application/json",
},

body:JSON.stringify({

business:{

...business,

diagnosis:
diagnosis || null

},

duration:days

})

}
);



const result =
await response.json();



if(!response.ok){

throw new Error(
result.message ||
"Autopilot gagal."
);

}



setAutopilotData(
result.result
);



setProvider(
result.provider || ""
);



setTab(
"autopilot"
);



}catch(error){

alert(
formatError(error)
);

}
finally{

setBusy(false);

}


};
  const getPriority = () => {

    if (
      diagnosis?.areaPriority?.title
    ) {

      return {

        title:
          diagnosis.areaPriority.title,


        text:
          diagnosis.areaPriority.summary ||
          "Lihat Business Diagnosis untuk penjelasan lengkap."

      };

    }



    if (
      business?.problem
    ) {

      return {

        title:
          "Memahami masalah utama",


        text:
          business.problem

      };

    }



    return {

      title:
        "Bangun profil bisnis",


      text:
        "Ceritakan usaha Anda agar ZENAI dapat memahami kondisi bisnis dan menentukan langkah berikutnya."

    };

  };




  const priority =
    getPriority();





  const navItems = [

    {
      id:"command",
      icon:"🏆",
      label:"Business Command"
    },

    {
      id:"capture",
      icon:"🎙",
      label:"Ceritakan Usaha"
    },

    {
      id:"diagnosis",
      icon:"🩺",
      label:"Business Diagnosis"
    },

    {
      id:"pulse",
      icon:"📡",
      label:"Business Pulse"
    },

    {
      id:"autopilot",
      icon:"⚡",
      label:"Action Autopilot"
    }

  ];




  const titles = {

    command:
      "Business Command",

    capture:
      "Ceritakan Usaha",

    diagnosis:
      "Business Diagnosis",

    pulse:
      "Business Pulse",

    autopilot:
      "Action Autopilot"

  };







  const DiagnosisCard = ({
    icon,
    label,
    data,
  }) => {


    if(
      !data?.title
    ){

      return null;

    }



    return (

      <article

        className="action"

        style={{

          display:"block",

          width:"100%",

          padding:"22px",

          marginBottom:"20px",

          boxSizing:"border-box"

        }}

      >


        <div

          style={{

            paddingBottom:"16px",

            marginBottom:"18px",

            borderBottom:
              "1px solid #e5e7eb"

          }}

        >


          <div

            style={{

              display:"flex",

              alignItems:"center",

              gap:"8px",

              fontSize:"12px",

              fontWeight:"700",

              color:"#64748b",

              marginBottom:"10px",

              textTransform:
                "uppercase"

            }}

          >


            <span>

              {icon}

            </span>


            <span>

              {label}

            </span>


          </div>




          <h2

            style={{

              margin:0,

              fontSize:"22px",

              lineHeight:"1.35"

            }}

          >

            {data.title}

          </h2>



        </div>





        <div

          className="diagnosis-grid"

          style={{

            display:"grid",

            gridTemplateColumns:
              "repeat(2,minmax(0,1fr))",

            gap:"16px"

          }}

        >



          {data.summary && (

            <div

              className="diagnosis-item"

              style={{

                padding:"16px",

                borderRadius:"12px",

                background:"#f8fafc"

              }}

            >

              <h4>

                Ringkasan Analisis

              </h4>


              <p>

                {data.summary}

              </p>


            </div>

          )}






          {
          Array.isArray(
            data.evidence
          )
          &&
          data.evidence.length > 0
          &&

          (

            <div

              className="diagnosis-item"

              style={{

                padding:"16px",

                borderRadius:"12px",

                background:"#f8fafc"

              }}

            >


              <h4>

                Dasar Analisis

              </h4>


              <ul>


                {
                data.evidence.map(

                  (
                    item,
                    index
                  )=>(

                    <li
                      key={index}
                    >

                      {item}

                    </li>

                  )

                )

                }


              </ul>


            </div>

          )

          }
          {data.impact && (

            <div

              className="diagnosis-item"

              style={{

                padding:"16px",

                borderRadius:"12px",

                background:"#f8fafc"

              }}

            >

              <h4>

                Potensi Dampak

              </h4>


              <p>

                {data.impact}

              </p>


            </div>

          )}






          {
          Array.isArray(
            data.recommendations
          )
          &&
          data.recommendations.length > 0
          &&

          (

            <div

              className="diagnosis-item"

              style={{

                padding:"16px",

                borderRadius:"12px",

                background:"#f8fafc"

              }}

            >

              <h4>

                Rekomendasi Prioritas

              </h4>


              <ol>


                {
                data.recommendations.map(

                  (
                    item,
                    index
                  )=>(

                    <li
                      key={index}
                    >

                      {item}

                    </li>

                  )

                )

                }


              </ol>


            </div>

          )

          }


        </div>





        <style jsx>{`

          @media(max-width:768px){

            .diagnosis-grid{

              grid-template-columns:
              1fr !important;

            }

          }

        `}</style>



      </article>

    );

  };







  return (

    <div className="app">


      <aside>


        <h2>

          ◈ ZEN

          <span>

            AI

          </span>

        </h2>




        {
        navItems.map(

          (item)=>(

            <button

              key={item.id}

              onClick={()=>setTab(item.id)}

              style={{

                fontWeight:

                tab===item.id
                ?
                "700"
                :
                undefined

              }}

            >

              {item.icon}

              {" "}

              {item.label}


            </button>

          )

        )

        }



      </aside>





      <main>


        <header>


          <div>


            <small>

              AI-POWERED BUSINESS COMMAND CENTER

            </small>



            <h1>

              {titles[tab]}

            </h1>


          </div>




          <div>


            {

            provider

            ?

            `● ${provider} aktif`

            :

            "● ZENAI siap membantu"

            }


          </div>


        </header>
        {tab === "command" && (

          <section>

            <h2>
              Ringkasan Bisnis
            </h2>



            {!business ? (

              <>

                <p>
                  Mulai dengan
                  menceritakan usaha Anda.
                  ZENAI akan membantu
                  memahami kondisi bisnis,
                  menemukan area yang perlu
                  diperhatikan, dan
                  menyiapkan langkah
                  berikutnya.
                </p>


                <button

                  className="primary"

                  onClick={()=>setTab("capture")}

                >

                  🎙 Ceritakan Usaha

                </button>


              </>


            ) : (

              <>


                <div className="cards">


                  <article>

                    <h3>
                      🏪 Bisnis
                    </h3>


                    <p>

                      {business.product ||
                      "Belum teridentifikasi"}

                    </p>


                  </article>




                  <article>

                    <h3>
                      🎯 Target
                    </h3>


                    <p>

                      {business.target ||
                      "Belum cukup informasi"}

                    </p>


                  </article>




                  <article>

                    <h3>
                      📊 Data Bisnis
                    </h3>


                    <p>

                      ZENAI menggunakan
                      informasi yang tersedia.
                      Skor bisnis tidak
                      ditampilkan sebelum
                      tersedia data aktual.

                    </p>


                  </article>


                </div>





                <div

                  style={{

                    marginTop:"24px",

                    padding:"20px",

                    borderRadius:"14px",

                    background:"#fff1e6"

                  }}

                >


                  <h3>

                    🎯 Prioritas Saat Ini

                  </h3>



                  <h2>

                    {priority.title}

                  </h2>



                  <p>

                    {priority.text}

                  </p>




                  <button

                    className="primary"

                    disabled={busy}

                    onClick={()=>{

                      if(diagnosis){

                        setTab("diagnosis");

                      }else{

                        runDiagnosis();

                      }

                    }}

                  >

                    {busy

                    ?

                    "ZENAI sedang menganalisis..."

                    :

                    diagnosis

                    ?

                    "🩺 Lihat Diagnosis"

                    :

                    "🩺 Buat Business Diagnosis"

                    }


                  </button>



                </div>





                <div

                  style={{

                    marginTop:"24px"

                  }}

                >


                  <h3>

                    ⚡ Status Action Autopilot

                  </h3>



                  <p>

                    {autopilotData

                    ?

                    "Strategi sudah tersedia dan dapat ditinjau kembali."

                    :

                    "Belum ada action plan aktif."

                    }


                  </p>



                  <button

                    onClick={()=>setTab("autopilot")}

                  >

                    {autopilotData

                    ?

                    "Lihat Action Plan"

                    :

                    "Buka Action Autopilot"

                    }


                  </button>



                </div>



              </>


            )}



          </section>

        )}






        {tab === "capture" && (

          <section>


            <h2>

              Ceritakan Usaha

            </h2>



            <p>

              Ceritakan produk,
              pelanggan, kondisi usaha,
              atau masalah yang sedang
              dihadapi.

            </p>




            <textarea

              value={text}

              onChange={(e)=>setText(e.target.value)}

              placeholder={`Contoh:
Saya menjual makanan ringan.
Target saya mahasiswa.
Masalah saya adalah pemasaran.`}

            />




            <br />



            <input

              type="file"

              accept="image/*"

              onChange={handleImage}

            />





            <br /><br />



            <input

              ref={audioInputRef}

              type="file"

              accept="audio/*"

              onChange={handleAudio}

            />





            <br /><br />



            <button

              onClick={()=>{

                isRecording

                ?

                stopRecording()

                :

                startRecording()

              }}

            >

              {isRecording

              ?

              `⏹ Stop ${formatRecordingTime(recordingTime)}`

              :

              "🎙 Rekam Voice Note"

              }


            </button>





            {audio && (

              <>

                <br /><br />


                <audio

                  controls

                  src={audio}

                />


              </>

            )}





            <br /><br />



            <button

              className="primary"

              disabled={busy || isRecording}

              onClick={analyzeBusiness}

            >

              {busy

              ?

              "Menganalisis..."

              :

              "✨ Analisis Usaha"

              }


            </button>


          </section>

        )}
