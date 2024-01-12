import { startWebServer } from "./app";

async function main() {
   try {
        startWebServer();
   } catch (error) {
        console.log(error, 'Erro ao iniciar aplicação!');
   } 
}
main();