import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

dotenv.config({ path: caminho_env });

var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

import usuarioRouter from "./src/routes/usuarios.js";
import mailerRouter from "./src/routes/mailer.js";
import codeRouter from "./src/routes/code.js";
import microserviceRouter from "./src/routes/microservices.js";
import instanceRouter from "./src/routes/instances.js";
import AlertRouter from "./src/routes/alerts.js";
import lixeiraRouter from "./src/routes/lixeira.js";
import reportsRouter from "./src/routes/reports.js"

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/mailer", mailerRouter);
app.use("/code", codeRouter);
app.use("/microservices", microserviceRouter);
app.use("/instances", instanceRouter);
app.use("/alerts", AlertRouter);
app.use("/lixeira", lixeiraRouter);
app.use("/reports", reportsRouter);

app.listen(PORTA_APP, function () {
  console.log(`
               %%%%%%%                            
             %%%%%%%%%%%                          
            %%%%      %%%                         
            %%%        %%%                        
            %%%        %%%                        
            %%%%      %%%          %%%%%%%%       
             %%%%%%%%%%%          %%%%%%%%%%%     
                %%%%%%%%%%      #%%%      %%%%    
                    %%%%%%%%%%  %%%        %%%    
                   %%%%%%%%%%%%%%%%        %%%    
                  %%%%      %%%%%%%%      %%%%    
                  %%%        %%%% %%%%%%%%%%%     
                  %%%        %%%    %%%%%%        
                 %%%%%      %%%%%                 
       %%%%%%%  %%%%%%%%%%%%%%%%%%%%%%%%%       
     %%%%%%%%%%%%%%   %%%%%%  %%%%%%%%%%%%%%     
    %%%%     %%%%               %%%%      %%%    
    %%%       %%%%              %%%        %%%    
    %%%       %%%%              %%%%      %%%%    
    %%%%     %%%%                %%%%%%%%%%%%     
     %%%%%%%%%%%                    %%%%%%%       
       %%%%%%%                        

    ##   ##  ####   ####   ######    #####   ##  ##  ##   ##  ###### 
    ### ###   ##   ##  ##  ##   ##  ##   ##  ##  ##  ##   ##  ##   ##
    #######   ##   ##  ##  ##   ##  ##   ##  ##  ##  ##   ##  ##  ##
    ## # ##   ##   ##      ######   ##   ##  ######  ##   ##  #####  
    ##   ##   ##   ##  ##  ## ##    ##   ##  ##  ##  ##   ##  ##  ##
    ##   ##   ##   ##  ##  ##  ##   ##   ##  ##  ##  ##   ##  ##   ##
    ##   ##  ####   ####   ##   ##   #####   ##  ##   #####   ###### 
                                                            
    Aplicação MicroHub sendo executada em ambiente de ::${process.env.AMBIENTE_PROCESSO}::
    
    Para alterar o ambiente, acesse o arquivo 'app.js'\n\n`);
});