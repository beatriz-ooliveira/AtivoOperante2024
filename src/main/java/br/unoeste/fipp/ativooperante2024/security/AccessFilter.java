package br.unoeste.fipp.ativooperante2024.security;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AccessFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        String token = req.getHeader("Authorization");
        String path = req.getRequestURI();

        // Permitir acesso anônimo ao endpoint de cadastro de usuário
        if (path.equals("/apis/cidadao/cadastrar")) {
            chain.doFilter(request, response);
        } else {
            if (token != null && JWTTokenProvider.verifyToken(token)) {
                chain.doFilter(request, response);
            } else {
                ((HttpServletResponse) response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getOutputStream().write("Não autorizado".getBytes());
            }
        }
    }
}
