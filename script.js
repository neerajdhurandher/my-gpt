let open_api_api_key = null
let stored_validity_value = localStorage['api_key_validation'];
let valid_api_key = false

if (stored_validity_value) {
    stored_validity_value = JSON.parse(stored_validity_value)
    let date = Date.now();
    console.log(date - stored_validity_value["time_stamp"])
    // 1 day = 86400000 ms
    if (date - stored_validity_value["time_stamp"] > 864000000) {
        valid_api_key = false
    } else {
        valid_api_key = stored_validity_value["status"]
    }
}

let api_key_div = document.querySelector(".api-key-container")
let content_div = document.querySelector(".content-container")

let api_continue_button = document.getElementById("api-key-submit-button")
let api_key_input_element = document.getElementById("api-key-input")

let send_button = document.getElementById("send-button")

let response_container = document.querySelector(".response-container")


function toggle_main_container_visibility() {
    console.log(valid_api_key)
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
        valid_api_key = true
    }
    let date = Date.now();
    let validity_status = {
        "time_stamp": date,
        "status": valid_api_key
    }
    localStorage['api_key_validation'] = JSON.stringify(validity_status)
    toggle_main_container_visibility()
}


async function call_gpt(prompt) {
    if (open_api_api_key == null) {
        return null
    }

    result = await axios.post(
        "https://api.openai.com/v1/completions",
        {
            prompt: prompt,
            model: "gpt-3.5-turbo",
            max_tokens: 4000,
            n: 1,
        },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${open_api_api_key}`,
            },
        }
    );

    console.log("response from ", result.data.choices[0].text);
    return result.data.choices[0].text
}


function prompt_send(input) {
    if (input == "") {
        console.log("Empty input")
    } else {
        response = call_gpt(input)
        create_response_card(response)
    }
}

toggle_main_container_visibility()

api_continue_button.addEventListener("click", () => {
    let api_key_input = api_key_input_element.value
    check_valid_api_key(api_key_input)
})
