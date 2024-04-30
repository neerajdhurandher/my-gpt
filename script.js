let open_api_api_key = null

async function call_gpt(prompt){
    if (open_api_api_key == null){
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

function create_response_card(response){
    let response_element = document.createElement("div")
}

function prompt_send(input){
    if(input == ""){
        console.log("Empty input")
    }else{
        response = call_gpt(input)
        create_response_card(response)
    }
}