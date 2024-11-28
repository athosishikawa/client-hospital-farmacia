import react from 'react';
import "../styles/CadastroReceitaStyle.css"

const CadastroReceita = () => {
    return(
        <div class="prescription-form-container">
            <form class="prescription-form">
                <h2>Criar Receita Eletrônica</h2>

                    <fieldset>
                        <legend>Dados do Paciente</legend>
                        <div class="form-group">
                            <label for="patient-name">Nome Completo:</label>
                            <input type="text" id="patient-name" name="patient-name" placeholder="Digite o nome do paciente" required />
                        </div>
                        <div class="form-group">
                            <label for="birth-date">Data de Nascimento:</label>
                            <input type="date" id="birth-date" name="birth-date" required />
                        </div>
                        <div class="form-group">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="Digite o CPF" required />
                        </div>
                        <div class="form-group">
                            <label for="health-plan">Plano de Saúde (se aplicável):</label>
                            <input type="text" id="health-plan" name="health-plan" placeholder="Digite o plano de saúde" />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados do Médico</legend>
                        <div class="form-group">
                            <label for="doctor-name">Nome Completo:</label>
                            <input type="text" id="doctor-name" name="doctor-name" placeholder="Digite o nome do médico" required />
                        </div>
                        <div class="form-group">
                            <label for="crm">CRM:</label>
                            <input type="text" id="crm" name="crm" placeholder="Digite o CRM" required />
                        </div>
                        <div class="form-group">
                            <label for="digital-signature">Assinatura Digital:</label>
                            <input type="file" id="digital-signature" name="digital-signature" required />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados dos Medicamentos</legend>
                        <div class="form-group">
                            <label for="medication-name">Nome do Medicamento:</label>
                            <input type="text" id="medication-name" name="medication-name" placeholder="Digite o nome do medicamento" required />
                        </div>
                        <div class="form-group">
                            <label for="dosage">Dosagem:</label>
                            <input type="text" id="dosage" name="dosage" placeholder="Digite a dosagem" required />
                        </div>
                        <div class="form-group">
                            <label for="quantity">Quantidade:</label>
                            <input type="number" id="quantity" name="quantity" placeholder="Digite a quantidade" required />
                        </div>
                        <div class="form-group">
                            <label for="administration-route">Via de Administração:</label>
                            <input type="text" id="administration-route" name="administration-route" placeholder="Ex.: Oral, Intravenosa" required />
                        </div>
                        <div class="form-group">
                            <label for="observations">Observações:</label>
                            <textarea id="observations" name="observations" rows="4" placeholder="Digite observações adicionais"></textarea>
                        </div>
                    </fieldset>

                    <button type="submit" class="btn">Salvar Receita</button>
                </form>
            </div>

    );

};

export default CadastroReceita;