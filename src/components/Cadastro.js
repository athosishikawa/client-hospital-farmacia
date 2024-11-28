import React from "react";
import "../styles/CadastroStyle.css"

const Cadastro = () => {
    return(
        <div class="form-container">
            <form class="form">
                <h2>Cadastro</h2>

                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" placeholder="Digite seu nome" />
                    <small class="error-message">Mensagem de erro aqui</small>
                </div>

                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Digite seu email" />
                    <small class="error-message">Mensagem de erro aqui</small>
                </div>

                <div class="form-group">
                    <label for="senha">Senha:</label>
                    <input type="password" id="senha" name="senha" placeholder="Digite sua senha" />
                    <small class="error-message">Mensagem de erro aqui</small>
                </div>

                <button type="submit" class="btn">Cadastrar</button>
            </form>
        </div>

    );
};

export default Cadastro;