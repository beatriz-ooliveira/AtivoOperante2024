package br.unoeste.fipp.ativooperante2024.restcontrollers;

import br.unoeste.fipp.ativooperante2024.db.entities.Denuncia;
import br.unoeste.fipp.ativooperante2024.db.entities.Orgao;
import br.unoeste.fipp.ativooperante2024.db.entities.Tipo;
import br.unoeste.fipp.ativooperante2024.db.entities.Usuario;
import br.unoeste.fipp.ativooperante2024.db.repositories.DenunciaRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.OrgaoRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.TipoRepository;
import br.unoeste.fipp.ativooperante2024.db.repositories.UsuarioRepository;
import br.unoeste.fipp.ativooperante2024.services.DenunciaService;
import br.unoeste.fipp.ativooperante2024.services.OrgaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("apis/cidadao/")
public class CidadaoRestController {



    @Value("${upload.directory}")
    private String uploadDirectory;


    @Autowired
    DenunciaRepository denunciaRepo;

    @Autowired
    OrgaoService orgaoservice;

    @Autowired
    TipoRepository tipoRepo;

    @Autowired
    UsuarioRepository usuRepo;

    @Autowired
    private DenunciaService denunciaService;


    @GetMapping("teste-conexao")
    public String testeConexao() {
        return "Conectado";
    }

    @GetMapping("/listar-orgaos")
    public ResponseEntity<List<Orgao>> listarOrgaos() {
        List<Orgao> orgaos = orgaoservice.getAll();
        return ResponseEntity.ok(orgaos);
    }

    @GetMapping("/listar-tipos")
    public ResponseEntity<List<Tipo>> listarTipos() {
        List<Tipo> tipos = tipoRepo.findAll();
        return ResponseEntity.ok(tipos);
    }

    @PostMapping("/enviar-denuncias")
    public ResponseEntity<DenunciaResponse> enviarDenuncia(
            @RequestParam("titulo") String titulo,
            @RequestParam("texto") String descricao,
            @RequestParam("tipo") int tipoId,
            @RequestParam("urgencia") int urgencia,
            @RequestParam("orgao") Long orgaoId,
            @RequestParam(value = "imagem", required = false) MultipartFile imagem,
            @RequestParam("usuarioId") String usuarioId,
            @RequestParam("data") String dataStr) {

        try {
            String fileName = null;
            if (imagem != null && !imagem.isEmpty()) {
                // Save the image to the file system
                fileName = imagem.getOriginalFilename();
                Path filePath = Paths.get(uploadDirectory, fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, imagem.getBytes());
            }

            // Convert the string date to LocalDate
            LocalDate data = LocalDate.parse(dataStr);

            // Create and save the denuncia
            Orgao org = orgaoservice.getById(orgaoId);
            Tipo tip = tipoRepo.getById(tipoId);
            Usuario usuario = usuRepo.findByEmail(usuarioId);
            Denuncia den = new Denuncia(titulo, descricao, urgencia, data, org, tip, usuario, fileName);
            Denuncia savedDenuncia = denunciaRepo.save(den);

            DenunciaResponse response = new DenunciaResponse(savedDenuncia);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @PostMapping("/cadastrar")
    public ResponseEntity<Object> cadastrarUsuario(@RequestBody Usuario usuario) {
        try {
            usuario.setNivel(2); // Nível de cidadão
            usuRepo.save(usuario);
            return new ResponseEntity<>("Usuário cadastrado com sucesso.", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log detalhado da exceção
            return new ResponseEntity<>("Erro ao cadastrar o usuário: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/minhas-denuncias")
    public ResponseEntity<Object> listarMinhasDenuncias(@RequestParam(value = "userEmail") String userEmail) {
        Usuario usuario = usuRepo.findByEmail(userEmail);

        if (usuario != null) {
            List<Denuncia> denuncias = denunciaRepo.findAllByUsuario(usuario);
            List<DenunciaResponse> denunciaResponses = denuncias.stream()
                    .map(denuncia -> new DenunciaResponse(
                            denuncia.getId(),
                            denuncia.getTitulo(),
                            denuncia.getTexto(),
                            denuncia.getUrgencia(),
                            denuncia.getData(),
                            denuncia.getOrgao().getNome(),
                            denuncia.getTipo().getNome(),
                            denuncia.getUsuario().getEmail(),
                            denuncia.getImagem()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(denunciaResponses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }




    @GetMapping("/get-all-orgaos")
    public ResponseEntity<Object> buscarTodosOrgaos()
    {   return new ResponseEntity<>(orgaoservice.getAll(),HttpStatus.OK);
    }

    // Outros endpoints relacionados ao cidadão podem ser adicionados aqui

}
