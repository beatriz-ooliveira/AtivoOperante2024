package br.unoeste.gaspar.ativooperante2024.restcontrollers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;




@RestController
@RequestMapping("apis/cidadao/")
public class CidadaoRestController {

    @RequestMapping("teste_conexao")
    public String testeConexao()
    {
        return "conectado";
    }



}
