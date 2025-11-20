import { encodingForModel } from "js-tiktoken";
let enc; // same model used for generation

export  function countTokens(text){
    try{
        enc =  encodingForModel("gpt-4o-mini");
        return enc.encode(text).length;

    }
    catch(error){
        console.error("Encoding error:", error);
        enc = encodingForModel("gpt-3.5-turbo");
    }
}

export  function countMessageTokens(messages) {
    console.log("Counting tokens for messages:", messages);
  let total = 0;
  messages.forEach(msg => {
    total += countTokens(msg.content) + 4; // message format overhead
  });
  return total + 3; // reply format overhead
}
