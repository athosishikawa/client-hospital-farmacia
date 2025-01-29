import React, { useState, useEffect } from 'react';
import "../styles/CadastroReceitaStyle.css"
import axios from 'axios';


const CadastroReceita = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [planosSaude, setPlanosSaude] = useState([]);
    const [selectedMedicamento, setSelectedMedicamento] = useState(null);
    const [formData, setFormData] = useState({
        paciente: {
            nome: '',
            dataNascimento: '',
            cpf: '',
            planoSaude: ''
        },
        medico: {
            nome: '',
            crm: '',
            assinaturaDigital: null
        },
        medicamento: {
            id: '',
            nome: '',
            dosagem: '',
            quantidade: '',
            viaAdministracao: '',
            observacoes: ''
        }
    });

    const carregarMedicamentos = async () => {
        try {
            const response = await fetch('http://localhost:8080/medicamento/listarMedicamentos');
            if (response.ok) {
                const data = await response.json();
                setMedicamentos(data);
            } else {
                console.error('Erro ao carregar medicamentos');
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
        }
    };

    const carregarPlanosSaude = async () => {
        try {
            const response = await fetch('http://localhost:8080/plano/listarPlanos');
            if (response.ok) {
                const data = await response.json();
                setPlanosSaude(data);
            } else {
                console.error('Erro ao carregar planos de saúde');
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
        }
    };


    useEffect(() => {
        carregarMedicamentos();
        carregarPlanosSaude();

    }, []);

    const handleMedicamentoSelect = (e) => {
        const medicamentoId = e.target.value;
        const medicamentoSelecionado = medicamentos.find(med => med.id === parseInt(medicamentoId));
        
        if (medicamentoSelecionado) {
            setSelectedMedicamento(medicamentoSelecionado);
            setFormData(prev => ({
                ...prev,
                medicamento: {
                    id: medicamentoSelecionado.id,
                    nome: medicamentoSelecionado.nome,
                    dosagem: medicamentoSelecionado.dosagem,
                    quantidade: medicamentoSelecionado.quantidade,
                    viaAdministracao: medicamentoSelecionado.viaDeAdministracao,
                    observacoes: medicamentoSelecionado.observacoes
                }
            }));
        }
    };

    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {

            const pessoaData = {
                nome: formData.paciente.nome,
                cpf: formData.paciente.cpf,
                dataNascimento: formData.paciente.dataNascimento,

            };

            // 1. Create Pessoa
            const pessoaResponse = await axios.post('http://localhost:8080/pessoa/cadastrarPessoa', pessoaData);
            const pessoaCriada = pessoaResponse.data; 
            
            console.log("PESSOA", pessoaCriada)
            // 2. Create Paciente with the created Pessoa
            const pacienteData = {
                plano: { id: formData.paciente.planoSaude },
                pessoa: pessoaCriada 
            };

            console.log("Plan ID being sent:", formData.paciente.planoSaude);
            console.log("Full pacienteData:", pacienteData);


            console.log("IDDDDDD",formData.paciente.planoSaude)
            
            const pacienteResponse = await axios.post('http://localhost:8080/paciente/cadastrarPacientes', pacienteData);
            

            if (!pacienteResponse.data) {
                throw new Error('Failed to create Paciente record');
            }

            const pacienteCriado = pacienteResponse.data;
    
            const itemReceitaData = {
                quantidade: formData.medicamento.quantidade,
                dosagem: formData.medicamento.dosagem,
                observacoes: formData.medicamento.observacoes,
                viaDeAdministracao: formData.medicamento.viaAdministracao
            };

            // 3. Create ItemReceita
            const itemReceitaResponse = await axios.post('http://localhost:8080/itemReceita/cadastrarItemReceita', itemReceitaData);
            const itemReceitaCriado = itemReceitaResponse.data;

            if (!itemReceitaResponse.data) {
                throw new Error('Failed to create ItemReceita record');
            }
    
            const medicoResponse = await axios.get(`http://localhost:8080/medicos/findMedico?crm=${formData.medico.crm}`);
            const medicoCriado = medicoResponse.data;

            if (!medicoResponse.data) {
                throw new Error('Failed to create medicoResponse record');
            }
    
            
            // 4. Create Receita with proper references
            const receitaData = {
                data: new Date(),
                medicamento: medicamentos.find(m => m.id === formData.medicamento.id),
                medico: medicoCriado,
                paciente: pacienteCriado,
                itemReceita: itemReceitaCriado
            };
            console.log("MEDICO:", medicoCriado);

            console.log("RECEITA:", receitaData);
            

            const receitaResponse = await axios.post('http://localhost:8080/receita/cadastrarReceita', receitaData);
            console.log("RECEITA",receitaResponse)
            if (receitaResponse.data) {
                alert('Receita cadastrada com sucesso!');
            }
        } catch (error) {
            if (error.response) {
                // O servidor respondeu com um status de erro
                console.error('Erro de resposta:', error.response.data);
                alert(`Erro do servidor: ${error.response.data}`);
            } else if (error.request) {
                // A requisição foi feita mas não houve resposta
                console.error('Erro de rede:', error.request);
                alert('Erro de conexão com o servidor. Verifique se o backend está rodando.');
            } else {
                // Algo aconteceu na configuração da requisição
                console.error('Erro:', error.message);
                alert(`Erro ao processar requisição: ${error.message}`);
            }
        }
    };

    return(
        <div className="prescription-form-container">
            <form className="prescription-form">
                <h2>Criar Receita Eletrônica</h2>

                    <fieldset>
                        <legend>Dados do Paciente</legend>
                        <div className="form-group">
                            <label for="patient-name">Nome Completo:</label>
                            <input type="text" id="patient-name" name="nome" placeholder="Digite o nome do paciente" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label for="birth-date">Data de Nascimento:</label>
                            <input type="date" id="birth-date" name="dataNascimento" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="Digite o CPF" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="health-plan">Plano de Saúde:</label>
                            <select id="health-plan" name="planoSaude" onChange={(e) => handleInputChange(e, 'paciente')} required>
                                <option value="">Selecione um plano de saúde</option>
                                {planosSaude.map(plano => (
                                    <option key={plano.id} value={plano.id}>{plano.nome}</option>
                                ))}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados do Médico</legend>
                        <div className="form-group">
                            <label for="doctor-name">Nome Completo:</label>
                            <input type="text" id="doctor-name" name="nome" placeholder="Digite o nome do médico" onChange={(e) => handleInputChange(e, 'medico')} required />
                        </div>
                        <div className="form-group">
                            <label for="crm">CRM:</label>
                            <input type="text" id="crm" name="crm" placeholder="Digite o CRM" onChange={(e) => handleInputChange(e, 'medico')} required />
                        </div>
                        <div className="form-group">
                            <label for="digital-signature">Assinatura Digital:</label>
                            <input type="file" id="digital-signature" name="assinaturaDigital" onChange={(e) => handleInputChange(e, 'medico')} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados dos Medicamentos</legend>
                        <div className="form-group">
                            <label htmlFor="medication-select">Selecione o Medicamento:</label>
                            <select
                                id="medication-select"
                                className="form-control"
                                onChange={handleMedicamentoSelect}
                                required
                            >
                                <option value="">Selecione um medicamento</option>
                                {medicamentos.map(med => (
                                    <option key={med.id} value={med.id}>
                                        {med.nome} (mg)
                                    </option>
                                ))}
                            </select>
                        </div>
                    
                        {selectedMedicamento && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="dosage">Dosagem:</label>
                                    <input
                                        type="text"
                                        id="dosage"
                                        name="dosagem"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantidade:</label>
                                    <input
                                        type="text"
                                        id="quantity"
                                        name="quantidade"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="administration-route">Via de Administração:</label>
                                    <input
                                        type="text"
                                        id="administration-route"
                                        name="viaAdministracao"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="observations">Observações:</label>
                                    <textarea
                                        id="observations"
                                        name="observacoes"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        rows="4"
                                    />
                                </div>
                            </>
                        )}
                    </fieldset>

                    <button type="submit" className="btn" onClick={handleSubmit}>Salvar Receita</button>
                </form>
            </div>

    );

};

export default CadastroReceita;