let open_api_api_key = null
let stored_validity_value = localStorage['api_key_validation'];
let valid_api_key = false

if (stored_validity_value) {
    stored_validity_value = JSON.parse(stored_validity_value)
    let date = Date.now();
    // 1 day = 86400000 ms
    if (date - stored_validity_value["time_stamp"] > 864000000) {
        valid_api_key = false
    } else {
        valid_api_key = stored_validity_value["status"]
        open_api_api_key = stored_validity_value["api_key"]
    }
}

let api_key_div = document.querySelector(".api-key-container")
let content_div = document.querySelector(".content-container")

let api_continue_button = document.getElementById("api-key-submit-button")
let api_key_input_element = document.getElementById("api-key-input")

let prompt_input_element = document.getElementById("prompt-input")
let send_button = document.getElementById("send-button")
let loader_element = document.getElementById("loader")
let response_container = document.querySelector(".response-container")


function toggle_main_container_visibility() {
    if (valid_api_key) {
        api_key_div.style.display = "none"
        content_div.style.display = "block"
    } else {
        api_key_div.style.display = "block"
        content_div.style.display = "none"
    }
}


function check_valid_api_key(api_key) {
    if (api_key.length < 45) {
        valid_api_key = false
    } else {
        open_api_api_key = api_key
        try {
            let result = call_gpt("Hello")
            let date = Date.now();
            valid_api_key = true
            let validity_status = {
                "time_stamp": date,
                "status": valid_api_key,
                "api_key": api_key
            }
            localStorage['api_key_validation'] = JSON.stringify(validity_status)
            toggle_main_container_visibility()

        } catch {
            console.log("error")
            alert("Invalid OpenAI api key")
            api_key_input_element.value = ""
            open_api_api_key = null
        }
    }
}


async function call_gpt(prompt) {
    if (open_api_api_key == null) {
        return null
    }

    const API_URL = "https://api.openai.com/v1/chat/completions"

    const post_data = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${open_api_api_key}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 4000,
            "n": 1
        })
    };
    let result = null

    await fetch(API_URL, post_data)
        .then(response => response.json())
        .then(response => {
            result = response["choices"][0]["message"]["content"]
        })
        .catch(error => {
            console.error(error);
        });
    return result
}

function create_response_card(response) {
    let response_element = document.createElement("div")
    response_element.innerHTML += response
    response_element.classList.add("response-card")
    response_container.appendChild(response_element)
    response_container.scrollTop = response_container.scrollHeight;
}

async function send_prompt_action(input_element) {
    if (input_element.value == "") {
    } else {
        document.getElementById("send-text").style.display = "none"
        loader_element.style.display = "block"
        console.log("GPT calling....")
        let response = await call_gpt(input_element.value)
        console.log("GPT called , response : " + response)
        if (response) {
            create_response_card(response)
        }
        input_element.value = ""
        loader_element.style.display = "none"
        document.getElementById("send-text").style.display = "block"


        return response;
    }
}

toggle_main_container_visibility()

api_continue_button.addEventListener("click", () => {
    let api_key_input = api_key_input_element.value
    check_valid_api_key(api_key_input)
})

send_button.addEventListener("click", () => {
    send_prompt_action(prompt_input_element)
})

prompt_input_element.addEventListener("keyup", function (event) {
    if (event.ctrlKey && event.keyCode === 13) {
        event.preventDefault();
        send_prompt_action(prompt_input_element)
    }
})
