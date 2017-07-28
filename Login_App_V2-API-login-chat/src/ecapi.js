import axios from "axios";

const apiUrl = "https://api.edu.chat/";

function eduChatRequest(method, url, data) {
    if(method === "POST") {
        return axios.post(apiUrl + url, data)
        .then(function (response) {
            return response;
        })
        .catch(function (error) {
            console.log("Login didn't work " + error);

        });
    }
    return undefined;
}

export function login(email, password) {
  const loginUrl = "v1/api/login/";
  return eduChatRequest("POST", loginUrl, {
            username: email,
            password,
            platform: "web"
        });
}


export function getChat(){

  const chatUrl = "v1/chat/";

        const token = localStorage.getItem("Token");
        const config ={headers:{
          Authorization:
          "Token " + token,
        }};

        const chats = axios.get(apiUrl + chatUrl, config)
          .then((response) => {
             return response.data.results.chats;
          })
          .catch((error) => {
              console.log("Getting Chats didn't work " +  error);

          });

      return chats;

}
