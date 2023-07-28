export const Messages = {
  "en-US": {
    did_not_find: "I'm sorry I didn't find anything.",
    thanks_for_sharing:"Your token is being saved. Thanks", 
    will_answer_projector:"I'll answer on the projector to a better experience...",
    ok_get_information: "OK, I will get some information.", 
    whats_email: "What's your E-mail address?", 
    whats_mobile: "What's your recovery mobile number (e.g. +1 2229998888)?", 
    confirm_mobile: "Please type the code just sent to your mobile.", 
    new_password: (newPassword)=> `Your new temporary password is: ${newPassword}. Go to https://myaccount.microsoft.com and login with the new information provided.`,
    please_use_code:(code)=> `Please, answer the Bot with the code: ${code}.`
  },
  "pt-BR": {
    did_not_find: "Desculpe-me, não encontrei nada a respeito.",
    thanks_for_sharing:"Sua chave foi salva, obrigado.",
    will_answer_projector:"Vou te responder na tela para melhor visualização...",
    ok_get_information: "OK, vou solicitar algumas informações.", 
    whats_email: "Qual o seu e-mail na sua organização?", 
    whats_mobile: "Qual o seu celular cadastrado?", 
    confirm_mobile: "Por favor, digite o código enviado para seu celular.", 
    new_password: (newPassword) => `Sua nova senha temporária é: ${newPassword}. Acesse https://myaccount.microsoft.com e faça login com as novas informações fornecidas.`,
    please_use_code:(code)=> `Por favor, responda ao bot com o código: ${code}.`
  }
};
