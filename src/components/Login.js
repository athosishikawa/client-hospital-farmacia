import react from 'react';
import "../styles/Login.css"

const Login = () => {
    return(
        <div class="login-container">
            <form class="login-form">
                <h2>Login</h2>

                <div class="form-group">
                <label for="user-type">Tipo de Usuário:</label>
                <select id="user-type" name="user-type" required>
                    <option value="" disabled selected>Selecione</option>
                    <option value="medico">Médico</option>
                    <option value="farmaceutico">Farmacêutico</option>
                </select>
                </div>

                <div class="form-group">
                <label for="username">Usuário:</label>
                <input type="text" id="username" name="username" placeholder="Digite seu usuário" required />
                </div>

                <div class="form-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required />
                </div>

                <button type="submit" class="btn">Entrar</button>

                <p class="error-message" id="error-message">Usuário ou senha inválidos. Tente novamente.</p>
            </form>
        </div>

    );
};

export default Login;